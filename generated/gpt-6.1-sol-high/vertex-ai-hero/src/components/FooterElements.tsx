import './FooterElements.css'

const FooterElements = () => {
  return (
    <div className="footer-elements">
      <div className="footer-left">
        <p className="description">
          It helps you imagine, plan, and refine spaces<br />
          through natural conversations.<br />
          From choosing colors and layouts to suggesting<br />
          furniture and décor, it adapts to your taste.
        </p>
      </div>
      <div className="footer-right">
        <button className="tag-btn glass pill">Solutions for complex spaces</button>
        <div className="action-row">
          <button className="icon-btn glass pill">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="tag-btn glass pill">Conversational & Action</button>
        </div>
      </div>
    </div>
  )
}

export default FooterElements
