// components/DynamicServiceCard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export interface ServiceItem {
  id: number;
  title: string;
  leftSvg: string;   // path or SVG markup for left image
  rightSvg: string;  // path or SVG markup for right image
}

interface DynamicServiceCardProps {
  service: ServiceItem;
}

const getFormattedTitle = (title: string, id: number) => {
  if (id === 1) return <>New-Age Influencer<br />Marketing</>;
  if (id === 2) return <>Creative Meme<br />Marketing</>;
  if (id === 3) return <>Social Media<br />Management</>;
  return title;
};

const cardLayouts: Record<number, {
  leftClass: string;
  rightClass: string;
}> = {
  1: {
    leftClass: "absolute left-[5.9%] bottom-[8%] w-[21.25%] h-[39.1%] max-w-[119px] max-h-[90px] z-20",
    rightClass: "absolute right-[-4%] md:right-[-6%] top-[12%] w-[35.7%] h-[72.1%] max-w-[200px] max-h-[166px] z-20 pointer-events-none mr-13 mt-4"
  },
  2: {
    leftClass: "absolute left-[5.9%] bottom-[8%] w-[20%] h-[40%] max-w-[110px] max-h-[100px] z-20",
    rightClass: "absolute right-[4%] top-[10%] w-[38.8%] h-[83.5%] max-w-[217px] max-h-[192px] z-20 pointer-events-none"
  },
  3: {
    leftClass: "absolute left-[5.9%] bottom-[8%] w-[20%] h-[40%] max-w-[110px] max-h-[100px] z-20",
    rightClass: "absolute right-[2%] top-[10%] w-[44.3%] h-[85.4%] max-w-[248px] max-h-[196px] z-20 pointer-events-none"
  },
  4: {
    leftClass: "absolute left-[5.9%] bottom-[8%] w-[20%] h-[40%] max-w-[110px] max-h-[100px] z-20",
    rightClass: "absolute right-[2%] top-[10%] w-[47.3%] h-[85.2%] max-w-[265px] max-h-[196px] z-20 pointer-events-none"
  },
  5: {
    leftClass: "absolute left-[5.9%] bottom-[8%] w-[20%] h-[40%] max-w-[110px] max-h-[100px] z-20",
    rightClass: "absolute right-[3%] top-[12%] w-[36.8%] h-[79.4%] max-w-[206px] max-h-[182px] z-20 pointer-events-none"
  }
};

