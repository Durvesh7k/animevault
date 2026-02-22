import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabase'

// ── HELPERS ───────────────────────────────────────────────────

function Label({ children }) {
  return (
    <label className="block text-[0.7rem] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
      {children}
    </label>
  )
}

/** Upload a File object to Supabase Storage, return public URL */
async function uploadToStorage(file, folder = 'posters') {
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('anime-poster')
    .upload(filename, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data } = supabase.storage.from('anime-poster').getPublicUrl(filename)
  return data.publicUrl
}

/** Fetch a remote image URL and upload it to Supabase Storage, return public URL */
// NEW - replace with this

// ── ADD MANUALLY ─────────────────────────────────────────────
function AddManually({ addAnime }) {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', description: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast('Please select an image file', 'error'); return }
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5MB', 'error'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast('Anime name is required!', 'error'); return }
    setSaving(true)
    try {
      let posterUrl = ''
      if (imageFile) {
        setUploadProgress('Uploading image…')
        posterUrl = await uploadToStorage(imageFile)
      }
      setUploadProgress('Saving to database…')
      await addAnime({
        name: form.name.trim(),
        poster: posterUrl,
        description: form.description.trim(),
      })
      toast(`"${form.name.trim()}" saved! ✨`)
      setForm({ name: '', description: '' })
      clearImage()
    } catch (err) {
      toast(`Failed: ${err.message}`, 'error')
    }
    setSaving(false)
    setUploadProgress('')
  }

  return (
    <section>
      <h2 className="font-display font-bold text-2xl grad-text-accent mb-1">Add Anime Manually</h2>
      <p className="text-slate-600 text-sm mb-7 font-light">
        Upload a poster image — it's stored in Supabase Storage
      </p>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 max-w-lg flex flex-col gap-5">

        {/* Name */}
        <div>
          <Label>Anime Name *</Label>
          <input type="text" placeholder="e.g. Attack on Titan"
            value={form.name} onChange={e => set('name', e.target.value)}
            className="form-input" />
        </div>

        {/* Image upload */}
        <div>
          <Label>Poster Image</Label>
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-36
                              border-2 border-dashed border-white/[0.12] rounded-xl
                              cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5
                              transition-all duration-200 group">
              <span className="text-3xl mb-2">🖼️</span>
              <span className="text-xs text-slate-500 group-hover:text-slate-400">
                Click to upload image
              </span>
              <span className="text-[0.65rem] text-slate-700 mt-1">PNG, JPG, WEBP — max 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="relative w-32 rounded-xl overflow-hidden border border-white/[0.08] group">
              <img src={imagePreview} alt="Preview" className="w-full block" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white
                           text-xs flex items-center justify-center opacity-0 group-hover:opacity-100
                           transition-opacity hover:bg-red-500/80"
              >×</button>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <textarea placeholder="Brief description of the anime..." rows={4}
            value={form.description} onChange={e => set('description', e.target.value)}
            className="form-input resize-y min-h-[90px] leading-relaxed" />
        </div>

        <button type="submit" disabled={saving} className="btn-grad py-3 rounded-xl text-sm">
          {saving ? (uploadProgress || 'Saving…') : '+ Add to Collection'}
        </button>
      </form>
    </section>
  )
}

