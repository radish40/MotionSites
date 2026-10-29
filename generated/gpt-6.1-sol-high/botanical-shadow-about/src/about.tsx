// Original asset is disabled (HTTP 401). The local recovery retains this
// design's real shadow motion; see recovery/provenance.json for its limitations.
const ORIGINAL_BACKGROUND_URL = 'https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/f_auto/v1779835701/bg-2-video_sgbpqt.mp4';

/** Static composition; the recovered background video is the only moving layer. */
export default function About() {
  return (
    <section
      aria-label="About our work"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: "'Zimula Trial Med', sans-serif",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        data-original-src={ORIGINAL_BACKGROUND_URL}
        src={`${import.meta.env.BASE_URL}assets/botanical-shadow-recovered.webm`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'rgba(242, 238, 230, 0.38)', pointerEvents: 'none', zIndex: 1 }}
      />
      <div
        style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', pointerEvents: 'none', textAlign: 'center',
          padding: '0 24px', zIndex: 2,
        }}
      >
        <p style={{
          fontSize: 'clamp(32px, 5.5vw, 80px)', lineHeight: 1.18, color: '#2a2420',
          maxWidth: 780, letterSpacing: '-0.025em', fontWeight: 400, margin: 0,
        }}>
          What stands the<br />
          test of time is all<br />
          that guides the<br />
          work.
        </p>
      </div>
      <div style={{
        position: 'absolute', bottom: 'clamp(24px, 4vh, 48px)', left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '0 24px', zIndex: 2,
      }}>
        <div aria-hidden="true" style={{ width: 1, height: 56, background: 'rgba(42,36,32,0.25)' }} />
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <svg aria-hidden="true" width="24" height="28" viewBox="0 0 26 30" fill="none">
            <path
              d="M13 1C6.373 1 1 6.373 1 13c0 5.52 3.55 10.23 8.52 11.94l3.26 3.76a.75.75 0 001.14 0l3.26-3.76C22.45 23.23 25 18.52 25 13 25 6.373 19.627 1 13 1z"
              stroke="#2a2420"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
          <p style={{
            fontSize: 'clamp(11px, 1.4vw, 13px)', color: '#2a2420', letterSpacing: '0.04em',
            lineHeight: 1.6, maxWidth: 340, opacity: 0.75,
          }}>
            Civic bodies and private clients trust us to shape resilient communities and purposeful places.
          </p>
        </div>
      </div>
    </section>
  );
}
