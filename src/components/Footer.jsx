import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-scroll';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Contact', to: 'contact' }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <FaGithub className="text-xl" />,
      url: 'https://github.com/ericbowser/'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="text-xl" />,
      url: 'https://www.linkedin.com/in/eric-bowser-a25036348/'
    }
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-burtons mb-4">
              <span className="text-teal-500">E.R.B.</span> - Eric Ryan Bowser
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Full-Stack Developer specializing in React, Node.js, and .NET technologies.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              &copy; {currentYear} Eric Ryan Bowser. All rights reserved.
            </p>
          </div>

          {/* Site Navigation */}
          <div className="text-center">
            <h4 className="text-gray-900 dark:text-white font-medium mb-4">Site Navigation</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className="text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="text-center md:text-right">
            <h4 className="text-gray-900 dark:text-white font-medium mb-4">Connect</h4>
            <div className="flex justify-center md:justify-end space-x-4 mb-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
                aria-label="Contact"
              >
                <FaEnvelope className="text-xl" />
              </Link>
            </div>
            <a
              href="../assets/cv_8_4_2025.docx"
              download
              className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;