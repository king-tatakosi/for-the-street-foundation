import { useState } from 'react'
import {
  ArrowRight,
  HeartHandshake,
  Image as ImageIcon,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  Smartphone,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import logo from './assets/logo.jpeg'
import Programs from './Gallery'
import {
  donationLines,
  heroPhoto,
  leaderPhoto,
  leaders,
  org,
  stats,
  storyPhoto,
} from './data/siteData'

const NAV = [
  ['About', '#about'],
  ['Programs', '#programs'],
  ['Leadership', '#leadership'],
  ['Contact Us', '#contact'],
]

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a className="brand" href="#top" aria-label={`${org.name} home`}>
          <img src={logo} alt="" width="52" height="52" loading="lazy" />
          <span>
            For The Street <small>Foundation</small>
          </span>
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="main-nav" className={`nav ${open ? 'open' : ''}`} aria-label="Main">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="btn btn-give" href="#get-involved" onClick={() => setOpen(false)}>
            <HeartHandshake size={18} aria-hidden="true" /> Donate
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <p className="tag tag-teal">Youth-led · Ghana</p>
          <h1>
            Offering <em>hope</em> to people who need it most
          </h1>
          <p className="lead">
            {org.name} brings people together to give back through donation
            programs.
          </p>
          <div className="actions">
            <a className="btn btn-give" href="#get-involved">
              <HeartHandshake size={18} aria-hidden="true" /> Give today
            </a>
            <a className="btn btn-ghost" href="#programs">
              See our programs <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-art" aria-hidden={heroPhoto ? undefined : 'true'}>
          <span className="ribbon r1" />
          <span className="ribbon r2" />
          <span className="ribbon r3" />
          <span className="ribbon r4" />
          <div className="blob">
            {heroPhoto ? (
              <img src={heroPhoto} alt="Volunteers of For The Street Foundation" />
            ) : (
              <img className="logo-fit" src={logo} alt="" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section cream" id="about">
      <div className="wrap about-grid">
        <div>
          <p className="tag tag-pink">Our story</p>
          <h2>
            Who <em>we</em> are
          </h2>
          <p>
            For The Street Foundation (FTS) is a youth-led nonprofit
            organisation in Ghana, established in 2024 by a group of young
            people with a shared passion for humanity, community development,
            and improving the lives of underprivileged and street-connected
            individuals.
          </p>
          <p>
            The foundation was born in the founder's final year at Adisadel
            College, following a personal desire to make a meaningful
            difference in society and extend a helping hand to people who are
            often neglected or overlooked.
          </p>
          <p>
            FTS began with a simple but powerful belief: everyone deserves an
            opportunity to live a better life, regardless of their social or
            economic background. What started as a vision to support vulnerable
            individuals has grown into a movement driven by compassion,
            volunteerism, and the desire to create lasting social impact.
          </p>
          <p>
            The foundation operates primarily in Takoradi and Accra, Ghana, with
            a commitment to reaching communities and individuals who need
            support.
          </p>
        </div>
        <figure className="story-frame">
          <span className="sheet s1" aria-hidden="true" />
          <span className="sheet s2" aria-hidden="true" />
          <span className="sheet s3" aria-hidden="true" />
          <div className="story-photo">
            {storyPhoto ? (
              <img
                src={storyPhoto}
                alt="Leaders of For The Street Foundation with some of the people the foundation has supported"
                loading="lazy"
              />
            ) : (
              <div className="story-ph" role="img" aria-label="Group photo coming soon">
                <ImageIcon size={40} aria-hidden="true" />
                <span>Group photo coming soon</span>
              </div>
            )}
          </div>
          <span className="tape t1" aria-hidden="true" />
          <span className="tape t2" aria-hidden="true" />
          <figcaption className="story-cap">
            <Users size={18} aria-hidden="true" /> Leaders &amp; the people we serve
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function Stats() {
  const real = stats.filter((s) => s.value !== null)
  if (real.length < 3) return null
  return (
    <section className="stats" aria-label="By the numbers">
      <div className="wrap stats-grid">
        {real.map((s) => (
          <div key={s.label}>
            <strong>{s.value.toLocaleString()}+</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Leadership() {
  return (
    <section className="section cream" id="leadership">
      <div className="wrap">
        <p className="tag tag-yellow">The team</p>
        <h2>
          Meet our <em>leaders</em>
        </h2>
        <ul className="leaders">
          {leaders.map((l) => {
            const photo = leaderPhoto(l.id)
            return (
              <li key={l.id} className={`leader ${l.branch === 'Accra' ? 'is-accra' : 'is-takoradi'}`}>
                <div className="avatar">
                  {photo ? (
                    <img src={photo} alt={l.name || `${l.branch} ${l.role}`} loading="lazy" />
                  ) : (
                    <UserRound size={56} aria-hidden="true" />
                  )}
                </div>
                <span className="branch-chip">{l.branch}</span>
                <h3>{l.role}</h3>
                <p>{l.name || 'Name to be announced'}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function ContactCard() {
  const hasDetails = org.email || org.phone
  return (
    <article id="contact" className="info-card is-contact" aria-labelledby="contact-card-title">
      <h3 id="contact-card-title">
        <Mail size={22} aria-hidden="true" /> Contact us
      </h3>
      <p>Questions, partnerships, or want to volunteer? Reach out to us.</p>
      <ul className="info-list">
        {org.email && (
          <li>
            <Mail size={20} aria-hidden="true" />
            <div>
              <span className="info-label">Email</span>
              <a href={`mailto:${org.email}`}>{org.email}</a>
            </div>
          </li>
        )}
        {org.phone && (
          <li>
            <Phone size={20} aria-hidden="true" />
            <div>
              <span className="info-label">Phone</span>
              <a href={`tel:${org.phone}`}>{org.phone}</a>
            </div>
          </li>
        )}
        <li>
          <MapPin size={20} aria-hidden="true" />
          <div>
            <span className="info-label">Based in</span>
            <span>Ghana</span>
          </div>
        </li>
      </ul>
      {!hasDetails && (
        <p className="info-empty">Email and phone details are coming soon.</p>
      )}
    </article>
  )
}

function DonateCard() {
  // Only lines with a real number are shown.
  const lines = donationLines.filter((line) => line.number)
  return (
    <article className="info-card is-donate" aria-labelledby="donate-card-title">
      <h3 id="donate-card-title">
        <HeartHandshake size={22} aria-hidden="true" /> Ways to donate
      </h3>
      <p>Every gift helps us do more for people who need it most.</p>
      {lines.length > 0 ? (
        <ul className="info-list">
          {lines.map((line) => (
            <li key={`${line.label}-${line.number}`}>
              {line.type === 'bank' ? (
                <Landmark size={20} aria-hidden="true" />
              ) : (
                <Smartphone size={20} aria-hidden="true" />
              )}
              <div>
                <span className="info-label">{line.label}</span>
                <strong className="don-number">{line.number}</strong>
                {line.accountName && <span>Account name: {line.accountName}</span>}
                {line.detail && <span>{line.detail}</span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="info-empty">Donation details are coming soon.</p>
      )}
    </article>
  )
}

function GetInvolved() {
  return (
    <section className="section dark" id="get-involved">
      <div className="wrap involved">
        <div>
          <p className="tag tag-yellow">Join us</p>
          <h2>
            Be part of the next <em>donation</em>
          </h2>
          <p className="lead">
            Give, volunteer or partner with us. Reach out and we will show you
            how you can help.
          </p>
        </div>
      </div>
      <div className="wrap info-cards">
        <DonateCard />
        <ContactCard />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap foot-grid">
        <div>
          <a className="brand" href="#top">
            <img src={logo} alt="" width="52" height="52" loading="lazy" />
            <span>
              For The Street <small>Foundation</small>
            </span>
          </a>
          <p>{org.tagline}</p>
        </div>
        <div>
          <h3>Explore</h3>
          <ul>
            {NAV.map(([label, href]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            {org.email && (
              <li>
                <Mail size={16} aria-hidden="true" /> <a href={`mailto:${org.email}`}>{org.email}</a>
              </li>
            )}
            {org.phone && (
              <li>
                <Phone size={16} aria-hidden="true" /> <a href={`tel:${org.phone}`}>{org.phone}</a>
              </li>
            )}
            <li>
              <MapPin size={16} aria-hidden="true" /> Ghana
            </li>
          </ul>
        </div>
      </div>
      <p className="copy">
        © {new Date().getFullYear()} {org.name}. All rights reserved.
      </p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Programs />
        <Leadership />
        <GetInvolved />
      </main>
      <Footer />
    </>
  )
}
