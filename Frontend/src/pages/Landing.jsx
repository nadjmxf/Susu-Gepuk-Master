import Header from '../components/Header';
import Hero from '../components/Hero';
import Promo from '../components/Promo';
import Menu from '../components/Menu';
import AboutUs from '../components/AboutUs';
import Location from '../components/Location';

export default function Landing() {
  return (
    <>
      <Header />
      <main className="pt-[80px] min-h-screen">
        <div className="bg-[#1e3a8a] py-8 pb-24 border-b-8 border-gray-900">
          <Hero />
          <Promo />
        </div>
        <Menu />
        <AboutUs />
        <Location />
      </main>
    </>
  );
}
