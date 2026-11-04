'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import GroupImage from '@/public/group_client.svg';

type LogoCell = {
  id: string;
  label: string;
  src: string;
};

const CLIENT_LOGOS = [
  { fileName: 'flipkart-explore-plus-logo.svg', label: 'Flipkart Explore Plus' },
  { fileName: 'zepto-logo.svg', label: 'Zepto' },
  { fileName: 'country-delight-logo.svg', label: 'Country Delight' },
  { fileName: 'sugar-fit-logo.svg', label: 'Sugar.fit' },
  { fileName: 'indigo-logo.svg', label: 'IndiGo' },
  { fileName: 'nothing-logo.svg', label: 'Nothing' },
  { fileName: 'bmw-logo.svg', label: 'BMW' },
  { fileName: 'duolingo-logo.svg', label: 'Duolingo' },
  { fileName: 'oyo-logo.svg', label: 'OYO' },
  { fileName: 'mondelez-international-logo.svg', label: 'Mondelez International' },
  { fileName: 'bgmi-krafton-logo.svg', label: 'BGMI Krafton' },
  { fileName: 'godrej-logo.svg', label: 'Godrej' },
  { fileName: 'openai-logo.svg', label: 'OpenAI' },
  { fileName: 'nura-logo.svg', label: 'NURA' },
  { fileName: 'indulekha-logo.svg', label: 'Indulekha' },
  { fileName: 'unacademy-logo.svg', label: 'Unacademy' },
  { fileName: 'google-logo.svg', label: 'Google' },
  { fileName: 'amazon-logo.svg', label: 'Amazon' },
  { fileName: 'asian-paints-logo.svg', label: 'Asian Paints' },
  { fileName: 'pidilite-logo.svg', label: 'Pidilite' },
  { fileName: 'mcaffeine-logo.svg', label: 'mCaffeine' },
  { fileName: 'swiggy-instamart-logo.svg', label: 'Swiggy Instamart' },
  { fileName: 'closeup-logo.svg', label: 'Closeup' },
  { fileName: 'premier-league-logo.svg', label: 'Premier League' },
  { fileName: 'wow-skin-science-logo.svg', label: 'WOW Skin Science' },
  { fileName: 'flixbus-logo.svg', label: 'FlixBus' },
  { fileName: 'youtube-logo.svg', label: 'YouTube' },
  { fileName: 'bangur-cement-logo.svg', label: 'Bangur Cement' },
  { fileName: 'oziva-logo.svg', label: 'OZiva' },
  { fileName: 'gemini-logo.svg', label: 'Gemini' },
  { fileName: 'snapmint-logo.svg', label: 'Snapmint' },
  { fileName: 'blinkit-logo.svg', label: 'Blinkit' },
  { fileName: 'visit-saudi-logo.svg', label: 'Visit Saudi' },
  { fileName: 'ditto-logo.svg', label: 'Ditto' },
  { fileName: 'oppo-logo.svg', label: 'OPPO' },
];

const logoList: LogoCell[] = CLIENT_LOGOS.map(({ fileName, label }, index) => ({
  id: `logo-${index}`,
  label,
  src: `/clients/${fileName}`,
}));

const LOGO_ROWS: LogoCell[][] = [
  logoList.slice(0, 9),
  logoList.slice(9, 18),
  logoList.slice(18, 27),
  logoList.slice(27, 35),
];

const Clients = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 36 },
            {
              opacity: 1, y: 0, duration: 1, ease: 'power4.out',
              scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
            },
          );
        }

        if (gridRef.current) {
          gsap.fromTo(
            gridRef.current.querySelectorAll('.client-logo'),
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.55, stagger: 0.03, ease: 'power2.out',
              scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
            },
          );
        }
      } catch (error) {
        console.error('GSAP failed:', error);
      }
    };
    init();
  }, []);

  return (
    <section id="clients" className="w-full bg-[#02190A]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left var(--speed, 35s) linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right var(--speed, 35s) linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}} />
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#02190A] to-[#0C5A29]">
        <div className="relative z-10 w-full flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">

          {/* Heading */}
          <div ref={titleRef} className="flex w-full max-w-[860px] lg:max-w-[920px] xl:max-w-[980px] flex-col items-center gap-4 sm:gap-5 md:gap-5 lg:gap-6 xl:gap-6 text-center px-4 sm:px-6 md:px-8 lg:px-0" style={{paddingTop:"20px"}}>
            <h2
              className="font-['Tapestry',serif] text-[clamp(34px,4.5vw,64px)] font-normal leading-[1.2] text-[#FFF7EA]"
              style={{ textShadow: '0 4px 0 #08391A, 2px 0 0 #08391A, -2px 0 0 #08391A, 0 -2px 0 #08391A' }}
            >
              Our Star-Studded Brand Lineup
            </h2>
            <p className="w-full max-w-[840px] lg:max-w-[900px] xl:max-w-[960px] font-[family-name:var(--font-inter)] text-[clamp(14px,1.1vw,16px)] font-normal leading-[1.65] text-[#FFF7EA]/80">
              Our portfolio features the ultimate lead actors of the corporate world. We&apos;ve partnered with global giants to script viral<br />
              marketing campaigns, turning everyday brand messages into pure box-office gold.
            </p>
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.28] mix-blend-screen">
                  <Image src={GroupImage} alt="" fill className="object-cover" />
                </div>

          {/* Logo Carousel Container */}
          <div
            ref={gridRef}
            className="w-full relative py-4 md:py-6 lg:py-8 xl:py-10 2xl:py-12 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32"
            style={{
              maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
              paddingTop: '0px',
            }}
          >
            <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 w-full">
              {LOGO_ROWS.map((row, rowIdx) => {
                const isLeftToRight = rowIdx % 2 === 0;
                const speed = rowIdx === 0 ? '30s' : rowIdx === 1 ? '38s' : rowIdx === 2 ? '26s' : '34s';
                const animationClass = isLeftToRight ? 'animate-scroll-right' : 'animate-scroll-left';

                return (
                  <div
                    key={rowIdx}
                    className="marquee-row w-full overflow-hidden"
                  >
                    <div
                      className={`${animationClass} flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 w-max`}
                      style={{ '--speed': speed } as React.CSSProperties}
                    >
                      {row.concat(row).map((logo, logoIdx) => (
                        <div
                          key={`${logo.id}-${logoIdx}`}
                          className="client-logo relative shrink-0 overflow-hidden"
                          style={{
                            width: 'clamp(120px, 14.5vw, 177.6px)',
                            height: 'clamp(68px, 8.2vw, 100px)',
                          }}
                        >
                          <img
                            src={logo.src}
                            alt={`${logo.label} logo`}
                            draggable={false}
                            className="w-full h-full object-contain pointer-events-none select-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Clients;
