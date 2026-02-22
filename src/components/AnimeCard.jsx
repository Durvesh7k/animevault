export default function AnimeCard({ anime, isAdmin, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Remove "${anime.name}" from your collection?`)) {
      onDelete(anime.id)
    }
  }

  return (
    <article className="group relative h-[380px] rounded-2xl overflow-hidden cursor-pointer
                        border border-white/[0.07] bg-white/[0.03]
                        transition-all duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-[1.05] hover:-translate-y-1.5
                        hover:shadow-card hover:border-violet-500/40">

      {/* Poster image */}
      {anime.poster ? (
        <img
          src={anime.poster}
          alt={anime.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[380ms] group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-6xl"
             style={{ background: 'linear-gradient(135deg,#1e1b4b,#0c1a2e)' }}>
          🎌
        </div>
      )}

      {/* Always-visible bottom gradient + title */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 transition-opacity duration-300 group-hover:opacity-0"
           style={{ background: 'linear-gradient(to top, rgba(7,7,15,0.97) 0%, rgba(7,7,15,0.55) 45%, transparent 100%)' }}>
        <span className="inline-block mb-1.5 w-fit px-2 py-0.5 rounded-md text-[0.6rem] font-bold
                         uppercase tracking-widest text-violet-300
                         bg-violet-500/20 border border-violet-500/40">
          Anime
        </span>
        <h3 className="text-sm font-bold leading-snug text-slate-100 drop-shadow-lg">{anime.name}</h3>
      </div>

      {/* Hover description overlay */}
      <div className="absolute inset-0 flex flex-col justify-center p-6
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(8,145,178,0.12))',
                    backdropFilter: 'blur(6px)' }}>
        <h3 className="font-display font-bold text-base mb-3 leading-snug grad-text-accent">
          {anime.name}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-6">
          {anime.description || 'No description available for this anime.'}
        </p>
        {isAdmin && (
          <button
            onClick={handleDelete}
            className="mt-4 w-fit px-3 py-1.5 rounded-lg text-xs font-semibold
                       bg-red-500/15 border border-red-500/30 text-red-300
                       hover:bg-red-500/30 transition-colors duration-200"
          >
            🗑 Remove
          </button>
        )}
      </div>
    </article>
  )
}
