variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.aws_region))
    error_message = "AWS region must be a valid region identifier."
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "react-static-site"
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "namespace" {
  description = "Namespace for resource naming (enables ephemeral infrastructure)"
  type        = string
  default     = ""
  validation {
    condition     = can(regex("^[a-z0-9-]*$", var.namespace))
    error_message = "Namespace must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "domain_name" {
  description = "Custom domain name for the site (optional)"
  type        = string
  default     = ""
}

variable "root_domain" {
  description = "Root domain for auto-generated domain names"
  type        = string
  default     = "example.com"
}

variable "enable_cdn" {
  description = "Enable CloudFront CDN"
  type        = bool
  default     = true
}

variable "enable_ssl" {
  description = "Enable SSL certificate (requires domain_name)"
  type        = bool
  default     = false
}

variable "enable_logging" {
  description = "Enable access logging for S3 and CloudFront"
  type        = bool
  default     = true
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
  validation {
    condition = contains([
      "PriceClass_All",
      "PriceClass_200",
      "PriceClass_100"
    ], var.price_class)
    error_message = "Price class must be one of: PriceClass_All, PriceClass_200, PriceClass_100."
  }
}

variable "default_root_object" {
  description = "Default root object for CloudFront"
  type        = string
  default     = "index.html"
}

variable "error_document" {
  description = "Error document for S3 website hosting"
  type        = string
  default     = "index.html"
}

variable "allowed_origins" {
  description = "Allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "cache_ttl" {
  description = "Cache TTL settings for CloudFront"
  type = object({
    default_ttl = number
    max_ttl     = number
    min_ttl     = number
  })
  default = {
    default_ttl = 86400    # 1 day
    max_ttl     = 31536000 # 1 year
    min_ttl     = 0
  }
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "index_document" {
  description = "Index document for the website"
  type        = string
  default     = "index.html"
}

variable "enable_health_check" {
  description = "Enable Route53 health check for the domain"
  type        = bool
  default     = false
}