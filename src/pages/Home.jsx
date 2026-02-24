import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Navbar from '../components/Navbar'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'
import Footer from '../components/Footer'

export default function Home({ animeList, loading, error, removeAnime }) {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [search, setSearch]   = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage]       = useState(1)
  const [sort, setSort]       = useState('newest')

  const processed = useMemo(() => {
    let result = animeList.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'az') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'za') result = [...result].sort((a, b) => b.name.localeCompare(a.name))
    return result
  }, [animeList, search, sort])

  const totalPages = Math.ceil(processed.length / perPage)
  const paginated  = processed.slice((page - 1) * perPage, page * perPage)

  const handleSearch  = v => { setSearch(v); setPage(1) }
  const handlePerPage = v => { setPerPage(Number(v)); setPage(1) }
  const handleSort    = v => { setSort(v); setPage(1) }

  const handleDelete = async (id) => {
    try { await removeAnime(id); toast('Anime removed') }
    catch { toast('Failed to remove', 'error') }
  }

  return (
    <div className="relative min-h-screen bg-bg">
      {/* Mesh background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="mesh-blob-1" />
        <div className="mesh-blob-2" />
      </div>

      <div className="relative z-10">
        <Navbar search={search} onSearchChange={handleSearch} />

        {/* Hero header */}
        <header className="text-center px-6 pt-16 pb-8">
          <h1 className="font-display font-black text-5xl md:text-6xl leading-tight mb-3 grad-text">
            My Anime Collection
          </h1>
          <p className="text-slate-500 text-base font-light tracking-wide">
            A curated vault of handpicked masterpieces
          </p>
        </header>

        {/* Controls bar */}
        <div className="flex items-center justify-between px-6 pb-4 gap-4 flex-wrap">
          <p className="text-xs text-slate-500">
            {loading ? 'Loading…' : (
              <>
                Showing{' '}
                <span className="text-violet-400 font-semibold">{paginated.length}</span>
                {' '}of{' '}
                <span className="text-violet-400 font-semibold">{processed.length}</span>
                {' '}anime
                {search && <span className="text-slate-500 italic"> for "{search}"</span>}
              </>
            )}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <select className="text-xs sm:text-sm" value={sort} onChange={e => handleSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
            <select className="text-xs sm:text-sm" value={perPage} onChange={e => handlePerPage(e.target.value)}>
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mb-4 px-4 py-3 rounded-xl text-sm
                          bg-red-500/10 border border-red-500/30 text-red-300">
            ⚠ Database error: {error}
          </div>
        )}

        {/* Grid */}
        <div className="px-6 pb-4 animate-fade-up">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-11 h-11 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-28">
              <span className="text-7xl block mb-4 animate-float">{search ? '🔍' : '🌸'}</span>
              <h3 className="text-slate-500 text-xl font-semibold mb-2">
                {search ? `No results for "${search}"` : 'Your collection is empty'}
              </h3>
              <p className="text-slate-600 text-sm font-light">
                {search ? 'Try a different search term' : 'Visit /admin-login to start adding anime'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map(anime => (
                <AnimeCard key={anime.id} anime={anime} isAdmin={isAdmin} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        <Pagination current={page} total={totalPages} onPage={setPage} />
      </div>
      <Footer />
    </div>
  )
}
