# Local values for the static site infrastructure
locals {
  # Construct resource names with optional namespace for ephemeral environments
  resource_prefix = var.namespace != "" ? "${var.project_name}-${var.namespace}" : var.project_name

  # Domain configuration
  domain_name = var.domain_name != "" ? var.domain_name : "${local.resource_prefix}.${var.root_domain}"

  # Common tags applied to all resources
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Component   = "static-site"
    CreatedAt   = timestamp()
  }

  # S3 bucket names (must be globally unique)
  bucket_name         = "${local.resource_prefix}-${random_string.bucket_suffix.result}"
  s3_bucket_name      = "${var.project_name}-${var.environment}-static-site"
  s3_logs_bucket_name = "${var.project_name}-${var.environment}-cloudfront-logs"

  # CloudFront configuration
  cloudfront_comment = "${var.project_name} ${var.environment} static site distribution"

  # Certificate and domain configuration
  has_custom_domain = var.domain_name != ""

  # Origin configuration
  s3_origin_id = "S3-${local.s3_bucket_name}"

  # Cache behaviors configuration
  static_assets_patterns = [
    "/static/*",
    "*.js",
    "*.css",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.ico",
    "*.svg",
    "*.woff",
    "*.woff2",
    "*.ttf",
    "*.eot"
  ]

  # Error pages for SPA routing
  spa_error_codes = [403, 404]

  # Security headers
  security_headers = {
    "Strict-Transport-Security" = "max-age=31536000; includeSubDomains"
    "X-Content-Type-Options"    = "nosniff"
    "X-Frame-Options"           = "DENY"
    "X-XSS-Protection"          = "1; mode=block"
    "Referrer-Policy"           = "strict-origin-when-cross-origin"
  }
}