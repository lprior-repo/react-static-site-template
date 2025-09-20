# React Static Site Template Makefile
# Production-ready deployment automation with AWS
#
# Usage:
#   make help          - Show this help message
#   make setup         - Setup development environment
#   make dev           - Start development server
#   make build         - Build for production
#   make test          - Run all tests
#   make deploy-dev    - Deploy to development
#   make deploy-prod   - Deploy to production

.PHONY: help setup dev build test deploy-dev deploy-staging deploy-prod clean

# Variables
PROJECT_NAME := react-static-site-template
AWS_REGION := us-east-1
NODE_VERSION := 20

# Colors for pretty output
RED    := \033[31m
GREEN  := \033[32m
YELLOW := \033[33m
BLUE   := \033[34m
RESET  := \033[0m

# Default target
help: ## Show this help message
	@echo "$(BLUE)React Static Site Template$(RESET)"
	@echo "================================"
	@echo ""
	@echo "Available targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "Environment variables:"
	@echo "  AWS_REGION     = $(AWS_REGION)"
	@echo "  NODE_VERSION   = $(NODE_VERSION)"
	@echo ""

# Development Environment
setup: ## Setup development environment
	@echo "$(BLUE)Setting up development environment...$(RESET)"
	@if ! command -v node >/dev/null 2>&1; then \
		echo "$(RED)Error: Node.js not found. Please install Node.js $(NODE_VERSION)$(RESET)"; \
		exit 1; \
	fi
	@if ! command -v terraform >/dev/null 2>&1; then \
		echo "$(YELLOW)Warning: Terraform not found. Install from https://terraform.io$(RESET)"; \
	fi
	@if ! command -v aws >/dev/null 2>&1; then \
		echo "$(YELLOW)Warning: AWS CLI not found. Install from https://aws.amazon.com/cli/$(RESET)"; \
	fi
	npm ci
	cd terraform && terraform init
	@echo "$(GREEN)✅ Development environment ready!$(RESET)"
	@echo "$(BLUE)💡 Next steps:$(RESET)"
	@echo "  - Run 'make dev' to start development server"
	@echo "  - Run 'make test' to run tests"
	@echo "  - Run 'make deploy-dev' to deploy to development"

check-deps: ## Check for required dependencies
	@echo "$(BLUE)Checking dependencies...$(RESET)"
	@which node || (echo "$(RED)Node.js not found$(RESET)" && exit 1)
	@which npm || (echo "$(RED)npm not found$(RESET)" && exit 1)
	@which terraform || (echo "$(YELLOW)Terraform not found (optional)$(RESET)")
	@which aws || (echo "$(YELLOW)AWS CLI not found (optional)$(RESET)")
	@echo "$(GREEN)✅ Dependencies check complete$(RESET)"

# Development
dev: ## Start development server
	@echo "$(BLUE)Starting development server...$(RESET)"
	npm run dev

dev-https: ## Start development server with HTTPS
	@echo "$(BLUE)Starting development server with HTTPS...$(RESET)"
	npm run dev -- --https

# Building
build: ## Build for production
	@echo "$(BLUE)Building for production...$(RESET)"
	npm run build
	@echo "$(GREEN)✅ Build complete! Output in dist/$(RESET)"

build-analyze: ## Build with bundle analysis
	@echo "$(BLUE)Building with bundle analysis...$(RESET)"
	npm run build:analyze
	@echo "$(GREEN)✅ Build complete! Check dist/stats.html for analysis$(RESET)"

preview: build ## Preview production build locally
	@echo "$(BLUE)Previewing production build...$(RESET)"
	npm run preview

# Testing
test: ## Run all tests
	@echo "$(BLUE)Running tests...$(RESET)"
	npm test

test-coverage: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(RESET)"
	npm run test:coverage

test-watch: ## Run tests in watch mode
	@echo "$(BLUE)Running tests in watch mode...$(RESET)"
	npm run test:watch

# Quality Assurance
lint: ## Run linting
	@echo "$(BLUE)Running linter...$(RESET)"
	npm run lint

lint-fix: ## Fix linting issues
	@echo "$(BLUE)Fixing lint issues...$(RESET)"
	npm run lint:fix

format: ## Format code
	@echo "$(BLUE)Formatting code...$(RESET)"
	npm run format

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Running type check...$(RESET)"
	npm run type-check

security: ## Run security audit
	@echo "$(BLUE)Running security audit...$(RESET)"
	npm audit --audit-level=moderate

validate: lint type-check test security ## Run all validation checks
	@echo "$(GREEN)✅ All validation checks passed!$(RESET)"

# Infrastructure
tf-init: ## Initialize Terraform
	@echo "$(BLUE)Initializing Terraform...$(RESET)"
	cd terraform && terraform init

tf-plan: tf-init ## Plan Terraform changes
	@echo "$(BLUE)Planning Terraform changes...$(RESET)"
	cd terraform && terraform plan -var="environment=dev"

tf-validate: ## Validate Terraform configuration
	@echo "$(BLUE)Validating Terraform...$(RESET)"
	cd terraform && terraform validate
	cd terraform && terraform fmt -check

tf-format: ## Format Terraform files
	@echo "$(BLUE)Formatting Terraform files...$(RESET)"
	cd terraform && terraform fmt -recursive

tf-security: ## Run Terraform security checks
	@echo "$(BLUE)Running Terraform security checks...$(RESET)"
	@if command -v tfsec >/dev/null 2>&1; then \
		cd terraform && tfsec .; \
	else \
		echo "$(YELLOW)tfsec not found. Install with: brew install tfsec$(RESET)"; \
	fi

# Deployment
deploy-dev: validate build tf-validate ## Deploy to development environment
	@echo "$(BLUE)Deploying to development environment...$(RESET)"
	cd terraform && terraform apply -var="environment=dev" -auto-approve
	@$(MAKE) --no-print-directory _deploy-assets ENV=dev
	@echo "$(GREEN)✅ Deployed to development!$(RESET)"

deploy-staging: validate build tf-validate ## Deploy to staging environment
	@echo "$(BLUE)Deploying to staging environment...$(RESET)"
	@read -p "Are you sure you want to deploy to staging? [y/N] " confirm && \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		cd terraform && terraform apply -var="environment=staging" -auto-approve; \
		$(MAKE) --no-print-directory _deploy-assets ENV=staging; \
		echo "$(GREEN)✅ Deployed to staging!$(RESET)"; \
	else \
		echo "$(YELLOW)Deployment cancelled$(RESET)"; \
	fi

deploy-prod: validate build tf-validate ## Deploy to production environment
	@echo "$(RED)⚠️  PRODUCTION DEPLOYMENT$(RESET)"
	@read -p "Are you sure you want to deploy to PRODUCTION? [y/N] " confirm && \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		cd terraform && terraform apply -var="environment=prod" -auto-approve; \
		$(MAKE) --no-print-directory _deploy-assets ENV=prod; \
		echo "$(GREEN)✅ Deployed to production!$(RESET)"; \
	else \
		echo "$(YELLOW)Deployment cancelled$(RESET)"; \
	fi

_deploy-assets: ## Internal: Deploy assets to S3
	@echo "$(BLUE)Deploying assets to S3...$(RESET)"
	@BUCKET_NAME=$$(cd terraform && terraform output -raw s3_bucket_name) && \
	DISTRIBUTION_ID=$$(cd terraform && terraform output -raw cloudfront_distribution_id) && \
	echo "Deploying to bucket: $$BUCKET_NAME" && \
	aws s3 sync dist/ s3://$$BUCKET_NAME --delete \
		--cache-control "max-age=31536000" \
		--exclude "*.html" --exclude "*.xml" --exclude "*.txt" && \
	aws s3 sync dist/ s3://$$BUCKET_NAME --delete \
		--cache-control "max-age=0, no-cache" \
		--include "*.html" --include "*.xml" --include "*.txt" && \
	echo "$(BLUE)Invalidating CloudFront cache...$(RESET)" && \
	aws cloudfront create-invalidation --distribution-id $$DISTRIBUTION_ID --paths "/*" && \
	echo "$(GREEN)✅ Assets deployed successfully!$(RESET)"

deploy-assets-only: build ## Deploy only assets (skip infrastructure)
	@echo "$(BLUE)Deploying assets only...$(RESET)"
	@$(MAKE) --no-print-directory _deploy-assets ENV=dev

invalidate-cache: ## Invalidate CloudFront cache
	@echo "$(BLUE)Invalidating CloudFront cache...$(RESET)"
	@DISTRIBUTION_ID=$$(cd terraform && terraform output -raw cloudfront_distribution_id) && \
	aws cloudfront create-invalidation --distribution-id $$DISTRIBUTION_ID --paths "/*" && \
	echo "$(GREEN)✅ Cache invalidated!$(RESET)"

# Monitoring & Analytics
logs: ## View application logs (if any)
	@echo "$(BLUE)Application logs (static site has no server logs)$(RESET)"
	@echo "Check CloudFront logs in S3 or CloudWatch for access patterns"

status: ## Check deployment status
	@echo "$(BLUE)Checking deployment status...$(RESET)"
	@if [ -d "terraform/.terraform" ]; then \
		cd terraform && terraform output; \
	else \
		echo "$(YELLOW)Terraform not initialized. Run 'make tf-init' first.$(RESET)"; \
	fi

lighthouse: build ## Run Lighthouse performance audit
	@echo "$(BLUE)Running Lighthouse audit...$(RESET)"
	@if command -v lighthouse >/dev/null 2>&1; then \
		npm run preview & \
		sleep 3 && \
		lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-report.html && \
		echo "$(GREEN)✅ Lighthouse report generated: lighthouse-report.html$(RESET)"; \
	else \
		echo "$(YELLOW)Lighthouse not found. Install with: npm install -g lighthouse$(RESET)"; \
	fi

# Cleanup
clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(RESET)"
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/.cache/
	@echo "$(GREEN)✅ Cleaned!$(RESET)"

clean-all: clean ## Clean everything including node_modules
	@echo "$(BLUE)Cleaning everything...$(RESET)"
	rm -rf node_modules/
	cd terraform && rm -rf .terraform/
	@echo "$(GREEN)✅ Deep clean complete!$(RESET)"

destroy-dev: ## Destroy development infrastructure
	@echo "$(RED)⚠️  DESTROYING DEVELOPMENT INFRASTRUCTURE$(RESET)"
	@read -p "Are you sure you want to destroy development infrastructure? [y/N] " confirm && \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		cd terraform && terraform destroy -var="environment=dev" -auto-approve; \
		echo "$(GREEN)✅ Development infrastructure destroyed$(RESET)"; \
	else \
		echo "$(YELLOW)Destruction cancelled$(RESET)"; \
	fi

destroy-prod: ## Destroy production infrastructure (DANGEROUS)
	@echo "$(RED)⚠️  DESTROYING PRODUCTION INFRASTRUCTURE$(RESET)"
	@echo "$(RED)This action is IRREVERSIBLE and will DELETE ALL PRODUCTION DATA$(RESET)"
	@read -p "Type 'DESTROY PRODUCTION' to confirm: " confirm && \
	if [ "$$confirm" = "DESTROY PRODUCTION" ]; then \
		cd terraform && terraform destroy -var="environment=prod" -auto-approve; \
		echo "$(GREEN)Production infrastructure destroyed$(RESET)"; \
	else \
		echo "$(YELLOW)Destruction cancelled$(RESET)"; \
	fi

# Documentation
docs: ## Generate documentation
	@echo "$(BLUE)Generating documentation...$(RESET)"
	@if command -v typedoc >/dev/null 2>&1; then \
		typedoc src/ --out docs/; \
		echo "$(GREEN)✅ Documentation generated in docs/$(RESET)"; \
	else \
		echo "$(YELLOW)TypeDoc not found. Install with: npm install -g typedoc$(RESET)"; \
	fi

# Utilities
list-outdated: ## List outdated npm packages
	@echo "$(BLUE)Checking for outdated packages...$(RESET)"
	npm outdated

update-deps: ## Update dependencies (interactive)
	@echo "$(BLUE)Updating dependencies...$(RESET)"
	@if command -v npm-check-updates >/dev/null 2>&1; then \
		npm-check-updates --interactive; \
	else \
		echo "$(YELLOW)npm-check-updates not found. Install with: npm install -g npm-check-updates$(RESET)"; \
	fi

info: ## Show project information
	@echo "$(BLUE)Project Information$(RESET)"
	@echo "==================="
	@echo "Project: $(PROJECT_NAME)"
	@echo "AWS Region: $(AWS_REGION)"
	@echo "Node Version: $(NODE_VERSION)"
	@echo ""
	@echo "File counts:"
	@find src -name "*.ts" -o -name "*.tsx" | wc -l | awk '{print "TypeScript files: " $$1}'
	@find src -name "*.test.*" | wc -l | awk '{print "Test files: " $$1}'
	@echo ""
	@if [ -d "dist" ]; then \
		echo "Build size:"; \
		du -sh dist/ | awk '{print "Distribution: " $$1}'; \
	fi
	@if [ -d "node_modules" ]; then \
		du -sh node_modules/ | awk '{print "Dependencies: " $$1}'; \
	fi