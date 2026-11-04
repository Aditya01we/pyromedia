'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';

const SWIRL_BACKGROUND_SRC = '/figma-assets/debecbcbbc60be6ecfd1109bc3943897c846dfbc.svg';
const GRAIN_OVERLAY_SRC = '/figma-assets/d7f5aa5e9fb2bd0d8e2e393d36bd212eb81707dd.svg';
const STAMP_PANEL_SRC = '/images/star_lond_card.svg';
const STAMP_PANEL_STRETCH_SRC = '/images/star_lond_card_stretch.svg';
const TICKET_OUTER_SRC = '/figma-assets/8eafcca747bffb63ad18f1808aa6ba8617b7955c.svg';
const TICKET_INNER_SRC = '/figma-assets/213598d6180e41e56030ffbb30d458b1374d8b66.svg';
const TICKET_STAR_ROW_SRC = '/figma-assets/14bae6fa511820efa10423aaa5d7e6b281e15363.svg';
const TICKET_DOUBLE_RULE_SRC = '/figma-assets/fe4a23ee7d9283f901aa15ae3e56d271e4716fa3.svg';
const TICKET_SIDE_RULE_SRC = '/figma-assets/36f69fd30eb7465561e833880c9972d224dd5138.svg';
const TICKET_LOGO_MASK_SRC = '/figma-assets/e1f254fcf11efe864526bc62a3ed7eef58bef4ab.png';

const TICKET_WIDTH = 269.8;
const TICKET_HEIGHT = 140;

const COLLABS = [
  {
    id: 1,
    align: 'left' as const,
    name: 'Mobile Premier League',
    desc: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets.',
  },
  {
    id: 2,
    align: 'right' as const,
    name: 'Mobile Premier League',
    desc: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets.',
  },
  {
    id: 3,
    align: 'left' as const,
    name: 'Mobile Premier League',
    desc: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets.',
  },
  {
    id: 4,
    align: 'right' as const,
    name: 'Mobile Premier League',
    desc: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets.',
  },
];

const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;

const getTicketLayerStyle = (
  left: number,
  top: number,
  width: number,
  height: number,
): CSSProperties => ({
  left: toPercent(left, TICKET_WIDTH),
  top: toPercent(top, TICKET_HEIGHT),
  width: toPercent(width, TICKET_WIDTH),
  height: toPercent(height, TICKET_HEIGHT),
});

const getTicketLogoStyle = (): CSSProperties => ({
  ...getTicketLayerStyle(60, 53, 150, 34),
  WebkitMaskImage: `url(${TICKET_LOGO_MASK_SRC})`,
  maskImage: `url(${TICKET_LOGO_MASK_SRC})`,
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
});

function TicketDecoration({
  src,
  left,
  top,
  width,
  height,
}: {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return (
    <div className="pointer-events-none absolute" style={getTicketLayerStyle(left, top, width, height)}>
      <Image src={src} alt="" fill unoptimized sizes="100vw" className="object-fill" />
    </div>
  );
}

const Collabs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const swirlFrameRef = useRef<HTMLDivElement>(null);
  const swirlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isDisposed = false;
    let cleanupAnimations: (() => void) | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const updateSwirlBounds = () => {
      if (!sectionRef.current || !swirlFrameRef.current) {
        return;
      }

      const { width, height } = sectionRef.current.getBoundingClientRect();
      const size = Math.ceil(Math.hypot(width, height) * 1.12);

      swirlFrameRef.current.style.width = `${size}px`;
      swirlFrameRef.current.style.height = `${size}px`;
      swirlFrameRef.current.style.marginLeft = `${size / -2}px`;
      swirlFrameRef.current.style.marginTop = `${size / -2}px`;
    };

    updateSwirlBounds();

    if (sectionRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateSwirlBounds);
      resizeObserver.observe(sectionRef.current);
    }

    const init = async () => {
      try {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        if (isDisposed) {
          return;
        }

        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          if (!prefersReducedMotion && swirlRef.current) {
            gsap.to(swirlRef.current, {
              rotate: 360,
              duration: 32,
              ease: 'none',
              repeat: -1,
              transformOrigin: '50% 50%',
            });
          }

          if (titleRef.current) {
            gsap.fromTo(
              titleRef.current,
              { opacity: 0, y: 44 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
              },
            );
          }

          if (listRef.current) {
            const rows = listRef.current.querySelectorAll('.collab-row');
            gsap.fromTo(
              rows,
              { opacity: 0, x: (index) => (index % 2 === 0 ? -48 : 48) },
              {
                opacity: 1,
                x: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: { trigger: listRef.current, start: 'top 82%' },
              },
            );
          }
        }, sectionRef);

        cleanupAnimations = () => ctx.revert();
      } catch (error) {
        console.error('GSAP failed:', error);
      }
    };

    init();

    return () => {
      isDisposed = true;
      resizeObserver?.disconnect();
      cleanupAnimations?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collabs"
      className="relative overflow-hidden bg-gradient-to-b from-[#02190A] to-[#08391A] py-5 sm:py-10 lg:py-[20px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={swirlFrameRef}
          className="absolute left-1/2 top-1/2"
        >
          <div ref={swirlRef} className="relative h-full w-full will-change-transform">
            <Image
              src={SWIRL_BACKGROUND_SRC}
              alt=""
              fill
              unoptimized
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
      <Image
        src={GRAIN_OVERLAY_SRC}
        alt=""
        fill
        unoptimized
        className="pointer-events-none absolute inset-0 object-cover object-center opacity-60"
      />

      <div className="relative z-10 w-full flex flex-col gap-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 2xl:px-16">
  <h2
    ref={titleRef}
    className="w-full max-w-[1200px] text-center font-['Tapestry',serif] text-[clamp(24px,4.5vw,58px)] font-normal leading-[1.2] text-[#FFF7EA] whitespace-normal md:whitespace-nowrap"
    style={{
      textShadow:
        '0 4px 0 #08391A, 2px 0 0 #08391A, -2px 0 0 #08391A, 0 -2px 0 #08391A',
    }}
  >
    Star-Studded Tie-Ups: Our Collaborations
  </h2>

 <div ref={listRef} className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 px-4 md:px-8 lg:px-12 xl:px-14 2xl:px-16">
  {COLLABS.map((collab) => (
    <CollabRow key={collab.id} collab={collab} />
  ))}
</div>
</div>
    </section>
  );
};

