// components/Footer.jsx
import React from "react";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-green-50">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:px-8 lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo + Description */}
          <div>
            <div className="text-teal-600 flex items-center gap-3 font-bold text-2xl">
              <Image
                src="/logo.jpg"
                alt="Company Logo"
                width={100}
                height={100}
                className="h-10 w-auto"
              />
              <span className="text-2xl">Raj Grocery</span>
            </div>

            <p className="mt-4 max-w-xs text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse non
              cupiditate quae nam molestias.
            </p>

            {/* Social Links */}
            <ul className="mt-8 flex gap-6">
              {/* Facebook */}
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 
                      2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797
                      c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26
                      c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988
                      C18.343 21.128 22 16.991 22 12z"
                    />
                  </svg>
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 
                      3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 
                      011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 
                      1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 
                      2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 
                      4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153
                      c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08
                      c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465
                      a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772
                      c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808
                      v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427
                      a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525
                      c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 
                      11.685 2h.63zM12 6.865a5.135 5.135 0 110 
                      10.27 5.135 5.135 0 010-10.27z"
                    />
                  </svg>
                </a>
              </li>

              {/* GitHub */}
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 
                      4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 
                      0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343
                      -.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 
                      1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 
                      2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113
                      -4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253
                      -.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 
                      9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 
                      1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 
                      2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695
                      -4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 
                      2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 
                      0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:col-span-2">
            <div>
              <p className="font-medium text-gray-900">Services</p>
              <ul className="mt-6 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-teal-600">
                    1on1 Coaching
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Company Review
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Accounts Review
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    HR Consulting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    SEO Optimisation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900">Company</p>
              <ul className="mt-6 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-teal-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Meet the Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900">Helpful Links</p>
              <ul className="mt-6 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900">Legal</p>
              <ul className="mt-6 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Returns Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-600">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Company Name. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
