import ServiceCard from './ServiceCard';

const ICON_COLOR = 'rgb(200, 111, 255)';
const RING = 'M0.970459 8C0.970459 11.866 4.10447 15 7.97046 15C11.8365 15 14.9705 11.866 14.9705 8C14.9705 4.13401 11.8365 1 7.97046 1C4.10447 1 0.970459 4.13401 0.970459 8ZM13.5705 8C13.5705 11.0928 11.0633 13.6 7.97046 13.6C4.87766 13.6 2.37046 11.0928 2.37046 8C2.37046 4.90721 4.87766 2.4 7.97046 2.4C11.0633 2.4 13.5705 4.90721 13.5705 8Z';
function DesignIcon() {
  return <svg viewBox="0 0 16 16" fill="none" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8ZM13.6 8C13.6 11.0928 11.0928 13.6 8 13.6C4.90721 13.6 2.4 11.0928 2.4 8C2.4 4.90721 4.90721 2.4 8 2.4C11.0928 2.4 13.6 4.90721 13.6 8Z" fill={ICON_COLOR} /></svg>;
}
function OnboardingIcon() {
  return <svg viewBox="0 0 16 16" fill="none" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d={RING} fill={ICON_COLOR} /><circle cx="2" cy="2" r="2" transform="matrix(-1 0 0 1 10 6)" fill={ICON_COLOR} /></svg>;
}
function DeliveryIcon() {
  return <svg viewBox="0 0 16 16" fill="none" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d={RING} fill={ICON_COLOR} /><circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 11 5)" fill={ICON_COLOR} /></svg>;
}
function DeploymentIcon() {
  return <svg viewBox="0 0 16 16" fill="none" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d={RING} fill={ICON_COLOR} /><circle cx="4" cy="4" r="4" transform="matrix(-1 0 0 1 12 4)" fill={ICON_COLOR} /></svg>;
}
const CARDS = [
  { label: 'Planning', icon: <DesignIcon />, title: <>Turn new programs<br />into structured plans without the noise.</>, bullets: ['Embedded program leads', 'Decision-ready roadmaps'] },
  { label: 'Procurement', icon: <OnboardingIcon />, title: <>Source and qualify<br />vendors with far<br />less friction.</>, bullets: ['Cross-org scope alignment', 'End-to-end accountability'] },
  { label: 'Logistics', icon: <DeliveryIcon />, title: <>Move the right<br />materials on time<br />without surprises.</>, bullets: ['Spec and fit validations', 'Change order ownership'] },
  { label: 'Commissioning', icon: <DeploymentIcon />, title: <>Activate systems with complete context, not guesswork.</>, bullets: ['Uninterrupted workflows', 'Verified clean handoffs'] },
];

export default function TrustedSection() {
  return (
    <section className="relative flex flex-col items-center w-full" aria-labelledby="trusted-heading"
      style={{ backgroundImage: `url("${import.meta.env.BASE_URL}assets/background.webp")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', padding: 'clamp(100px, 12vw, 180px) clamp(16px, 4vw, 40px) clamp(100px, 12vw, 160px)', gap: 110 }}>
      <div className="flex flex-col items-center text-center w-full px-2" style={{ maxWidth: 1200, gap: 20 }}>
        <h2 id="trusted-heading" className="text-white font-medium" style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.2, margin: 0 }}>
          Relied on by enterprise teams<br />
          <span style={{ backgroundImage: 'linear-gradient(90deg, rgb(43,167,255), rgb(202,69,255) 50%, rgb(254,136,27))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', display: 'inline' }}>from groundbreak to go-live.</span>
        </h2>
        <p style={{ color: 'rgb(189, 174, 231)', fontSize: 'clamp(14px, 1.25vw, 18px)', margin: 0 }}>Built for operational clarity through constant change. Proven across 530+ MW of critical infrastructure.</p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 12, position: 'relative', zIndex: 1 }}>
        {CARDS.map(card => <ServiceCard key={card.label} {...card} />)}
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(to bottom, transparent, rgb(255, 255, 255))', pointerEvents: 'none' }} />
    </section>
  );
}
