import React from 'react';
import { FiHome } from "react-icons/fi";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import resume from '../assets/erb_cv_resume.pdf';

function Navbar({ setDarkMode = () => {}, darkMode = false, showBackButton = false, onBackToLanding = () => {} }) {
    return (
        <nav className={`
            fixed top-0 left-0 right-0 z-50
            backdrop-blur-lg bg-white/80 dark:bg-gray-800/80
            border-b border-gray-200 dark:border-gray-700
            shadow-sm
            transition-all duration-300
        `}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Brand/Back Button */}
                    <div className="flex items-center space-x-4">
                        {showBackButton && (
                            <button
                                onClick={onBackToLanding}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                                         bg-gradient-to-r from-cyan-500 to-teal-500 text-white
                                         hover:opacity-90 transition-opacity
                                         font-medium"
                                aria-label="Back to home"
                            >
                                <FiHome className="text-lg" />
                                <span className="hidden sm:inline">Back to Home</span>
                            </button>
                        )}
                        <div className="text-sm sm:text-base">
                            <h1 className="font-bold text-gray-900 dark:text-white">
                                <span className="text-teal-500">E.R.B.</span> - Eric Ryan Bowser
                            </h1>
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg 
                                     text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-100 dark:hover:bg-gray-700
                                     transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <BsFillSunFill className="text-xl" />
                            ) : (
                                <BsFillMoonStarsFill className="text-xl" />
                            )}
                        </button>

                        {/* Resume Download */}
                        <a
                            className="px-4 py-2 
                                   bg-gradient-to-r from-cyan-500 to-teal-500 
                                   text-white rounded-lg 
                                   hover:opacity-90 transition-opacity
                                   font-medium text-sm sm:text-base"
                            href={resume}
                            download
                        >
                            <span className="hidden sm:inline">Download </span>Resume
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;