import { useEffect, useMemo, useState } from 'react'
import './AreasCovered.css'

type AreaId = 'birmingham' | 'london' | 'outside'

type Props = {
  phone?: string
  defaultArea?: AreaId
  // Optional, override map URLs if you have custom Google My Maps
  maps?: Partial<Record<AreaId, string>>
}

const MAPS_DEFAULT: Record<AreaId, string> = {
  birmingham: 'https://www.google.com/maps?q=Birmingham%2C+UK&output=embed',
  london: 'https://www.google.com/maps?q=London%2C+UK&output=embed',
  outside: 'https://www.google.com/maps?q=United+Kingdom&output=embed',
}

export default function AreasCovered({
  phone = '07888505983',
  defaultArea = 'birmingham',
  maps,
}: Props) {
  const mapSrcById = useMemo(() => ({ ...MAPS_DEFAULT, ...maps }), [maps])
  const [active, setActive] = useState<AreaId>(defaultArea)

  // Optional: pick area from URL like #areas=london
  useEffect(() => {
    const hash = window.location.hash
    const m = hash.match(/areas=(birmingham|london|outside)/i)
    if (m) setActive(m[1].toLowerCase() as AreaId)
  }, [])

  const tel = `tel:${phone.replace(/\s+/g, '')}`

  return (
    <section id="areas" className="areas" aria-labelledby="areas-title">
      <div className="areas__inner">
        <h2 id="areas-title" className="areas__title">Areas covered</h2>
        <p className="areas__lead">Select a region. The map updates.</p>

        <div className="areas__grid">
          <div className="areas__list" role="tablist" aria-label="Regions">
            <button
              type="button"
              className={`chip ${active === 'birmingham' ? 'is-active' : ''}`}
              role="tab"
              aria-selected={active === 'birmingham'}
              onClick={() => setActive('birmingham')}
            >
              Birmingham and surroundings
            </button>
            <button
              type="button"
              className={`chip ${active === 'london' ? 'is-active' : ''}`}
              role="tab"
              aria-selected={active === 'london'}
              onClick={() => setActive('london')}
            >
              London and surroundings
            </button>
            <button
              type="button"
              className={`chip ${active === 'outside' ? 'is-active' : ''}`}
              role="tab"
              aria-selected={active === 'outside'}
              onClick={() => setActive('outside')}
            >
              Outside these areas
            </button>

            <div className="areas__cta">
              <a href="#quote" className="btn btn--primary">Get a Quote</a>
              <a href={tel} className="btn btn--ghost">Call {phone}</a>
            </div>

            <p className="areas__hint">
              For a precise polygon, create a Google My Maps with your service zone. Paste its embed URL into the props.
            </p>
          </div>

          <div className="areas__map">
            <iframe
              key={active}
              title={`Map for ${active}`}
              src={mapSrcById[active]}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="map__label">
              {active === 'birmingham' && 'Birmingham region'}
              {active === 'london' && 'London region'}
              {active === 'outside' && 'Jobs outside these regions are available. Travel fee applies.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
