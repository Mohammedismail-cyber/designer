import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PricingTable = ({ plans }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toggle */}
      <div className="flex items-center justify-center mb-12">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${
            !isYearly ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-4 py-2 rounded-r-lg font-medium transition-colors ${
            isYearly ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-2xl p-8 border ${
              plan.popular
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="text-xs font-semibold uppercase tracking-wider mb-4">
                Most Popular
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
              {plan.description}
            </p>
            
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isYearly ? 'yearly' : 'monthly'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-4xl font-bold">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                plan.popular
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
