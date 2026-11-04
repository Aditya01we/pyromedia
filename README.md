# Landing Page - Next.js + Hero Section

A modern landing page built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS** featuring an advanced animated Hero section.

## 🎯 Features
✅ **Modern Stack**
- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS for styling
- GSAP for advanced animations

✅ **Hero Section**
- Canvas-based particle animation background
- SVG film border with animated perforations
- Sunburst gradient rays animation
- Character-by-character text animation with GSAP
- Responsive design with Tailwind viewport units
- Custom badge shapes with SVG masks
- Texture overlay effects

✅ **Advanced React Concepts Used**
- Client-side rendering with `'use client'`
- useEffect hooks for canvas and animation management
- useRef for element references
- Dynamic module imports (GSAP lazy loading)
- Responsive design with Tailwind CSS

## 📦 Installation

```bash
# Navigate to project directory
cd landing-page

# Install dependencies
npm install
```

## 🚀 Getting Started

```bash
# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

```
landing-page/
├── app/
│   ├── components/
│   │   └── Hero.tsx          # Main hero section component
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── public/
│   └── Group.png             # Texture overlay image
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🎨 Customization

### Hero Component (`app/components/Hero.tsx`)

**Colors**: Edit color values in className attributes
- Background: `bg-[#051c0e]` → Dark green
- Text: `text-[#08471F]` → Forest green
- Accent: `bg-[#0d4220]` → Medium green

**Typography**:
- Small top text: `text-[52px]` (Chathura font)
- Main heading: `text-[72px]` (Abril Fatface font)
- Paragraph: `text-[13px]` (Inter font)

**Animation Timing**: Modify GSAP timeline in useEffect hook

**Dimensions**:
- Container aspect ratio: `aspect-[2/1]`
- Max width: `max-w-[1440px]`
- Margins: `mt-[28px] mx-[40px] mb-[52px]`

## 🎬 Animation Details

### Canvas Particles
- Responsive particle count based on screen size
- Upward floating motion with fade
- Edge distribution bias for realistic depth

### GSAP Animations
- Sequential timeline animations
- Character split animation on heading 2
- Staggered character reveal with back.out easing
- Letter spacing animation on top text

### SVG Border
- Animated film perforations
- Linear gradient mask
- 1.5s animation cycle

### Sunburst
- Rotating conic gradient
- 60s infinite animation
- Positioned behind content

## 🔧 Technologies

- **Next.js**: React framework with server optimization
- **React 19**: Latest React version
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **GSAP**: Professional animation library
- **Canvas API**: Particle animations

## 📝 Environment Setup

### Fonts Required (Tailwind)
The component uses these custom fonts:
- **Chathura** (serif): Load from Google Fonts or self-host
- **Abril Fatface** (serif): Load from Google Fonts or self-host
- **Inter** (sans-serif): Included in Tailwind by default

Add to `app/layout.tsx` if needed:
```tsx
import { Chathura, Abril_Fatface } from 'next/font/google';
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deploy to Vercel:
```bash
vercel deploy
```

## 📄 License

MIT License - Feel free to use this template for your projects!

---

Built with ❤️ using modern React and Next.js practices
"# pyromedia" 
