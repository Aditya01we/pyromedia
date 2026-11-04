'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const PORTRAIT_SRC = '/figma-assets/23d79cd729a0940b87e0ed5232149113606ebe93.png';
const BACKGROUND_SRC = '/figma-assets/testimonials-background.svg';

const testimonials = [
  {
    id: 1,
    text: 'Working with PYROMEDIA has been an incredible experience. My experience working with the whole team has been really great. The entire team is supportive, reliable, honest and transparent. They communicate and evaluate everything very clearly.',
    name: 'Kunal',
    role: 'Brand Director',
  },
  {
    id: 2,
    text: "It's been amazing working with the team and Arshit. Quick feedback was always taken into consideration. Timely execution of campaigns and creative ideation made it a great experience working with such an efficient and passionate team.",
    name: 'Rachit',
    role: 'Marketing Lead',
  },
  {
    id: 3,
    text: 'Pyromedia is the first company I chose to run influencer campaigns, and I feel it is my good fortune. They not only deal with influencing but also work as a team that supports overall growth and stands with you.',
    name: 'Deepu Kumar',
    role: 'Creative Head',
  },
] as const;

type Testimonial = (typeof testimonials)[number];

// Repeat the testimonials so the curved track always has enough cards to fill
// wide viewports and loop seamlessly.
const REPEAT = 4;
const displayCards: Testimonial[] = Array.from({ length: REPEAT }, () => testimonials).flat();

