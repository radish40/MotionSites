const accordionSection = document.querySelector(".platform-accordion");
const accordionTabs = Array.from(document.querySelectorAll("[data-accordion-tab]"));
const accordionCards = Array.from(document.querySelectorAll("[data-accordion-card]"));

function activateAccordionPanel(panelName) {
accordionTabs.forEach((tab) => {
const isActive = tab.dataset.accordionTab === panelName;
tab.classList.toggle("active", isActive);
tab.setAttribute("aria-selected", String(isActive));
});
accordionCards.forEach((card) => {
card.classList.toggle("active", card.dataset.accordionCard === panelName);
});
}

function updateScrollAccordion() {
if (!accordionSection || !accordionCards.length) return;

const rect = accordionSection.getBoundingClientRect();
const scrollable = Math.max(1, rect.height - window.innerHeight);
const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
const maxIndex = accordionCards.length - 1;
const rawIndex = progress * maxIndex;
const activeIndex = Math.min(maxIndex, Math.max(0, Math.round(rawIndex)));
const stack = document.querySelector(".accordion-stack");
const stackHeight = stack ? stack.clientHeight : window.innerHeight * 0.74;
const collapsedHeight = window.innerWidth <= 820 ? 96 : 84;

const cardPositions = accordionCards.map((_, index) => {
let y = 0;
if (index > 0) {
const segmentProgress = Math.min(1, Math.max(0, rawIndex - (index - 1)));
const startY = stackHeight + collapsedHeight;
const endY = index * collapsedHeight;
y = startY + (endY - startY) * segmentProgress;
}
return Math.round(y);
});

accordionCards.forEach((card, index) => {
const y = cardPositions[index];
const nextY = cardPositions[index + 1];
const visibleHeight = typeof nextY === "number"
? Math.max(collapsedHeight, Math.min(stackHeight, nextY + 2))
: stackHeight;
const clipBottom = Math.max(0, stackHeight - visibleHeight);

card.style.setProperty("--card-y", `${Math.round(y)}px`);
card.style.setProperty("--card-clip-bottom", `${Math.round(clipBottom)}px`);
card.style.zIndex = String(index + 1);
});

const activeCard = accordionCards[activeIndex];
if (activeCard) activateAccordionPanel(activeCard.dataset.accordionCard);
}

// Tab click scrolls to the correct segment
accordionTabs.forEach((tab) => {
tab.addEventListener("click", () => {
if (!accordionSection || !accordionCards.length) return;
const index = accordionCards.findIndex(
(card) => card.dataset.accordionCard === tab.dataset.accordionTab
);
const maxIndex = accordionCards.length - 1;
const scrollable = accordionSection.offsetHeight - window.innerHeight;
const target = accordionSection.offsetTop + (index / maxIndex) * scrollable;
window.scrollTo({ top: target, behavior: "smooth" });
});
});

window.addEventListener("scroll", updateScrollAccordion, { passive: true });
window.addEventListener("resize", updateScrollAccordion);
updateScrollAccordion();
