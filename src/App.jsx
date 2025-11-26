import React, { useState, useEffect, useRef } from "react";
import { Element } from 'react-scroll';
import head2 from './assets/eb_1.jpg';
import Footer from './components/Footer';
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Cards from "./components/Cards";
import EmailSubmit from "./components/EmailSubmit";
import Projects from "./components/Projects";
import About from "./components/About";

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [currentView, setCurrentView] = useState('landing'); // 'landing', 'about', 'skills', 'projects', 'contact'
    
    // Refs for scrolling
    const aboutRef = useRef(null);
    const skillsRef = useRef(null);
    const projectsRef = useRef(null);
    const contactRef = useRef(null);

    // Load dark mode preference from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    // Save dark mode preference to localStorage
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Handle navigation from landing page
    const handleNavigate = (section) => {
        setCurrentView(section);
        
        // Smooth scroll to section after a brief delay for animation
        setTimeout(() => {
            const refs = {
                'about': aboutRef,
                'skills': skillsRef,
                'projects': projectsRef,
                'contact': contactRef
            };
            
            if (refs[section]?.current) {
                refs[section].current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    };

    // Handle back to landing
    const handleBackToLanding = () => {
        setCurrentView('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render based on current view
    if (currentView === 'landing') {
        return (
            <div className={darkMode ? "dark" : ""}>
                <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                    <Navbar 
                        setDarkMode={setDarkMode} 
                        darkMode={darkMode}
                        showBackButton={false}
                    />
                    <Landing onNavigate={handleNavigate} darkMode={darkMode} />
                    <Footer />
                </div>
            </div>
        );
    }

    // Render focused section view
    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <Navbar 
                    setDarkMode={setDarkMode} 
                    darkMode={darkMode}
                    showBackButton={true}
                    onBackToLanding={handleBackToLanding}
                />

                {/* About Section */}
                {currentView === 'about' && (
                    <div ref={aboutRef}>
                        <Element name="about">
                            <About profileImage={head2} />
                        </Element>
                    </div>
                )}

                {/* Skills Section */}
                {currentView === 'skills' && (
                    <div ref={skillsRef} className="pt-20">
                        <Element name="skills">
                            <section className="py-20">
                                <div className="container mx-auto px-4">
                                    <div className="text-center mb-12">
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-burtons">
                                            Technical Skills
                                        </h2>
                                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                            A comprehensive overview of my technical expertise and professional capabilities.
                                        </p>
                                    </div>
                                    <Cards />
                                </div>
                            </section>
                        </Element>
                    </div>
                )}

                {/* Projects Section */}
                {currentView === 'projects' && (
                    <div ref={projectsRef} className="pt-20">
                        <Element name="projects">
                            <div className="bg-gray-50 dark:bg-gray-800">
                                <Projects />
                            </div>
                        </Element>
                    </div>
                )}

                {/* Contact Section */}
                {currentView === 'contact' && (
                    <div ref={contactRef} className="pt-20">
                        <Element name="contact">
                            <section className="py-20">
                                <div className="container mx-auto px-4 flex flex-col items-center">
                                    <div className="text-center mb-12 max-w-2xl">
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-burtons">
                                            Get In Touch
                                        </h2>
                                        <p className="text-lg text-gray-600 dark:text-gray-300">
                                            Interested in working together or have questions about my experience?
                                            Feel free to reach out through the form below.
                                        </p>
                                    </div>
                                    <div className="w-full max-w-md">
                                        <EmailSubmit />
                                    </div>
                                </div>
                            </section>
                        </Element>
                    </div>
                )}

                <Footer />
            </div>
        </div>
    );
}

export default App;