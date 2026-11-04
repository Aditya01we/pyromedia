'use client';

import React from 'react';
import Image from 'next/image';

export interface CaseStudy {
  id: number;
  title: string;
  /** Optional video source; the design shows a dark placeholder panel */
  videoUrl?: string;
}

const PlayButton = () => (
  <button
    type="button"
    aria-label="Play video"
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38px] h-[40px] transition-transform duration-300 hover:scale-110 cursor-pointer"
  >
    <Image src="/services/play.svg" alt="" width={38} height={40} draggable={false} />
  </button>
);

const VideoPanel = ({ study, className }: { study: CaseStudy; className: string }) => (
  <div className={`${className} rounded-[12px] bg-[#083E11] overflow-hidden`}>
    {study.videoUrl ? (
      <video
        src={study.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        controls
        preload="metadata"
      />
    ) : (
      <PlayButton />
    )}
  </div>
);

const Caption = ({ text }: { text: string }) => (
  <p className="font-[family-name:var(--font-tapestry)] font-normal capitalize text-center text-[#143D15] leading-[1.2] text-[clamp(22px,1.95vw,28px)] whitespace-nowrap">
    {text}
  </p>
);

export { VideoPanel, Caption, PlayButton };
