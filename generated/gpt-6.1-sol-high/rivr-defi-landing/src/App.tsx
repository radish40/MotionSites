import { useRef, useState, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { X, ArrowUpRight, Waves } from 'lucide-react';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
const descriptions:Record<string,string>={
'Book Demo':'Explore how RIVR brings liquid staking, Smart Vaults, and cross-chain liquidity together. Start with the ecosystem below.',
'Launch App':'The RIVR application is not connected in this landing-page preview. Explore the protocol’s staking and vault features below.',
'Start Staking':'Stake RIVR to keep your assets productive and liquid. Wallet connections and live transactions are not enabled in this preview.',
'View Audits':'Smart contracts audited. Security at every layer. Audit reports have not been supplied for this preview.',
'Audits':'Audit reports have not been supplied for this preview.',
'Cross-Chain':'Move through one connected ecosystem with liquid assets and strategies designed for DeFi.',
'Governance':'RIVR governance gives its community a voice in the direction of the protocol. Live proposals are not connected in this preview.',
'Join Discord':'Join the RIVR community to connect with other yielders. An official Discord invitation has not been supplied for this preview.',
'Discord':'An official Discord invitation has not been supplied for this preview.'};
export default function App(){const [panel,setPanel]=useState('');const dialog=useRef<HTMLDialogElement>(null);useEffect(()=>{if(panel)dialog.current?.showModal();else dialog.current?.close()},[panel]);return <MotionConfig reducedMotion="user"><main className="min-h-screen bg-[#f0f0f0]"><Hero open={setPanel}/><Metrics/><Features open={setPanel}/><CTA open={setPanel}/><Footer open={setPanel}/></main><dialog ref={dialog} onCancel={()=>setPanel('')} onClick={e=>{if(e.target===e.currentTarget)setPanel('')}}><div className="dialog-content"><button className="dialog-close" onClick={()=>setPanel('')} aria-label="Close dialog"><X size={21}/></button><Waves size={30} strokeWidth={1}/><span className="eyebrow">RIVR / EXPLORE</span><h2>{panel}</h2><p>{descriptions[panel] || (['Developers','Documentation','Documentation / Library'].includes(panel)?'Discover Smart Vaults, liquid staking, and a connected DeFi ecosystem. Full technical documentation has not been supplied for this preview.':'This destination has not been supplied for the RIVR landing-page preview.')}</p><a className="button dark" href="#ecosystem" onClick={()=>setPanel('')}>Explore the ecosystem<ArrowUpRight size={17}/></a></div></dialog></MotionConfig>}