// ── ADD VIA JIKAN API ─────────────────────────────────────────
function AddViaAPI({ addAnime, hasAnime }) {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [addedIds, setAddedIds] = useState(new Set())

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true); setResults([])
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24`)
      const data = await res.json()
      setResults(data.data || [])
      if (!data.data?.length) toast('No results found', 'error')
    } catch (err) {
      toast(`Jikan API error: ${err.message}`, 'error')
    }
    setLoading(false)
  }

  const handleAdd = async (anime) => {
    const title = anime.title
    if (hasAnime(title)) { toast('Already in collection!', 'error'); return }

    setSavingId(anime.mal_id)
    try {
      const posterUrl =
        anime.images?.jpg?.large_image_url ||
        anime.images?.jpg?.image_url ||
        ''

      await addAnime({ name: title, poster: posterUrl, description: anime.synopsis || '' })
      setAddedIds(prev => new Set([...prev, anime.mal_id]))
      toast(`"${title}" added! 🎌`)
    } catch (err) {
      toast(`Failed: ${err.message}`, 'error')
      console.error('[handleAdd]', err)
    } finally {
      setSavingId(null)
    }
  }

  const isAdded = (anime) => addedIds.has(anime.mal_id) || hasAnime(anime.title)

  return (
    <section>
      <h2 className="font-display font-bold text-2xl grad-text-accent mb-1">Add via Jikan API</h2>
      <p className="text-slate-600 text-sm mb-7 font-light">
        Search and add anime directly from the Jikan API
      </p>


      <form className="flex gap-3 mb-7" onSubmit={handleSearch}>
        <input type="text"
          placeholder="Search anime (e.g. Naruto, Demon Slayer...)"
          value={query} onChange={e => setQuery(e.target.value)}
          className="form-input flex-1" />
        <button type="submit" disabled={loading}
          className="px-5 py-3 rounded-xl font-semibold text-sm text-white whitespace-nowrap
                     transition-all duration-200 disabled:opacity-50 hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }}>
          {loading ? 'Searching…' : '🔍 Search'}
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-11 h-11 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(anime => (
            <div key={anime.mal_id}
              className="glass rounded-2xl overflow-hidden transition-all duration-200
                            hover:border-violet-500/35 hover:-translate-y-1">
              <div className="relative h-44">
                <img src={anime.images?.jpg?.image_url} alt={anime.title}
                  loading="lazy" className="w-full h-full object-cover" />
                {anime.score && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[0.65rem]
                                   font-bold text-yellow-300 bg-black/70 border border-white/10 backdrop-blur">
                    ⭐ {anime.score}
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col gap-2">
                <h4 className="text-xs font-bold leading-snug text-slate-200">{anime.title}</h4>
                {anime.title_english && anime.title_english !== anime.title && (
                  <span className="text-[0.65rem] text-slate-600">{anime.title_english}</span>
                )}
                <p className="text-[0.7rem] text-slate-500 leading-relaxed line-clamp-2">
                  {anime.synopsis || 'No description.'}
                </p>

                <button
                  onClick={() => handleAdd(anime)}
                  disabled={isAdded(anime) || savingId === anime.mal_id}
                  className={`w-full py-1.5 rounded-lg text-[0.75rem] font-semibold transition-all duration-200
                    ${isAdded(anime)
                      ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 cursor-default'
                      : 'bg-violet-500/15 border border-violet-500/35 text-violet-300 hover:bg-violet-500/30'}`}
                >
                  {savingId === anime.mal_id
                    ? '⬆ Uploading…'
                    : isAdded(anime) ? '✓ Added' : '+ Add'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ── ADMIN LAYOUT ──────────────────────────────────────────────
export default function Admin({ addAnime, hasAnime, animeCount }) {
  const { logout, session } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('manual')

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const navItems = [
    { id: 'manual', icon: '✏️', label: 'Add Manually' },
    { id: 'api', icon: '🌐', label: 'Add via API' },
  ]

  const navBtnCls = (id) => `
    flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-left
    border transition-all duration-200 cursor-pointer
    ${tab === id
      ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
      : 'bg-transparent border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'}
  `

  return (
    <div className="relative min-h-screen bg-bg flex">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="mesh-blob-1" />
        <div className="mesh-blob-2" />
      </div>

      <aside className="relative z-10 w-60 shrink-0 glass border-r border-white/[0.07]
                        flex flex-col px-3 py-6 sticky top-0 h-screen">
        <div className="flex items-start gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }}>⚙️</div>
          <div>
            <div className="font-display font-bold text-sm text-slate-200">Admin Panel</div>
            <div className="text-[0.65rem] text-violet-400 mt-0.5 break-all">{session?.user?.email}</div>
            <div className="text-[0.65rem] text-slate-600">{animeCount} anime in DB</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <button key={item.id} className={navBtnCls(item.id)} onClick={() => setTab(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-1 pt-4 border-t border-white/[0.06]">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-medium
                             text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all">
            ← View Collection
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-medium
                             text-red-400 hover:bg-red-500/10 border border-transparent
                             hover:border-red-500/20 transition-all">
            ↩ Logout
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 p-8 overflow-y-auto animate-fade-up">
        {tab === 'manual' && <AddManually addAnime={addAnime} />}
        {tab === 'api' && <AddViaAPI addAnime={addAnime} hasAnime={hasAnime} />}
      </main>
    </div>
  )
}