const DynamicServiceCard: React.FC<DynamicServiceCardProps> = ({ service }) => {
  const [leftAnimation, setLeftAnimation] = useState(null);
  const [rightAnimation, setRightAnimation] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [hasHoveredCard, setHasHoveredCard] = useState(false);

  useEffect(() => {
    const loadAnimation = async (url: string, setter: any) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Failed to load animation from ${url}:`, error);
      }
    };

    if (service.leftSvg && service.leftSvg.endsWith('.json')) {
      loadAnimation(service.leftSvg, setLeftAnimation);
    }
    if (service.rightSvg && service.rightSvg.endsWith('.json')) {
      loadAnimation(service.rightSvg, setRightAnimation);
    }
  }, [service.leftSvg, service.rightSvg]);

  const layout = cardLayouts[service.id] || cardLayouts[1];

  const handlePointerEnter = () => {
    if (hasHoveredCard || isFlipping) return;

    setHasHoveredCard(true);
    setIsFlipping(true);
  };

  const handlePointerLeave = () => {
    setHasHoveredCard(false);
  };

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.animationName !== 'flipOnce') return;

    setIsFlipping(false);
  };

  const renderAsset = (path: string, animationData: any, className: string) => {
    if (!path) return null;
    if (path.endsWith('.json')) {
      if (animationData) {
        return (
          <div className={className}>
            <Lottie animationData={animationData} loop autoplay style={{ width: '100%', height: '100%' }} />
          </div>
        );
      }
      return null;
    } else {
      return (
        <div className={className}>
          <img src={path} alt="" className="w-full h-full object-contain" />
        </div>
      );
    }
  };

  return (
    <div style={{ perspective: '1200px' }} className="w-full max-w-[560px] min-w-[280px] my-[10px] [container-type:inline-size]">
    <div
      className={`service-card relative w-full shadow-lg rounded-[24px] overflow-visible${isFlipping ? ' flipping' : ''}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="relative w-full h-auto aspect-[560/230] overflow-visible">
        {/* WHITE BACKGROUND SVG */}
        <div className="absolute inset-0 w-full h-full z-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 560 230"
            fill="none"
            preserveAspectRatio="none"
            className="block"
          >
            <path
              d="M557.646 20.9045C546.096 20.9045 536.741 11.55 536.741 0H400.804C400.77 4.395 397.199 7.94864 392.796 7.94864C388.392 7.94864 384.821 4.395 384.787 0H22.35C22.35 11.55 12.9955 20.9045 1.44546 20.9045C0.954547 20.9045 0.477273 20.8636 0 20.8364V208.255C0.477273 208.227 0.954547 208.186 1.44546 208.186C12.9955 208.186 22.35 217.541 22.35 229.091H384.787C384.821 224.696 388.392 221.142 392.796 221.142C397.199 221.142 400.77 224.696 400.804 229.091H536.741C536.741 217.541 546.096 208.186 557.646 208.186C558.136 208.186 558.614 208.227 559.091 208.255V20.835C558.614 20.8636 558.136 20.9045 557.646 20.9045Z"
              fill="#FFF7EA"
            />
          </svg>
        </div>

        {/* GREEN INNER SVG */}
        <div
          className="absolute z-10 top-[12.5px] left-[12.5px] w-[calc(100%-25px)] h-[calc(100%-25px)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 535 205"
            fill="none"
            preserveAspectRatio="none"
            className="block"
          >
            <path
              d="M514.538 204.544H20.0018L19.65 203.714C19.1359 202.501 18.5414 201.334 17.8827 200.246C15.9927 196.935 13.5395 193.998 10.5736 191.486C7.69228 189.041 4.43182 187.12 0.882272 185.775L0 185.441V19.1032L0.880909 18.7691C9.26046 15.6027 16.1018 9.06136 19.6514 0.823631L20.0059 0H514.537L514.891 0.823631C518.441 9.06136 525.282 15.6027 533.662 18.7691L534.546 19.1032V185.442L533.663 185.776C525.284 188.943 518.442 195.484 514.893 203.722L514.538 204.544ZM21.7936 201.817H512.756C516.558 193.579 523.431 187 531.818 183.57V20.9741C523.431 17.5432 516.558 10.965 512.756 2.72727H21.7895C17.9877 10.965 11.1136 17.5432 2.72727 20.9741V183.571C6.22909 185.003 9.45818 186.963 12.3368 189.405C15.5455 192.123 18.2032 195.305 20.2336 198.865C20.7941 199.789 21.3191 200.783 21.7936 201.817Z"
              fill="#143D15"
            />
          </svg>
        </div>

        {/* CARD CONTENT */}
        <div className="absolute inset-0 z-20 overflow-visible">
          {/* Title */}
          <div className="absolute left-[max(5.8%,24px)] top-[max(10%,20px)] max-w-[65%] z-30">
            <h4 className="card-title select-none">
              {getFormattedTitle(service.title, service.id)}
            </h4>
          </div>

          {/* Left illustration */}
          {renderAsset(
            service.leftSvg,
            leftAnimation,
            layout.leftClass
          )}

          {/* Right illustration */}
          {renderAsset(
            service.rightSvg,
            rightAnimation,
            layout.rightClass
          )}
        </div>
      </div>

      <style jsx>{`
        .card-title {
          font-family: var(--font-yeseva-one), 'Yeseva One', var(--font-tapestry), 'Tapestry', serif;
          font-size: clamp(16px, 6.2vw, 36px);
          font-size: clamp(15px, 7.1cqw, 36px);
          font-weight: 400;
          line-height: 1.15;
          text-transform: capitalize;
          color: #08391a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .service-card {
          transform-style: preserve-3d;
          will-change: transform;
        }

        .service-card.flipping {
          animation: flipOnce 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1 forwards;
        }

        @keyframes flipOnce {
          0%   { transform: rotateY(0deg) translateY(0px); }
          50%  { transform: rotateY(180deg) translateY(-10px); }
          100% { transform: rotateY(0deg) translateY(0px); }
        }
      `}</style>
    </div>
    </div>
  );
};

export default DynamicServiceCard;
