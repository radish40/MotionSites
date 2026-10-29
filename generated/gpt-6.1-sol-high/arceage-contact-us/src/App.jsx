import { useState } from 'react';
import { motion } from 'motion/react';
import Typewriter from './Typewriter';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const fields = [
  { label: 'Your Name*', name: 'name', type: 'text', placeholder: "Who's reaching out?", required: true, autoComplete: 'name' },
  { label: 'Email*', name: 'email', type: 'email', placeholder: 'Where can we reach you?', required: true, autoComplete: 'email' },
  { label: 'Phone Number*', name: 'phone', type: 'tel', placeholder: 'Best number to call you on?', required: true, autoComplete: 'tel' },
  { label: 'Farm / Company', name: 'farm', type: 'text', placeholder: 'Your farm or organization?', required: false, autoComplete: 'organization' },
  { label: 'Tell Us More', name: 'message', type: 'text', placeholder: 'What crops or acreage would you like to discuss?', required: false },
];

export default function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', farm: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, farm: false, message: false });

  const handleChange = (e) => setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched((previous) => ({ ...previous, [e.target.name]: true }));
  const validations = {
    name: formData.name.trim().length > 0,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    phone: /^\+[\d\s\-\(\)]{7,20}$/.test(formData.phone),
    farm: formData.farm.trim().length > 0,
    message: formData.message.trim().length > 0,
  };

  function renderIcon(fieldName, isRequired) {
    if (!touched[fieldName]) return null;
    const valid = validations[fieldName];
    if (!(valid && (isRequired || formData[fieldName])) && !(isRequired && !valid)) return null;
    const mask = `url("https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/${valid ? 'tick' : 'close'}-circle.svg")`;
    // Keep the specified source; the local mask remains visible when it returns 404.
    const maskWithFallback = `${mask}, url("${import.meta.env.BASE_URL}icons/${valid ? 'tick' : 'close'}-circle.svg")`;
    return (
      <div
        role="img"
        aria-label={valid ? 'Valid' : 'Invalid'}
        className={`absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 ${valid ? 'bg-[#27BD09]' : 'bg-[#FF1F1F]'}`}
        style={{ WebkitMaskImage: maskWithFallback, maskImage: maskWithFallback, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}
      />
    );
  }

  return (
    <main className="bg-black font-sans text-white">
      <section id="contact" className="w-full bg-white text-black py-24 px-6 md:px-12 lg:px-[120px] flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="w-full max-w-3xl mx-auto flex flex-col items-center"
        >
          <div className="text-center mb-16 w-full">
            <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-medium tracking-tight mb-6 leading-[1.1]">
              <span className="text-black font-dm-serif font-normal italic"><Typewriter text="Let's grow!" delay={0} speed={0.012} /></span>{' '}
              <Typewriter text="Fill in the form" delay={0.2} speed={0.012} />
              <br />
              <Typewriter text="and we'll be in touch" delay={0.4} speed={0.012} />
            </h2>
            <p className="text-lg md:text-xl text-gray-800">
              <Typewriter text="Ask us about our precision harvesting services" delay={0.6} speed={0.012} />
            </p>
          </div>
          <form className="max-w-2xl w-full mx-auto flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            {fields.map(({ label, name, type, placeholder, required, autoComplete }) => (
              <motion.div key={name} variants={formVariants} className="flex flex-col gap-2 border-b border-[#D9D9D9] pb-2 transition-colors duration-300 hover:border-black focus-within:border-black">
                <label htmlFor={name} className="text-sm font-medium">{label}</label>
                <div className="relative w-full">
                  <input
                    id={name} name={name} type={type} placeholder={placeholder} required={required}
                    autoComplete={autoComplete} value={formData[name]} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={touched[name] && required ? !validations[name] : undefined}
                    className="w-full bg-transparent outline-none placeholder:text-[#D9D9D9] focus:placeholder:text-gray-500 transition-colors duration-300 text-base pr-8"
                  />
                  {renderIcon(name, required)}
                </div>
              </motion.div>
            ))}
            <motion.div variants={formVariants} className="mt-8 flex justify-center">
              <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-[#27BD09] transition-colors duration-300 text-sm tracking-wide">Send Message</button>
            </motion.div>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
