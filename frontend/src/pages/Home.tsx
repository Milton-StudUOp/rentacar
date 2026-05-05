import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import TechSection from '../components/sections/TechSection';
import FleetSection from '../components/sections/FleetSection';
import DriversSection from '../components/sections/DriversSection';
import ManagementSection from '../components/sections/ManagementSection';

export default function Home() {
    return (
        <div>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <TechSection />
            <FleetSection />
            <DriversSection />
            <ManagementSection />
        </div>
    );
}
