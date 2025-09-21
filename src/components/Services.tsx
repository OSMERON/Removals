import './Services.css'

type Props = {
  phone?: string
  onQuoteClick?: () => void
}

const SERVICES = [
  {
    id: 'house',
    title: 'House Removals',
    desc: 'Safe moves for flats and houses. Fast loading and careful unloading.',
    features: ['Protective blankets', 'Disassembly on request', 'Moves any day']
  },
  {
    id: 'office',
    title: 'Office Removals',
    desc: 'Minimal downtime. Labelled boxes and clear plan.',
    features: ['Evening or weekend', 'IT equipment care', 'Fully insured']
  },
  {
    id: 'packing',
    title: 'Packing Service',
    desc: 'We pack, you relax. Quality boxes and tape included.',
    features: ['Fragile items care', 'Full or partial pack', 'Unpack on arrival']
  },
  {
    id: 'manvan',
    title: 'Man and Van',
    desc: 'Small moves and single items. Flexible slots.',
    features: ['Quick booking', 'Local and nationwide', 'Pay per hour or fixed']
  },
  {
    id: 'assembly',
    title: 'Furniture Assembly',
    desc: 'Build and reassemble wardrobes, beds, and desks.',
    features: ['Bring tools', 'IKEA experts', 'Secure fittings']
  },
  {
    id: 'storage',
    title: 'Storage',
    desc: 'Short or long term storage with pickup and return.',
    features: ['Clean units', 'Tracked inventory', 'Weekly access']
  }
]

export default function Services({ phone = '07888505983', onQuoteClick }: Props) {
  const tel = `tel:${phone.replace(/\s+/g, '')}`

  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="services__inner">
        <h2 id="services-title" className="services__title">Services</h2>
        <p className="services__lead">Choose what you need. We do the rest.</p>

        <div className="services__grid">
          {SERVICES.map(s => (
            <article key={s.id} className="card" aria-labelledby={`${s.id}-title`}>
              <h3 id={`${s.id}-title`} className="card__title">{s.title}</h3>
              <p className="card__desc">{s.desc}</p>
              <ul className="card__list">
                {s.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>

              <div className="card__cta">
                <a
                  href="#quote"
                  className="btn btn--primary"
                  data-evt={`quote-${s.id}`}
                  onClick={onQuoteClick}
                >
                  Get a Quote
                </a>
                <a
                  href={tel}
                  className="btn btn--ghost"
                  data-evt={`call-${s.id}`}
                  aria-label={`Call ${phone} about ${s.title}`}
                >
                  Call {phone}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
