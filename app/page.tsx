

import Hero from '../components/home/Hero';
import Steps from '../components/home/Steps';

import Features from '../components/home/Features';
import BattlesGrid from '../components/home/BattlesGrid';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Steps />

      <Features />
      <BattlesGrid />
      <Testimonials />
      <CTA />
    </>
  );
}
