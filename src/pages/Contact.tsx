import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.warn('Form submitted:', formData);
    alert('Thank you for your message! This is a demo form.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact - React Static Site Template</title>
        <meta
          name="description"
          content="Get in touch with us about the React Static Site Template."
        />
        <meta property="og:title" content="Contact - React Static Site Template" />
        <meta
          property="og:description"
          content="Get in touch with us about the React Static Site Template."
        />
      </Helmet>

      <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Have questions about the template? We&apos;d love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Send Message
            </button>
          </div>
        </form>

        <div className="mx-auto mt-20 max-w-xl">
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900">Other Ways to Reach Us</h3>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-sm font-semibold text-gray-900">GitHub</dt>
                <dd className="mt-1 text-sm text-gray-600">
                  <a
                    href="https://github.com"
                    className="text-blue-600 hover:text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View the source code and submit issues
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-900">Documentation</dt>
                <dd className="mt-1 text-sm text-gray-600">
                  Check out the README and documentation for detailed setup instructions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
