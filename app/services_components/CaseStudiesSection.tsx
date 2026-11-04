'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import StampShape from './StampShape';
import { CaseStudy, VideoPanel, Caption } from './CaseStudyCard';

export const caseStudies: CaseStudy[] = [
  { id: 1, title: 'Vijay x Chat GPT' },
  { id: 2, title: 'Vijay x Chat GPT' },
  { id: 3, title: 'Vijay x Chat GPT' },
];

interface CaseStudiesSectionProps {
  items?: CaseStudy[];
}

/**
 * Case studies section from Figma (node 630:7459) — heading, two portrait
 * video stamps and a featured landscape stamp with carousel arrows, on a
 * dark green chevron background.
 */
const CaseStudiesSection = ({ items = caseStudies }: CaseStudiesSectionProps) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [featured, setFeatured] = useState(0);

  const portraits = items.slice(0, 2);
  const featuredItem = items[(2 + featured + items.length) % items.length];

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.case-card');
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
    <section className="case-studies-bg relative w-full overflow-hidden py-16 md:py-[60px]">
      <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 xl:px-0">
        {/* Heading (Figma 630:7784) */}
        <h2 className="font-[family-name:var(--font-tapestry)] font-normal capitalize text-center text-[#FFF7EA] leading-[1.2] text-[clamp(34px,4.45vw,64px)]">
          Case studies/works (reels and videos)
        </h2>

        {/* Cards (Figma 630:7785 / 630:7852 / 630:7919) */}
        <div
          ref={cardsRef}
          className="mt-9 flex flex-col items-center lg:flex-row lg:items-start lg:justify-center gap-10"
        >
          {/* Portrait stamps */}
          {portraits.map((study) => (
            <div
              key={study.id}
              className="case-card relative w-full max-w-[317px] aspect-[317.32/540] shrink-0"
            >
              <StampShape width={317.32} height={540} className="absolute inset-0 w-full h-full" />
              <VideoPanel
                study={study}
                className="absolute left-[6.3%] top-[3.7%] w-[87.3%] h-[82.2%]"
              />
              <div className="absolute left-0 right-0 top-[88.5%]">
                <Caption text={study.title} />
              </div>
            </div>
          ))}

          {/* Featured stamp with carousel arrows */}
          <div className="case-card relative w-full max-w-[485px] aspect-[485/540] shrink-0">
            <StampShape width={485} height={540} className="absolute inset-0 w-full h-full" />
            <div className="absolute left-0 right-0 top-[5.2%]">
              <Caption text={featuredItem.title} />
            </div>
            <VideoPanel
              study={featuredItem}
              className="absolute left-[4.12%] top-[14.07%] w-[91.75%] h-[60.74%]"
            />
            {/* Prev / next (Figma 630:7997) */}
            <div className="absolute left-1/2 top-[82.2%] -translate-x-1/2 flex gap-[24px]">
              <button
                type="button"
                aria-label="Previous case study"
                onClick={() => setFeatured((f) => f - 1)}
                className="relative h-[56px] w-[58px] cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <Image
                  src="/services/arrow_prev.svg"
                  alt=""
                  fill
                  sizes="58px"
                  className="object-contain"
                  draggable={false}
                />
              </button>
              <button
                type="button"
                aria-label="Next case study"
                onClick={() => setFeatured((f) => f + 1)}
                className="relative h-[56px] w-[58px] cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <Image
                  src="/services/arrow_next.svg"
                  alt=""
                  fill
                  sizes="58px"
                  className="object-contain"
                  draggable={false}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .case-studies-bg {
          background-color: #04300c;
          background-image: url('/images/case_study_service.svg');
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          position: relative;
        }
        .case-studies-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 20, 4, 0.45) 0%, rgba(0, 20, 4, 0) 30%, rgba(0, 20, 4, 0) 70%, rgba(0, 20, 4, 0.45) 100%);
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};

export default CaseStudiesSection;
