import { notFound } from 'next/navigation';
export function generateStaticParams(){return ['booking','faq','account'].map(p=>({catchAll:[p]}))}
export default function CatchAll(){notFound()}
