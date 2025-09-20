#!/bin/bash

# React Static Site Build Script
# Optimized build process with validation and optimization

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

check_node_version() {
    log_info "Checking Node.js version..."

    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js is not installed"
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18 or higher is required. Current: $(node --version)"
    fi

    log_success "Node.js version: $(node --version)"
}

install_dependencies() {
    log_info "Installing dependencies..."
    cd "$PROJECT_ROOT"

    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi

    log_success "Dependencies installed"
}

run_pre_build_checks() {
    log_info "Running pre-build validation..."
    cd "$PROJECT_ROOT"

    # Type checking
    log_info "Running TypeScript type check..."
    npm run type-check

    # Linting
    log_info "Running ESLint..."
    npm run lint

    # Code formatting check
    log_info "Checking code formatting..."
    npm run format:check

    log_success "Pre-build validation passed"
}

run_tests() {
    log_info "Running tests..."
    cd "$PROJECT_ROOT"

    npm run test:run

    log_success "All tests passed"
}

generate_build_info() {
    log_info "Generating build information..."
    cd "$PROJECT_ROOT"

    BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    GIT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    NODE_VERSION=$(node --version)

    cat > public/build-info.json << EOF
{
  "buildTime": "$BUILD_TIME",
  "gitCommit": "$GIT_COMMIT",
  "gitBranch": "$GIT_BRANCH",
  "nodeVersion": "$NODE_VERSION",
  "environment": "${NODE_ENV:-production}"
}
EOF

    log_success "Build info generated"
}

build_application() {
    log_info "Building application..."
    cd "$PROJECT_ROOT"

    # Set production environment
    export NODE_ENV=production

    # Build the application
    npm run build

    if [ ! -d "dist" ]; then
        log_error "Build failed - dist directory not found"
    fi

    log_success "Application built successfully"
}

analyze_bundle() {
    log_info "Analyzing bundle size..."
    cd "$PROJECT_ROOT"

    # Calculate total size
    TOTAL_SIZE=$(du -sh dist/ | cut -f1)

    # Find largest files
    echo
    echo "Build Analysis:"
    echo "==============="
    echo "Total size: $TOTAL_SIZE"
    echo
    echo "Largest files:"
    find dist/ -type f -exec du -h {} + | sort -rh | head -10

    # Check for potential issues
    echo
    echo "Bundle Analysis:"

    # Check JS bundle sizes
    find dist/assets -name "*.js" -type f | while read -r file; do
        size=$(stat -c%s "$file")
        size_kb=$((size / 1024))
        filename=$(basename "$file")

        if [ $size_kb -gt 1000 ]; then
            log_warning "Large JS bundle: $filename ($size_kb KB)"
        fi
    done

    # Check CSS bundle sizes
    find dist/assets -name "*.css" -type f | while read -r file; do
        size=$(stat -c%s "$file")
        size_kb=$((size / 1024))
        filename=$(basename "$file")

        if [ $size_kb -gt 200 ]; then
            log_warning "Large CSS bundle: $filename ($size_kb KB)"
        fi
    done

    log_success "Bundle analysis complete"
}

optimize_assets() {
    log_info "Optimizing assets..."
    cd "$PROJECT_ROOT"

    # Compress images if imagemin is available
    if command -v imagemin >/dev/null 2>&1; then
        find dist/ -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | while read -r img; do
            imagemin "$img" --out-dir="$(dirname "$img")"
        done
        log_success "Images optimized"
    else
        log_info "imagemin not available, skipping image optimization"
    fi

    # Generate gzipped versions for static serving
    find dist/ -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) | while read -r file; do
        gzip -9 -c "$file" > "$file.gz"
    done

    log_success "Gzipped versions created"
}

validate_build() {
    log_info "Validating build output..."
    cd "$PROJECT_ROOT"

    # Check if index.html exists
    if [ ! -f "dist/index.html" ]; then
        log_error "index.html not found in build output"
    fi

    # Check if assets directory exists
    if [ ! -d "dist/assets" ]; then
        log_error "assets directory not found in build output"
    fi

    # Check for required files
    required_files=("manifest.json" "robots.txt" "sitemap.xml")
    for file in "${required_files[@]}"; do
        if [ ! -f "dist/$file" ]; then
            log_warning "Optional file missing: $file"
        fi
    done

    # Validate HTML
    if command -v html5validator >/dev/null 2>&1; then
        html5validator --root dist/ --also-check-css
        log_success "HTML validation passed"
    else
        log_info "html5validator not available, skipping HTML validation"
    fi

    log_success "Build validation complete"
}

generate_security_headers() {
    log_info "Generating security headers..."
    cd "$PROJECT_ROOT"

    # Create _headers file for Netlify-style deployments (if needed)
    cat > dist/_headers << 'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
EOF

    log_success "Security headers generated"
}

cleanup_build() {
    log_info "Cleaning up build artifacts..."
    cd "$PROJECT_ROOT"

    # Remove source maps in production
    if [ "${NODE_ENV:-}" = "production" ]; then
        find dist/ -name "*.map" -delete
    fi

    # Remove build info from public
    rm -f public/build-info.json

    log_success "Build cleanup complete"
}

main() {
    echo "================================"
    echo "React Static Site Build Process"
    echo "Project: $(basename "$PROJECT_ROOT")"
    echo "================================"
    echo

    check_node_version
    install_dependencies
    run_pre_build_checks
    run_tests
    generate_build_info
    build_application
    analyze_bundle
    optimize_assets
    validate_build
    generate_security_headers
    cleanup_build

    echo
    log_success "Build process completed successfully!"
    echo "Output directory: dist/"
    echo "Total size: $(du -sh dist/ | cut -f1)"
}

# Error handling
trap 'log_error "Build failed at line $LINENO"' ERR

# Run main function
main "$@"