import React from 'react';
import { motion } from 'framer-motion';

export const BigLogotypeFooter = ({ logo, sitemap, contactInfo, socialLinks }) => {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big Logotype */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="text-6xl md:text-8xl font-bold tracking-tight">
            {logo}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Sitemap */}
          <div>
            <h4 className="font-semibold mb-4">Sitemap</h4>
            <ul className="space-y-2">
              {sitemap.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              {contactInfo.map((info, index) => (
                <div key={index}>{info}</div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};
