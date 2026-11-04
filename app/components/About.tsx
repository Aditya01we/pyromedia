'use client';

import { useEffect, useRef } from 'react';
import GroupImage from '@/public/Group.png';
import { RibbonStrip } from './RibbonStrip';
import { useCanvasParticles } from '@/app/hooks/useCanvasParticles';

const ALL_WORDS =
  'is a Cinematic Masterpiece Blazing a Global Trail of Data Driven ROI and Blockbuster Brand Stories.'.split(
    ' ',
  );
const GROUPS: string[] = [];

for (let i = 0; i < ALL_WORDS.length; i += 2) {
  GROUPS.push(ALL_WORDS.slice(i, i + 2).join(' '));
}

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const canvasRef = useCanvasParticles();

  // Ribbon entrance animation only.
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let isMounted = true;

    const init = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const ribbon = ribbonRef.current;
      if (!isMounted || !section || !ribbon) return;

      const context = gsap.context(() => {
        gsap.set(ribbon, { autoAlpha: 0, x: 100, y: -100 });

        gsap.to(ribbon, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: false,
          },
        });
      }, section);

      cleanup = () => context.revert();
    };

    init();

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex min-h-0 lg:min-h-screen w-full items-center justify-center overflow-hidden bg-[#051c0e]"
    >
      <div className="relative z-20 flex aspect-auto sm:aspect-[16/10] md:aspect-[2/1] lg:aspect-[1.8/1] w-full items-center justify-center overflow-hidden px-3 sm:px-4 md:px-8 lg:px-12 xl:px-16 pt-20 pb-36 sm:py-0 lg:py-8 xl:py-12">
        <div className="relative sm:absolute sm:inset-0 z-20 flex w-full flex-col justify-center px-[6%] sm:px-[8%] sm:pb-[10%]">
          {/* Ribbon container keeps its entrance animation. */}

          <div
            ref={ribbonRef}
            id="about-ribbon-container"
            className="pointer-events-none absolute right-0 -top-16 sm:-top-8 lg:top-0 z-30 block h-[350px] w-[600px] origin-top-right scale-[0.35] sm:scale-[0.55] lg:scale-100 overflow-visible"
          >
            <RibbonStrip className="absolute right-[-175px] top-[-18px] h-[52px] w-[1120px] rotate-[12deg]" />
            <RibbonStrip className="absolute right-[-315px] top-[-118px] h-[52px] w-[980px] rotate-[63deg]" />
          </div>
          


          <div className="z-20 flex max-w-full flex-col items-start justify-center gap-0.5 sm:gap-0.5 md:gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 text-left">
            
            <h2
              id="about-main-text"
              className="font-['Tapestry',serif] text-[clamp(22px,5.6vw,28px)] font-normal leading-[1.4] tracking-wide text-[#fff7eb] sm:text-[3.8vw] md:text-[min(44px,4.6vw)] lg:text-[48px] xl:text-[65px]"
            >
              <span className="mr-2 inline-flex select-none items-center gap-1 rounded-[4px] py-0.5 align-middle font-sans text-[2.8vw] font-black uppercase leading-none tracking-tighter md:text-[min(38px,4vw)] lg:text-[32px] xl:text-[38px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1.2em] w-auto"
                  width="280"
                  height="100"
                  viewBox="0 0 180 70"
                  fill="none"
                >
                  <path d="M53.9473 0.56781H70.6979V28.959C61.4469 28.959 53.9473 21.4594 53.9473 12.2082V0.56781Z" fill="#FFF7EA" />
                  <path d="M93.9703 0.56781H77.2196V46.8455C86.4706 46.8455 93.9703 39.3459 93.9703 30.0947V0.56781Z" fill="#FFF7EA" />
                  <path d="M63.8712 47.1308C68.2616 47.1308 71.8206 43.5716 71.8206 39.1812C71.8206 34.7908 68.2616 31.2317 63.8712 31.2317C59.4809 31.2317 55.9219 34.7908 55.9219 39.1812C55.9219 43.5716 59.4809 47.1308 63.8712 47.1308Z" fill="#45B289" />
                  <path d="M35.2048 0.424194C38.0702 0.424194 41.9368 1.35534 45.0895 3.93472C48.2477 6.51889 50.6777 10.7486 50.6777 17.3175C50.6777 23.8947 47.7799 28.3691 44.3985 31.196C41.0243 34.0168 37.1605 35.2035 35.2048 35.2036C33.2887 35.2036 27.7526 35.232 22.6955 35.2605C20.1672 35.2748 17.7583 35.289 15.9819 35.2997C15.0939 35.3051 14.3636 35.3099 13.8555 35.313C13.6015 35.3146 13.4024 35.3159 13.2674 35.3168C13.2002 35.3172 13.1485 35.3172 13.1138 35.3174H13.11L0.231406 45.6772L0 45.8631V7.23856C6.47483e-05 6.75159 0.158177 6.08397 0.454589 5.36313C0.752101 4.6397 1.19342 3.85171 1.76979 3.12219C2.92145 1.66464 4.62682 0.424259 6.81423 0.424194H35.2048ZM10.5049 11.0716V24.983H33.076C36.9172 24.9828 40.031 21.869 40.0311 18.0276C40.0311 14.1861 36.9173 11.0717 33.076 11.0716H10.5049Z" fill="#FFF7EA" />
                  <path d="M155.443 0C169.005 0 180 8.80143 180 22.997C180 38.6121 169.005 45.9941 155.443 45.9941C139.402 45.9939 130.885 35.6977 130.885 22.997C130.885 8.80149 141.879 6.47483e-05 155.443 0ZM155.301 11.6401C149.656 11.6401 145.08 16.9154 145.08 23.4226C145.08 29.9298 149.656 35.205 155.301 35.205C160.945 35.2049 165.521 29.9297 165.521 23.4226C165.521 16.9155 160.945 11.6403 155.301 11.6401Z" fill="#FFF7EA" />
                  <path d="M113.561 45.9941H98.7979V0.56781H113.561V45.9941ZM128.04 13.3436C119.464 13.3493 115.999 14.9546 113.561 22.2869V8.51715C118.491 2.81037 121.637 0.984206 128.04 0.56781V13.3436Z" fill="#FFF7EA" />
                  <path d="M104.101 69.0886L107.114 60.189H108.926L111.932 69.0886H110.243L108.175 62.641C108.127 62.4862 108.086 62.3483 108.053 62.2259C108.021 62.1003 107.99 61.978 107.962 61.8601H107.931C107.903 61.978 107.872 62.1003 107.84 62.2259C107.807 62.3483 107.767 62.4862 107.718 62.641L105.687 69.0886H104.101ZM105.662 67.0452L105.98 65.8616H109.974L110.304 67.0452H105.662Z" fill="#FFF7EA" />
                  <path d="M99.5703 69.07V60.1891H101.236V69.07H99.5703Z" fill="#FFF7EA" />
                  <path d="M89.0674 68.9904V60.1892H92.0865C93.3148 60.1892 94.3015 60.5557 95.0468 61.2893C95.7926 62.019 96.1649 63.0323 96.1649 64.3299V64.8375C96.1649 66.135 95.7946 67.1529 95.0532 67.8904C94.3125 68.624 93.3232 68.9904 92.0865 68.9904H89.0674ZM90.824 67.7816H91.9881C92.7249 67.7816 93.3038 67.542 93.7246 67.0622C94.1455 66.5786 94.3559 65.8793 94.3559 64.9644V64.2211C94.3559 63.2984 94.141 62.603 93.7117 62.1355C93.2818 61.6642 92.7075 61.4265 91.9881 61.4227H90.824V67.7816Z" fill="#FFF7EA" />
                  <path d="M79.7041 68.9904V60.1892H86.1484V61.4952H81.5889V63.8766H85.5015V65.0913H81.5889V67.7149H86.2338V68.9904H79.7041Z" fill="#FFF7EA" />
                  <path d="M68.0586 68.9902V60.189H69.988L71.8165 66.0526C71.8554 66.1892 71.8903 66.3226 71.922 66.4514C71.9576 66.5803 71.9874 66.7175 72.012 66.8626H72.0386C72.0632 66.7175 72.0917 66.5803 72.1234 66.4514C72.1584 66.3187 72.1953 66.1853 72.2341 66.0526L74.0632 60.189H76.0082V68.9902H74.5967V63.1875C74.5967 63.0541 74.5967 62.9052 74.5967 62.74C74.6006 62.5749 74.6071 62.4254 74.6181 62.2926H74.5864C74.565 62.4293 74.5352 62.5788 74.4964 62.74C74.4575 62.9013 74.4187 63.0502 74.3798 63.1875L72.6045 68.9902H71.3464L69.5653 63.1875C69.5264 63.0541 69.4856 62.8967 69.4435 62.7154C69.4047 62.5341 69.3781 62.393 69.3639 62.2926H69.3322C69.3393 62.3891 69.3451 62.5303 69.3484 62.7154C69.3555 62.8967 69.3587 63.0541 69.3587 63.1875V68.9902H68.0586Z" fill="#FFF7EA" />
                </svg>
              </span>
              <span>is a Cinematic Masterpiece<br className="hidden sm:block" /></span>
              <span> Blazing a Global Trail of Data Driven<br className="hidden sm:block" /></span>
              <span> ROI and Blockbuster Brand Stories.</span>
            </h2>

            <p
              id="about-sub-paragraph"
              className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-3 max-w-full sm:max-w-[85%] font-['Inter',sans-serif] text-[clamp(11px,3vw,13px)] font-normal leading-[1.6] text-[#FFF7EA] sm:text-[1.1vw] md:text-[14px]"
            >
              Lights, Camera, Impact! Pyromedia is the ultimate marketing powerhouse, blazing trails
              across 12 countries from India to the USA. With a decade of expertise, we don&apos;t just
              follow trends; we direct the digital climax. Our secret script? A data-driven blueprint
              that turns creative ideas into ROI masterpieces. Every campaign is a housefull
              performance designed to ignite your brand&apos;s legacy. No fillers, just pure, measurable
              box-office success on a global screen!
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-50 mix-blend-screen opacity-[0.38]"
          // style={{
          //   backgroundImage: `url(${GroupImage.src})`,
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          // }}
        />
             <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      </div>

<div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-[22%] w-full select-none overflow-hidden">
  <img 
    src="/road_ray.svg" 
    alt="" 
    aria-hidden="true" 
    className="h-full w-full object-cover object-bottom" 
  />
</div>
    </div>
  );
};

export default About;
