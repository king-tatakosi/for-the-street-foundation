import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
  X,
  ZoomIn,
} from 'lucide-react'
import { programs } from './data/siteData'
import './Gallery.css'

// How many photos each story shows before "View all photos".
const MAX_SHOWN = 5

// Turns '2025-03-15' into '15 March 2025'. Anything else is shown as written.
function formatDate(value) {
  if (!value) return null
  const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const month = /^(\d{4})-(\d{2})$/.exec(value)
  if (full || month) {
    const m = full || month
    const d = new Date(Number(m[1]), Number(m[2]) - 1, full ? Number(m[3]) : 1)
    if (!Number.isNaN(d.getTime())) {
      return {
        iso: value,
        label: d.toLocaleDateString(
          'en-GB',
          full
            ? { day: 'numeric', month: 'long', year: 'numeric' }
            : { month: 'long', year: 'numeric' },
        ),
      }
    }
  }
  return { iso: null, label: value }
}

// Fades a story in the first time it scrolls into view.
function useReveal() {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || shown) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown])
  return [ref, shown]
}

// Full-screen photo viewer. It only ever receives ONE activity's photos,
// so photos from different activities can never be mixed.
function Lightbox({ photos, title, altFor, start, onClose }) {
  const dialogRef = useRef(null)
  const stripRef = useRef(null)
  const touchX = useRef(null)
  const [i, setI] = useState(start)
  const total = photos.length
  const go = (dir) => setI((n) => (n + dir + total) % total)

  // Open as a modal, lock page scroll, and give focus back when closed.
  useEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement
    if (!dialog.open) dialog.showModal()
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
    }
  }, [])

  // Pre-load the neighbouring photos so next/previous feels instant.
  useEffect(() => {
    if (total < 2) return
    for (const d of [1, -1]) {
      const img = new Image()
      img.src = photos[(i + d + total) % total]
    }
  }, [i, photos, total])

  // Keep the current thumbnail visible in the strip.
  useEffect(() => {
    const el = stripRef.current?.children[i]
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [i])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="st-lb"
      aria-label={`${title} photo viewer`}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="st-lb-bar">
        <p className="st-lb-title">{title}</p>
        <p className="st-lb-count" aria-live="polite">
          Photo {i + 1} of {total}
        </p>
        <button type="button" className="st-lb-btn" onClick={onClose} aria-label="Close photo viewer">
          <X aria-hidden="true" />
        </button>
      </div>
      <div
        className="st-lb-stage"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 50 && total > 1) go(dx < 0 ? 1 : -1)
        }}
      >
        {total > 1 && (
          <button
            type="button"
            className="st-lb-btn st-lb-prev"
            onClick={() => go(-1)}
            aria-label="Previous photo"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        <img key={i} className="st-lb-img" src={photos[i]} alt={altFor(i)} />
        {total > 1 && (
          <button
            type="button"
            className="st-lb-btn st-lb-next"
            onClick={() => go(1)}
            aria-label="Next photo"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
      {total > 1 && (
        <div className="st-lb-strip" ref={stripRef}>
          {photos.map((src, k) => (
            <button
              key={src}
              type="button"
              className="st-lb-thumb"
              aria-label={`Show photo ${k + 1}`}
              aria-current={k === i ? 'true' : undefined}
              onClick={() => setI(k)}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </dialog>,
    document.body,
  )
}

// One donation / outreach activity = one visual story.
function ActivityStory({ activity, index }) {
  const { id, title, date, location, description, images } = activity
  const [ref, shown] = useReveal()
  const [openAt, setOpenAt] = useState(null)

  const total = images.length
  const preview = images.slice(0, MAX_SHOWN)
  const extra = total - preview.length
  const when = formatDate(date)
  const altFor = (n) =>
    `${title}${location ? `, ${location}` : ''}, photo ${n + 1} of ${total}`

  return (
    <article
      ref={ref}
      className={`st acc-${index % 5} ${index % 2 ? 'is-flip' : ''} ${shown ? 'is-in' : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="wrap st-grid">
        <div className="st-copy">
          <p className="st-num">
            <span className="st-dot" aria-hidden="true" />
            Story {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="st-title" id={`${id}-title`}>
            {title}
          </h3>
          <ul className="st-meta">
            <li className={when ? undefined : 'is-empty'}>
              <CalendarDays size={18} aria-hidden="true" />
              <span className="st-sr">When: </span>
              {when ? (
                when.iso ? <time dateTime={when.iso}>{when.label}</time> : when.label
              ) : (
                'Date to be added'
              )}
            </li>
            <li className={location ? undefined : 'is-empty'}>
              <MapPin size={18} aria-hidden="true" />
              <span className="st-sr">Where: </span>
              {location || 'Location to be added'}
            </li>
          </ul>
          <p className={`st-desc ${description ? '' : 'is-empty'}`}>
            {description || 'The story of this activity is coming soon.'}
          </p>
          {total > 0 && (
            <button
              type="button"
              className="st-btn"
              aria-haspopup="dialog"
              onClick={() => setOpenAt(0)}
            >
              <ImageIcon size={18} aria-hidden="true" />
              View all {total} {total === 1 ? 'photo' : 'photos'}
            </button>
          )}
        </div>

        <div
          className="st-mosaic"
          data-count={total ? preview.length : 3}
          role={total ? undefined : 'img'}
          aria-label={total ? undefined : `Photos from ${title} are coming soon`}
        >
          {total
            ? preview.map((src, k) => (
                <button
                  key={src}
                  type="button"
                  className="st-tile"
                  aria-haspopup="dialog"
                  onClick={() => setOpenAt(k)}
                >
                  <img src={src} alt={altFor(k)} loading="lazy" decoding="async" />
                  <span className="st-zoom" aria-hidden="true">
                    <ZoomIn size={20} />
                  </span>
                  {extra > 0 && k === preview.length - 1 && (
                    <span className="st-more" aria-hidden="true">
                      +{extra}
                    </span>
                  )}
                </button>
              ))
            : [0, 1, 2].map((k) => (
                <div key={k} className={`st-tile st-ph st-ph-${k}`} aria-hidden="true">
                  <ImageIcon size={k === 0 ? 40 : 28} />
                  {k === 0 && <span>Photos coming soon</span>}
                </div>
              ))}
        </div>
      </div>

      {openAt !== null && (
        <Lightbox
          photos={images}
          title={title}
          altFor={altFor}
          start={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </article>
  )
}

export default function Programs() {
  return (
    <section className="section stories" id="programs" aria-labelledby="stories-title">
      <div className="wrap st-head">
        <p className="tag tag-blue">Past donations</p>
        <h2 id="stories-title">
          Our impact <em>stories</em>
        </h2>
        <p className="lead">
          Every donation drive and outreach is its own story. See where we
          went, when it happened, what we did, and the moments we captured
          along the way.
        </p>
      </div>
      <div className="st-list">
        {programs.length === 0 && (
          <p className="wrap st-none">Our first stories are coming soon.</p>
        )}
        {programs.map((activity, i) => (
          <ActivityStory key={activity.id} activity={activity} index={i} />
        ))}
      </div>
    </section>
  )
}
