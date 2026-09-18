import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { GeneratorPage } from './pages/GeneratorPage';

function getRoute(): string {
  const path = window.location.pathname;
  if (path === '/generator') return 'generator';
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState<string>(getRoute());

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('popstate', handler);
    window.addEventListener('pushstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('pushstate', handler);
    };
  }, []);

  // Intercept internal link clicks for SPA navigation
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new Event('pushstate'));
      window.scrollTo(0, 0);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  if (route === 'generator') return <GeneratorPage />;
  return <LandingPage />;
}
