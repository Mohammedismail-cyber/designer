import React from 'react';
import { motion } from 'framer-motion';

export const TeamGrid = ({ members }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {members.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 bg-gray-100">
            {member.image}
            
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4"
            >
              {member.socials?.map((social, socialIndex) => (
                <a
                  key={socialIndex}
                  href={social.href}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </motion.div>
          </div>
          
          <h3 className="font-semibold text-gray-900">{member.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{member.role}</p>
        </motion.div>
      ))}
    </div>
  );
};
