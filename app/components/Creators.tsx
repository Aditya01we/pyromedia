'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import GroupImage from '@/public/Group.png';

type Platform = 'instagram' | 'youtube';

type CreatorPlatform = {
  type: Platform;
  href: string;
};

type Creator = {
  id: number;
  name: string;
  role: string;
  image: string;
  hoverImage: string;
  platforms: CreatorPlatform[];
};

const creators: Creator[] = [
  {
    id: 1,
    name: 'Vijay Kumar',
    role: 'Content Creator',
    image: '/creators/vijay.png',
    hoverImage: '/creators/vijay_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/vijay3guy/' },
      { type: 'youtube', href: 'https://www.youtube.com/@3guy' },
    ],
  },
  {
    id: 2,
    name: 'Jaydeep Patel',
    role: 'Content Creator',
    image: '/creators/jaydeep.png',
    hoverImage: '/creators/jaydeep_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/jaydeepdpatel/' },
      { type: 'youtube', href: 'https://www.youtube.com/@hezukepapa' },
    ],
  },
  {
    id: 5,
    name: 'Muneeb Hasan Khan',
    role: 'Content Creator',
    image: '/creators/muneeb.png',
    hoverImage: '/creators/muneeb_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/feelmuneeb/' },
      { type: 'youtube', href: 'https://www.youtube.com/@feelmuneeb' },
    ],
  },
  {
    id: 6,
    name: 'Shashank Sharma',
    role: 'Content Creator',
    image: '/creators/shashank.png',
    hoverImage: '/creators/shashank_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/shashankayur' },
      { type: 'youtube', href: 'https://www.youtube.com/@shashankayur' },
    ],
  },
  {
    id: 7,
    name: 'Loveneet valecha',
    role: 'Content Creator',
    image: '/creators/loveneet.png',
    hoverImage: '/creators/loveneet_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/loveneet_valechaa/' },
      { type: 'youtube', href: 'https://www.youtube.com/@loveneetvalecha' },
    ],
  },
  // {
  //   id: 8,
  //   name: 'Pawan Lohomord',
  //   role: 'Content Creator',
  //   image: '/creators/pawan.png',
  //   hoverImage: '/creators/pawan_hover.png',
  //   platforms: [
  //     { type: 'instagram', href: 'https://www.instagram.com/lohomord/' },
  //     { type: 'youtube', href: 'https://www.youtube.com/RomRomJi' },
  //   ],
  // },
  // {
  //   id: 9,
  //   name: 'Nirmalesh',
  //   role: 'Content Creator',
  //   image: '/creators/nirmalesh.png',
  //   hoverImage: '/creators/nirmalesh_hover.png',
  //   platforms: [
  //     { type: 'instagram', href: 'https://www.instagram.com/marine_mantra_reels/' },
  //     { type: 'youtube', href: 'https://www.youtube.com/@MarineMantra' },
  //   ],
  // },
  {
    id: 11,
    name: 'Anshul Jeet',
    role: 'Content Creator',
    image: '/creators/anshul.png',
    hoverImage: '/creators/anshul_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/anshul.jeet444/' },
      { type: 'youtube', href: 'https://www.youtube.com/@Anxhuljeet' },
    ],
  },
  {
    id: 12,
    name: 'Barkha Tiwari',
    role: 'Content Creator',
    image: '/creators/barkha.png',
    hoverImage: '/creators/barkha_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/barkha_tiwari_1' },
      { type: 'youtube', href: 'https://www.youtube.com/@BarkhaTiwariofficial' },
    ],
  },
  {
    id: 13,
    name: 'Hezal Patel',
    role: 'Content Creator',
    image: '/creators/hezal.png',
    hoverImage: '/creators/hezal_hover.png',
    platforms: [
      { type: 'instagram', href: 'https://www.instagram.com/hezalnuts' },
      { type: 'youtube', href: 'https://www.youtube.com/' },
    ],
  },
];

const hoverPortraitClipPath = 'polygon(0 3.2%, 7.6% 0, 92.4% 0, 100% 3.2%, 100% 96.8%, 92.4% 100%, 7.6% 100%, 0 96.8%)';

// Duplicate creators for infinite carousel
const infiniteCreators = [...creators, ...creators];

