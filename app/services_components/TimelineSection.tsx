'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import TimelineCard, { TimelineStep } from './TimelineCard';

const stepDescription =
  'The Real Protagonists! At Pyromedia, we don’t just manage talent; we curate a gallery of visionaries. Our creators, "The Sparks," are the digital icons who turn every campaign into a blockbuster event.';

export const timelineSteps: TimelineStep[] = [
  { id: 1, number: '01', title: 'Meet the Sparks', description: stepDescription },
  { id: 2, number: '02', title: 'Strategy Development', description: stepDescription },
  { id: 3, number: '03', title: 'Creator Selection', description: stepDescription },
  { id: 4, number: '04', title: 'Campaign Execution', description: stepDescription },
];

const BACKGROUND_SRC = '/services/milestones/bg_2.svg';
const backgroundStyle: CSSProperties = {
  backgroundImage: `url(${BACKGROUND_SRC})`,
};

interface TimelineSectionProps {
  items?: TimelineStep[];
}

/**
 * Process timeline section from Figma (node 630:7186) — heading + four
 * staggered postage-stamp cards on a dark green halftone background.
 */
const TimelineSection = ({ items = timelineSteps }: TimelineSectionProps) => {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.timeline-card');
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
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={backgroundStyle}
      />

      <div className="relative max-w-[1260px] mx-auto px-4 md:px-8 xl:px-0">
        {/* Heading (Figma 630:7191) */}
        <h2 className="font-[family-name:var(--font-tapestry)] font-normal capitalize text-center text-[#FFF7EA] leading-[1.2] text-[clamp(34px,4.45vw,64px)]">
          Visual timeline works best.
        </h2>

        {/* Staggered stamp cards (Figma 630:7192..7392) */}
        <div
          ref={cardsRef}
          className="mt-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-10 justify-items-center"
        >
          {items.map((step, index) => (
            <div
              key={step.id}
              className={index % 2 === 1 ? 'sm:translate-y-[60px]' : ''}
            >
              <TimelineCard step={step} />
            </div>
          ))}
        </div>

        {/* Spacer so staggered cards don't overflow the section */}
        <div className="hidden sm:block h-[60px]" />
      </div>
    </section>
  );
};

export default TimelineSection;
