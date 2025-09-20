#!/bin/bash

# React Static Site Template Setup Script
# Initializes development environment and installs all dependencies

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

check_system_requirements() {
    log_info "Checking system requirements..."

    # Check OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="Windows"
    else
        log_warning "Unknown operating system: $OSTYPE"
        OS="Unknown"
    fi

    log_info "Operating System: $OS"
}

check_node() {
    log_info "Checking Node.js installation..."

    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18 or higher is required. Current: $(node --version)"
    fi

    log_success "Node.js version: $(node --version)"
}

check_npm() {
    log_info "Checking npm installation..."

    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm is not installed"
    fi

    log_success "npm version: $(npm --version)"
}

check_git() {
    log_info "Checking Git installation..."

    if ! command -v git >/dev/null 2>&1; then
        log_warning "Git is not installed. Version control features will be limited."
        return
    fi

    log_success "Git version: $(git --version)"

    # Check if this is a git repository
    cd "$PROJECT_ROOT"
    if ! git status >/dev/null 2>&1; then
        log_info "Initializing Git repository..."
        git init
        log_success "Git repository initialized"
    fi
}

check_optional_tools() {
    log_info "Checking optional tools..."

    # Terraform
    if command -v terraform >/dev/null 2>&1; then
        log_success "Terraform available: $(terraform version | head -n1)"
    else
        log_warning "Terraform not found. Infrastructure deployment will not be available."
        echo "  Install from: https://www.terraform.io/downloads.html"
    fi

    # AWS CLI
    if command -v aws >/dev/null 2>&1; then
        log_success "AWS CLI available: $(aws --version)"
    else
        log_warning "AWS CLI not found. Deployment to AWS will not be available."
        echo "  Install from: https://aws.amazon.com/cli/"
    fi

    # Task
    if command -v task >/dev/null 2>&1; then
        log_success "Task available: $(task --version)"
    else
        log_warning "Task not found. Using make instead of task for automation."
        echo "  Install from: https://taskfile.dev/installation/"
    fi

    # Make
    if command -v make >/dev/null 2>&1; then
        log_success "Make available: $(make --version | head -n1)"
    else
        log_warning "Make not found. Manual script execution required."
    fi
}

install_node_dependencies() {
    log_info "Installing Node.js dependencies..."
    cd "$PROJECT_ROOT"

    npm ci

    log_success "Node.js dependencies installed"
}

setup_husky() {
    log_info "Setting up Git hooks with Husky..."
    cd "$PROJECT_ROOT"

    if [ -d ".git" ]; then
        npm run prepare
        log_success "Git hooks configured"
    else
        log_warning "Not a Git repository, skipping Husky setup"
    fi
}

setup_terraform() {
    if command -v terraform >/dev/null 2>&1; then
        log_info "Initializing Terraform..."
        cd "$PROJECT_ROOT/terraform"

        terraform init

        log_success "Terraform initialized"
    else
        log_info "Skipping Terraform initialization (not installed)"
    fi
}

setup_vscode() {
    log_info "Setting up VS Code configuration..."
    cd "$PROJECT_ROOT"

    mkdir -p .vscode

    # Create VS Code settings
    cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "emmet.includeLanguages": {
    "typescriptreact": "html"
  }
}
EOF

    # Create VS Code extensions recommendations
    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "hashicorp.terraform",
    "ms-vscode.test-adapter-converter",
    "vitest.explorer"
  ]
}
EOF

    # Create VS Code tasks
    cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "test",
      "type": "npm",
      "script": "test",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
EOF

    log_success "VS Code configuration created"
}

run_initial_tests() {
    log_info "Running initial tests to verify setup..."
    cd "$PROJECT_ROOT"

    # Type check
    npm run type-check

    # Lint check
    npm run lint

    # Build test
    npm run build

    # Test run
    npm run test:run

    log_success "All initial tests passed"
}

create_env_file() {
    log_info "Creating environment file..."
    cd "$PROJECT_ROOT"

    if [ ! -f ".env.local" ]; then
        cat > .env.local << 'EOF'
# Development environment variables
VITE_APP_TITLE=React Static Site Template
VITE_API_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development

# Add your environment-specific variables here
EOF
        log_success ".env.local created"
    else
        log_info ".env.local already exists"
    fi
}

print_next_steps() {
    echo
    echo "================================"
    log_success "Setup completed successfully!"
    echo "================================"
    echo
    echo "🚀 Next steps:"
    echo
    echo "1. Start development server:"
    echo "   npm run dev"
    echo "   # or"
    echo "   make dev"
    echo "   # or"
    echo "   task dev"
    echo
    echo "2. Run tests:"
    echo "   npm test"
    echo "   # or"
    echo "   make test"
    echo
    echo "3. Build for production:"
    echo "   npm run build"
    echo "   # or"
    echo "   make build"
    echo
    echo "4. Deploy to AWS (requires AWS credentials):"
    echo "   make deploy-dev"
    echo "   # or"
    echo "   ./scripts/deploy.sh dev"
    echo
    echo "📚 Useful commands:"
    echo "   make help          # Show all available commands"
    echo "   task --list        # Show all task commands"
    echo "   npm run lint:fix   # Fix linting issues"
    echo "   npm run test:watch # Run tests in watch mode"
    echo
    echo "🔧 Development URLs:"
    echo "   Development: http://localhost:3000"
    echo "   Preview:     http://localhost:4173"
    echo
    if command -v code >/dev/null 2>&1; then
        echo "💡 Open in VS Code: code ."
    fi
    echo
}

main() {
    echo "================================"
    echo "React Static Site Template Setup"
    echo "================================"
    echo

    check_system_requirements
    check_node
    check_npm
    check_git
    check_optional_tools

    echo
    log_info "Installing dependencies and configuring environment..."

    install_node_dependencies
    setup_husky
    setup_terraform
    setup_vscode
    create_env_file

    echo
    log_info "Running verification tests..."

    run_initial_tests

    print_next_steps
}

# Error handling
trap 'log_error "Setup failed at line $LINENO"' ERR

# Run main function
main "$@"