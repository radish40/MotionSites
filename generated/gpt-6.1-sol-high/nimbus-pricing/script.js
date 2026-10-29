const pricingSection = document.querySelector(".pricing-section");
const pricingBars = Array.from(document.querySelectorAll(".pricing-bar"));

function updatePricingBars() {
if (!pricingSection || !pricingBars.length) return;

const rect = pricingSection.getBoundingClientRect();
const viewport = window.innerHeight || 1;
const progress = Math.min(1, Math.max(0,
(viewport - rect.top) / (viewport + rect.height)
));

pricingBars.forEach((bar, index) => {
const wave = Math.sin(progress * Math.PI * 2 + index * 0.72);
const secondaryWave = Math.cos(progress * Math.PI + index * 0.34);
const morph = Math.round(wave * 34 + secondaryWave * 14);
bar.style.setProperty("--bar-morph", `${morph}px`);
});
}

window.addEventListener("scroll", updatePricingBars, { passive: true });
window.addEventListener("resize", updatePricingBars);
updatePricingBars();
