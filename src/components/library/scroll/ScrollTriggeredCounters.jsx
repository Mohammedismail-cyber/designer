import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export const ScrollTriggeredCounters = ({ stats }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl font-bold text-gray-900 md:text-5xl">
            {inView && (
              <CountUp
                end={stat.value}
                duration={2}
                suffix={stat.suffix || ''}
                prefix={stat.prefix || ''}
              />
            )}
          </div>
          <div className="mt-2 text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
