import React from 'react';
import { CheckIcon, ClockIcon, ChartIcon } from '../ui/icons';

const features = [
  {
    title: "IP-Based Vote",
    description: "One person, one vote. We strictly track IP addresses to ensure your results represent real customer demand, not spam or bots.",
    icon: <CheckIcon className="w-5 h-5 text-brand-black" />
  },
  {
    title: "Poll Deadlines",
    description: "You control the clock. Set your battle to run for 24 hours, 48 hours, or a week. The system automatically closes voting when time's up.",
    icon: <ClockIcon className="w-5 h-5 text-brand-black" />
  },
  {
    title: "Live Results",
    description: "No waiting for reports. Watch the battle unfold in real-time and see who is winning the moment a vote is cast.",
    icon: <ChartIcon className="w-5 h-5 text-brand-black" />
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-[42px] font-bold text-brand-black mb-6 tracking-tight">Core Features</h2>
          <p className="text-[16px] text-gray-500 font-normal">Designed for real-world restaurant challenges.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`
                bg-white p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-out 
                group hover:-translate-y-1 animate-fade-in-up
              `}
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-brand-black mb-4 group-hover:text-brand-yellow transition-colors duration-300">{feature.title}</h3>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;