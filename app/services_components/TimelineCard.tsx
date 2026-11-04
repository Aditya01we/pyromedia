'use client';

import React, { useId } from 'react';

export interface TimelineStep {
  id: number;
  number: string;
  title?: string;
  description: string;
}

interface TimelineCardProps {
  step: TimelineStep;
}

/* Stamp geometry from Figma (node 630:7259): 285x485 rect with punched holes */
const HOLE_R = 10;
const topXs = Array.from({ length: 11 }, (_, i) => 18 + 25 * i);
const sideYs = Array.from({ length: 19 }, (_, i) => 38 + 25 * i);

/**
 * Postage-stamp process card from Figma (node 630:7258) — cream stamp with
 * punched edges, a large ghost step number, title and description.
 */
const TimelineCard: React.FC<TimelineCardProps> = ({ step }) => {
  const maskId = useId();

  return (
    <div className="timeline-card relative w-[285px] h-[502px] shrink-0">
      {/* Stamp shape (rect minus edge holes), offset 17px down like the Figma group */}
      <svg
        viewBox="0 0 285 485"
        width="285"
        height="485"
        className="absolute left-0 top-[17px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id={maskId}>
            <rect width="285" height="485" rx="4" fill="white" />
            {topXs.map((x) => (
              <React.Fragment key={`tb${x}`}>
                <circle cx={x} cy={0} r={HOLE_R} fill="black" />
                <circle cx={x} cy={485} r={HOLE_R} fill="black" />
              </React.Fragment>
            ))}
            {sideYs.map((y) => (
              <React.Fragment key={`lr${y}`}>
                <circle cx={0} cy={y} r={HOLE_R} fill="black" />
                <circle cx={285} cy={y} r={HOLE_R} fill="black" />
              </React.Fragment>
            ))}
          </mask>
        </defs>
        <rect width="285" height="485" fill="#FFF7EA" mask={`url(#${maskId})`} />
      </svg>

      {/* Ghost step number (Figma 630:7321) */}
      <p className="absolute top-0 left-1/2 -translate-x-1/2 font-[family-name:var(--font-inter)] font-bold text-[108px] leading-[1.6] text-[rgba(7,53,24,0.08)] whitespace-nowrap select-none pointer-events-none">
        {step.number}
      </p>

      {/* Title + description (Figma 630:7322) */}
      <div className="absolute left-[18px] top-[148px] w-[249px] flex flex-col gap-4 text-center">
        {step.title && (
          <h3 className="font-[family-name:var(--font-tapestry)] font-normal capitalize text-[#143D15] leading-[1.2] text-[36px]">
            {step.title}
          </h3>
        )}
        <p className="font-[family-name:var(--font-inter)] font-normal text-[#08391A] leading-[1.6] text-[16px]">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default TimelineCard;
