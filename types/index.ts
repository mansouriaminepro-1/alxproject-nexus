
import React from 'react';

// 🔹 Navigation Types
export interface NavLink {
  label: string;
  href: string;
}

// 🔹 Component Prop Types
export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}
