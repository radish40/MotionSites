export default function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className={className} aria-hidden="true"><path d="M 64 256 L 0 256 L 0 192 L 64 192 Z M 160 256 L 96 256 L 96 160 L 0 160 L 0 96 L 160 96 Z M 256 256 L 192 256 L 192 64 L 0 64 L 0 0 L 256 0 Z" fill="#2563EB"/></svg>;
}
