# React Static Site Template

A production-ready React static site template with TypeScript, Tailwind CSS,
comprehensive testing, and complete AWS deployment infrastructure.

## 🚀 Features

### Frontend Stack

- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **React Helmet Async** for SEO meta tag management

### Testing & Quality

- **Vitest** for unit testing with 80% coverage threshold
- **Testing Library** for component testing
- **ESLint** with React and TypeScript rules
- **Prettier** for code formatting
- **Husky** for pre-commit hooks

### Development Experience

- **Hot Module Replacement** for instant feedback
- **TypeScript** strict mode for better code quality
- **Path mapping** for clean imports
- **Progressive Web App** capabilities
- **Bundle analysis** and optimization

### Infrastructure & Deployment

- **AWS S3** for static hosting
- **CloudFront** CDN for global distribution
- **Route53** for DNS management (optional)
- **Terraform** for infrastructure as code
- **GitHub Actions** for CI/CD
- **Security headers** and best practices

## 📋 Prerequisites

- Node.js 18+ and npm
- AWS CLI configured (for deployment)
- Terraform 1.13+ (for infrastructure)
- Git

## 🛠️ Quick Start

### 1. Setup Development Environment

```bash
# Clone and setup
git clone <repository-url>
cd react-static-site-template

# Run setup script
./scripts/setup.sh

# Or manual setup
npm ci
npm run prepare  # Setup git hooks
```

### 2. Start Development

```bash
# Start development server
npm run dev
# or
make dev
# or
task dev

# Visit http://localhost:3000
```

### 3. Build and Test

```bash
# Run all tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
react-static-site-template/
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── styles/            # CSS and styling
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # SEO robots file
│   └── sitemap.xml        # SEO sitemap
├── terraform/             # Infrastructure as code
│   ├── main.tf            # Terraform configuration
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Output values
│   ├── s3.tf             # S3 bucket configuration
│   ├── cloudfront.tf     # CloudFront distribution
│   └── route53.tf        # DNS configuration
├── scripts/               # Deployment scripts
│   ├── setup.sh          # Development setup
│   ├── build.sh          # Production build
│   └── deploy.sh         # Deployment script
├── .github/workflows/     # CI/CD pipelines
├── tests/                 # Test configuration
├── package.json           # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── Taskfile.yml          # Task automation
└── Makefile              # Make targets
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Types

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Multi-component interaction tests
- **E2E Tests**: Full application workflow tests (via Playwright)

### Coverage Requirements

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## 🏗️ Building

### Development Build

```bash
npm run dev
```

### Production Build

```bash
# Standard build
npm run build

# Build with bundle analysis
npm run build:analyze

# Build for preview environment
npm run build:preview
```

### Build Optimization

- **Code splitting** for optimal loading
- **Tree shaking** to remove unused code
- **Asset optimization** with proper caching headers
- **Bundle size monitoring** with warnings for large files
- **Compression** with gzip for static files

## 🚀 Deployment

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** installed locally

### Deployment Environments

- **Development**: Continuous deployment from `develop` branch
- **Staging**: Manual deployment with approval
- **Production**: Manual deployment from `main` branch with approval

### Deploy with Scripts

```bash
# Deploy to development
./scripts/deploy.sh dev

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh prod
```

### Deploy with Make

```bash
# Deploy to different environments
make deploy-dev
make deploy-staging
make deploy-prod

# Deploy only assets (skip infrastructure)
make deploy-assets-only

# Invalidate CloudFront cache
make invalidate-cache
```

### Deploy with Task

```bash
# Deploy to different environments
task deploy:dev
task deploy:staging
task deploy:prod

# Deploy individual components
task deploy:assets
task deploy:invalidate
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
VITE_APP_TITLE=My React App
VITE_API_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
```

### Terraform Variables

Configure in `terraform/terraform.tfvars`:

```hcl
project_name = "my-react-app"
environment  = "prod"
domain_name  = "example.com"
enable_ssl   = true
```

### Build Configuration

Customize in `vite.config.ts`:

```typescript
export default defineConfig({
  // Customize build settings
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 500,
  },
  // Add environment-specific configuration
});
```

## 📊 Performance

### Bundle Size Limits

- **JavaScript bundles**: < 1MB per chunk
- **CSS bundles**: < 200KB per file
- **Total initial load**: < 2MB

### Performance Monitoring

```bash
# Analyze bundle size
npm run build:analyze

# Run Lighthouse audit
make lighthouse

# Check performance metrics
task perf:bundle
```

### Optimization Features

- **Code splitting** by route and vendor libraries
- **Lazy loading** for non-critical components
- **Asset optimization** with proper cache headers
- **CDN distribution** via CloudFront
- **Compression** with gzip and brotli

## 🔒 Security

### Security Features

- **Content Security Policy** headers
- **HTTPS enforcement** via CloudFront
- **Security headers** (X-Frame-Options, X-Content-Type-Options)
- **Dependency scanning** via npm audit
- **Infrastructure security** via Checkov and TFLint

### Security Scanning

```bash
# Run security audit
npm run security:check

# Scan dependencies
make security

# Terraform security scan
make tf-security
```

## 🔍 Monitoring & Observability

### Available Metrics

- **CloudFront**: Cache hit ratio, origin requests, error rates
- **S3**: Request counts, data transfer, error rates
- **Build**: Bundle sizes, build times, test coverage

### Monitoring Commands

```bash
# View CloudWatch metrics
make status

# Check deployment status
task status

# View build analytics
npm run build:analyze
```

## 🛠️ Development Tools

### Available Commands

```bash
# Show all available commands
make help
task --list

# Code quality
npm run lint
npm run lint:fix
npm run format
npm run type-check

# Testing
npm run test:watch
npm run test:coverage
npm run test:ui

# Development
npm run dev
npm run preview
npm run build:analyze
```

### IDE Setup

**VS Code Extensions** (recommended):

- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- TypeScript and JavaScript Language Features
- Auto Rename Tag
- Path Intellisense

**Configuration files** are automatically created by setup script.

## 📚 Documentation

### Generate Documentation

```bash
# Generate TypeScript documentation
make docs

# Serve documentation locally
task docs:serve
```

### API Documentation

- **Component Documentation**: Generated via TypeDoc
- **Infrastructure Documentation**: Available in terraform/ README
- **Deployment Documentation**: Available in scripts/ comments

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

1. **Quality Gate**: Linting, type checking, testing
2. **Build**: Production build with optimization
3. **Infrastructure Validation**: Terraform validation and security scanning
4. **E2E Testing**: Full application testing (PR only)
5. **Performance Testing**: Lighthouse audits (PR only)
6. **Deployment**: Automated deployment to appropriate environment
7. **Post-deployment**: Cache invalidation and verification

### Pipeline Features

- **Parallel execution** for faster builds
- **Security scanning** with Checkov and CodeQL
- **Bundle analysis** with size tracking
- **Coverage reporting** with Codecov integration
- **Environment promotion** with approval gates

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Workflow

1. **Setup**: Run `./scripts/setup.sh`
2. **Develop**: Use `npm run dev` or `make dev`
3. **Test**: Run `npm test` continuously
4. **Lint**: Fix issues with `npm run lint:fix`
5. **Build**: Test with `npm run build`
6. **Deploy**: Use `make deploy-dev`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the fast build tool
- **Tailwind CSS** for the utility-first approach
- **Vitest Team** for the testing framework
- **AWS** for the cloud infrastructure
- **Terraform** for infrastructure as code

---

**🚀 Happy coding! Build something amazing!**
