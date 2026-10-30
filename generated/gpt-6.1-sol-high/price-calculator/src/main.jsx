import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as Toast from '@radix-ui/react-toast'
import { Slider } from './components/ui/slider'
import { useToast } from './hooks/use-toast'
import { calculatePrice, calculateAgencyCost, calculateFreelancerCost, formatPrice } from './pricing'
import './styles.css'

function RadioOption({ name, value, selected, onChange, children, price }) {
  return <label className="option">
    <input type="radio" name={name} value={value} checked={selected === value} onChange={() => onChange(value)} />
    <span className="radio-mark" aria-hidden="true" />
    <span className="option-label">{children}</span>
    {price && <span className="option-price">{price}</span>}
  </label>
}

function CheckboxOption({ checked, onChange, children }) {
  return <label className="option addon">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span className="checkbox-mark" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    <span className="option-label">{children}</span>
    <span className="option-price">+$50/pages</span>
  </label>
}

function App() {
  const [serviceType, setServiceType] = useState('both')
  const [pages, setPages] = useState(5)
  const [needContent, setNeedContent] = useState(false)
  const [needSEO, setNeedSEO] = useState(false)
  const [timeline, setTimeline] = useState('regular')
  const { toasts, dismiss } = useToast()
  const state = { serviceType, pages, needContent, needSEO, timeline }
  return <Toast.Provider>
    <main>
      <section id="calculator-section">
        <div className="section-inner">
          <header className="section-header">
            <p className="eyebrow">Try project estimation calculator</p>
            <h2 className="section-title">Get premium website<br className="desktop-break" /> within your budget</h2>
          </header>
          <div className="calculator-grid">
            <form className="calculator-form" onSubmit={(event) => event.preventDefault()} aria-label="Project estimation calculator">
              <fieldset className="form-section">
                <legend>What kind of service do you need?</legend>
                <div className="options">
                  <RadioOption name="service" value="design" selected={serviceType} onChange={setServiceType}>Only Design</RadioOption>
                  <RadioOption name="service" value="development" selected={serviceType} onChange={setServiceType}>Only Development</RadioOption>
                  <RadioOption name="service" value="both" selected={serviceType} onChange={setServiceType}>Design + Development</RadioOption>
                </div>
              </fieldset>
              <fieldset className="form-section pages-section">
                <legend>Number of Pages <span className="page-value">{pages}</span></legend>
                <Slider min={1} max={30} step={1} value={[pages]} onValueChange={([value]) => setPages(value)} />
                <div className="slider-labels"><span>1</span><span>30</span></div>
              </fieldset>
              <fieldset className="form-section">
                <legend>Add-ons</legend>
                <div className="options">
                  <CheckboxOption checked={needContent} onChange={setNeedContent}>I will need help with content</CheckboxOption>
                  <CheckboxOption checked={needSEO} onChange={setNeedSEO}>I want to optimize my website for SEO</CheckboxOption>
                </div>
              </fieldset>
              <fieldset className="form-section timeline-section">
                <legend>How fast do you need this?</legend>
                <div className="options">
                  <RadioOption name="timeline" value="rush" selected={timeline} onChange={setTimeline} price="+$100/pages">Within 7 Days</RadioOption>
                  <RadioOption name="timeline" value="fast" selected={timeline} onChange={setTimeline} price="+$25/pages">Within 14 Days</RadioOption>
                  <RadioOption name="timeline" value="regular" selected={timeline} onChange={setTimeline}>Regular Speed <span className="detail">(Based on discussion)</span></RadioOption>
                </div>
              </fieldset>
            </form>
            <aside className="estimation" aria-labelledby="estimate-title">
              <h3 id="estimate-title">Estimated Cost</h3>
              <p className="estimate-description">An estimate of your investment, with no surprises.<br className="wide-break" /> See how much you can save with us.</p>
              <div className="price-cards" aria-live="polite" aria-atomic="true">
                <div className="price-card">
                  <h3>Typical Agency charges minimum</h3>
                  <p className="price" data-testid="agency-price">{formatPrice(calculateAgencyCost(state))}</p>
                  <p className="price-note">+ Too much extra time &amp; additional cost</p>
                </div>
                <div className="price-card">
                  <h3>Regular Freelancer charges minimum</h3>
                  <p className="price" data-testid="freelancer-price">{formatPrice(calculateFreelancerCost(state))}</p>
                  <p className="price-note">+ Too much headache &amp; back-and-forth</p>
                </div>
                <div className="price-card studio-card">
                  <h3>With Webfluin Studio</h3>
                  <p className="price studio-price" data-testid="studio-price">{formatPrice(calculatePrice(state))}</p>
                  <p className="price-note">Save your money, time &amp; headache</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
    {toasts.map((item) => <Toast.Root key={item.id} open onOpenChange={(open) => !open && dismiss()} className="toast"><Toast.Title>{item.title}</Toast.Title><Toast.Description>{item.description}</Toast.Description></Toast.Root>)}
    <Toast.Viewport className="toast-viewport" />
  </Toast.Provider>
}

createRoot(document.getElementById('root')).render(<App />)
