import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - React Static Site Template</title>
        <meta
          name="description"
          content="Learn more about the React Static Site Template and its features."
        />
        <meta property="og:title" content="About - React Static Site Template" />
        <meta
          property="og:description"
          content="Learn more about the React Static Site Template and its features."
        />
      </Helmet>

      <div className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <p className="text-base font-semibold leading-7 text-blue-600">About This Template</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for Modern Development
          </h1>
          <p className="mt-6 text-xl leading-8">
            This React static site template provides everything you need to build and deploy
            production-ready web applications with confidence and speed.
          </p>

          <div className="mt-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Key Features</h2>
            <p className="mt-6">
              Our template is designed with modern development practices and production requirements
              in mind. Every component has been carefully crafted to provide the best developer
              experience while maintaining high performance and reliability standards.
            </p>

            <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
              <li className="flex gap-x-3">
                <svg
                  className="mt-1 h-5 w-5 flex-none text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.66a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong className="font-semibold text-gray-900">TypeScript Integration.</strong>{' '}
                  Full type safety with modern TypeScript configuration for better development
                  experience and fewer runtime errors.
                </span>
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="mt-1 h-5 w-5 flex-none text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.66a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong className="font-semibold text-gray-900">Vite Build System.</strong>{' '}
                  Lightning-fast development server with hot module replacement and optimized
                  production builds.
                </span>
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="mt-1 h-5 w-5 flex-none text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.66a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong className="font-semibold text-gray-900">Comprehensive Testing.</strong>{' '}
                  Vitest setup with coverage reporting, component testing, and continuous
                  integration.
                </span>
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="mt-1 h-5 w-5 flex-none text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.66a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong className="font-semibold text-gray-900">AWS Infrastructure.</strong>{' '}
                  Complete Terraform configuration for S3, CloudFront, and Route53 with security
                  best practices.
                </span>
              </li>
            </ul>

            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Architecture</h2>
            <p className="mt-6">
              The template follows a clean, modular architecture that scales with your project.
              Components are organized by function, with clear separation of concerns between UI
              components, business logic, and infrastructure code.
            </p>
            <p className="mt-8">
              The build process is optimized for performance, with automatic code splitting, tree
              shaking, and asset optimization. The result is a fast, lightweight application that
              provides an excellent user experience across all devices and network conditions.
            </p>

            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Deployment</h2>
            <p className="mt-6">
              Deployment is handled through a comprehensive CI/CD pipeline that includes quality
              gates, security scanning, and automated testing. The infrastructure is defined as code
              using Terraform, ensuring consistent and reproducible deployments across all
              environments.
            </p>
            <p className="mt-8">
              The template supports multiple deployment environments (development, staging,
              production) with environment-specific configurations and approval workflows for
              production deployments.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
