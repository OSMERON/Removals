import './WhyUs.css'
import type { JSX } from 'react'

type Props = {
  phone?: string
  onQuoteClick?: () => void
}

type Reason = {
  id: 'insured' | 'ontime' | 'care' | 'pricing' | 'shortnotice' | 'reviews'
  title: string
  desc: string
  Icon: () => JSX.Element
}

/* Static icons for the default state */
/* daca inlocuiesti svg cu Inside each <div className="card__anim">, replace the SVG with your asset.

For a video: <video src="/anim/insured.mp4" autoplay loop muted playsInline />

For Lottie: include the player script in index.html, then use <lottie-player src="/anim/insured.json" autoplay loop></lottie-player> */
function InsuredIcon() {
  return (
    <svg className="icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 6l18 6v14c0 12-8 22-18 26-10-4-18-14-18-26V12l18-6z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M22 33l7 7 14-14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function OnTimeIcon() {
  return (
    <svg className="icon" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="3"/>
      <line x1="32" y1="32" x2="32" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}
function CareIcon() {
  return (
    <svg className="icon" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="22" width="44" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M10 26h44" stroke="currentColor" strokeWidth="3"/>
    </svg>
  )
}
function PricingIcon() {
  return (
    <svg className="icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M24 40h20M22 30c0-6 4-10 10-10s10 4 10 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M22 30h8v12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}
function ShortNoticeIcon() {
  return (
    <svg className="icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M36 4L12 38h14l-4 22 30-40H36z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    </svg>
  )
}
function ReviewsIcon() {
  return (
    <svg className="icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 28l6-2 3-6 3 6 6 2-6 3-3 6-3-6z" fill="currentColor"/>
      <path d="M30 14l4-1 2-4 2 4 4 1-4 2-2 4-2-4z" fill="currentColor"/>
      <path d="M44 34l5-2 2-5 2 5 5 2-5 2-2 5-2-5z" fill="currentColor"/>
    </svg>
  )
}

const REASONS: Reason[] = [
  { id: 'insured', title: 'Fully insured', desc: 'Cover for goods and property. Peace of mind on every move.', Icon: InsuredIcon },
  { id: 'ontime', title: 'On time', desc: 'Reliable arrivals with clear ETAs and updates.', Icon: OnTimeIcon },
  { id: 'care', title: 'Careful handling', desc: 'Furniture wrapped and protected. Doors and floors guarded.', Icon: CareIcon },
  { id: 'pricing', title: 'Clear pricing', desc: 'Transparent rates. No hidden fees.', Icon: PricingIcon },
  { id: 'shortnotice', title: 'Short notice', desc: 'Same day or next day when slots are open.', Icon: ShortNoticeIcon },
  { id: 'reviews', title: '5 star reviews', desc: 'Proven service across the region.', Icon: ReviewsIcon },
]

export default function WhyUs({ phone = '07888505983', }: Props) {
  const tel = `tel:${phone.replace(/\s+/g, '')}`
  
  return (
    <section>
      <h2>Why choose us</h2>
      <a href={tel}>Call {phone}</a>
    </section>
  )

  return (
    
    <section id="why" className="why" aria-labelledby="why-title">
      <div className="why__inner">
        <h2 id="why-title" className="why__title">Why choose us</h2>
        <p className="why__lead">Real care, clear prices, and on time moves.</p>

        <div className="why__grid">
          {REASONS.map(r => (
            <article key={r.id} className={`card card--${r.id}`} aria-labelledby={`why-${r.id}-title`}>
              <div className="card__icon" aria-hidden="true">
                <r.Icon />
              </div>

              <div className="card__content">
                <h3 id={`why-${r.id}-title`} className="card__title">{r.title}</h3>
                <p className="card__desc">{r.desc}</p>
              </div>

              {/* Overlay for the hover animation. Replace inner content later if needed */}
              <div className="card__anim" aria-hidden="true">
                {/* Default expressive animations per card */}
                {r.id === 'insured' && (
                  <svg className="anim anim--shield" viewBox="0 0 64 64">
                    <path className="shield" d="M32 6l18 6v14c0 12-8 22-18 26-10-4-18-14-18-26V12l18-6z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
                    <path className="check" d="M22 33l7 7 14-14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {r.id === 'ontime' && (
                  <svg className="anim anim--clock" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="3"/>
                    <line className="hand hour" x1="32" y1="32" x2="32" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <line className="hand min" x1="32" y1="32" x2="46" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="32" cy="32" r="2" fill="currentColor"/>
                  </svg>
                )}
                {r.id === 'care' && (
                  <svg className="anim anim--box" viewBox="0 0 64 64">
                    <rect className="crate" x="12" y="24" width="40" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="3"/>
                    <path className="strap" d="M26 24v-8h12v8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                )}
                {r.id === 'pricing' && (
                  <svg className="anim anim--pound" viewBox="0 0 64 64">
                    <circle className="ring" cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeOpacity=".15"/>
                    <path className="p" d="M24 40h18M22 30c0-6 4-10 10-10s10 4 10 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M22 30h8v12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                )}
                {r.id === 'shortnotice' && (
                  <svg className="anim anim--bolt" viewBox="0 0 64 64">
                    <path className="bolt" d="M36 4L12 38h14l-4 22 30-40H36z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
                  </svg>
                )}
                {r.id === 'reviews' && (
                  <svg className="anim anim--stars" viewBox="0 0 64 64">
                    <path className="star s1" d="M12 28l6-2 3-6 3 6 6 2-6 3-3 6-3-6z" fill="currentColor"/>
                    <path className="star s2" d="M30 14l4-1 2-4 2 4 4 1-4 2-2 4-2-4z" fill="currentColor"/>
                    <path className="star s3" d="M44 34l5-2 2-5 2 5 5 2-5 2-2 5-2-5z" fill="currentColor"/>
                  </svg>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
