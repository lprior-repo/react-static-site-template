# CloudFront distribution outputs
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_distribution_id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_distribution_arn
}

output "cloudfront_distribution_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_distribution_domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront hosted zone ID"
  value       = module.cloudfront.cloudfront_distribution_hosted_zone_id
}

# S3 bucket outputs
output "s3_bucket_id" {
  description = "Name of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_bucket_domain_name
}

output "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_bucket_regional_domain_name
}

# S3 logs bucket outputs (conditional)
output "s3_logs_bucket_id" {
  description = "Name of the S3 logs bucket"
  value       = var.enable_logging ? module.s3_logs_bucket[0].s3_bucket_id : null
}

output "s3_logs_bucket_arn" {
  description = "ARN of the S3 logs bucket"
  value       = var.enable_logging ? module.s3_logs_bucket[0].s3_bucket_arn : null
}

# Domain and certificate outputs (conditional)
output "domain_name" {
  description = "Custom domain name (if configured)"
  value       = var.domain_name != "" ? var.domain_name : null
}

output "certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = var.domain_name != "" ? aws_acm_certificate.main[0].arn : null
}

output "certificate_validation_fqdns" {
  description = "FQDNs for certificate validation"
  value       = var.domain_name != "" ? [for record in aws_route53_record.cert_validation : record.fqdn] : []
}

# Route53 outputs (conditional)
output "route53_zone_id" {
  description = "Route53 hosted zone ID"
  value       = var.domain_name != "" ? data.aws_route53_zone.main[0].zone_id : null
}

output "route53_zone_name" {
  description = "Route53 hosted zone name"
  value       = var.domain_name != "" ? data.aws_route53_zone.main[0].name : null
}

output "route53_name_servers" {
  description = "Route53 hosted zone name servers"
  value       = var.domain_name != "" ? data.aws_route53_zone.main[0].name_servers : []
}

# Website URLs
output "website_url" {
  description = "URL of the website"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${module.cloudfront.cloudfront_distribution_domain_name}"
}

output "cloudfront_url" {
  description = "CloudFront distribution URL"
  value       = "https://${module.cloudfront.cloudfront_distribution_domain_name}"
}

# Origin Access Control
output "origin_access_control_id" {
  description = "ID of the Origin Access Control"
  value       = module.cloudfront.cloudfront_origin_access_controls["main"].id
}

# Health check outputs (conditional)
output "health_check_id" {
  description = "Route53 health check ID"
  value       = var.domain_name != "" && var.enable_health_check ? aws_route53_health_check.main[0].id : null
}

# Deployment information
output "deployment_info" {
  description = "Deployment information for CI/CD"
  value = {
    s3_bucket     = module.s3_bucket.s3_bucket_id
    cloudfront_id = module.cloudfront.cloudfront_distribution_id
    website_url   = var.domain_name != "" ? "https://${var.domain_name}" : "https://${module.cloudfront.cloudfront_distribution_domain_name}"
    aws_region    = var.aws_region
    environment   = var.environment
    project_name  = var.project_name
  }
}