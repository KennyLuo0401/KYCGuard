import React from 'react';
import { Shield, Github, Twitter, ExternalLink, Heart, Code } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Documentation', href: '#', icon: <Code className="w-4 h-4" /> },
    { label: 'Terms', href: '#', icon: <ExternalLink className="w-4 h-4" /> },
    { label: 'Privacy', href: '#', icon: <ExternalLink className="w-4 h-4" /> },
  ];

  const socialLinks = [
    { 
      label: 'GitHub',
      href: '#',
      icon: <Github className="w-5 h-5" />,
      hoverColor: 'hover:text-white'
    },
    { 
      label: 'Twitter',
      href: '#',
      icon: <Twitter className="w-5 h-5" />,
      hoverColor: 'hover:text-blue-400'
    },
  ];

  return (
    <footer className="border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              <span className="font-display text-lg font-bold text-white">KYC Guard</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Secure and compliant identity verification for the decentralized world. 
              Built with modern web standards and blockchain technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:px-8">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`text-gray-400 ${social.hoverColor} transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800/50`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} KYC Guard. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>by</span>
              <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                KYC Guard Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}