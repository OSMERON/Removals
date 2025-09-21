import { useMemo, useState } from 'react'
import './Contact.css'

type ContactData = {
  name: string
  phone: string
  email: string
  from: string
  to: string
  date: string
  size: string
  message: string
  consent: boolean
}

const OWNER_NAME = 'Bogdan'
const OWNER_PHONE = '07888505983'

// set these later in .env
const EMAIL_WEBHOOK: string | undefined = (import.meta as any).env?.VITE_EMAIL_WEBHOOK
const OWNER_EMAIL: string | undefined = (import.meta as any).env?.VITE_OWNER_EMAIL

export default function Contact() {
  const waNumber = useMemo(() => toWhatsAppNumber(OWNER_PHONE), [])
  const waBase = `https://wa.me/${waNumber}`

  const [data, setData] = useState<ContactData>({
    name: '',
    phone: '',
    email: '',
    from: '',
    to: '',
    date: '',
    size: '1 bed',
    message: '',
    consent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<string | null>(null)

  function setField<K extends keyof ContactData>(k: K, v: ContactData[K]) {
    setData(prev => ({ ...prev, [k]: v }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!data.phone.trim()) e.phone = 'Required'
    if (!data.from.trim()) e.from = 'Required'
    if (!data.to.trim()) e.to = 'Required'
    if (!data.consent) e.consent = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function buildMessageLines() {
    return [
      'New enquiry for removals',
      `Name: ${data.name.trim() || 'Anonymous'}`,
      `Phone: ${data.phone.trim()}`,
      data.email.trim() ? `Email: ${data.email.trim()}` : '',
      `From: ${data.from.trim()}`,
      `To: ${data.to.trim()}`,
      data.date ? `Move date: ${data.date}` : '',
      `Property size: ${data.size}`,
      data.message.trim() ? `Details: ${data.message.trim()}` : ''
    ].filter(Boolean)
  }

  function buildWhatsappUrl() {
    const txt = encodeURIComponent(buildMessageLines().join('\n'))
    return `${waBase}?text=${txt}`
  }

  async function sendEmailSilent() {
    if (!EMAIL_WEBHOOK || !OWNER_EMAIL) return
    const subject = 'New removals enquiry'
    const lines = buildMessageLines()
    const text = lines.join('\n')
    const html =
      `<h2>New removals enquiry</h2>` +
      `<ul>` +
      lines.map(l => `<li>${escapeHtml(l)}</li>`).join('') +
      `</ul>`

    try {
      await fetch(EMAIL_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: OWNER_EMAIL,
          subject,
          text,
          html,
          meta: { when: new Date().toISOString() }
        })
      })
    } catch {
      // ignore
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(null)
    if (!validate()) return
    const url = buildWhatsappUrl()
    window.open(url, '_blank')
    sendEmailSilent()
    try { localStorage.setItem('last_contact', JSON.stringify({ ...data, when: Date.now() })) } catch {}
    setSent('Opening WhatsApp')
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__inner">
        <h2 id="contact-title" className="contact__title">Contact</h2>
        <p className="contact__lead">You are reaching {OWNER_NAME}. Reply on WhatsApp.</p>

        <article className="ccard ccard--form" aria-labelledby="form-title">
          <h3 id="form-title" className="ccard__title">Message form</h3>
          <p className="ccard__hint">Fill the basics. I will reply fast.</p>

          <form className="form" onSubmit={onSubmit}>
            <div className="form__row">
              <label className="field">
                <span>Name, optional</span>
                <input
                  type="text"
                  value={data.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="Your name"
                />
              </label>

              <label className="field">
                <span>Your phone</span>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={e => setField('phone', e.target.value)}
                  placeholder="07..."
                  aria-invalid={!!errors.phone}
                  className={errors.phone ? 'is-invalid' : ''}
                  required
                />
                {errors.phone ? <em className="err">Required</em> : null}
              </label>
            </div>

            <div className="form__row">
              <label className="field">
                <span>Email, optional</span>
                <input
                  type="email"
                  value={data.email}
                  onChange={e => setField('email', e.target.value)}
                  placeholder="you@email.com"
                />
              </label>

              <label className="field">
                <span>Move date, optional</span>
                <input
                  type="date"
                  value={data.date}
                  onChange={e => setField('date', e.target.value)}
                />
              </label>
            </div>

            <div className="form__row">
              <label className="field">
                <span>From address or postcode</span>
                <input
                  type="text"
                  value={data.from}
                  onChange={e => setField('from', e.target.value)}
                  placeholder="e.g. SE1 2AA"
                  aria-invalid={!!errors.from}
                  className={errors.from ? 'is-invalid' : ''}
                  required
                />
                {errors.from ? <em className="err">Required</em> : null}
              </label>

              <label className="field">
                <span>To address or postcode</span>
                <input
                  type="text"
                  value={data.to}
                  onChange={e => setField('to', e.target.value)}
                  placeholder="e.g. B3 1AB"
                  aria-invalid={!!errors.to}
                  className={errors.to ? 'is-invalid' : ''}
                  required
                />
                {errors.to ? <em className="err">Required</em> : null}
              </label>
            </div>

            <div className="form__row">
              <label className="field">
                <span>Property size</span>
                <select value={data.size} onChange={e => setField('size', e.target.value)}>
                  <option>Studio</option>
                  <option>1 bed</option>
                  <option>2 bed</option>
                  <option>3 bed</option>
                  <option>4+ bed</option>
                  <option>Office</option>
                </select>
              </label>
            </div>

            <label className="form__block field">
              <span>Details, optional</span>
              <textarea
                rows={5}
                value={data.message}
                onChange={e => setField('message', e.target.value)}
                placeholder="Stairs. Parking. Special items."
              />
            </label>

            <label className="consent">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={e => setField('consent', e.target.checked)}
                aria-invalid={!!errors.consent}
                required
              />
              I agree to be contacted about my enquiry
            </label>
            {errors.consent ? <em className="err">Required</em> : null}

            <div className="form__actions">
              <button type="submit" className="btn btn--primary">Send on WhatsApp</button>
            </div>

            {sent ? <p className="sent" role="status" aria-live="polite">{sent}</p> : null}
          </form>
        </article>
      </div>
    </section>
  )
}

function toWhatsAppNumber(raw: string) {
  const digits = raw.replace(/\D+/g, '')
  if (digits.startsWith('0')) return `44${digits.slice(1)}`
  if (digits.startsWith('44')) return digits
  return digits
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
