/**
 * Central site configuration — edit these values to rebrand the site
 * for any photographer without touching component code.
 */
export const site = {
  name: "Kim",
  studio: "Kim Photography",
  tagline: "Stories Worth Remembering.",
  intro:
    "Portrait, wedding, editorial, car, animal, and nature photography crafted around authentic moments.",
  location: "Boynton Beach, Florida",
  region: "South Florida · Available worldwide",
  email: "hello@kimphotography.com",
  phone: "+1 (561) 555-0184",
  specialties: ["Weddings", "Portraits", "Editorial", "Cars", "Animals", "Nature"],
  travel: "Available for travel",
  since: 2012,
  social: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    vimeo: "https://vimeo.com",
  },
  url: "https://kimphotography.com",
} as const;

export const bookingTypes = [
  "Wedding",
  "Elopement",
  "Portrait",
  "Family",
  "Editorial / Fashion",
  "Automotive / Car",
  "Pet / Animal",
  "Event",
  "Nature / Wildlife",
  "Other",
] as const;

export const budgetRanges = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;
