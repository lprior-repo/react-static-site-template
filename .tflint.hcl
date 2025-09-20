# TFLint Configuration for React Static Site Template
# This configuration enforces AWS security best practices and static site quality standards

config {
  # Enable module inspection
  module = true

  # Force return zero exit code even when issues are found
  force = false

  # Disable color output for CI/CD environments
  disabled_by_default = false
}

# AWS Provider Plugin
plugin "aws" {
  enabled = true
  version = "0.30.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

# Terraform Core Rules
plugin "terraform" {
  enabled = true
  preset  = "recommended"
}

# S3 Security Rules
rule "aws_s3_bucket_public_access_block" {
  enabled = true
}

rule "aws_s3_bucket_public_read" {
  enabled = true
}

rule "aws_s3_bucket_public_write" {
  enabled = true
}

rule "aws_s3_bucket_invalid_storage_class" {
  enabled = true
}

rule "aws_s3_bucket_encryption_enabled" {
  enabled = true
}

# CloudFront Security Rules
rule "aws_cloudfront_distribution_logging_enabled" {
  enabled = true
}

rule "aws_cloudfront_distribution_https_only" {
  enabled = true
}

rule "aws_cloudfront_distribution_no_deprecated_ssl" {
  enabled = true
}

# Route53 Security Rules
rule "aws_route53_record_invalid_type" {
  enabled = true
}

rule "aws_route53_zone_invalid_vpc_id" {
  enabled = true
}

# ACM Certificate Rules
rule "aws_acm_certificate_domain_validation_options_domain_name" {
  enabled = true
}

rule "aws_acm_certificate_lifecycle_rule_id" {
  enabled = true
}

# IAM Security Rules (if any IAM resources are added)
rule "aws_iam_policy_document_gov_friendly_arns" {
  enabled = true
}

rule "aws_iam_role_policy_attachment_policy_arn" {
  enabled = true
}

# Naming Convention Rules
rule "terraform_naming_convention" {
  enabled = true

  # Custom naming patterns
  resource "aws_s3_bucket" {
    format = "snake_case"
  }

  resource "aws_cloudfront_distribution" {
    format = "snake_case"
  }

  resource "aws_route53_record" {
    format = "snake_case"
  }
}

# Required Labels/Tags
rule "terraform_required_labels" {
  enabled = true

  # Ensure all resources have required tags
  labels = [
    "Environment",
    "Project",
    "Team",
    "Cost-Center"
  ]
}

# Documentation Requirements
rule "terraform_documented_outputs" {
  enabled = true
}

rule "terraform_documented_variables" {
  enabled = true
}

# Type Constraints
rule "terraform_typed_variables" {
  enabled = true
}

# Standard Formatting
rule "terraform_standard_module_structure" {
  enabled = true
}

# Unused declarations
rule "terraform_unused_declarations" {
  enabled = true
}

# Version constraints
rule "terraform_required_version" {
  enabled = true
}

rule "terraform_required_providers" {
  enabled = true
}

# Security best practices
rule "terraform_workspace_remote" {
  enabled = true
}