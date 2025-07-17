// src/pages/About.jsx
import React from 'react';
import { Music, Globe, Users, Heart, Github, Linkedin, Mail } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-4">
          About MultiTune
        </h1>
        <p className="text-xl text-primary-100">
          Bridging cultures through music, one language at a time
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Heart className="h-6 w-6 mr-2 text-red-500" />
          Our Mission
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          MultiTune is a revolutionary music platform that celebrates the diversity of languages and cultures through music. 
          We believe that music is a universal language that transcends borders, and our platform makes it easy for users to 
          discover and enjoy songs in multiple languages.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you're a music enthusiast exploring different cultures or someone looking to enjoy your favorite songs 
          in your native language, MultiTune provides a seamless experience that connects you to the rich tapestry of 
          global music.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Globe className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Multi-Language Support
          </h3>
          <p className="text-gray-600">
            Listen to the same song in different languages with authentic artists and vocals
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Music className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            High-Quality Audio
          </h3>
          <p className="text-gray-600">
            Stream songs in high quality with advanced audio controls and features
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Community Driven
          </h3>
          <p className="text-gray-600">
            Built for music lovers who appreciate cultural diversity and linguistic richness
          </p>
        </div>
      </div>

      {/* Technology Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Frontend</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                React.js with modern hooks
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Tailwind CSS for styling
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Lucide React for icons
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                React Router for navigation
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Backend</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Node.js with Express.js
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                RESTful API architecture
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Audio streaming with range support
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                CORS and security middleware
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Project Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Purpose</h3>
            <p className="text-gray-600 mb-4">
              This project was developed as part of an internship to showcase modern web development skills 
              using the MERN stack (MongoDB, Express.js, React, Node.js). It demonstrates proficiency in 
              building full-stack applications with modern JavaScript frameworks.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Multi-language song support
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Real-time audio streaming
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Advanced search and filtering
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Responsive design
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Developer
        </h2>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Munir (Developer)
            </h3>
            <p className="text-gray-600 mb-3">
              Full-stack developer passionate about creating innovative web applications 
              that bridge cultures and enhance user experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github className="h-5 w-5 mr-1" />
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Linkedin className="h-5 w-5 mr-1" />
                LinkedIn
              </a>
              <a
                href="mailto:munir@example.com"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-5 w-5 mr-1" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-600">
        <p>
          Built with ❤️ using React, Node.js, and modern web technologies
        </p>
        <p className="mt-2 text-sm">
          © 2025 MultiTune - Internship Project
        </p>
      </div>
    </div>
  );
};
