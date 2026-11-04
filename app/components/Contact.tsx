'use client';

import { useEffect, useRef, useState } from 'react';
import { NeonCheckbox } from './ui/animated-check-box';

const API_ENDPOINT = '/api/contact';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  });

  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // Native HTML5 validation (required / type="email") has already passed by
    // the time onSubmit fires. The consent checkbox is visually custom, so we
    // guard it here instead of relying on the hidden input's validation bubble.
    if (!form.consent) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      // POST to internal API route, which forwards to Apps Script server-side.
      // The actual Apps Script URL is kept secret on the server.
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          message: form.message,
          consent: form.consent,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // The form posts via fetch, so hand the lead to the visitor tracker directly.
      window.phyoTrack?.identify({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
      });

      setStatus('success');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        consent: false,
      });
    } catch (error) {
      console.error('Contact form submit failed:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext('2d');
    if (context === null) return;
    const ctx: CanvasRenderingContext2D = context;

    let particles: Array<{ x: number; y: number; radius: number; alpha: number; vx: number; vy: number }> = [];
    let animationFrameId = 0;
    let resizeTimeout: number | undefined;

    function initParticles(width: number, height: number) {
      particles = [];
      const numSpeckles = Math.floor((width * height) / 4000);

      for (let i = 0; i < numSpeckles; i += 1) {
        let x: number;
        const edgeBias = Math.random();
        if (edgeBias < 0.4) {
          x = Math.random() * (width * 0.3);
        } else if (edgeBias < 0.8) {
          x = width - Math.random() * (width * 0.3);
        } else {
          x = width * 0.3 + Math.random() * (width * 0.4);
        }

        const y = Math.random() * height;
        let radius = Math.random() * 1.5;
        if (Math.random() > 0.95) radius = Math.random() * 3.5 + 1;

        const alpha = Math.random() * 0.8 + 0.2;
        const vx = (Math.random() - 0.5) * 0.4;
        const vy = -Math.random() * 0.5 - 0.2;

        particles.push({ x, y, radius, alpha, vx, vy });
      }
    }

    function resizeCanvas() {
      const nextCanvas = canvasRef.current;
      const nextSection = sectionRef.current;
      if (!nextCanvas || !nextSection) return;

      const rect = nextSection.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      nextCanvas.width = rect.width * dpr;
      nextCanvas.height = rect.height * dpr;
      nextCanvas.style.width = `${rect.width}px`;
      nextCanvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles(rect.width, rect.height);
    }

    function animate() {
      const nextSection = sectionRef.current;
      if (!nextSection) return;

      const { width, height } = nextSection.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.y + particle.radius < 0) particle.y = height + particle.radius;
        if (particle.x > width + particle.radius) particle.x = -particle.radius;
        else if (particle.x < -particle.radius) particle.x = width + particle.radius;

        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(animate);
    }

    function handleResize() {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 80);
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(section);
    window.addEventListener('resize', handleResize);
    resizeCanvas();
    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(resizeTimeout);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 42 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power4.out',
              scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
            },
          );
        }

        if (formRef.current) {
          gsap.fromTo(
            formRef.current.querySelectorAll('.contact-animate'),
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: { trigger: formRef.current, start: 'top 82%' },
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
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-[830px] w-full overflow-hidden bg-[#02190A] px-4 py-10 sm:px-6 lg:min-h-[630px] lg:px-0 xl:py-12"
    >
      <style jsx>{`
        :global(.contact-neon-checkbox) {
          --primary: #04240f;
          --primary-dark: #021509;
          --primary-light: #063817;
          --size: 24px;
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#02190A_0%,#063116_46%,#0A4D23_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,247,234,0.1),transparent_18%),radial-gradient(circle_at_18%_72%,rgba(12,90,41,0.38),transparent_24%),radial-gradient(circle_at_82%_32%,rgba(12,90,41,0.34),transparent_22%),radial-gradient(circle_at_78%_76%,rgba(255,247,234,0.06),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 mix-blend-screen bg-[radial-gradient(circle_at_65%_30%,rgba(60,255,140,0.22),transparent_0_16%,transparent_34%),radial-gradient(circle_at_72%_58%,rgba(60,255,140,0.18),transparent_0_14%,transparent_30%),radial-gradient(circle_at_28%_80%,rgba(255,247,234,0.08),transparent_0_10%,transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,25,10,0.12)_0%,rgba(2,25,10,0)_18%,rgba(2,25,10,0)_82%,rgba(2,25,10,0.14)_100%)]" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1] h-full w-full" />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center">
        <div ref={titleRef} className="mt-0 flex w-full max-w-[1100px] flex-col items-center gap-6 text-center">
          <h2
            className="font-['Tapestry',serif] text-[clamp(34px,4.5vw,62px)] font-normal leading-[1.2] text-[#FFF7EA]"
            style={{
              textShadow:
                '0 4px 0 #08391A, 2px 0 0 #08391A, -2px 0 0 #08391A, 0 -2px 0 #08391A',
            }}
          >
            Start Your Blockbuster Journey Now!
          </h2>
          <p className="max-w-[1000px] font-[family-name:var(--font-inter)] text-[16px] font-normal leading-[1.6] text-[#FFF7EA] sm:text-[18px]">
            Got a vision? We&apos;ve got the data-driven script. Connect with us today and let&apos;s make some
            real digital magic happen.
          </p>
        </div>

        <form
  ref={formRef}
  onSubmit={handleSubmit}
  className="mt-10 flex w-full max-w-[780px] flex-col gap-4 lg:mt-10" 
  // {/* Yahan gap-10 ko hata kar gap-4 kar diya gaya hai */}
>
  {/* First Name & Last Name */}
  <div className="contact-animate grid grid-cols-1 gap-4 md:grid-cols-2"> 
    {/* Yahan gap-5 ko hata kar gap-4 kar diya gaya hai */}
    <ContactInput
      name="firstName"
      autoComplete="given-name"
      value={form.firstName}
      onChange={handleChange}
      placeholder="First Name"
      required
    />
    <ContactInput
      name="lastName"
      autoComplete="family-name"
      value={form.lastName}
      onChange={handleChange}
      placeholder="Last Name"
      required
    />
  </div>

  {/* Email & Phone */}
  <div className="contact-animate grid grid-cols-1 gap-4 md:grid-cols-2">
    {/* Yahan bhi gap-5 ko hata kar gap-4 kar diya gaya hai */}
    <ContactInput
      name="email"
      type="email"
      autoComplete="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email Address"
      required
    />
    <ContactInput
      name="phone"
      type="tel"
      autoComplete="tel"
      value={form.phone}
      onChange={handleChange}
      placeholder="Phone Number"
    />
  </div>

  {/* Message Textarea */}
  <div className="contact-animate">
    <textarea
      name="message"
      value={form.message}
      onChange={handleChange}
      placeholder="Write Message Here..."
      rows={5}
      required
      className="h-[100px] sm:h-[110px] md:h-[120px] lg:h-[136px] xl:h-[145px] w-full resize-none rounded-[8px] border border-[#FFF7EA] bg-[rgba(255,247,234,0.04)] px-[14px] sm:px-[16px] md:px-[18px] lg:px-[19px] xl:px-[20px] py-[10px] sm:py-[11px] md:py-[12px] lg:py-[13px] xl:py-[14px] font-[family-name:var(--font-inter)] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-normal leading-[1.2] text-[#FFF7EA] outline-none backdrop-blur-[3px] placeholder:text-[#FFF7EA] focus:border-[#FFF7EA]"
    />
  </div>

  {/* Checkbox Section */}
  <div className="contact-animate mt-1 sm:mt-1.5 md:mt-2 xl:mt-2.5 2xl:mt-3 flex cursor-pointer items-start gap-2 sm:gap-2.5 md:gap-3 xl:gap-3.5 2xl:gap-4 font-[family-name:var(--font-inter)] text-[12px] sm:text-[13px] md:text-[14px] font-normal leading-[1.4] text-[#FFF7EA] md:items-center md:text-[16px]">
    {/* Maine items-center ko maintain rakha hai, but text size ko 18px se 14px/16px kiya hai taaki wo better fit ho */}
    <div className="mt-1 md:mt-0">
      <NeonCheckbox
        id="contact-consent"
        name="consent"
        checked={form.consent}
        onChange={handleConsentChange}
        className="contact-neon-checkbox"
      />
    </div>
    <span>It has survived not only five centuries, but also the leap into electronic typesetting.</span>
  </div>

  {/* Submit Button */}
  <div className="contact-animate mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3 flex flex-col gap-2 sm:gap-2.5 md:gap-3">
    <button
      type="submit"
      disabled={status === 'submitting'}
      className="h-12 w-full rounded-[8px] border border-[#FFF7EA] bg-[#FFF7EA] font-[family-name:var(--font-inter)] text-[18px] font-medium capitalize leading-[1.2] text-[#08471F] transition-transform duration-200 hover:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {status === 'submitting' ? 'Submitting...' : 'Submit Now'}
    </button>

    {status === 'success' && (
      <p className="text-center font-[family-name:var(--font-inter)] text-[16px] text-[#FFF7EA]">
        Thanks! Your message has been sent.
      </p>
    )}
    {status === 'error' && (
      <p className="text-center font-[family-name:var(--font-inter)] text-[16px] text-[#FFD7D7]">
        {!form.consent
          ? 'Please tick the consent box before submitting.'
          : 'Something went wrong. Please try again.'}
      </p>
    )}
  </div>
</form>
      </div>
    </section>
  );
};

function ContactInput({
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  autoComplete,
}: {
  name: string;
  autoComplete?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="h-12 w-full rounded-[8px] border border-[#FFF7EA] bg-[rgba(255,247,234,0.04)] px-[19px] font-[family-name:var(--font-inter)] text-[18px] font-normal leading-[1.2] text-[#FFF7EA] outline-none backdrop-blur-[3px] placeholder:text-[#FFF7EA] focus:border-[#FFF7EA]"
    />
  );
}

export default Contact;
