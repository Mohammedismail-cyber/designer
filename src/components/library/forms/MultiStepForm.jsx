import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MultiStepForm = ({ steps, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-gray-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {steps[currentStep].component}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        
        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};
