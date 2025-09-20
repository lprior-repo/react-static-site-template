#!/bin/bash

# React Static Site Deployment Script
# This script deploys the React application to AWS S3 with CloudFront invalidation
#
# Usage:
#   ./scripts/deploy.sh [environment]
#
# Arguments:
#   environment: dev, staging, or prod (default: dev)

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEFAULT_ENVIRONMENT="dev"
ENVIRONMENT="${1:-$DEFAULT_ENVIRONMENT}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Validation
validate_environment() {
    case "$ENVIRONMENT" in
        dev|staging|prod)
            log_info "Environment: $ENVIRONMENT"
            ;;
        *)
            log_error "Invalid environment: $ENVIRONMENT. Use dev, staging, or prod."
            ;;
    esac
}

check_dependencies() {
    log_info "Checking dependencies..."

    command -v node >/dev/null 2>&1 || log_error "Node.js is required but not installed."
    command -v npm >/dev/null 2>&1 || log_error "npm is required but not installed."
    command -v terraform >/dev/null 2>&1 || log_error "Terraform is required but not installed."
    command -v aws >/dev/null 2>&1 || log_error "AWS CLI is required but not installed."

    log_success "All dependencies are available"
}

check_aws_credentials() {
    log_info "Checking AWS credentials..."

    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        log_error "AWS credentials not configured. Run 'aws configure' first."
    fi

    log_success "AWS credentials are valid"
}

install_dependencies() {
    log_info "Installing Node.js dependencies..."
    cd "$PROJECT_ROOT"
    npm ci
    log_success "Dependencies installed"
}

run_tests() {
    log_info "Running tests..."
    cd "$PROJECT_ROOT"
    npm run test:run
    log_success "All tests passed"
}

lint_code() {
    log_info "Running linter..."
    cd "$PROJECT_ROOT"
    npm run lint
    log_success "Linting passed"
}

type_check() {
    log_info "Running TypeScript type check..."
    cd "$PROJECT_ROOT"
    npm run type-check
    log_success "Type check passed"
}

build_application() {
    log_info "Building application..."
    cd "$PROJECT_ROOT"
    npm run build

    if [ ! -d "dist" ]; then
        log_error "Build failed - dist directory not found"
    fi

    log_success "Application built successfully"
}

validate_terraform() {
    log_info "Validating Terraform configuration..."
    cd "$PROJECT_ROOT/terraform"

    terraform init -backend=false
    terraform validate
    terraform fmt -check

    log_success "Terraform validation passed"
}

deploy_infrastructure() {
    log_info "Deploying infrastructure for environment: $ENVIRONMENT"
    cd "$PROJECT_ROOT/terraform"

    terraform init
    terraform plan -var="environment=$ENVIRONMENT" -out=tfplan

    if [ "$ENVIRONMENT" = "prod" ]; then
        log_warning "About to deploy to PRODUCTION environment"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Deployment cancelled by user"
        fi
    fi

    terraform apply tfplan
    rm -f tfplan

    log_success "Infrastructure deployed"
}

deploy_assets() {
    log_info "Deploying assets to S3..."
    cd "$PROJECT_ROOT/terraform"

    # Get outputs from Terraform
    BUCKET_NAME=$(terraform output -raw s3_bucket_name)
    DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)

    if [ -z "$BUCKET_NAME" ] || [ -z "$DISTRIBUTION_ID" ]; then
        log_error "Failed to get Terraform outputs. Ensure infrastructure is deployed."
    fi

    log_info "S3 Bucket: $BUCKET_NAME"
    log_info "CloudFront Distribution: $DISTRIBUTION_ID"

    cd "$PROJECT_ROOT"

    # Deploy static assets with long cache headers
    log_info "Uploading static assets..."
    aws s3 sync dist/ s3://"$BUCKET_NAME" \
        --delete \
        --cache-control "max-age=31536000, public, immutable" \
        --exclude "*.html" \
        --exclude "*.xml" \
        --exclude "*.txt" \
        --exclude "manifest.json"

    # Deploy HTML files and other files that should not be cached
    log_info "Uploading HTML files..."
    aws s3 sync dist/ s3://"$BUCKET_NAME" \
        --delete \
        --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
        --include "*.html" \
        --include "*.xml" \
        --include "*.txt" \
        --include "manifest.json"

    log_success "Assets uploaded to S3"

    # Invalidate CloudFront cache
    log_info "Invalidating CloudFront cache..."
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)

    log_info "Invalidation ID: $INVALIDATION_ID"
    log_success "CloudFront cache invalidation initiated"
}

get_deployment_urls() {
    log_info "Getting deployment URLs..."
    cd "$PROJECT_ROOT/terraform"

    WEBSITE_URL=$(terraform output -raw website_url 2>/dev/null || echo "Not available")
    CLOUDFRONT_URL=$(terraform output -raw cloudfront_url 2>/dev/null || echo "Not available")

    echo
    log_success "Deployment complete!"
    echo "================================"
    echo "Environment: $ENVIRONMENT"
    echo "Website URL: $WEBSITE_URL"
    echo "CloudFront URL: $CLOUDFRONT_URL"
    echo "================================"
}

run_deployment_tests() {
    log_info "Running deployment tests..."
    cd "$PROJECT_ROOT/terraform"

    WEBSITE_URL=$(terraform output -raw website_url 2>/dev/null)

    if [ -n "$WEBSITE_URL" ]; then
        log_info "Testing website availability..."

        # Wait a moment for CloudFront to update
        sleep 10

        if curl -sSf "$WEBSITE_URL" >/dev/null; then
            log_success "Website is accessible"
        else
            log_warning "Website may not be immediately accessible (CloudFront propagation in progress)"
        fi
    fi
}

cleanup() {
    log_info "Cleaning up temporary files..."
    cd "$PROJECT_ROOT/terraform"
    rm -f tfplan
    log_success "Cleanup complete"
}

# Main deployment process
main() {
    log_info "Starting deployment process..."
    echo "================================"
    echo "React Static Site Deployment"
    echo "Environment: $ENVIRONMENT"
    echo "Project: $(basename "$PROJECT_ROOT")"
    echo "================================"
    echo

    validate_environment
    check_dependencies
    check_aws_credentials

    # Build and validate
    install_dependencies
    lint_code
    type_check
    run_tests
    build_application
    validate_terraform

    # Deploy
    deploy_infrastructure
    deploy_assets

    # Verify
    run_deployment_tests
    get_deployment_urls

    cleanup

    log_success "Deployment completed successfully!"
}

# Error handling
trap 'log_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"