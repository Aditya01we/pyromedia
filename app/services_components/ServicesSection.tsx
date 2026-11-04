'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import GroupImage from '@/public/Group.png';
import ServiceCard from './ServiceCard';
import { services, ServiceContent } from './servicesData';

interface ServicesSectionProps {
  items?: ServiceContent[];
}

/**
 * Services section from Figma (node 630:5) — rotating green sunburst with
 * grunge texture behind large ticket-style service cards.
 */
const ServicesSection = ({ items = services }: ServicesSectionProps) => {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.service-card');
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 60, scale: 0.96 },
              {
                opacity: 1, y: 0, scale: 1,
                duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 85%' },
              }
            );
          });
        }
      } catch (e) {
        console.error('GSAP failed:', e);
      }
    };
    init();
  }, []);

  return (
    <section className="relative w-full bg-[#051c0e] overflow-hidden">
      {/* Rotating sunburst (Figma group 630:6) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-[300%] aspect-square animate-[spin_60s_linear_infinite] opacity-40"
          style={{ background: 'repeating-conic-gradient(from 0deg at 50% 50%, #051c0e 0deg 4deg, #08471F 4deg 8deg)' }}
        />
      </div>

      {/* Grunge texture (Figma group 630:47) */}
      <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-overlay z-[5]">
        <Image src={GroupImage} alt="" fill className="object-cover" />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.32] mix-blend-screen z-20">
        <Image src={GroupImage} alt="" fill className="object-cover" />
      </div>

      {/* Scan lines */}
      <div className="scanline-overlay absolute inset-0 z-10 pointer-events-none" />

      {/* Service cards */}
      <div ref={cardsRef} className="relative z-30 flex flex-col gap-12 md:gap-16 px-4 md:px-[8.33%] my-[40px]">
        {items.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