// Curve strength — matches CircularGallery's `bend` (expressed in its ~15-unit
// world space, scaled to pixels below). Higher = deeper arc + stronger tilt.
const BEND = 1;
const SCROLL_EASE = 0.15;
// Continuous drift in px/frame (~48px/s at 60fps). Set to 0 to disable.
const AUTO_SCROLL_SPEED: number = 2.4;

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function debounce<T extends (...args: never[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const Testimonials = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Title reveal animation.
  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 34 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power4.out',
              scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
            },
          );
        }
      } catch (error) {
        console.error('GSAP failed:', error);
      }
    };

    init();
  }, []);

  // Curved, draggable carousel engine — a DOM port of CircularGallery's bend
  // math (arc drop + tangent rotation, per-card infinite wrap, lerp scroll).
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>('.testimonial-card'));
    if (!cards.length) return;

    const count = cards.length;
    const extra = new Array(count).fill(0);
    const scroll = { current: 0, target: 0, last: 0, position: 0 };

    let containerWidth = 0;
    let cardWidth = 0;
    let gap = 48;
    let itemWidth = 0;
    let widthTotal = 0;
    let H = 0;
    let R = 0;
    let raf = 0;

    const measure = () => {
      containerWidth = container.clientWidth;
      cardWidth = cards[0].offsetWidth;
      gap = window.innerWidth < 768 ? 24 : 48;
      itemWidth = cardWidth + gap;
      widthTotal = itemWidth * count;
      H = containerWidth / 2;
      const B = (Math.abs(BEND) / 15) * H;
      R = B === 0 ? 0 : (H * H + B * B) / (2 * B);
    };

    const center = () => {
      // Snap so a card sits dead-center initially and after every settle.
      const start = Math.round(widthTotal / 2 / itemWidth) * itemWidth;
      scroll.current = scroll.target = scroll.last = start;
    };

    measure();
    center();

    const apply = (direction: 'right' | 'left') => {
      const planeOffset = cardWidth / 2;
      const viewportOffset = containerWidth / 2;

      for (let i = 0; i < count; i++) {
        const x = i * itemWidth - scroll.current - extra[i];

        let translateY = 0;
        let rotate = 0;
        if (R > 0) {
          const effectiveX = Math.min(Math.abs(x), H);
          const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
          translateY = arc;
          rotate = Math.sign(x) * Math.asin(effectiveX / R) * (180 / Math.PI);
        }

        cards[i].style.transform =
          `translate(-50%, 0) translateX(${x}px) translateY(${translateY}px) rotate(${rotate}deg)`;

        const isBefore = x + planeOffset < -viewportOffset;
        const isAfter = x - planeOffset > viewportOffset;
        if (direction === 'right' && isBefore) extra[i] -= widthTotal;
        if (direction === 'left' && isAfter) extra[i] += widthTotal;
      }
    };

    const update = () => {
      if (AUTO_SCROLL_SPEED && !isDown) {
        scroll.target += AUTO_SCROLL_SPEED;
      }
      scroll.current = lerp(scroll.current, scroll.target, SCROLL_EASE);
      const direction = scroll.current > scroll.last ? 'right' : 'left';
      apply(direction);
      scroll.last = scroll.current;
      raf = requestAnimationFrame(update);
    };

    const snap = () => {
      // Auto-scroll drifts continuously, so snapping would fight it.
      if (AUTO_SCROLL_SPEED) return;
      scroll.target = Math.round(scroll.target / itemWidth) * itemWidth;
    };
    const snapDebounced = debounce(snap, 200);

    // Pointer drag (mouse + touch via Pointer Events).
    let isDown = false;
    let startX = 0;
    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      scroll.position = scroll.target;
      startX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      scroll.target = scroll.position - (e.clientX - startX);
    };
    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      snap();
    };

    // Horizontal wheel / trackpad / shift+wheel — never hijacks vertical page scroll.
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
      if (!delta) return;
      scroll.target += delta * 0.6;
      snapDebounced();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scroll.target += itemWidth;
        snapDebounced();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scroll.target -= itemWidth;
        snapDebounced();
      }
    };

    const onResize = () => {
      extra.fill(0);
      measure();
      center();
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden bg-[#075B25] px-4 py-10 sm:px-6 lg:px-0"
    >
      <Image
        src={BACKGROUND_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center">
        <h2
          ref={titleRef}
          className="text-center font-['Tapestry',serif] text-[clamp(34px,4.5vw,62px)] font-normal leading-[1.2] text-[#FFF7EA]"
          style={{
            textShadow:
              '0 4px 0 #08391A, 2px 0 0 #08391A, -2px 0 0 #08391A, 0 -2px 0 #08391A',
          }}
        >
          The Critics&apos; Choice: What Our Clients Say
        </h2>

        <div
          ref={containerRef}
          tabIndex={0}
          role="region"
          aria-label="Client testimonials carousel. Drag to scroll, or use Left and Right Arrow keys."
          className="relative mt-10 h-[535px] w-full cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing sm:h-[600px]"
        >
          <div ref={trackRef} className="absolute inset-0">
            {displayCards.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="testimonial-card absolute left-1/2 top-0 w-[min(86vw,408px)] will-change-transform"
      style={{ transformOrigin: 'center center' }}
    >
      <article className="relative h-[520px] w-full">
        <div className="absolute left-1/2 top-0 h-[480px] w-[400px] max-w-[calc(100%-8px)] -translate-x-1/2 bg-[#FFF7EA] shadow-[0_14px_4px_rgba(0,0,0,0.15)]" />

        <div className="absolute left-1/2 top-5 z-10 flex w-[360px] max-w-[calc(100%-48px)] -translate-x-1/2 justify-center">
          <p className="text-center font-[family-name:var(--font-inter)] text-[17px] font-normal leading-[1.6] text-[#282828] sm:text-[18px]">
            {testimonial.text}
          </p>
        </div>

        <div
          className="absolute bottom-[88px] left-1/2 z-20 h-[60px] w-[327px] max-w-[82%] -translate-x-1/2 bg-[#08391A] text-[#FFF7EA]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)' }}
        >
          <div className="ml-[136px] flex h-full flex-col justify-center gap-1 font-[family-name:var(--font-inter)] leading-[1.2]">
            <span className="whitespace-nowrap text-[18px] font-normal">{testimonial.name}</span>
            <span className="text-[14px] font-normal capitalize">{testimonial.role}</span>
          </div>
        </div>

        <div className="absolute bottom-[78px] left-[62px] z-30 h-[100px] w-[80px] rotate-[-12deg] border-2 border-[#FFF7EA] bg-[#FFF7EA] shadow-[4px_4px_4px_rgba(0,0,0,0.15)]">
          <Image src={PORTRAIT_SRC} alt="" fill sizes="80px" className="object-cover" />
        </div>
      </article>
    </div>
  );
}

export default Testimonials;
