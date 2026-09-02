/**
 * Central site configuration — edit these values to rebrand the site
 * for any photographer without touching component code.
 */
export const site = {
  name: "John Doe",
  studio: "John Doe Photography",
  tagline: "Stories Worth Remembering.",
  intro:
    "Portrait, wedding, lifestyle, and editorial photography crafted around authentic moments.",
  location: "Portland, Oregon",
  region: "Pacific Northwest · Available worldwide",
  email: "hello@johndoephotography.com",
  phone: "+1 (503) 555-0184",
  specialties: ["Weddings", "Portraits", "Editorial", "Lifestyle", "Travel"],
  travel: "Available for travel",
  since: 2012,
  social: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    vimeo: "https://vimeo.com",
  },
  url: "https://johndoephotography.com",
} as const;

export const bookingTypes = [
  "Wedding",
  "Elopement",
  "Portrait",
  "Couples",
  "Family",
  "Editorial / Fashion",
  "Brand / Lifestyle",
  "Event",
  "Travel / Destination",
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
