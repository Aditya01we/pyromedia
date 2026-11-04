'use client';

import React from 'react';
import Image from 'next/image';

export interface MilestoneItem {
  id: number;
  value: string;
  label: string;
}

interface MilestoneCardProps {
  milestone: MilestoneItem;
  /** Right-column cards in the design are a horizontal mirror of the artwork */
  mirrored?: boolean;
}

/* Artwork part positions as % of the 580x168.83 card frame (Figma 630:6153) */
const parts = [
  { src: '/services/milestones/ms_slab.svg', left: 13.397, top: 17.574, width: 86.395, height: 81.879 },
  { src: '/services/milestones/ms_panel.svg', left: 17.069, top: 30.8, width: 78.918, height: 56.193 },
  { src: '/services/milestones/ms_dots.svg', left: 14.99, top: 22.661, width: 83.176, height: 72.05 },
  { src: '/services/milestones/ms_top.svg', left: 0, top: 0.113, width: 100, height: 18.345 },
  { src: '/services/milestones/ms_fin1.svg', left: 0.295, top: 0, width: 13.293, height: 100 },
  { src: '/services/milestones/ms_fin2.svg', left: 0.295, top: 0, width: 13.293, height: 34.755 },
  { src: '/services/milestones/ms_fin3.svg', left: 0.295, top: 3.826, width: 13.293, height: 48.873 },
  { src: '/services/milestones/ms_fin4.svg', left: 0.295, top: 8.731, width: 13.293, height: 60.241 },
  { src: '/services/milestones/ms_fin5.svg', left: 0.295, top: 14.724, width: 13.293, height: 69.076 },
];

/**
 * Marquee-style milestone card from Figma (node 630:6153) — 580x168.83 green
 * 3D cinema sign with dotted lights border and a cream stat panel.
 */
const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, mirrored = false }) => {
  return (
    <div className="milestone-card relative w-full aspect-[580/168.83]">
      {/* Sign artwork */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
      >
        {parts.map((part) => (
          <div
            key={part.src}
            className="absolute"
            style={{
              left: `${part.left}%`,
              top: `${part.top}%`,
              width: `${part.width}%`,
              height: `${part.height}%`,
            }}
          >
            <div className="relative h-full w-full">
              <Image src={part.src} alt="" fill sizes="580px" draggable={false} />
            </div>
          </div>
        ))}
      </div>

      {/* Stat text, centered on the cream panel (Figma 630:6408) */}
      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={
          mirrored
            ? { right: '17.069%', top: '30.8%', width: '78.918%', height: '56.193%' }
            : { left: '17.069%', top: '30.8%', width: '78.918%', height: '56.193%' }
        }
      >
        <span className="font-[family-name:var(--font-inter)] font-semibold uppercase text-[#08391A] leading-[1.2] text-[clamp(28px,3.75vw,54px)]">
          {milestone.value}
        </span>
        <span className="font-[family-name:var(--font-inter)] font-normal capitalize text-[#08391A] leading-[1.6] text-[clamp(11px,1.12vw,16px)]">
          {milestone.label}
        </span>
      </div>
    </div>
  );
};

export default MilestoneCard;
