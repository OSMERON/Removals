import { useEffect, useState } from 'react'
import './Gallery.css'

type GalleryItem = {
  id: string
  src: string
  caption: string
  date: string
}

const LS_ITEMS = 'gallery_items'
const OWNER_KEY = 'owner_auth'

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isOwner, setIsOwner] = useState(localStorage.getItem(OWNER_KEY) === '1')

  // composer
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [caption, setCaption] = useState<string>('')

  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  // viewer
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [savedScroll, setSavedScroll] = useState<number>(0)

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_ITEMS)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // persist
  useEffect(() => {
    try { localStorage.setItem(LS_ITEMS, JSON.stringify(items)) } catch {}
  }, [items])

  // sync owner login from Reviews
  useEffect(() => {
    const sync = () => setIsOwner(localStorage.getItem(OWNER_KEY) === '1')
    const onStorage = (e: StorageEvent) => {
      if (e.key === OWNER_KEY) sync()
      if (e.key === LS_ITEMS && e.newValue) {
        try { setItems(JSON.parse(e.newValue)) } catch {}
      }
    }
    const t = setInterval(sync, 600)
    window.addEventListener('storage', onStorage)
    return () => {
      clearInterval(t)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // lock scroll when modal open, restore on close
  useEffect(() => {
    if (selected) {
      const y = window.scrollY
      setSavedScroll(y)
      document.body.style.position = 'fixed'
      document.body.style.top = `-${y}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      const y = savedScroll
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (y) window.scrollTo(0, y)
    }
  }, [selected, savedScroll])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function onPick(f: File | null) {
    setErr(null)
    setMsg(null)
    setFile(f)
    if (!f) {
      setPreview('')
      return
    }
    if (!f.type.startsWith('image/')) {
      setErr('Choose an image file')
      setFile(null)
      setPreview('')
      return
    }
    try {
      const dataUrl = await fileToDataUrl(f)
      setPreview(dataUrl)
    } catch {
      setErr('Failed to read file')
      setPreview('')
    }
  }

  function clearComposer() {
    setFile(null)
    setPreview('')
    setCaption('')
    setMsg(null)
    setErr(null)
  }

  function addItem() {
    setMsg(null)
    setErr(null)
    if (!isOwner) return
    if (!preview) { setErr('Pick an image'); return }
    if (!caption.trim()) { setErr('Add a caption'); return }

    const item: GalleryItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      src: preview,
      caption: sanitize(caption).slice(0, 120),
      date: new Date().toISOString().slice(0, 10)
    }
    setItems(prev => [item, ...prev])
    clearComposer()
    setMsg('Photo added')
  }

  function deleteItem(id: string) {
    if (!isOwner) return
    setItems(prev => prev.filter(x => x.id !== id))
  }

  function openViewer(item: GalleryItem) {
    setSelected(item)
  }

  function closeViewer() {
    setSelected(null)
  }

  return (
    <section id="gallery" className="gallery" aria-labelledby="gallery-title">
      <div className="gallery__inner">
        <h2 id="gallery-title" className="gallery__title">Gallery</h2>
        <p className="gallery__lead">Photos from our moves</p>

        <div className="gallery__grid">
          {isOwner && (
            <article className="gcard gcard--composer" aria-labelledby="composer-title">
              <header className="gcard__head">
                <div className="thumb thumb--placeholder" aria-hidden="true">+</div>
                <div className="meta">
                  <h3 id="composer-title" className="gcard__title">Add photo</h3>
                  <div className="gcard__sub">Owner only</div>
                </div>
              </header>

              <div className="composer">
                <label className="file">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => onPick(e.target.files?.[0] || null)}
                    aria-label="Pick an image"
                  />
                  <span>{file ? file.name : 'Choose image'}</span>
                </label>

                {preview ? (
                  <div className="preview"><img src={preview} alt="Selected preview" /></div>
                ) : (
                  <div className="preview preview--empty" aria-hidden="true">No image</div>
                )}

                <input
                  type="text"
                  className="caption"
                  placeholder="Caption"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  aria-label="Caption"
                />

                <div className="composer__actions">
                  <button type="button" className="btn btn--primary" onClick={addItem}>Upload</button>
                  <button type="button" className="btn btn--danger" onClick={clearComposer}>Delete</button>
                </div>

                {err ? <p className="msg msg--err" role="alert">{err}</p> : null}
                {msg ? <p className="msg" role="status" aria-live="polite">{msg}</p> : null}
              </div>
            </article>
          )}

          {items.map(it => (
            <figure
              key={it.id}
              className="gcard gcard--image"
              aria-labelledby={`cap-${it.id}`}
              onClick={() => openViewer(it)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') openViewer(it) }}
            >
              <div className="gcard__media">
                <img src={it.src} alt={it.caption || 'Gallery image'} loading="lazy" />
              </div>
              <figcaption id={`cap-${it.id}`} className="gcard__cap">
                <span className="gcard__captext">{it.caption}</span>
                <span className="gcard__date">{formatDate(it.date)}</span>
              </figcaption>

              {isOwner ? (
                <div className="gcard__actions">
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={e => { e.stopPropagation(); deleteItem(it.id) }}
                    aria-label="Delete photo"
                  >
                    tanks
                  </button>
                </div>
              ) : null}
            </figure>
          ))}
        </div>
      </div>

      {selected ? (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeViewer}
        >
          <div className="modal__content" onClick={e => e.stopPropagation()}>
            <img src={selected.src} alt={selected.caption || 'Image'} />
            <div className="modal__cap">
              <span className="modal__text">{selected.caption}</span>
              <span className="modal__date">{formatDate(selected.date)}</span>
            </div>
            <button type="button" className="modal__close" onClick={closeViewer} aria-label="Close">×</button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatDate(iso: string) {
  const d = new Date(iso + (iso.endsWith('Z') ? '' : 'T00:00:00'))
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

function sanitize(s: string) {
  return s.replace(/[<>]/g, '')
}
