import { StrictMode, useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { X } from 'lucide-react';
import Navbar from './Navbar';
import Hero from './Hero';
import Logo from './Logo';
import './styles.css';
const details: Record<string,string> = {
  Features: 'Capture ideas, organize active sprints, and keep project deadlines in view.',
  Solutions: 'Bring your design projects and product refreshes into one organized workflow.',
  Resources: 'Start with an idea. Break it into tasks, organize a sprint, and keep your team in sync.',
  Pricing: 'Explore Prioritize with a free trial. Plan details will be available when the product launches.',
  'Sign in': 'Prioritize is a product preview. Account sign-in will be available when the product launches.',
  'Try for free': 'Make room for your next idea. Prioritize is a product preview; trial registration will be available at launch.'
};
function App() {
  const [active, setActive] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if(active) dialog.current?.showModal(); }, [active]);
  const close = () => { dialog.current?.close(); setActive(null); };
  return <MotionConfig reducedMotion="user"><Navbar onAction={setActive}/><Hero onStart={() => setActive('Try for free')}/><dialog ref={dialog} onCancel={() => setActive(null)} onClick={e => {if(e.target===dialog.current) close();}} aria-labelledby="dialog-title" className="preview-dialog"><button className="dialog-close" aria-label="Close dialog" onClick={close}><X size={20}/></button><Logo/><h2 id="dialog-title">{active}</h2><p>{active && details[active]}</p><button className="primary-button mt-6" onClick={close}>Back to your ideas</button></dialog></MotionConfig>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
