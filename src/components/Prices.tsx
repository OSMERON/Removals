import { useEffect, useMemo, useState } from 'react'
import './Prices.css'

type Props = {
  phone?: string
}

type Bedrooms = 'Studio' | '1 bed' | '2 bed' | '3 bed' | '4 bed'

const SIZE_FACTOR: Record<Bedrooms, number> = {
  'Studio': 1.0,
  '1 bed': 1.2,
  '2 bed': 1.6,
  '3 bed': 2.0,
  '4 bed': 2.5,
}

const BOX_ESTIMATE: Record<Bedrooms, number> = {
  'Studio': 15,
  '1 bed': 25,
  '2 bed': 40,
  '3 bed': 60,
  '4 bed': 80,
}

export default function Prices({ phone = '07888505983' }: Props) {
  const [bedrooms, setBedrooms] = useState<Bedrooms>('1 bed')
  const [distanceMiles, setDistanceMiles] = useState<number>(10)
  const [movers, setMovers] = useState<number>(2)
  const [packing, setPacking] = useState<boolean>(false)
  const [stairsFlights, setStairsFlights] = useState<number>(0)
  const [piano, setPiano] = useState<boolean>(false)
  const [date, setDate] = useState<string>('')

  // Simple internal pricing model. Not visible to users.
  const quote = useMemo(() => {
    const base = 40
    const mileRate = 1.2
    const moverHourly = 30

    const size = SIZE_FACTOR[bedrooms] || 1
    const estHours = Math.max(2, size * 2)
    const travel = Math.max(0, distanceMiles) * mileRate
    const labor = estHours * moverHourly * Math.max(1, movers)

    const packingFlat = packing ? 60 : 0
    const boxes = packing ? BOX_ESTIMATE[bedrooms] : 0
    const boxesCost = packing ? boxes * 1.2 : 0

    const stairsCost = Math.max(0, stairsFlights) * 10
    const pianoCost = piano ? 80 : 0

    const isWeekend = date ? isWeekendDate(date) : false
    const weekendFee = isWeekend ? 0.1 : 0

    const subtotal = base + travel + labor + packingFlat + boxesCost + stairsCost + pianoCost
    const total = Math.round(subtotal * (1 + weekendFee))

    return {
      total,
      breakdown: {
        base,
        travel: round2(travel),
        labor: round2(labor),
        packing: round2(packingFlat + boxesCost),
        stairs: stairsCost,
        piano: pianoCost,
        weekend: isWeekend ? '10% applied' : '0%',
      },
    }
  }, [bedrooms, distanceMiles, movers, packing, stairsFlights, piano, date])

  // If someone comes from buttons that use #quote, ensure we are scrolled here
  useEffect(() => {
    if (window.location.hash === '#quote') {
      const el = document.getElementById('quote')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const tel = `tel:${phone.replace(/\s+/g, '')}`

  function handleBookClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    event.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = '#contact';
    }
  }

  return (
    <section id="quote" className="prices" aria-labelledby="prices-title">
      <div className="prices__inner">
        <h2 id="prices-title" className="prices__title">Instant quote</h2>
        <p className="prices__lead">Estimate your move in seconds. Then book or call.</p>

        <form className="prices__form" onSubmit={e => e.preventDefault()}>
          <div className="field">
            <label htmlFor="bedrooms">Property size</label>
            <select
              id="bedrooms"
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value as Bedrooms)}
            >
              <option>Studio</option>
              <option>1 bed</option>
              <option>2 bed</option>
              <option>3 bed</option>
              <option>4 bed</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="distance">Distance in miles</label>
            <input
              id="distance"
              type="number"
              min={1}
              step={1}
              value={Number.isFinite(distanceMiles) ? distanceMiles : 0}
              onChange={e => setDistanceMiles(parseFloatSafe(e.target.value, 0))}
              inputMode="numeric"
            />
          </div>

          <div className="field">
            <label htmlFor="movers">Number of movers</label>
            <input
              id="movers"
              type="number"
              min={1}
              max={2}
              step={1}
              value={Number.isFinite(movers) ? movers : 2}
              onChange={e => setMovers(parseIntSafe(e.target.value, 2))}
              inputMode="numeric"
            />
          </div>

          <div className="field checkbox">
            <label>
              <input
                type="checkbox"
                checked={packing}
                onChange={e => setPacking(e.target.checked)}
              />
              Packing service
            </label>
          </div>

          <div className="field">
            <label htmlFor="stairs">Stairs, flights total</label>
            <input
              id="stairs"
              type="number"
              min={0}
              max={12}
              step={1}
              value={Number.isFinite(stairsFlights) ? stairsFlights : 0}
              onChange={e => setStairsFlights(parseIntSafe(e.target.value, 0))}
              inputMode="numeric"
            />
          </div>

          <div className="field checkbox">
            <label>
              <input
                type="checkbox"
                checked={piano}
                onChange={e => setPiano(e.target.checked)}
              />
              Piano or extra large item
            </label>
          </div>

          <div className="field">
            <label htmlFor="date">Move date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <small className="hint">Weekend adds 10 percent</small>
          </div>
        </form>

        <div className="prices__result" role="status" aria-live="polite">
          <div className="total">
            <span className="total__label">Estimated total</span>
            <span className="total__value">£{formatGBP(quote.total)}</span>
          </div>

          <div className="breakdown">
            <div><span>Base</span><strong>£{formatGBP(quote.breakdown.base)}</strong></div>
            <div><span>Travel</span><strong>£{formatGBP(quote.breakdown.travel)}</strong></div>
            <div><span>Labor</span><strong>£{formatGBP(quote.breakdown.labor)}</strong></div>
            {packing ? <div><span>Packing</span><strong>£{formatGBP(quote.breakdown.packing)}</strong></div> : null}
            {stairsFlights > 0 ? <div><span>Stairs</span><strong>£{formatGBP(quote.breakdown.stairs)}</strong></div> : null}
            {piano ? <div><span>Piano</span><strong>£{formatGBP(quote.breakdown.piano)}</strong></div> : null}
            <div><span>Weekend</span><strong>{quote.breakdown.weekend}</strong></div>
          </div>

          <div className="actions">
            <a href="#contact" className="btn btn--primary" onClick={handleBookClick}>Book now</a> 
            <a href={tel} className="btn btn--ghost" aria-label={`Call ${phone}`}>Call {phone}</a>
          </div>

          <p className="prices__note">Price is an estimate. Final quote depends on exact inventory and access.</p>
        </div>
      </div>
    </section>
  )
}

function parseFloatSafe(v: string, fallback: number) {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : fallback
}

function parseIntSafe(v: string, fallback: number) {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : fallback
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function isWeekendDate(isoDate: string) {
  const d = new Date(isoDate + 'T00:00:00')
  const day = d.getDay()
  return day === 6 || day === 0
}

function formatGBP(n: number) {
  return n.toLocaleString('en-GB', { minimumFractionDigits: 0 })
}
