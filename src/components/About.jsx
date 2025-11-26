import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-scroll';

const About = ({ profileImage }) => {
  return (
    <section id="about" className="font-burtons py-20 bg-gray-50 dark:bg-gray-900 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Profile Image Column */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative">
              {/* Main Image */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-teal-500 dark:border-teal-400 shadow-xl">
                <img
                  src={profileImage}
                  alt="Eric Ryan Bowser"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Circle */}
              <div className="absolute -z-10 top-10 -left-10 w-20 h-20 rounded-full bg-cyan-400 opacity-30 dark:opacity-20 blur-md"></div>
              <div className="absolute -z-10 bottom-10 -right-10 w-32 h-32 rounded-full bg-teal-400 opacity-30 dark:opacity-20 blur-md"></div>
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full lg:w-3/5">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white font-burtons">
              <span className="text-teal-500">Hello, I'm Eric</span>
            </h2>

            <div className="text-lg text-gray-700 dark:text-gray-300 mb-8 space-y-4">
              <p>
                I'm a Full-Stack Developer with a passion for building modern web applications
                using React, Node.js, and C#/.NET technologies. With over 10 years of experience
                in software development, I specialize in creating responsive, user-friendly interfaces
                and robust backend systems.
              </p>
              <p>
                My approach to development focuses on writing clean, maintainable code following best practices
                and industry standards. I'm experienced in Agile methodologies and have a strong foundation
                in software architecture, database design, and API development.
              </p>
              <p>
                When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects,
                and continuously improving my skills through hands-on learning and professional development.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <a
                href="https://github.com/ericbowser"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
              >
                <FaGithub className="text-xl" />
                <span className="font-medium">GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/eric-bowser-a25036348/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
              >
                <FaLinkedin className="text-xl" />
                <span className="font-medium">LinkedIn</span>
              </a>

              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                <FaEnvelope className="text-xl" />
                <span className="font-medium">Contact Me</span>
              </Link>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="../assets/cv_8_4_2025.docx"
                download
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                Download Resume
              </a>

              <Link
                to="projects"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 font-medium rounded-md border border-teal-500 dark:border-teal-400 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;