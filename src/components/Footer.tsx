import React from 'react';
import { Shield, Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    services: [
      'Website Development',
      'Mobile App Development',
      'AI & Machine Learning',
      'Cybersecurity',
      'Academic Projects',
    ],
    company: [
      'About Us',
      'Our Team',
      'Careers',
      'Blog',
      'Contact',
    ],
    resources: [
      'Case Studies',
      'Documentation',
      'Support',
      'Privacy Policy',
      'Terms of Service',
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/charlieverse', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/company/charlieverse', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/charlieverse', label: 'Twitter' },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Shield className="h-8 w-8 text-cyan-400" />
                  <div className="absolute inset-0 h-8 w-8 text-cyan-400 animate-pulse opacity-50">
                    <Shield className="h-8 w-8" />
                  </div>
                </div>
                <span className="text-xl font-bold text-white">Charlieverse</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering businesses with cutting-edge technology solutions. 
                From web development to AI implementation, we transform your vision into reality.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <span>hello@charlieverse.tech</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2024 Charlieverse. All rights reserved.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-cyan-400 transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 hover:scale-110"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;