import { useEffect, useMemo, useState } from 'react'
import './AreasCovered.css'

type AreaKey = 'birmingham' | 'london' | 'outside'

type Props = {
  phone?: string
  defaultArea?: AreaKey
  maps?: Partial<Record<AreaKey, string>>
}

const MAPS_DEFAULT: Record<AreaKey, string> = {
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
  const [active, setActive] = useState<AreaKey>(defaultArea)

  useEffect(() => {
    const m = window.location.hash.match(/areas=(birmingham|london|outside)/i)
    if (m) setActive(m[1].toLowerCase() as AreaKey)
  }, [])

  const tel = `tel:${phone.replace(/\s+/g, '')}`

  return (
    <section id="areas" className="areas" aria-labelledby="areas-title">
      <div className="areas__inner">
        <h2 id="areas-title" className="areas__title">Areas covered</h2>
        <p className="areas__lead">Select a region. The map updates.</p>

        <div className="areas__grid">
          <div className="areas__list">
            <div role="tablist" aria-label="Regions">
              {active === 'birmingham' ? (
                <button
                  type="button"
                  id="tab-birmingham"
                  className="chip is-active"
                  role="tab"
                  aria-selected="true"
                  aria-controls="panel-birmingham"
                  tabIndex={0}
                  onClick={() => setActive('birmingham')}
                >
                  Birmingham and surroundings
                </button>
              ) : (
                <button
                  type="button"
                  id="tab-birmingham"
                  className="chip"
                  role="tab"
                  aria-controls="panel-birmingham"
                  tabIndex={-1}
                  onClick={() => setActive('birmingham')}
                >
                  Birmingham and surroundings
                </button>
              )}

              {active === 'london' ? (
                <button
                  type="button"
                  id="tab-london"
                  className="chip is-active"
                  role="tab"
                  aria-selected="true"
                  aria-controls="panel-london"
                  tabIndex={0}
                  onClick={() => setActive('london')}
                >
                  London and surroundings
                </button>
              ) : (
                <button
                  type="button"
                  id="tab-london"
                  className="chip"
                  role="tab"
                  aria-controls="panel-london"
                  tabIndex={-1}
                  onClick={() => setActive('london')}
                >
                  London and surroundings
                </button>
              )}

              {active === 'outside' ? (
                <button
                  type="button"
                  id="tab-outside"
                  className="chip is-active"
                  role="tab"
                  aria-selected="true"
                  aria-controls="panel-outside"
                  tabIndex={0}
                  onClick={() => setActive('outside')}
                >
                  Outside these areas
                </button>
              ) : (
                <button
                  type="button"
                  id="tab-outside"
                  className="chip"
                  role="tab"
                  aria-controls="panel-outside"
                  tabIndex={-1}
                  onClick={() => setActive('outside')}
                >
                  Outside these areas
                </button>
              )}
            </div>

            <div className="areas__cta">
              <a href="#quote" className="btn btn--primary">Get a Quote</a>
              <a href={tel} className="btn btn--ghost">Call {phone}</a>
            </div>

            <p className="areas__hint">
              For a precise polygon, create a Google My Maps with your service zone. Paste its embed URL into the props.
            </p>
          </div>

          <div className="areas__map" style={{ minHeight: 420 }}>
            <div
              id="panel-birmingham"
              role="tabpanel"
              aria-labelledby="tab-birmingham"
              hidden={active !== 'birmingham'}
              style={{ display: active === 'birmingham' ? 'block' : 'none' }}
            >
              <iframe
                title="Map for Birmingham"
                src={mapSrcById.birmingham}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ width: '100%', height: '100%', minHeight: 420, border: 0 }}
              />
              <div className="map__label">Birmingham region</div>
            </div>

            <div
              id="panel-london"
              role="tabpanel"
              aria-labelledby="tab-london"
              hidden={active !== 'london'}
              style={{ display: active === 'london' ? 'block' : 'none' }}
            >
              <iframe
                title="Map for London"
                src={mapSrcById.london}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ width: '100%', height: '100%', minHeight: 420, border: 0 }}
              />
              <div className="map__label">London region</div>
            </div>

            <div
              id="panel-outside"
              role="tabpanel"
              aria-labelledby="tab-outside"
              hidden={active !== 'outside'}
              style={{ display: active === 'outside' ? 'block' : 'none' }}
            >
              <iframe
                title="Map for outside regions"
                src={mapSrcById.outside}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ width: '100%', height: '100%', minHeight: 420, border: 0 }}
              />
              <div className="map__label">Jobs outside these regions are available. Travel fee applies.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