function CollabRow({ collab }: { collab: (typeof COLLABS)[number] }) {
  const isLeft = collab.align === 'left';

  return (
    <div
      className={`collab-row relative flex flex-col items-center gap-2 sm:gap-3 md:gap-4 lg:min-h-[176px] lg:items-stretch lg:gap-[18px] xl:gap-[20px] 2xl:gap-[22px] ${
        isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
      }`}
    >
      <div
        className="relative z-20 w-[220px] shrink-0 sm:w-[248px] md:w-[260px] lg:w-[240px] xl:w-[286.659px]"
      >
        <TicketArt className={isLeft ? 'lg:-rotate-[8deg]' : 'lg:rotate-[8deg]'} />
      </div>

     <div className="relative z-10 w-full lg:flex-1">
  <div className="relative min-h-[150px] sm:min-h-[160px] md:min-h-[180px] w-full lg:min-h-[260px] xl:min-h-[300px] 2xl:min-h-[340px]">
    {/* Background Stamp Image — stretch variant below lg so the panel always covers the text */}
    <Image
      src={STAMP_PANEL_STRETCH_SRC}
      alt=""
      fill
      unoptimized
      className="pointer-events-none object-fill lg:hidden"
    />
    <Image
      src={STAMP_PANEL_SRC}
      alt=""
      fill
      unoptimized
      className="pointer-events-none hidden object-fill lg:block"
    />
    
    {/* Text Container with Adjusted Padding */}
    <div className="relative z-10 flex h-full w-full flex-col justify-start pt-6 sm:pt-8 lg:pt-20 px-10 pb-8 sm:px-12 lg:px-[45px] lg:pb-[35px]">
      <h3 className="mt-3 sm:mt-4 lg:mt-2 font-[family-name:var(--font-abril-fatface)] text-[15px] leading-[1.1] text-black sm:text-[20px] sm:leading-[1.15] lg:text-[22px] lg:leading-[1.2] xl:text-[28px]">
        {collab.name}
      </h3>
      <p className="mt-2 sm:mt-3 lg:mt-1 max-w-[820px] font-[family-name:var(--font-inter)] text-[12px] leading-[1.4] text-[#595959] sm:text-[14px] sm:leading-[1.5] lg:text-[14px] lg:leading-[1.4] xl:text-[18px] xl:leading-[1.6]">
        {collab.desc}
      </p>
    </div>
  </div>
</div>
    </div>
  );
}

function TicketArt({ className = '' }: { className?: string }) {
  return (
    <div className={`relative aspect-[269.8/140] w-full ${className}`}>
      <Image
        src={TICKET_OUTER_SRC}
        alt=""
        fill
        unoptimized
        className="pointer-events-none object-fill"
      />

      <TicketDecoration src={TICKET_INNER_SRC} left={26.17} top={21.27} width={217.613} height={96.75} />
      <TicketDecoration src={TICKET_DOUBLE_RULE_SRC} left={34.36} top={24.54} width={201.648} height={7.121} />
      <TicketDecoration src={TICKET_DOUBLE_RULE_SRC} left={34.36} top={107.4} width={201.648} height={7.121} />
      <TicketDecoration src={TICKET_SIDE_RULE_SRC} left={34.36} top={42.54} width={12.882} height={54.55} />
      <TicketDecoration src={TICKET_SIDE_RULE_SRC} left={222.5} top={42.54} width={12.882} height={54.55} />
      <TicketDecoration src={TICKET_STAR_ROW_SRC} left={25.31} top={10.19} width={219.006} height={7.16} />
      <TicketDecoration src={TICKET_STAR_ROW_SRC} left={25.31} top={123.36} width={219.006} height={7.16} />

      <div className="absolute bg-[#FFF7EA]" style={getTicketLogoStyle()} />
    </div>
  );
}

export default Collabs;
