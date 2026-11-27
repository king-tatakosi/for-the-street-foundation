// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to change the website's content.
// Anything left empty ('' or null) is hidden or shown as a
// friendly placeholder — nothing fake is displayed.
// ─────────────────────────────────────────────────────────────

export const org = {
  name: 'For The Street Foundation',
  tagline: 'Hope that meets people where they are.',
  email: '', // e.g. 'hello@yourdomain.org'
  phone: '', // e.g. '+233 00 000 0000'
}

// ── Donation lines (shown in the "Ways to donate" card) ──────────
// Add one entry for every way people can give. An entry only shows on the
// site once its `number` is filled in. While the list is empty, the card
// says "Donation details are coming soon".
//   type:        'momo' (mobile money, shows a phone icon)
//                or 'bank' (bank account, shows a bank icon)
//   label:       what to call it, e.g. 'Mobile Money' or 'Bank transfer'
//   accountName: the name the account is registered under
//   number:      the mobile money number or the bank account number
//   detail:      optional extra line, e.g. the bank name and branch
// Example (remove the // to use it, then replace with your real details):
//   { type: 'momo', label: 'Mobile Money', accountName: '', number: '', detail: '' },
export const donationLines = []

// ── Donation activities (each one is a story in the gallery) ─
// TO ADD A NEW ACTIVITY:
//   1. Add an entry below (the id must be unique, with no spaces).
//   2. Create the folder src/assets/gallery/<id>/ and drop its photos in
//      (any .jpg .jpeg .png .webp .avif). Photos show in filename order.
//   3. Optional: name one photo cover.jpg (or cover.png etc.) to choose the
//      large featured photo. If there is none, the first photo is used.
// Newest first is recommended; stories appear in the order listed here.
// date: use 'YYYY-MM-DD' (e.g. '2025-03-15'). Leave '' if not known yet.
// Anything left '' shows a friendly "to be added" note, nothing fake.
//
// `coverImage` and `images` are filled in automatically (see the bottom of
// this file), so each finished activity has: id, title, date, location,
// description, coverImage and images.
const activityInfo = [
  {
    id: 'program-1',
    title: 'Where It All Began',
    date: '',
    location: 'Takoradi',
    description:
      "This was For The Street Foundation's first ever donation, and it took place in Takoradi. It was the moment our belief that everyone deserves a better chance moved from an idea into action, and the start of the journey we continue today.",
  },
  {
    id: 'program-2',
    title: 'Two Teams, One Mission',
    date: '',
    location: 'Accra',
    description:
      "This was our third donation in Accra, and the first time the Accra and Takoradi teams came together to give as one. Side by side, young people from two cities shared a single mission: bringing hope to those who need it most.",
  },
  {
    id: 'program-3',
    title: 'Giving Hope on the Streets',
    date: '',
    location: 'Accra',
    description:
      "This donation took place in Accra. Our volunteers, in their For The Street Foundation shirts, took to the streets to hand over gifts in person, stopping to talk, share a smile and remind each person that they are seen and valued. For us, giving is about the connection as much as what is in the bag.",
  },
]

// ── Leaders ──────────────────────────────────────────────────
// Photos are picked up AUTOMATICALLY from src/assets/leaders/
// Name the file exactly like the id, e.g. accra-president.jpg
export const leaders = [
  { id: 'President-Takoradi', branch: 'Takoradi', role: 'President', name: 'Samuel Kojo Afoah Jnr' },
  { id: 'Vice-Takoradi', branch: 'Takoradi', role: 'Vice President', name: 'Othnevia Serwaa Asomaning' },
  { id: 'President-Accra', branch: 'Accra', role: 'President', name: 'Kelvin Sedem Fugar' },
  { id: 'Vice-Accra', branch: 'Accra', role: 'Vice President', name: 'Oswald Agyekum Gyamfi' },
]

// ── Impact numbers ───────────────────────────────────────────
// The "By the numbers" band only appears once at least 3 of these
// have a real value. Replace null with your true figures.
export const stats = [
  { label: 'Branches', value: 2 },
  { label: 'People reached', value: null },
  { label: 'Donation programs', value: null },
  { label: 'Volunteers', value: null },
]

// ── Photo auto-loaders (no need to edit below) ───────────────
const galleryFiles = import.meta.glob(
  '../assets/gallery/*/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, import: 'default' },
)
const leaderFiles = import.meta.glob(
  '../assets/leaders/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, import: 'default' },
)
const heroFiles = import.meta.glob('../assets/hero.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

export const photosFor = (programId) =>
  Object.entries(galleryFiles)
    .filter(([path]) => path.includes(`/gallery/${programId}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, src]) => src)

// Builds the final list the gallery shows. Each activity gets its own
// photos only (from its own folder), so activities never mix.
const photoEntriesFor = (activityId) =>
  Object.entries(galleryFiles)
    .filter(([path]) => path.includes(`/gallery/${activityId}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))

export const programs = activityInfo.map((activity) => {
  const entries = photoEntriesFor(activity.id)
  const cover =
    entries.find(([path]) => /^cover\./i.test(path.split('/').pop())) ||
    entries[0]
  const ordered = cover ? [cover, ...entries.filter((e) => e !== cover)] : entries
  const images = ordered.map(([, src]) => src)
  return { ...activity, coverImage: images[0] || null, images }
})

export const leaderPhoto = (leaderId) => {
  const hit = Object.entries(leaderFiles).find(
    ([path]) => path.split('/').pop().replace(/\.[^.]+$/, '') === leaderId,
  )
  return hit ? hit[1] : null
}

export const heroPhoto = Object.values(heroFiles)[0] || null

// Group photo for the "Our story" section: save it as src/assets/story.jpg
const storyFiles = import.meta.glob('../assets/story.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})
export const storyPhoto = Object.values(storyFiles)[0] || null
