'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GroupImage from '@/public/Group.png';
import DynamicServiceCard, { ServiceItem } from './DynamicServiceCard';

const services = [
  {
    id: 1,
    title: 'New-Age Influencer Marketing',
    description: 'Partnering with influencers who align with your brand vision, we create authentic connections that resonate with audiences.',
    leftSvg: '/services/1.1.json',
    rightSvg: '/services/SERVICE 1.json',
  },
  {
    id: 2,
    title: 'Creative Meme Marketing',
    description: 'Viral moments made intentional. We craft memes that spark conversations and amplify your brand voice.',
    leftSvg: '/services/mini_2.svg',
    rightSvg: '/services/SERVICE 2.json',
  },
  {
    id: 3,
    title: 'Social Media Management',
    description: 'From strategy to execution, we manage your social presence to build community and drive engagement.',
    leftSvg: '/services/mini_3.svg',
    rightSvg: '/services/SERVICE 3.json',
  },
  {
    id: 4,
    title: 'Public Relation',
    description: 'Shaping narratives and building relationships, we position your brand as an industry leader.',
    leftSvg: '/services/mini_4.svg',
    rightSvg: '/services/SERVICES 4.json',
  },
  {
    id: 5,
    title: 'TVC Production',
    description: 'Lights, camera, blockbuster! From concept to final cut, we produce television commercials with cinematic drama and emotion.',
    leftSvg: '/services/5.1.json',
    rightSvg: '/services/SERVICES 5.json',
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 60 },
            {
              opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
              scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
            }
          );
        }

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.service-card');
          gsap.fromTo(
            cards,
            { opacity: 0, y: 50, scale: 0.92 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.9, stagger: 0.12, ease: 'power3.out',
              scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
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
    <section ref={sectionRef} className="relative w-full bg-[#051c0e] overflow-hidden">
      {/* Rotating sunburst — clipped to start below the SERVICES line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" style={{ top: 0, bottom: 0 }}>
        <div
          className="absolute w-[300%] h-[300%] animate-[spin_60s_linear_infinite] opacity-40"
          style={{ background: 'repeating-conic-gradient(from 0deg at 50% 50%, #051c0e 0deg 4deg, #08471F 4deg 8deg)' }}
        />
      </div>

      {/* Grunge texture (Figma group 150:42378) */}
      <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-overlay z-5">
        <Image src={GroupImage} alt="" fill className="object-cover" />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.32] mix-blend-screen z-20">
        <Image src={GroupImage} alt="" fill className="object-cover" />
      </div>

      {/* Scan lines */}
      <div className="scanline-overlay absolute inset-0 z-10 pointer-events-none" />

      {/* Top section rule */}
      <div className="relative z-30 flex items-center gap-4 px-8 md:px-16 mb-6 opacity-30">
        {/* <div className="flex-1 h-px bg-[#FFF7EA]" />
        <span className="font-['var(--font-geist-mono)',monospace] text-[10px] uppercase tracking-[0.3em] text-[#FFF7EA]">Services</span>
        <div className="flex-1 h-px bg-[#FFF7EA]" /> */}
      </div>

      {/* Section title */}
      <div className="relative z-30 text-center px-4 mb-6 md:mb-5">
        <h2
          ref={titleRef}
          className="font-['Tapestry',serif] text-[clamp(34px,4.5vw,64px)] font-normal text-[#FFF7EA] text-center capitalize leading-[1.2] section-title-glow"
        >
          Our Action-Packed Services
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 xl:gap-x-9 2xl:gap-x-10 gap-y-4 sm:gap-y-6 md:gap-y-8 lg:gap-y-10 xl:gap-y-11 2xl:gap-y-12 w-[min(95vw,1440px)] sm:w-[min(92vw,1440px)] md:w-[min(90vw,1440px)] lg:w-[min(88vw,1440px)] xl:w-[min(87vw,1440px)] mx-auto px-4 sm:px-8 lg:px-16 xl:px-18 2xl:px-20 relative z-30 py-12 pt-0 md:py-16 lg:py-18 xl:py-20 2xl:py-24 md:pt-0" ref={cardsRef} style={{paddingTop:0}}>
        {services.map((service, index) => (
          <Link
            key={service.id}
            href={`/services?id=${service.id}`}
            className={`w-full flex justify-center cursor-pointer ${index === 4 ? 'md:col-span-2' : ''}`}
          >
            <DynamicServiceCard service={service} />
          </Link>
        ))}
      </div>
    </section>
  );
};


export default Services;
