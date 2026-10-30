export type CategoryKey = 'general' | 'ai' | 'integrations';
export const categories: { key: CategoryKey; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'ai', label: 'AI & Capabilities' },
  { key: 'integrations', label: 'Integrations & Security' },
];
export const faqs: Record<CategoryKey, { q: string; a: string }[]> = {
  general: [
    { q: 'What is UI Rocket?', a: 'UI Rocket is a learning platform for designers who want to master AI-powered design workflows and ship production-ready websites faster.' },
    { q: 'Who is this for?', a: 'Designers, founders, and creators who want to level up their AI design skills and build real, shippable products.' },
    { q: 'Do I need prior design experience?', a: 'No. The curriculum starts from fundamentals and progressively builds toward advanced AI-driven workflows.' },
    { q: 'How long does it take?', a: 'Most members make meaningful progress within a few weeks of consistent practice.' },
    { q: 'Is there a community?', a: 'Yes. You get access to a private community of designers and founders building with AI.' },
  ],
  ai: [
    { q: 'Which AI tools do you cover?', a: 'We focus on Lovable, Figma AI, image generation models, and the workflows that tie them together into a real design process.' },
    { q: 'Will AI replace designers?', a: "No. Designers who use AI fluently will replace those who don't. The course teaches you to be the former." },
    { q: 'Do I need API keys?', a: 'No. Everything you need is included — no separate API keys, subscriptions, or hidden setup.' },
    { q: 'Can I use these skills with any tool?', a: "Yes. The principles transfer across tools — you'll learn frameworks, not button-clicks." },
    { q: 'How often is the content updated?', a: "Regularly. As AI tools evolve, we update the curriculum so you're always learning what's current." },
  ],
  integrations: [
    { q: 'Which tools does UI Rocket integrate with?', a: 'UI Rocket works alongside Lovable, Figma, and the most common modern design and dev tools.' },
    { q: 'Is my data secure?', a: 'Yes. Your data is encrypted in transit and at rest, and never shared with third parties.' },
    { q: 'Is my data used to train AI models?', a: 'No. Your work and account data are never used to train AI models.' },
    { q: 'Who can access our workspace data?', a: 'Only members you explicitly invite. Access is fully under your control.' },
    { q: 'Where is my data stored?', a: 'On secure cloud infrastructure with industry-standard compliance and backups.' },
  ],
};
