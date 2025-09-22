import './Footer.css'

const OWNER_NAME = 'Bogdan'
const OWNER_PHONE = '07888505983'

export default function Footer() {
  const year = new Date().getFullYear()
  const telHref = `tel:${OWNER_PHONE.replace(/\s+/g, '')}`
  const waNumber = toWhatsAppNumber(OWNER_PHONE)

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="logo" aria-hidden="true">B</div>
          <div>
            <p className="brand__name">Bogdan Removals</p>
            <p className="brand__tag">Fast moves. Careful handling.</p>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <ul className="fnav">
            <li><a href="#services">Services</a></li>
            <li><a href="#prices">Prices</a></li>
            <li><a href="#areas">Areas</a></li>
            <li><a href="#whys">Why us</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="footer__contact">
          <a className="btn btn--primary" href={telHref} aria-label={`Call ${OWNER_PHONE}`}>Call {OWNER_PHONE}</a>
          <a className="btn btn--ghost" href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <p className="hours">Open daily 08:00 to 20:00</p>
        </div>

        <div className="footer__social" aria-label="Social links">
          <a href="#" className="sicon" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 22v-8h3l1-4h-4V7c0-1.1.9-2 2-2h2V1h-3a5 5 0 0 0-5 5v4H6v4h3v8h4z"/></svg>
          </a>
          <a href="#" className="sicon" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2.2A3.8 3.8 0 1 0 15.8 13 3.8 3.8 0 0 0 12 9.2zM18.5 6a1.5 1.5 0 1 1-1.49 1.5A1.5 1.5 0 0 1 18.5 6z"/></svg>
          </a>
          <a href="#" className="sicon" aria-label="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h3a5 5 0 0 0 5 5v3a8 8 0 0 1-5-2v7.5A6.5 6.5 0 1 1 10 10a6.6 6.6 0 0 1 2 .3V13a3.5 3.5 0 1 0 2 3.2V3z"/></svg>
          </a>
        </div>

        <div className="footer__legal">
          <p>© {year} {OWNER_NAME}. All rights reserved.</p>
          <ul className="legal">
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#terms">Terms</a></li>
            <li><button type="button" className="top" onClick={scrollTop}>Back to top</button></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

function toWhatsAppNumber(raw: string) {
  const digits = raw.replace(/\D+/g, '')
  if (digits.startsWith('0')) return `44${digits.slice(1)}`
  if (digits.startsWith('44')) return digits
  return digits
}
