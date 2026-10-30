const originalSource = 'https://stream.mux.com/OD2Ny6q9anbQ9h7Vie3KnqDxFpzHM9sjwfhF029lfd600.m3u8';

export default function SailingVideo() {
  return <video autoPlay loop muted playsInline data-original-source={originalSource} aria-label="Shamoni background film" className="absolute inset-0 w-full h-full object-cover z-0">
    <source src={import.meta.env.BASE_URL + 'assets/sailing.mp4'} type="video/mp4" />
    <source src={originalSource} type="application/vnd.apple.mpegurl" />
  </video>;
}
