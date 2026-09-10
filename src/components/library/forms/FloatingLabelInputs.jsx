import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const FloatingLabelInputs = ({ fields }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [values, setValues] = useState({});

  const handleFocus = (name) => setFocusedField(name);
  const handleBlur = () => setFocusedField(null);
  const handleChange = (name, value) => setValues({ ...values, [name]: value });

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="relative">
          <input
            type={field.type || 'text'}
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={() => handleFocus(field.name)}
            onBlur={handleBlur}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors peer"
            placeholder=" "
          />
          <motion.label
            htmlFor={field.name}
            animate={{
              y: focusedField === field.name || values[field.name] ? -24 : 0,
              scale: focusedField === field.name || values[field.name] ? 0.85 : 1,
            }}
            className="absolute left-4 top-3 text-gray-500 pointer-events-none origin-left transition-all"
          >
            {field.label}
          </motion.label>
        </div>
      ))}
    </div>
  );
};
