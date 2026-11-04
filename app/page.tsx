import Hero         from './components/Hero';
import About        from './components/About';
import Services     from './components/Services';
import Collabs      from './components/Collabs';
import Creators     from './components/Creators';
import Clients      from './components/Clients';
import Testimonials from './components/Testimonials';
import Contact      from './components/Contact';
import Footer       from './components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Collabs />
      <Creators />
      <Clients />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
