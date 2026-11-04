export interface ServiceContent {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  /** Path to a Lottie .json (or static image) shown on the right side of the card */
  illustration: string;
}

export const services: ServiceContent[] = [
  {
    id: 1,
    title: 'New-Age Influencer Marketing',
    description:
      'The Real Protagonists! At Pyromedia, we don’t just manage talent; we curate a gallery of visionaries. Our creators, "The Sparks," are the digital icons who turn every campaign into a blockbuster event.',
    ctaText: 'Book a Strategy Call',
    ctaHref: '#contact',
    illustration: '/services/SERVICE 1.json',
  },
  {
    id: 2,
    title: 'Creative Meme Marketing',
    description:
      'Comedy that converts! We speak fluent internet. From trending formats to original viral hits, we turn your brand into the punchline everyone wants to share — without ever making it the joke.',
    ctaText: 'Book a Strategy Call',
    ctaHref: '#contact',
    illustration: '/services/SERVICE 2.json',
  },
  {
    id: 3,
    title: 'Social Media Management',
    description:
      'Your feed, our screenplay! We script, shoot and schedule content that keeps audiences hooked episode after episode — building communities that show up for every release.',
    ctaText: 'Book a Strategy Call',
    ctaHref: '#contact',
    illustration: '/services/SERVICE 3.json',
  },
  {
    id: 4,
    title: 'Public Relation',
    description:
      'Every star needs a spotlight! We craft the narratives, place the headlines and manage the buzz so your brand stays the hero of every story the press wants to tell.',
    ctaText: 'Book a Strategy Call',
    ctaHref: '#contact',
    illustration: '/services/SERVICES 4.json',
  },
  {
    id: 5,
    title: 'TVC Production',
    description:
      'Lights, camera, blockbuster! From concept to final cut, we produce television commercials with cinematic drama and emotion that audiences remember long after the credits roll.',
    ctaText: 'Book a Strategy Call',
    ctaHref: '#contact',
    illustration: '/services/SERVICES 5.json',
  },
];
