'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import CtaButton from './CtaButton';
import { ServiceContent } from './servicesData';

interface ServiceCardProps {
  service: ServiceContent;
}

/**
 * Large service card from Figma (node 630:2885) — 1200x492 cream ticket-shaped
 * card with a thin green decorative border, text content + CTA on the left,
 * a hand-drawn dashed divider and a Lottie illustration on the right.
 */
const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!service.illustration.endsWith('.json')) return;
    let cancelled = false;
    fetch(service.illustration)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch((err) =>
        console.error(`Failed to load animation ${service.illustration}:`, err)
      );
    return () => {
      cancelled = true;
    };
  }, [service.illustration]);

  return (
    <div className="service-card relative w-full max-w-[1200px] mx-auto lg:aspect-[1200/492] transition-transform duration-300 ease-out hover:-translate-y-1">
      {/* Cream ticket-shaped background (card.svg, Figma 630:2886) */}
      <Image
        src="/services/card_stretch.svg"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        className="absolute inset-0 object-fill lg:hidden"
        draggable={false}
      />
      <Image
        src="/services/card.svg"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        className="absolute inset-0 hidden object-fill lg:block"
        draggable={false}
      />

      {/* Thin green decorative inner border (border.svg, Figma 630:5234) */}
      <div className="absolute left-[2.15%] right-[2.15%] top-[5.3%] bottom-[5.3%] pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 535 205"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-full"
        >
          <path
            d="M514.538 204.544H20.0018L19.65 203.714C19.1359 202.501 18.5414 201.334 17.8827 200.246C15.9927 196.935 13.5395 193.998 10.5736 191.486C7.69228 189.041 4.43182 187.12 0.882272 185.775L0 185.441V19.1032L0.880909 18.7691C9.26046 15.6027 16.1018 9.06136 19.6514 0.823631L20.0059 0H514.537L514.891 0.823631C518.441 9.06136 525.282 15.6027 533.662 18.7691L534.546 19.1032V185.442L533.663 185.776C525.284 188.943 518.442 195.484 514.893 203.722L514.538 204.544ZM21.7936 201.817H512.756C516.558 193.579 523.431 187 531.818 183.57V20.9741C523.431 17.5432 516.558 10.965 512.756 2.72727H21.7895C17.9877 10.965 11.1136 17.5432 2.72727 20.9741V183.571C6.22909 185.003 9.45818 186.963 12.3368 189.405C15.5455 192.123 18.2032 195.305 20.2336 198.865C20.7941 199.789 21.3191 200.783 21.7936 201.817Z"
            fill="#143D15"
          />
        </svg>
      </div>

      {/* Card content */}
      <div className="relative lg:absolute lg:inset-0 flex flex-col lg:flex-row px-8 py-12 sm:px-12 lg:p-0">
        {/* Text block (Figma 630:6127 — x:59/1200, y:73/492, w:639/1200) */}
        <div className="lg:absolute lg:left-[4.92%] lg:top-[14.8%] lg:w-[53.25%] flex flex-col gap-6 lg:gap-8">
          <div className="flex flex-col gap-3 lg:gap-4">
            <h3 className="font-[family-name:var(--font-tapestry)] font-normal capitalize text-[#143D15] leading-[1.2] text-[clamp(32px,4.45vw,64px)]">
              {service.title}
            </h3>
            <p className="font-[family-name:var(--font-inter)] font-normal text-[#08391A] leading-[1.6] text-[clamp(14px,1.25vw,18px)]">
              {service.description}
            </p>
          </div>
          <CtaButton text={service.ctaText} href={service.ctaHref} />
        </div>

        {/* Dashed vertical divider (Figma 630:5236 — x:841.6/1200) */}
        {/* <div className="hidden md:block absolute left-[70.13%] top-[4%] bottom-[4%] w-px border-l-2 border-dashed border-[#143D15]/50" /> */}

        {/* Lottie illustration (right side) */}
        <div className="relative mt-8 lg:mt-0 self-center lg:self-auto w-[70%] max-w-[320px] lg:max-w-none lg:absolute lg:left-[62%] lg:right-[2.5%] lg:top-1/2 lg:-translate-y-1/2 lg:w-auto lg:h-[78%] pointer-events-none">
          {service.illustration.endsWith('.json') ? (
            animationData && (
              <Lottie
                animationData={animationData}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            )
          ) : (
            <Image
              src={service.illustration}
              alt=""
              fill
              sizes="(max-width: 768px) 320px, 420px"
              className="object-contain"
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