const Creators = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: { trigger: titleRef.current, start: 'top 88%' },
            }
          );
        }

        if (trackRef.current) {
          const cards = trackRef.current.querySelectorAll('.creator-figma-card');

          gsap.fromTo(
            cards,
            { opacity: 0, y: 54, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: { trigger: trackRef.current, start: 'top 82%' },
            }
          );
        }
      } catch (error) {
        console.error('GSAP failed:', error);
      }
    };

    init();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#051c0e] pt-10  md:pt-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(28,179,84,0.22),_transparent_42%),linear-gradient(180deg,_rgba(8,58,25,0.82)_0%,_rgba(5,28,14,1)_70%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        style={{ top: 0, bottom: 0 }}
      >
        <div
          className="absolute h-[300%] w-[300%] animate-[spin_60s_linear_infinite] opacity-40"
          style={{
            background:
              'repeating-conic-gradient(from 0deg at 50% 50%, #051c0e 0deg 4deg, #08471F 4deg 8deg)',
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.28] mix-blend-screen">
        <Image src={GroupImage} alt="" fill className="object-cover" />
      </div>
      <div className="scanline-overlay absolute inset-0 pointer-events-none opacity-80" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">

        <div className="mb-14 lg:mb-16 xl:mb-18 2xl:mb-20 text-center">
          <h2
            ref={titleRef}
            className="section-title-glow font-['Tapestry',serif] text-[clamp(34px,4.5vw,62px)] font-normal text-center leading-[1.2] text-[#FFF7EA]"
            style={{
              textShadow:
                '0 4px 0 #08391A, 2px 0 0 #08391A, -2px 0 0 #08391A, 0 -2px 0 #08391A',
            }}
          >
            The Main Leads: Meet Our Talented Roster
          </h2>
          <p className="mx-auto mt-4 max-w-[820px] font-['Inter',sans-serif] text-sm leading-7 text-[rgba(255,247,234,0.68)]">
            The Real Protagonists! At Pyromedia, we don&apos;t just manage talent; we curate a gallery of
            visionaries. Our creators, &ldquo;The Sparks,&rdquo; are the digital icons who turn every campaign into
            a blockbuster event. With raw ingenuity and screen-breaking talent, they ignite your brand&apos;s
            story and captivate global audiences like true superstars.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-hidden pb-4">
          <div
            ref={trackRef}
            className="flex gap-4 pb-6 pt-2 sm:gap-5 animate-[scroll_15s_linear_infinite]"
            style={{
              animation: 'scroll 10s linear infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {infiniteCreators.map((creator, index) => (
              <CreatorCard key={`${creator.id}-${index}`} creator={creator} />
            ))}
          </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 2));
          }
        }
      `}</style>
    </section>
  );
};

function CreatorCard({ creator }: { creator: Creator }) {
  const slug = creator.image.split('/').pop()!.replace(/\.png$/, '');

  return (
    <article className="creator-figma-card relative h-[529px] w-[217px] shrink-0 [perspective:1200px]">
      {/* Portrait hover zone: ONLY this area (y=0-371) triggers flip.
          Bottom area (pills at y=371+) is dead zone — hovering it does NOT flip. */}
      <div className="portrait-hover-zone peer absolute inset-x-0 top-0 h-[371px] z-20" />

      <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] peer-hover:[transform:rotateY(180deg)]">
        {/* ── Front face: card art + name + pills ── */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {/* Dummy SVG background */}
          <Image
            src={`/dummy/${slug}.svg`}
            alt={`${creator.name} card`}
            fill
            sizes="217px"
            unoptimized
            className="pointer-events-none select-none object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.28)]"
          />

          {/* Name + pills (on front face only) */}
          <div className="absolute left-0 top-[371px] h-[157.17px] w-full">
            <h3 className="absolute inset-x-[16px] top-[22px] text-center font-[family-name:var(--font-yeseva-one)] text-[18px] capitalize leading-[1.3] text-[#FFF7EA] break-words">
              {creator.name}
            </h3>

            <div className="absolute bottom-[26px] left-1/2 flex -translate-x-1/2 items-center gap-[4px] backdrop-blur-[1.5px]">
              {creator.platforms.map((platform) => (
                <PlatformPill key={platform.type} creatorName={creator.name} platform={platform} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Back face (revealed on portrait hover flip) ── */}
        <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] pointer-events-none">
          <Image
            src="/images/creator_card_hover.svg"
            alt=""
            fill
            sizes="217px"
            className="select-none object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.28)]"
          />
          <div
            className="absolute left-[13.52px] top-[14px] h-[500.99px] w-[189px] overflow-hidden"
            style={{ clipPath: hoverPortraitClipPath }}
          >
            <Image
              src={creator.hoverImage}
              alt={`${creator.name} hover portrait`}
              fill
              sizes="189px"
              className="object-cover object-center"
            />
          </div>
          <div
            className="pointer-events-none absolute left-[13.52px] top-[14px] h-[500.99px] w-[189px] border border-[rgba(8,58,25,0.36)]"
            style={{ clipPath: hoverPortraitClipPath }}
          />
        </div>
      </div>
    </article>
  );
}

function PlatformPill({ creatorName, platform }: { creatorName: string; platform: CreatorPlatform }) {
  const isInstagram = platform.type === 'instagram';
  const label = isInstagram ? 'Instagram' : 'YouTube';

  return (
    <a
      href={platform.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-[24px] w-[87.5px] items-center justify-center gap-[4px] overflow-hidden rounded-[4px] bg-[rgba(255,247,234,0.16)] text-[#FFF7EA] transition-colors duration-200 hover:bg-[rgba(255,247,234,0.28)]"
      aria-label={`${label} profile for ${creatorName}`}
    >
      {isInstagram ? <InstagramIcon /> : <YoutubeIcon />}
      <span className="font-[family-name:var(--font-inter)] text-[12px] capitalize leading-[1.2]">{label}</span>
    </a>
  );
}

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px] shrink-0" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px] shrink-0" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="5.2" width="19" height="13.6" rx="4.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M10 9.25L15.2 12L10 14.75V9.25Z" fill="currentColor" />
  </svg>
);

export default Creators;
