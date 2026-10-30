import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <div className="logo-placeholder">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="4" fill="white" fillOpacity="0.8" />
              <circle cx="16" cy="8" r="4" fill="white" fillOpacity="0.8" />
              <circle cx="8" cy="16" r="4" fill="white" fillOpacity="0.8" />
              <circle cx="16" cy="16" r="4" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          <span className="brand-name"><a href="">VertexAI</a></span>
        </div>
      </div>

      <div className="nav-main glass pill">
        <div className="nav-links">
          <a href="#product" className="nav-link">Product</a>
          <a href="#platform" className="nav-link">Platform</a>
          <a href="#customers" className="nav-link">Customers</a>
          <a href="#company" className="nav-link">Company</a>
        </div>
        <button className="login-btn pill">Login</button>
      </div>
    </nav>
  )
}

export default Navbar
