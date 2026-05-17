import { useEffect } from 'react';
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

function RevealObserver() {
  const { lang } = useLang();
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
  }, [lang]);
  return null;
}

export default function App() {
  return (
    <LangProvider>
      <RevealObserver />
      <div className="app">
        <Nav />
        <Hero />
        <Meaning />
        <Tokenomics />
        <HowToBuy />
        <About />
        <Squad />
        <Community />
        <Contributors />
        <Footer />
        <BGMToggle />
      </div>
    </LangProvider>
  );
}
