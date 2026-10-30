export function VideoBackground({ zoom = 1 }: { zoom?: number }) {
  return <div className="fixed inset-0 overflow-hidden pointer-events-none bg-zinc-100" style={{ zIndex: 0 }} aria-hidden="true">
    <div className="absolute inset-0 will-change-transform" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
      <video className="absolute inset-0 w-full h-full object-cover" src={`${import.meta.env.BASE_URL}assets/background.mp4`} autoPlay loop muted playsInline />
    </div>
  </div>;
}
