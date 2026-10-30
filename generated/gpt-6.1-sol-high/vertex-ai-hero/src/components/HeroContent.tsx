import './HeroContent.css'

const HeroContent = () => {
  return (
    <div className="hero-content">
      <h1 className="hero-title">
        <span className="sans-bold">Meet VertexAI.</span>
        <br />
        <span className="serif-italic">Redefine space</span>
        <span className="sans-light"> with</span>
        <br />
        <span className="sans-light">intelligent design</span>
      </h1>
      <div className="cta-container">
        <button className="cta-btn pill">Start free decoration</button>
      </div>
    </div>
  )
}

export default HeroContent
