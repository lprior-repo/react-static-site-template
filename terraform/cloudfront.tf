# CloudFront distribution using terraform-aws-modules
module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 5.0.0"

  comment             = local.cloudfront_comment
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = var.price_class
  default_root_object = var.index_document
  aliases             = var.domain_name != "" ? [var.domain_name] : []

  # Create OAC and set up S3 origin
  create_origin_access_control = true
  origin_access_control = {
    main = {
      description      = "OAC for ${var.project_name} static site"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  origin = {
    s3_bucket = {
      domain_name           = module.s3_bucket.s3_bucket_bucket_regional_domain_name
      origin_access_control = "main"
    }
  }

  # Default cache behavior
  default_cache_behavior = {
    target_origin_id           = "s3_bucket"
    viewer_protocol_policy     = "redirect-to-https"
    compress                   = true
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    cache_policy_id            = data.aws_cloudfront_cache_policy.managed_caching_optimized.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.managed_security_headers.id
  }

  # Ordered cache behaviors
  ordered_cache_behavior = [
    {
      path_pattern               = "/static/*"
      target_origin_id           = "s3_bucket"
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true
      allowed_methods            = ["GET", "HEAD", "OPTIONS"]
      cached_methods             = ["GET", "HEAD"]
      cache_policy_id            = data.aws_cloudfront_cache_policy.managed_caching_optimized_for_uncompressed_objects.id
      response_headers_policy_id = data.aws_cloudfront_response_headers_policy.managed_security_headers.id
    },
    {
      path_pattern           = "/api/*"
      target_origin_id       = "s3_bucket"
      viewer_protocol_policy = "redirect-to-https"
      compress               = true
      allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods         = ["GET", "HEAD"]
      cache_policy_id        = data.aws_cloudfront_cache_policy.managed_caching_disabled.id

      # Legacy forwarded values for API endpoints
      use_forwarded_values = true
      query_string         = true
      headers              = ["Authorization", "Content-Type"]
      cookies_forward      = "none"
      min_ttl              = 0
      default_ttl          = 0
      max_ttl              = 0
    }
  ]

  # Custom error responses for SPA routing
  custom_error_response = [
    {
      error_code            = 403
      response_code         = 200
      response_page_path    = "/${var.index_document}"
      error_caching_min_ttl = 300
    },
    {
      error_code            = 404
      response_code         = 200
      response_page_path    = "/${var.index_document}"
      error_caching_min_ttl = 300
    }
  ]

  # SSL certificate
  viewer_certificate = {
    acm_certificate_arn            = var.domain_name != "" ? aws_acm_certificate_validation.main[0].certificate_arn : null
    ssl_support_method             = var.domain_name != "" ? "sni-only" : null
    minimum_protocol_version       = var.domain_name != "" ? "TLSv1.2_2021" : null
    cloudfront_default_certificate = var.domain_name == ""
  }

  # Geo restrictions
  geo_restriction = {
    restriction_type = "none"
  }

  # Logging configuration
  logging_config = var.enable_logging ? {
    bucket          = module.s3_logs_bucket[0].s3_bucket_bucket_domain_name
    prefix          = "cloudfront-logs/"
    include_cookies = false
  } : {}

  tags = local.common_tags
}

# Managed cache policies
data "aws_cloudfront_cache_policy" "managed_caching_optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_cache_policy" "managed_caching_optimized_for_uncompressed_objects" {
  name = "Managed-CachingOptimizedForUncompressedObjects"
}

data "aws_cloudfront_cache_policy" "managed_caching_disabled" {
  name = "Managed-CachingDisabled"
}

# Managed response headers policies
data "aws_cloudfront_response_headers_policy" "managed_security_headers" {
  name = "Managed-SecurityHeadersPolicy"
}

# Note: CloudFront invalidations should be handled via CI/CD or AWS CLI
# Example: aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"