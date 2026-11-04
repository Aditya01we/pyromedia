'use client';

import React from 'react';
import Image from 'next/image';

interface CtaButtonProps {
  text: string;
  href?: string;
}

/**
 * Ribbon CTA button from Figma (node 630:6131) — 297x56 dark-green banner
 * with a hand-drawn dashed inner border and a star on each side.
 */
const CtaButton: React.FC<CtaButtonProps> = ({ text, href = '#' }) => {
  return (
    <a
      href={href}
      className="relative block w-[297px] h-[56px] max-w-full select-none transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
    >
      {/* Ribbon background */}
      <Image
        src="/services/cta_ribbon.svg"
        alt=""
        fill
        sizes="297px"
        className="absolute inset-0"
        draggable={false}
      />
      {/* Hand-drawn dashed inner border */}
      <div className="absolute left-[4%] top-[10.4%] h-[79.2%] w-[92%]">
        <Image
          src="/services/cta_dash.svg"
          alt=""
          fill
          sizes="273px"
          className="object-contain"
          draggable={false}
        />
      </div>
      {/* Stars */}
      <div className="absolute left-[13.5%] top-[39.3%] h-[12.4px] w-[14.7px]">
        <Image
          src="/services/cta_star_l.svg"
          alt=""
          fill
          sizes="15px"
          className="object-contain"
          draggable={false}
        />
      </div>
      <div className="absolute right-[13.5%] top-[39.3%] h-[12.4px] w-[14.7px]">
        <Image
          src="/services/cta_star_r.svg"
          alt=""
          fill
          sizes="15px"
          className="object-contain"
          draggable={false}
        />
      </div>
      {/* Label */}
      <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-inter)] text-[16px] capitalize text-[#FFF7EA] leading-[1.2]">
        {text}
      </span>
    </a>
  );
};

export default CtaButton;
