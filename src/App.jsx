import { useEffect, useState, useCallback } from 'react';
import { LangProvider, useLang } from './i18n.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Meaning from './components/Meaning.jsx';
import Tokenomics from './components/Tokenomics.jsx';
import HowToBuy from './components/HowToBuy.jsx';
import About from './components/About.jsx';
import Squad from './components/Squad.jsx';
import Community from './components/Community.jsx';
import Contributors from './components/Contributors.jsx';
import Footer from './components/Footer.jsx';
import BGMToggle from './components/BGMToggle.jsx';
import Gallery from './components/Gallery.jsx';

function useHashRoute() {
  const getRoute = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/gallery')) return 'gallery';
    return 'home';
  }, []);

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [getRoute]);

  return route;
}

function RevealObserver() {
  const { lang } = useLang();
  const route = useHashRoute();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang, route]);
  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <Meaning />
      <Tokenomics />
      <HowToBuy />
      <About />
      <Squad />
      <Community />
      <Contributors />
    </>
  );
}

function GalleryPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return <Gallery />;
}

export default function App() {
  const route = useHashRoute();

  return (
    <LangProvider>
      <RevealObserver />
      <div className="app">
        <Nav />
        {route === 'home' && <HomePage />}
        {route === 'gallery' && <GalleryPage />}
        <Footer />
        <BGMToggle />
      </div>
    </LangProvider>
  );
}
