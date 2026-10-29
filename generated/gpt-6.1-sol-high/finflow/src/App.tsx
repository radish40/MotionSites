import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = ['Platform', 'Tutorials', 'Compare', 'Solutions'];
  const logos = [
    { name: 'Shopify', icon: 'shopify' },
    { name: 'Stripe', icon: 'stripe' },
    { name: 'Visa', icon: 'visa' },
    { name: 'Apple Pay', icon: 'applepay' },
    { name: 'Mastercard', icon: 'mastercard' },
    { name: 'PayPal', icon: 'paypal' },
  ];
  const darkButtonStyle = {
    background: 'linear-gradient(to bottom, #3a3a3a, #111111)',
    border: '1.5px solid transparent',
  };
  const outlineButtonStyle = { border: '1.5px solid #222222', color: '#222222' };

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: "'ITC Avant Garde Gothic W02 Bk', sans-serif" }}
    >
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        style={{ filter: 'saturate(0)' }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_132418_e0e79d08-5d1f-42d9-b8ae-8dd69217aacf.mp4"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 max-w-7xl mx-auto w-full" aria-label="Main navigation" style={{ position: 'relative', zIndex: 20 }}>
          <span className="text-lg sm:text-xl font-semibold tracking-tight select-none" style={{ color: '#111111' }}>Fenvex</span>
          <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full" style={{ background: '#e5e5e5' }}>
            {links.map((link) => (
              <a key={link} href="#" className="text-sm px-4 py-1.5 rounded-full text-[#1a1a1a] hover:bg-white/50 transition-colors duration-200">{link}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button type="button" className="text-sm px-5 py-2 rounded-full transition-colors duration-200 hover:bg-white/20" style={outlineButtonStyle}>Log in</button>
            <button type="button" className="text-sm text-white px-5 py-2 rounded-full transition-all duration-200 hover:opacity-90" style={darkButtonStyle}>Sign up</button>
          </div>
          <button type="button" className="md:hidden p-2 rounded-full transition-colors duration-200 hover:bg-white/20" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} color="#111111" /> : <Menu size={22} color="#111111" />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="relative z-20 mx-4 rounded-2xl px-4 py-4 flex flex-col gap-2 md:hidden" style={{ background: '#e5e5e5' }}>
            {links.map((link) => (
              <a key={link} href="#" className="text-sm px-4 py-2 rounded-xl text-[#1a1a1a] hover:bg-white/50 transition-colors duration-200">{link}</a>
            ))}
            <div className="flex gap-2 pt-2 border-t border-[#c0c0c0]">
              <button type="button" className="w-full text-sm px-5 py-2 rounded-full transition-colors duration-200 hover:bg-white/20" style={outlineButtonStyle}>Log in</button>
              <button type="button" className="w-full text-sm text-white px-5 py-2 rounded-full transition-all duration-200 hover:opacity-90" style={darkButtonStyle}>Sign up</button>
            </div>
          </div>
        )}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-32 sm:pb-40 -mt-40">
          <h1 className="font-bold leading-tight mb-4 sm:mb-5" style={{ fontSize: 'clamp(1.75rem, 6vw, 3.75rem)', maxWidth: '800px', lineHeight: 1.1, color: '#111111' }}>Discover a faster path to financial flow</h1>
          <p className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xs sm:max-w-md leading-relaxed" style={{ color: '#333333' }}>Tap the Fenvex platform to craft payment experiences that are fast, trusted, and effortless.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none">
            <button type="button" className="w-full sm:w-auto text-center text-white text-sm px-7 py-3 rounded-full transition-all duration-200 hover:opacity-90 shadow-lg" style={darkButtonStyle}>Start building</button>
            <button type="button" className="w-full sm:w-auto text-center text-sm px-7 py-3 rounded-full transition-colors duration-200 backdrop-blur-sm hover:bg-white/20" style={outlineButtonStyle}>Reach our team</button>
          </div>
        </main>
        <div className="w-full px-4 pb-6 sm:pb-10 flex justify-center">
          <div className="w-full max-w-4xl bg-white rounded-2xl px-4 sm:px-8 py-5 sm:py-6 grid grid-cols-3 sm:flex sm:items-center sm:justify-between gap-4 sm:gap-6" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)' }}>
            {logos.map(({ name, icon }) => (
              <div key={name} className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200" title={name}>
                <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${icon}.svg`} alt={name} className={['Visa', 'Apple Pay', 'Mastercard'].includes(name) ? 'h-7 sm:h-8 w-auto' : 'h-6 sm:h-7 w-auto'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
