import { useEffect, useState, useMemo } from 'react'
import './Reviews.css'

type Props = {
  reviews?: Review[]
}

type Review = {
  id: string
  name?: string
  rating: number
  text: string
  date: string
  location: string
}

type Vote = 'up' | 'down' | null
type HelpfulState = Record<string, { up: number; down: number; myVote: Vote }>
type Reply = { id: string; name: string; message: string; owner: boolean; date: string }
type RepliesState = Record<string, Reply[]>

const OWNER_CODE = '7699'

const SEED: Review[] = [
  { id: 'r1', name: 'Daniel H.', rating: 5, text: 'Fast, careful, and on time. Furniture wrapped and no damage.', date: '2025-06-12', location: 'Croydon' },
  { id: 'r2', name: 'Sophie M.', rating: 5, text: 'Great packing service. Clear price and friendly team.', date: '2025-07-03', location: 'Bromley' },
  { id: 'r3', name: 'Imran K.', rating: 5, text: 'Short notice move done same day. Smooth from start to finish.', date: '2025-08-21', location: 'South London' }
]

export default function Reviews({ reviews = SEED }: Props) {
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())
  const allReviews = useMemo(() => [...reviews, ...userReviews].filter(r => !hiddenIds.has(r.id)), [reviews, userReviews, hiddenIds])

  const [helpful, setHelpful] = useState<HelpfulState>({})
  const [replies, setReplies] = useState<RepliesState>({})

  const [isOwner, setIsOwner] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  const [openReplyId, setOpenReplyId] = useState<string | null>(null)
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})

  // composer state
  const [newName, setNewName] = useState('')
  const [newRating, setNewRating] = useState<number>(5)
  const [newText, setNewText] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [postedMsg, setPostedMsg] = useState<string | null>(null)
  const [locError, setLocError] = useState(false)

  useEffect(() => {
    try {
      const u = localStorage.getItem('reviews_user')
      const h = localStorage.getItem('reviews_helpful')
      const r = localStorage.getItem('reviews_replies')
      const a = localStorage.getItem('owner_auth')
      const hid = localStorage.getItem('reviews_hidden')
      if (u) setUserReviews(JSON.parse(u))
      if (h) setHelpful(JSON.parse(h))
      if (r) setReplies(JSON.parse(r))
      if (hid) setHiddenIds(new Set(JSON.parse(hid)))
      setIsOwner(a === '1')
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('reviews_user', JSON.stringify(userReviews)) } catch {}
  }, [userReviews])

  useEffect(() => {
    try {
      localStorage.setItem('reviews_helpful', JSON.stringify(helpful))
      localStorage.setItem('reviews_replies', JSON.stringify(replies))
    } catch {}
  }, [helpful, replies])

  useEffect(() => {
    try { localStorage.setItem('reviews_hidden', JSON.stringify(Array.from(hiddenIds))) } catch {}
  }, [hiddenIds])

  useEffect(() => {
    setHelpful(prev => {
      const copy = { ...prev }
      for (const r of allReviews) if (!copy[r.id]) copy[r.id] = { up: 0, down: 0, myVote: null }
      return copy
    })
  }, [allReviews])

  function vote(id: string, v: Exclude<Vote, null>) {
    setHelpful(prev => {
      const cur = prev[id] ?? { up: 0, down: 0, myVote: null }
      let { up, down, myVote } = cur
      if (myVote === v) {
        if (v === 'up') up = Math.max(0, up - 1)
        else down = Math.max(0, down - 1)
        myVote = null
      } else {
        if (v === 'up') { up += 1; if (myVote === 'down') down = Math.max(0, down - 1) }
        else { down += 1; if (myVote === 'up') up = Math.max(0, up - 1) }
        myVote = v
      }
      return { ...prev, [id]: { up, down, myVote } }
    })
  }

  function loginOwner() {
    setAuthError(null)
    if (codeInput && codeInput === OWNER_CODE) {
      setIsOwner(true)
      localStorage.setItem('owner_auth', '1')
      setCodeInput('')
    } else {
      setAuthError('Wrong code')
    }
  }

  function logoutOwner() {
    setIsOwner(false)
    localStorage.removeItem('owner_auth')
    setOpenReplyId(null)
  }

  function openReply(id: string) {
    if (!isOwner) return
    setOpenReplyId(prev => (prev === id ? null : id))
  }

  function postReply(id: string) {
    if (!isOwner) return
    const msg = (replyDrafts[id] || '').trim()
    if (!msg) return
    const newReply: Reply = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: 'Owner',
      message: msg,
      owner: true,
      date: new Date().toISOString().slice(0, 10)
    }
    setReplies(prev => {
      const list = prev[id] ? [...prev[id], newReply] : [newReply]
      return { ...prev, [id]: list }
    })
    setReplyDrafts(prev => ({ ...prev, [id]: '' }))
    setOpenReplyId(null)
  }

  function deleteReview(id: string) {
    if (!isOwner) return
    const isUser = userReviews.some(x => x.id === id)
    if (isUser) {
      setUserReviews(prev => prev.filter(x => x.id !== id))
    } else {
      setHiddenIds(prev => new Set(prev).add(id))
    }
    setHelpful(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
    setReplies(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
    if (openReplyId === id) setOpenReplyId(null)
  }

  function submitNewReview() {
    setPostedMsg(null)
    setLocError(false)
    const name = newName.trim() || 'Anonymous'
    const text = newText.trim()
    const loc = newLocation.trim()
    if (loc.length < 2) {
      setLocError(true)
      setPostedMsg('Enter your location')
      return
    }
    if (text.length < 15) {
      setPostedMsg('Enter at least 15 characters')
      return
    }
    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    const rev: Review = {
      id,
      name: sanitize(name).slice(0, 60),
      rating: clamp(newRating, 1, 5),
      text: sanitize(text).slice(0, 800),
      date: new Date().toISOString().slice(0, 10),
      location: sanitize(loc).slice(0, 80)
    }
    setUserReviews(prev => [rev, ...prev])
    setNewName('')
    setNewRating(5)
    setNewText('')
    setNewLocation('')
    setPostedMsg('Thanks, your review has been added')
  }

  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <div className="reviews__inner">
        <h2 id="reviews-title" className="reviews__title">Reviews</h2>
        <p className="reviews__lead">Real feedback from customers</p>

        <div className="ownerbar" role="group" aria-label="Owner controls">
          {!isOwner ? (
            <>
              <input
                type="password"
                placeholder="Owner code"
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}
                aria-label="Owner code"
              />
              <button type="button" className="btn btn--primary" onClick={loginOwner}>
                Log in as owner
              </button>
              {authError ? <span className="ownerbar__err" role="status" aria-live="polite">{authError}</span> : null}
            </>
          ) : (
            <>
              <span className="ownerbar__ok">Owner mode</span>
              <button type="button" className="btn btn--ghost" onClick={logoutOwner}>
                Log out
              </button>
            </>
          )}
        </div>

        <div className="reviews__grid">
          <article className="review review--composer" aria-labelledby="composer-title">
            <header className="review__head">
              <div className="avatar" aria-hidden="true">You</div>
              <div className="meta">
                <h3 id="composer-title" className="review__name">Leave a review</h3>
                <div className="review__sub">Name and Location required</div>
              </div>
            </header>

            <div className="composer__row">
              <input
                type="text"
                placeholder="Your name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                aria-label="Your name"
              />
              <select
                aria-label="Rating"
                value={newRating}
                onChange={e => setNewRating(parseInt(e.target.value, 10))}
              >
                <option value={5}>★★★★★ 5</option>
                <option value={4}>★★★★☆ 4</option>
                <option value={3}>★★★☆☆ 3</option>
                <option value={2}>★★☆☆☆ 2</option>
                <option value={1}>★☆☆☆☆ 1</option>
              </select>
              <input
                type="text"
                placeholder="Your location"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                aria-label="Location"
                aria-invalid={locError}
                required
                className={locError ? 'is-invalid' : ''}
              />
            </div>

            <textarea
              placeholder="Write your experience"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              rows={4}
              aria-label="Review text"
            />

            <div className="composer__actions">
              <button type="button" className="btn btn--primary" onClick={submitNewReview}>Post review</button>
            </div>

            {postedMsg ? <p className="composer__msg" role="status" aria-live="polite">{postedMsg}</p> : null}
          </article>

          {allReviews.map(r => {
            const hv = helpful[r.id] ?? { up: 0, down: 0, myVote: null }
            const revReplies = replies[r.id] ?? []
            const isOpen = openReplyId === r.id
            return (
              <article key={r.id} className="review" aria-labelledby={`rev-${r.id}-title`}>
                <header className="review__head">
                  <div className="avatar" aria-hidden="true">{initials(r.name || 'Anonymous')}</div>
                  <div className="meta">
                    <h3 id={`rev-${r.id}-title`} className="review__name">{r.name || 'Anonymous'}</h3>
                    <div className="review__sub">
                      {renderStars(r.rating)}
                      <span className="dot">•</span>
                      <span>{formatDate(r.date)}</span>
                      <span className="dot">•</span>
                      <span>{r.location}</span>
                    </div>
                  </div>
                </header>

                <p className="review__text">{r.text}</p>

                <div className="review__actions" role="group" aria-label="Review actions">
                  <button
                    type="button"
                    className={`chip ${hv.myVote === 'up' ? 'is-active' : ''}`}
                    onClick={() => vote(r.id, 'up')}
                    aria-pressed={hv.myVote === 'up'}
                    aria-label="Helpful"
                  >
                    👍 Helpful <span className="count">{hv.up}</span>
                  </button>
                  <button
                    type="button"
                    className={`chip ${hv.myVote === 'down' ? 'is-active' : ''}`}
                    onClick={() => vote(r.id, 'down')}
                    aria-pressed={hv.myVote === 'down'}
                    aria-label="Not helpful"
                  >
                    👎 Not helpful <span className="count">{hv.down}</span>
                  </button>

                  {isOwner ? (
                    <button
                      type="button"
                      className="chip"
                      onClick={() => openReply(r.id)}
                      aria-expanded={isOpen}
                      aria-controls={`reply-${r.id}`}
                    >
                      💬 Reply
                    </button>
                  ) : null}
                </div>

                {revReplies.length > 0 ? (
                  <ul className="review__replies" aria-label="Replies">
                    {revReplies.map(rep => (
                      <li key={rep.id} className={`reply ${rep.owner ? 'reply--owner' : ''}`}>
                        <div className="reply__head">
                          <span className="reply__name">
                            {rep.name} {rep.owner ? <span className="badge">Owner</span> : null}
                          </span>
                          <span className="reply__date">{formatDate(rep.date)}</span>
                        </div>
                        <p className="reply__msg">{rep.message}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div
                  id={`reply-${r.id}`}
                  className={`replyform ${isOpen ? 'is-open' : ''}`}
                  hidden={!isOpen}
                  role="region"
                  aria-label="Reply form"
                >
                  <textarea
                    placeholder="Write a reply as Owner"
                    value={replyDrafts[r.id] ?? ''}
                    onChange={e => setReplyDrafts(prev => ({ ...prev, [r.id]: e.target.value }))}
                    rows={3}
                  />
                  <div className="replyform__actions">
                    <button type="button" className="btn btn--primary" onClick={() => postReply(r.id)}>
                      Post reply
                    </button>
                    {isOwner ? (
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => deleteReview(r.id)}
                        aria-label="Delete this review"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function initials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '')
  return letters.join('') || 'A'
}

function renderStars(n: number) {
  const items = []
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(n)
    items.push(
      <svg key={i} className={`star ${filled ? 'is-filled' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l3 6 6 .9-4.5 4.2 1.1 6.1L12 17l-5.6 3.2 1.1-6.1L3 9.9 9 9l3-6z" />
      </svg>
    )
  }
  return <span className="stars" aria-label={`${n} out of 5 stars`}>{items}</span>
}

function formatDate(iso: string) {
  const d = new Date(iso + (iso.endsWith('Z') ? '' : 'T00:00:00'))
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

function sanitize(s: string) {
  return s.replace(/[<>]/g, '')
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
