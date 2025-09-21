import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { createRouteSEO } from '../utils/seo';

// Pure data for features section
interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: readonly string[];
}

const features: readonly Feature[] = [
  {
    title: 'Modern React & TypeScript',
    description:
      'Built with React 18, TypeScript, and modern development practices for type safety and developer experience.',
    icon: [
      'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M9.75 3.104L19.8 8.904M5 14.5v.791c0 .864.933 1.539 1.777 1.284L19.8 14.5M5 14.5L19.8 8.904',
    ],
  },
  {
    title: 'Vite & Lightning Fast',
    description:
      'Powered by Vite for instant hot module replacement and optimized production builds.',
    icon: ['M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'],
  },
  {
    title: 'Testing & Quality',
    description:
      'Comprehensive testing setup with Vitest, coverage reports, and automated quality checks.',
    icon: [
      'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    ],
  },
  {
    title: 'AWS Deployment Ready',
    description:
      'Complete Terraform infrastructure for S3, CloudFront, and Route53 with CI/CD pipelines.',
    icon: [
      'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z',
    ],
  },
] as const;

// Pure component for feature card
interface FeatureCardProps {
  readonly feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => (
  <div className="relative pl-16">
    <dt className="text-base font-semibold leading-7 text-gray-900">
      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          {feature.icon.map((path, index) => (
            <path key={index} strokeLinecap="round" strokeLinejoin="round" d={path} />
          ))}
        </svg>
      </div>
      {feature.title}
    </dt>
    <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
  </div>
);

// Pure component for features section
interface FeaturesSectionProps {
  readonly features: readonly Feature[];
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => (
  <div className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-blue-600">Everything Included</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Production-Ready Features
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Built with modern tools and best practices for scalable, maintainable applications.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </dl>
      </div>
    </div>
  </div>
);

// Pure component for hero section
const HeroSection = () => (
  <div className="relative isolate px-6 pt-14 lg:px-8">
    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
      <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
    </div>

    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          React Static Site Template
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A production-ready React static site template with TypeScript, Tailwind CSS, testing
          setup, and complete AWS deployment infrastructure.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/about"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Learn More
          </Link>
          <Link to="/contact" className="text-sm font-semibold leading-6 text-gray-900">
            Get in Touch <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>

    <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
      <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
    </div>
  </div>
);

const Home = () => {
  const seoProps = createRouteSEO(
    'Home',
    'A production-ready React static site template with AWS deployment capabilities.',
    {
      ogTitle: 'React Static Site Template',
    }
  );

  return (
    <>
      <SEOHead seo={seoProps} />

      <div className="bg-white">
        <HeroSection />
        <FeaturesSection features={features} />
      </div>
    </>
  );
};

export default Home;
