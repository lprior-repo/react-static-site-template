# React Static Site Terraform Infrastructure

This Terraform configuration creates a production-ready infrastructure for
hosting a React static site on AWS using S3, CloudFront, and optionally Route53
for custom domains.

## Architecture

- **S3 Bucket**: Hosts the static files with versioning and encryption
- **CloudFront**: CDN distribution with Origin Access Control (OAC)
- **Route53**: DNS management for custom domains (optional)
- **ACM**: SSL/TLS certificates for HTTPS (optional)

## Features

- ✅ Origin Access Control (OAC) instead of deprecated OAI
- ✅ HTTPS-only with SSL/TLS certificates
- ✅ SPA routing support (404/403 → index.html)
- ✅ Optimized cache behaviors for static assets
- ✅ Security headers via managed policies
- ✅ S3 bucket encryption and versioning
- ✅ CloudFront access logging
- ✅ IPv6 support
- ✅ Production-ready security policies

## Prerequisites

1. **Terraform**: Version >= 1.13
2. **AWS CLI**: Configured with appropriate credentials
3. **Domain**: If using custom domain, ensure you own it and have Route53 hosted
   zone

## Quick Start

1. **Copy variables file**:

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Configure variables** in `terraform.tfvars`:

   ```hcl
   project_name = "my-react-app"
   environment  = "prod"
   aws_region   = "us-east-1"

   # Optional: Custom domain
   domain_name = "example.com"
   ```

3. **Initialize and apply**:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## Configuration Options

### Required Variables

| Variable       | Description                            | Example          |
| -------------- | -------------------------------------- | ---------------- |
| `project_name` | Project name (lowercase, hyphens only) | `"my-react-app"` |
| `environment`  | Environment (dev/staging/prod)         | `"prod"`         |
| `aws_region`   | AWS region                             | `"us-east-1"`    |

### Optional Variables

| Variable               | Description                   | Default                       |
| ---------------------- | ----------------------------- | ----------------------------- |
| `domain_name`          | Custom domain name            | `""` (uses CloudFront domain) |
| `enable_logging`       | Enable CloudFront access logs | `true`                        |
| `price_class`          | CloudFront price class        | `"PriceClass_100"`            |
| `enable_versioning`    | Enable S3 versioning          | `true`                        |
| `enable_health_check`  | Enable Route53 health check   | `false`                       |
| `cors_allowed_origins` | CORS allowed origins          | `["*"]`                       |

### Price Classes

- `PriceClass_100`: US, Canada, Europe
- `PriceClass_200`: All except Australia, Japan, India, etc.
- `PriceClass_All`: All edge locations

## Custom Domain Setup

1. **Ensure Route53 hosted zone exists** for your domain
2. **Set domain_name** in `terraform.tfvars`
3. **Apply configuration** - ACM certificate will be created and validated
   automatically
4. **Update name servers** if needed (check outputs for name servers)

## Deployment Workflow

### Initial Deployment

```bash
# Initialize Terraform
terraform init

# Plan changes
terraform plan -var-file="terraform.tfvars"

# Apply infrastructure
terraform apply -var-file="terraform.tfvars"

# Note the S3 bucket name and CloudFront distribution ID
terraform output
```

### Deploy React App

```bash
# Build your React app
npm run build

# Sync to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### CI/CD Integration

Use the `deployment_info` output for CI/CD automation:

```bash
# Get deployment info
DEPLOY_INFO=$(terraform output -json deployment_info)
BUCKET=$(echo $DEPLOY_INFO | jq -r '.s3_bucket')
DISTRIBUTION_ID=$(echo $DEPLOY_INFO | jq -r '.cloudfront_id')

# Deploy in CI/CD
aws s3 sync dist/ s3://$BUCKET --delete
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

## Outputs

After successful deployment, Terraform provides these outputs:

| Output                       | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `website_url`                | Main website URL (custom domain or CloudFront)    |
| `cloudfront_url`             | CloudFront distribution URL                       |
| `s3_bucket_id`               | S3 bucket name for file uploads                   |
| `cloudfront_distribution_id` | CloudFront distribution ID for cache invalidation |
| `deployment_info`            | Combined deployment information for CI/CD         |

## Security Features

### S3 Security

- All public access blocked
- Bucket policy restricts access to CloudFront only
- Server-side encryption enabled
- Versioning enabled with lifecycle policies

### CloudFront Security

- HTTPS-only (HTTP redirects to HTTPS)
- Security headers via managed response headers policy
- Origin Access Control (OAC) instead of deprecated OAI
- Custom error responses prevent direct S3 access

### Network Security

- IPv6 support
- Geo-restrictions support (currently disabled)
- WAF integration ready (commented out)

## Monitoring and Logging

### CloudFront Logs

- Access logs stored in separate S3 bucket
- 90-day retention policy
- Disabled by default (set `enable_logging = true`)

### Health Checks

- Route53 health check for custom domains
- CloudWatch integration
- Disabled by default (set `enable_health_check = true`)

## Cost Optimization

### S3 Lifecycle Policies

- Transition to IA after 30 days
- Transition to Glacier after 90 days
- Delete non-current versions after 365 days
- Delete incomplete multipart uploads after 7 days

### CloudFront

- Compression enabled
- Optimized cache policies
- Regional edge caches utilized

## Troubleshooting

### Common Issues

1. **Certificate validation timeout**:
   - Ensure Route53 hosted zone exists
   - Check DNS propagation
   - Verify domain ownership

2. **S3 access denied**:
   - Check bucket policy
   - Verify OAC configuration
   - Ensure CloudFront distribution exists first

3. **404 errors for SPA routes**:
   - Custom error responses configured for 403/404 → index.html
   - Verify error document setting

### Useful Commands

```bash
# Check CloudFront distribution status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# Check certificate validation
aws acm describe-certificate --certificate-arn YOUR_CERT_ARN --region us-east-1

# Test website
curl -I https://your-domain.com
```

## Clean Up

```bash
# Destroy infrastructure
terraform destroy -var-file="terraform.tfvars"

# Note: S3 buckets with versioning may require manual cleanup
```

## File Structure

```
terraform/
├── main.tf                    # Provider configuration
├── variables.tf               # Input variables
├── locals.tf                  # Local values
├── s3.tf                     # S3 buckets and policies
├── cloudfront.tf             # CloudFront distribution
├── route53.tf                # DNS and certificates
├── outputs.tf                # Output values
├── versions.tf               # Version constraints
├── terraform.tfvars.example  # Example variables
└── README.md                 # This file
```

## Contributing

1. Follow Terraform best practices
2. Use terraform-aws-modules where possible
3. Add appropriate tags to all resources
4. Update documentation for new features
5. Test with multiple configurations

## License

This Terraform configuration is provided as-is for educational and production
use.
