import React from 'react';
import { FaUser, FaCode, FaFolderOpen, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import head2 from '../assets/eb_1.jpg';

const Landing = ({ onNavigate, darkMode }) => {
  const sections = [
    {
      id: 'about',
      title: 'About Me',
      description: 'Learn about my background, experience, and passion for development',
      icon: <FaUser />,
      gradient: 'from-blue-500 to-cyan-500',
      delay: '0'
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      description: 'Explore my expertise across various technologies and frameworks',
      icon: <FaCode />,
      gradient: 'from-purple-500 to-pink-500',
      delay: '100'
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Discover my portfolio of full-stack applications and solutions',
      icon: <FaFolderOpen />,
      gradient: 'from-teal-500 to-green-500',
      delay: '200'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Get in touch to discuss opportunities or collaborations',
      icon: <FaEnvelope />,
      gradient: 'from-orange-500 to-red-500',
      delay: '300'
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-5xl py-4">
        {/* Hero Section */}
        <div className="text-center mb-2 space-y-1 animate-fadeIn">
          <div className="relative inline-block mb-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-teal-500 dark:border-teal-400 shadow-xl mx-auto">
              <img
                src={head2}
                alt="Eric Ryan Bowser"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative circles */}
            <div className="absolute -z-10 top-0 -left-2 w-12 h-12 rounded-full bg-cyan-400 opacity-30 dark:opacity-20 blur-lg animate-pulse"></div>
            <div className="absolute -z-10 bottom-0 -right-2 w-20 h-20 rounded-full bg-teal-400 opacity-30 dark:opacity-20 blur-lg animate-pulse"></div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-burtons">
            <span className="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Eric Ryan Bowser
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto">
            Full-Stack Developer
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Building modern web applications with React, Node.js, and .NET technologies
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="w-full mt-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
          {sections.map((section, index) => (
            <div
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`
                group relative overflow-hidden rounded-xl 
                bg-white dark:bg-gray-800 
                shadow-md hover:shadow-xl 
                transition-all duration-300 
                cursor-pointer transform 
                hover:scale-105 hover:-translate-y-1
                border border-gray-200 dark:border-gray-700
                animate-fadeInUp
              `}
              style={{ animationDelay: `${section.delay}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${section.gradient} 
                opacity-0 group-hover:opacity-10 
                transition-opacity duration-300
              `}></div>
              
              {/* Content */}
              <div className="relative p-4 md:p-5 h-full flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`
                  mb-2 w-12 h-12 md:w-14 md:h-14 rounded-lg 
                  bg-gradient-to-br ${section.gradient} 
                  flex items-center justify-center text-white
                  shadow-md transform group-hover:scale-110 
                  transition-transform duration-300
                `}>
                  <div className="text-xl md:text-2xl">
                    {section.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 font-burtons group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                  {section.title}
                </h2>
                
                {/* Description */}
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-2 flex-grow leading-tight">
                  {section.description}
                </p>
                
                {/* Arrow Icon */}
                <div className="flex items-center text-teal-500 dark:text-teal-400 font-medium text-xs group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <FaArrowRight className="ml-1 text-xs" />
                </div>
              </div>
              
              {/* Hover Border Effect */}
              <div className={`
                absolute inset-0 rounded-xl 
                border-2 border-transparent 
                group-hover:border-teal-500 dark:group-hover:border-teal-400
                transition-all duration-300
                pointer-events-none
              `}></div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

