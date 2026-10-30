export function calculatePrice({ serviceType, pages, needContent, needSEO, timeline }) {
  const { base, perPage } = {
    design: { base: 399, perPage: 100 },
    development: { base: 199, perPage: 100 },
    both: { base: 499, perPage: 200 },
  }[serviceType]
  let total = Math.max(base, base + (pages - 1) * perPage)
  if (needContent) total += pages * 50
  if (needSEO) total += pages * 50
  if (timeline === 'rush') total += pages * 100
  if (timeline === 'fast') total += pages * 25
  return total
}
export const calculateAgencyCost = ({ serviceType, pages }) => 8000 + (pages - 1) * (serviceType === 'both' ? 1000 : 400)
export const calculateFreelancerCost = ({ serviceType, pages }) => 3000 + (pages - 1) * (serviceType === 'both' ? 500 : 200)
export const formatPrice = (price) => `$${price.toLocaleString('en-US')}`
