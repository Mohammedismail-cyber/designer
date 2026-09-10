import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const InlineNewsletterSignup = ({ 
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  onSubmit 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
        required
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
      >
        {isSubmitted ? 'Subscribed!' : buttonText}
      </motion.button>
    </form>
  );
};
