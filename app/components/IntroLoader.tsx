'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Run animation
    const initAnimation = () => {
      try {
        // Ensure we disable scroll
        document.body.style.overflow = 'hidden';

        // Set initial states for paths
        gsap.set([
          '#logo-p',
          '#logo-y-left',
          '#logo-y-right',
          '#logo-r',
          '#logo-o',
          '#logo-media-m',
          '#logo-media-e',
          '#logo-media-d',
          '#logo-media-i',
          '#logo-media-a',
        ], {
          opacity: 0,
          y: 20,
        });

        gsap.set('#logo-y-dot', {
          opacity: 0,
          scale: 0,
          transformOrigin: 'center center',
        });

        const tl = gsap.timeline({
          onComplete: () => {
            // Unmute/reveal main site and re-enable scroll
            gsap.to(containerRef.current, {
              opacity: 0,
              yPercent: -100,
              duration: 1.2,
              ease: 'power4.inOut',
              onComplete: () => {
                document.body.style.overflow = '';
                onComplete();
              }
            });
          }
        });

        // 1. Reveal "PYRO" big letters
        tl.to('#logo-p', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, 0.2);

        tl.to('#logo-y-left', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.3');

        tl.to('#logo-y-right', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.4');

        // Y green dot bounce animation
        tl.to('#logo-y-dot', {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'back.out(2.5)'
        }, '-=0.2');

        tl.to('#logo-r', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.3');

        tl.to('#logo-o', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.4');

        // 2. Reveal "MEDIA" small letters (left to right: M -> E -> D -> I -> A)
        tl.to([
          '#logo-media-m',
          '#logo-media-e',
          '#logo-media-d',
          '#logo-media-i',
          '#logo-media-a'
        ], {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out'
        }, '-=0.1');

        // 3. Complete glow/pulse effect of the full assembled logo
        tl.to(svgRef.current, {
          scale: 1.05,
          filter: 'drop-shadow(0 0 15px rgba(69, 178, 137, 0.4))',
          duration: 0.6,
          ease: 'power2.inOut',
        });

        tl.to(svgRef.current, {
          scale: 1,
          filter: 'drop-shadow(0 0 0px rgba(69, 178, 137, 0))',
          duration: 0.5,
          ease: 'power2.inOut',
        }, '+=0.1');

      } catch (err) {
        console.error('Loader animation error:', err);
        // Fail-safe to avoid blocking user
        document.body.style.overflow = '';
        onComplete();
      }
    };

    initAnimation();

    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none pointer-events-auto"
    >
      <div className="relative flex flex-col items-center">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 sm:h-24 md:h-32 w-auto max-w-[85vw] transition-all duration-300"
          viewBox="0 0 180 70"
          fill="none"
        >
          {/* Left arm of Y */}
          <path
            id="logo-y-left"
            d="M53.9473 0.56781H70.6979V28.959C61.4469 28.959 53.9473 21.4594 53.9473 12.2082V0.56781Z"
            fill="#FFF7EA"
          />
          {/* Right arm of Y */}
          <path
            id="logo-y-right"
            d="M93.9703 0.56781H77.2196V46.8455C86.4706 46.8455 93.9703 39.3459 93.9703 30.0947V0.56781Z"
            fill="#FFF7EA"
          />
          {/* Green dot of Y */}
          <path
            id="logo-y-dot"
            d="M63.8712 47.1308C68.2616 47.1308 71.8206 43.5716 71.8206 39.1812C71.8206 34.7908 68.2616 31.2317 63.8712 31.2317C59.4809 31.2317 55.9219 34.7908 55.9219 39.1812C55.9219 43.5716 59.4809 47.1308 63.8712 47.1308Z"
            fill="#45B289"
          />
          {/* P */}
          <path
            id="logo-p"
            d="M35.2048 0.424194C38.0702 0.424194 41.9368 1.35534 45.0895 3.93472C48.2477 6.51889 50.6777 10.7486 50.6777 17.3175C50.6777 23.8947 47.7799 28.3691 44.3985 31.196C41.0243 34.0168 37.1605 35.2035 35.2048 35.2036C33.2887 35.2036 27.7526 35.232 22.6955 35.2605C20.1672 35.2748 17.7583 35.289 15.9819 35.2997C15.0939 35.3051 14.3636 35.3099 13.8555 35.313C13.6015 35.3146 13.4024 35.3159 13.2674 35.3168C13.2002 35.3172 13.1485 35.3172 13.1138 35.3174H13.11L0.231406 45.6772L0 45.8631V7.23856C6.47483e-05 6.75159 0.158177 6.08397 0.454589 5.36313C0.752101 4.6397 1.19342 3.85171 1.76979 3.12219C2.92145 1.66464 4.62682 0.424259 6.81423 0.424194H35.2048ZM10.5049 11.0716V24.983H33.076C36.9172 24.9828 40.031 21.869 40.0311 18.0276C40.0311 14.1861 36.9173 11.0717 33.076 11.0716H10.5049Z"
            fill="#FFF7EA"
          />
          {/* O */}
          <path
            id="logo-o"
            d="M155.443 0C169.005 0 180 8.80143 180 22.997C180 38.6121 169.005 45.9941 155.443 45.9941C139.402 45.9939 130.885 35.6977 130.885 22.997C130.885 8.80149 141.879 6.47483e-05 155.443 0ZM155.301 11.6401C149.656 11.6401 145.08 16.9154 145.08 23.4226C145.08 29.9298 149.656 35.205 155.301 35.205C160.945 35.2049 165.521 29.9297 165.521 23.4226C165.521 16.9155 160.945 11.6403 155.301 11.6401Z"
            fill="#FFF7EA"
          />
          {/* R */}
          <path
            id="logo-r"
            d="M113.561 45.9941H98.7979V0.56781H113.561V45.9941ZM128.04 13.3436C119.464 13.3493 115.999 14.9546 113.561 22.2869V8.51715C118.491 2.81037 121.637 0.984206 128.04 0.56781V13.3436Z"
            fill="#FFF7EA"
          />
          {/* MEDIA: A */}
          <path
            id="logo-media-a"
            d="M104.101 69.0886L107.114 60.189H108.926L111.932 69.0886H110.243L108.175 62.641C108.127 62.4862 108.086 62.3483 108.053 62.2259C108.021 62.1003 107.99 61.978 107.962 61.8601H107.931C107.903 61.978 107.872 62.1003 107.84 62.2259C107.807 62.3483 107.767 62.4862 107.718 62.641L105.687 69.0886H104.101ZM105.662 67.0452L105.98 65.8616H109.974L110.304 67.0452H105.662Z"
            fill="#FFF7EA"
          />
          {/* MEDIA: I */}
          <path
            id="logo-media-i"
            d="M99.5703 69.07V60.1891H101.236V69.07H99.5703Z"
            fill="#FFF7EA"
          />
          {/* MEDIA: D */}
          <path
            id="logo-media-d"
            d="M89.0674 68.9904V60.1892H92.0865C93.3148 60.1892 94.3015 60.5557 95.0468 61.2893C95.7926 62.019 96.1649 63.0323 96.1649 64.3299V64.8375C96.1649 66.135 95.7946 67.1529 95.0532 67.8904C94.3125 68.624 93.3232 68.9904 92.0865 68.9904H89.0674ZM90.824 67.7816H91.9881C92.7249 67.7816 93.3038 67.542 93.7246 67.0622C94.1455 66.5786 94.3559 65.8793 94.3559 64.9644V64.2211C94.3559 63.2984 94.141 62.603 93.7117 62.1355C93.2818 61.6642 92.7075 61.4265 91.9881 61.4227H90.824V67.7816Z"
            fill="#FFF7EA"
          />
          {/* MEDIA: E */}
          <path
            id="logo-media-e"
            d="M79.7041 68.9904V60.1892H86.1484V61.4952H81.5889V63.8766H85.5015V65.0913H81.5889V67.7149H86.2338V68.9904H79.7041Z"
            fill="#FFF7EA"
          />
          {/* MEDIA: M */}
          <path
            id="logo-media-m"
            d="M68.0586 68.9902V60.189H69.988L71.8165 66.0526C71.8554 66.1892 71.8903 66.3226 71.922 66.4514C71.9576 66.5803 71.9874 66.7175 72.012 66.8626H72.0386C72.0632 66.7175 72.0917 66.5803 72.1234 66.4514C72.1584 66.3187 72.1953 66.1853 72.2341 66.0526L74.0632 60.189H76.0082V68.9902H74.5967V63.1875C74.5967 63.0541 74.5967 62.9052 74.5967 62.74C74.6006 62.5749 74.6071 62.4254 74.6181 62.2926H74.5864C74.565 62.4293 74.5352 62.5788 74.4964 62.74C74.4575 62.9013 74.4187 63.0502 74.3798 63.1875L72.6045 68.9902H71.3464L69.5653 63.1875C69.5264 63.0541 69.4856 62.8967 69.4435 62.7154C69.4047 62.5341 69.3781 62.393 69.3639 62.2926H69.3322C69.3393 62.3891 69.3451 62.5303 69.3484 62.7154C69.3555 62.8967 69.3587 63.0541 69.3587 63.1875V68.9902H68.0586Z"
            fill="#FFF7EA"
          />
        </svg>
      </div>
    </div>
  );
};

export default IntroLoader;
