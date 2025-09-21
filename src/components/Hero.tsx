import './Hero.css'

type HeroProps = {
  onQuoteClick?: () => void
  phone?: string
  areas?: string
}

export default function Hero({ onQuoteClick, phone = '07888505983', areas = 'Birmingham, London and surrounding areas' }: HeroProps) {
  return (
    <header className="hero" id="home" role="banner">
      <div className="hero__inner">
        <p className="hero__eyebrow">Removals</p>
        <h1 className="hero__title">Stress‑free moving. Fast and safe.</h1>
        <p className="hero__tag">Home and office moves. Packing, transport, storage. Flexible scheduling.</p>

        <p className="hero__details">
          Our team protects your furniture, disassembles when needed, and delivers on time. Clear pricing, no surprises. Quote in 2 hours.
        </p>

        <ul className="hero__bullets" aria-label="Benefits">
          <li>Packing and materials on request</li>
          <li>Fully insured and vetted</li>
          <li>Local and nationwide, {areas}</li>
        </ul>

        <div className="hero__cta">
          <a href="#quote" className="btn btn--primary" onClick={onQuoteClick}>Get a Quote</a>
          <a href={`tel:${phone}`} className="btn btn--ghost">Call: {phone}</a>
        </div>

        <p className="hero__meta">Available today. We cover {areas}.</p>
      </div>
    </header>
  )
}