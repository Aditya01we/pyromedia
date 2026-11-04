'use client';

import { useEffect, useRef } from 'react';
import MilestoneCard, { MilestoneItem } from './MilestoneCard';

export const milestones: MilestoneItem[] = [
  { id: 1, value: '2000+', label: 'Global Campaigns' },
  { id: 2, value: '2000+', label: 'Global Campaigns' },
  { id: 3, value: '2000+', label: 'Global Campaigns' },
  { id: 4, value: '2000+', label: 'Global Campaigns' },
];

interface MilestonesSectionProps {
  items?: MilestoneItem[];
}

/**
 * Milestones section from Figma (node 630:6144) — heading + 2x2 grid of
 * marquee-sign stat cards on a dark green vertical gradient.
 */
const MilestonesSection = ({ items = milestones }: MilestonesSectionProps) => {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.milestone-card');
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0,
              duration: 0.8, stagger: 0.12, ease: 'power3.out',
              scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' },
            }
          );
        }
      } catch (e) {
        console.error('GSAP failed:', e);
      }
    };
    init();
  }, []);

  return (
    <section 
      className="relative w-full overflow-hidden py-16 md:py-[60px]"
      style={{ background: 'linear-gradient(180deg, #02190A 0%, #08391A 100%)' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-clockwise {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-clockwise {
          animation: spin-clockwise 20s linear infinite;
        }
      `}} />

      {/* Background Spin overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="animate-spin-clockwise absolute left-1/2 top-1/2 min-w-[150%] aspect-square bg-cover bg-center bg-no-repeat opacity-45 mix-blend-screen"
          style={{ 
            backgroundImage: 'url(/services/spin.svg)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Background Dots overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-screen z-10"
        style={{ backgroundImage: 'url(/services/dots.svg)' }}
      />

      <div className="relative z-20 mx-auto max-w-[1200px] px-4 md:px-8 xl:px-0">
        {/* Heading (Figma 630:6150) */}
        <h2 className="font-[family-name:var(--font-tapestry)] font-normal capitalize text-center text-[#FFF7EA] leading-[1.2] text-[clamp(34px,4.45vw,64px)]">
          Milestones (related to services)
        </h2>

        {/* 2x2 card grid (Figma 630:6151) */}
        <div
          ref={cardsRef}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
        >
          {items.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              mirrored={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;
