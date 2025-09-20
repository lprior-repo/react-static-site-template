# S3 bucket for hosting static website using terraform-aws-modules
module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.7.0"

  bucket = local.bucket_name

  # Versioning
  versioning = {
    enabled = true
  }

  # Encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
      bucket_key_enabled = true
    }
  }

  # Public access block
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # CORS configuration
  cors_rule = [
    {
      allowed_methods = ["GET", "HEAD"]
      allowed_origins = var.allowed_origins
      allowed_headers = ["*"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3000
    }
  ]


  tags = merge(local.common_tags, {
    Name        = "${local.resource_prefix}-website"
    Component   = "Storage"
    Description = "S3 bucket for static website hosting"
  })
}

# S3 bucket policy for CloudFront access
resource "aws_s3_bucket_policy" "website" {
  bucket = module.s3_bucket.s3_bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_bucket.s3_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.cloudfront_distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [module.s3_bucket, module.cloudfront]
}

# S3 bucket for access logs (optional) using terraform-aws-modules
module "s3_logs_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.7.0"
  count   = var.enable_logging ? 1 : 0

  bucket = "${local.bucket_name}-logs"

  # Encryption
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
      bucket_key_enabled = true
    }
  }

  # Public access block
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # Lifecycle configuration for logs
  lifecycle_rule = [
    {
      id     = "log_lifecycle"
      status = "Enabled"

      expiration = {
        days = 90
      }

      noncurrent_version_expiration = {
        noncurrent_days = 30
      }

      abort_incomplete_multipart_upload = {
        days_after_initiation = 7
      }
    }
  ]

  tags = merge(local.common_tags, {
    Name        = "${local.resource_prefix}-logs"
    Component   = "Logging"
    Description = "S3 bucket for access logs"
  })
}