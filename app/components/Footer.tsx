'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GroupImage from '@/public/Footer.svg';

const LOGO_SRC = '/figma-assets/6a2aae09e97c9a8eb4bfb4880aeb381223c5d96e.svg';
const EMAIL_ICON_SRC = '/social_icons/email_icon.svg';
const PHONE_ICON_SRC = '/social_icons/phone.svg';
const LOCATION_ICON_SRC = '/social_icons/location.svg';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Collaborations', href: '#collabs' },
  { label: 'Creators', href: '#creators' },
  { label: 'Clients', href: '#clients' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Get In Touch', href: '#contact' },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/thepyromedia/', icon: '/social_icons/linkedin.svg' },
  { label: 'Instagram', href: 'https://www.instagram.com/thepyromedia/', icon: '/social_icons/instagram.svg' },
  { label: 'X', href: 'https://x.com/Pyro_tweet', icon: '/social_icons/twitter.svg' },
] as const;

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (footerRef.current) {
          gsap.fromTo(
            footerRef.current.querySelectorAll('.footer-reveal'),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.05,
              ease: 'power3.out',
              scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
            },
          );
        }
      } catch (error) {
        console.error('GSAP failed:', error);
      }
    };

    init();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-[#03250E] px-5 py-10 text-[#FFF7EA] sm:px-8 lg:py-[60px]"
    >
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'url(/images/footer-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-screen">
        <Image src={GroupImage} alt="" fill className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.38)]" />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-12 px-[70px] lg:gap-14">

        {/* Top Section: Logo, Nav, Socials */}
        <div className="footer-reveal flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            
            {/* Logo */}
            <div className="relative h-[50px] w-[140px] shrink-0 lg:h-[60px] lg:w-[160px]">
              <Image src={LOGO_SRC} alt="Pyro Media" fill unoptimized className="object-contain object-left" />
            </div>

            {/* Vertical Divider (Fixed from h-25 to h-[80px]) */}
            <div className="hidden h-[80px] w-px bg-[rgba(255,247,234,0.25)] lg:block" />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 sm:gap-3 md:gap-4 font-[family-name:var(--font-inter)] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.2] text-[#FFF7EA] lg:gap-5 lg:text-[17px]">
              <div className="flex flex-wrap gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-2 sm:gap-y-3 md:gap-y-4 lg:gap-x-10">
                {navLinks.slice(0, 4).map((link) => (
                  <Link key={link.label} href={link.href} className="transition-opacity hover:opacity-80">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4 lg:gap-x-10">
                {navLinks.slice(4).map((link) => (
                  <Link key={link.label} href={link.href} className="transition-opacity hover:opacity-80">
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Social Icons & Copyright */}
          <div className="flex flex-col gap-5 lg:items-start">
            <div className="flex items-center gap-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="relative block h-11 w-11 transition-transform hover:scale-[1.04]"
                >
                  <Image src={item.icon} alt="" fill unoptimized className="object-contain" />
                </Link>
              ))}
            </div>
            <p className="font-[family-name:var(--font-inter)] text-[14px] font-normal leading-[1.6] text-[rgba(255,247,234,0.9)] lg:text-[15px]">
              All rights reserved 2026 PYROMEDIA CONSULTANCY LLP.
            </p>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="footer-reveal h-px w-full bg-[rgba(255,247,234,0.25)]" />

        {/* Bottom Section: Contact & Addresses */}
        <div className="footer-reveal flex flex-col justify-between gap-10 font-[family-name:var(--font-inter)] text-[15px] font-normal leading-[1.6] text-[#FFF7EA] lg:flex-row lg:text-[16px]">
          
          {/* Email & Phone */}
          <div className="grid max-w-[380px] gap-4">
            <Link href="mailto:Ashish@thepyromedia.com" className="flex items-start gap-3">
              <Image src={EMAIL_ICON_SRC} alt="" unoptimized width={21} height={15} className="mt-[6px] h-[15px] w-[21px] shrink-0" />
              <span>Ashish@thepyromedia.com</span>
            </Link>
            <Link href="tel:+919315732227" className="flex items-start gap-3">
              <Image src={PHONE_ICON_SRC} alt="" unoptimized width={16} height={18} className="mt-[5px] h-[18px] w-[16px] shrink-0 object-contain" />
              <span>+91 9315732227, +91 7888509409</span>
            </Link>
          </div>

          {/* Address 1: Noida */}
          <div className="flex max-w-[380px] items-start gap-3">
            <Image src={LOCATION_ICON_SRC} alt="" unoptimized width={15} height={18} className="mt-[5px] h-[18px] w-[15px] shrink-0" />
            <p>Noida: E-12/2, 3rd Floor, Block E, Sector-1, Near GAIL, Noida, Uttar Pradesh - 201301</p>
          </div>

          {/* Address 2: Chandigarh */}
          <div className="flex max-w-[380px] items-start gap-3">
            <Image src={LOCATION_ICON_SRC} alt="" unoptimized width={15} height={18} className="mt-[5px] h-[18px] w-[15px] shrink-0" />
            <p>Chandigarh: TDI Taj Plaza, Sector 118, Mohali, Sahibzada Ajit Singh Nagar, Punjab 160055</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;