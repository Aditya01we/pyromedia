import React from 'react';

const RIBBON_ITEMS = Array.from({ length: 12 });

export function RibbonStrip({ className }: { className: string }) {
  return (
    <div
      className={`${className} overflow-hidden border-y-2 border-[#005B4E] bg-[#fffcf4] text-[#005B4E] shadow-[0_14px_32px_rgba(0,0,0,0.28)]`}
    >
      <div className="ribbon-marquee h-full gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-11 2xl:gap-12 whitespace-nowrap px-3 sm:px-4 md:px-6 lg:px-8 xl:px-9 2xl:px-10">
        {RIBBON_ITEMS.map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4 font-['Inter',sans-serif] text-[16px] sm:text-[18px] md:text-[22px] lg:text-[25px] xl:text-[26px] 2xl:text-[27px] font-medium uppercase leading-none"
          >
            <StarIcon />
            <span>Pyro media</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[16px] sm:h-[18px] md:h-[22px] lg:h-[25px] w-[16px] sm:w-[18px] md:w-[22px] lg:w-[25px] shrink-0 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 1.5L14.9 8.45L22.4 9.05L16.7 13.95L18.45 21.25L12 17.35L5.55 21.25L7.3 13.95L1.6 9.05L9.1 8.45L12 1.5Z" />
    </svg>
  );
}
