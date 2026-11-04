import ServicesSection from '../services_components/ServicesSection';
import MilestonesSection from '../services_components/MilestonesSection';
import TimelineSection from '../services_components/TimelineSection';
import CaseStudiesSection from '../services_components/CaseStudiesSection';
import { services } from '../services_components/servicesData';
import Clients from '../components/Clients';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const service = services.find((s) => s.id === Number(id)) ?? services[0];
  return (
    <>
      <ServicesSection items={[service]} />
      <MilestonesSection />
      <TimelineSection />
      <CaseStudiesSection />
      <Clients />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
