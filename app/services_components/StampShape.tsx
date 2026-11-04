'use client';

import React, { useId } from 'react';

interface StampShapeProps {
  width: number;
  height: number;
  fill?: string;
  className?: string;
}

/* Perforation geometry from Figma (nodes 630:7787 / 630:7920) */
const HOLE_R = 11.134;
const HOLE_SPACING = 27.835;
const EDGE_INSET = 20.04; // first top/bottom hole center from the left edge
const SIDE_START = 43.3; // first side hole center from the top edge

/**
 * Postage-stamp rectangle with punched edge holes, sized via viewBox so it
 * scales with its container.
 */
const StampShape: React.FC<StampShapeProps> = ({
  width,
  height,
  fill = '#FFF7EA',
  className,
}) => {
  const maskId = useId();

  const topCount = Math.round((width - 2 * EDGE_INSET) / HOLE_SPACING) + 1;
  const sideCount = Math.floor((height - SIDE_START) / HOLE_SPACING) + 1;
  const topXs = Array.from({ length: topCount }, (_, i) => EDGE_INSET + HOLE_SPACING * i);
  const sideYs = Array.from({ length: sideCount }, (_, i) => SIDE_START + HOLE_SPACING * i);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id={maskId}>
          <rect width={width} height={height} rx="4" fill="white" />
          {topXs.map((x) => (
            <React.Fragment key={`tb${x}`}>
              <circle cx={x} cy={0} r={HOLE_R} fill="black" />
              <circle cx={x} cy={height} r={HOLE_R} fill="black" />
            </React.Fragment>
          ))}
          {sideYs.map((y) => (
            <React.Fragment key={`lr${y}`}>
              <circle cx={0} cy={y} r={HOLE_R} fill="black" />
              <circle cx={width} cy={y} r={HOLE_R} fill="black" />
            </React.Fragment>
          ))}
        </mask>
      </defs>
      <rect width={width} height={height} fill={fill} mask={`url(#${maskId})`} />
    </svg>
  );
};

export default StampShape;
