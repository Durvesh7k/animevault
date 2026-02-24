export default function Navbar({ search, onSearchChange }) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 h-16
                    bg-[#07070f]/80 backdrop-blur-2xl border-b border-white/[0.06]">
      {/* Brand */}
      <div className="flex flex-col">
        <span className="font-display font-black text-lg tracking-widest text-gradient-brand">
          ANIMEVAULT
        </span>
        <span className="text-[0.6rem] text-slate-600 uppercase tracking-[0.15em] font-light">
          My Collection
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08]
                      rounded-full px-3 py-2 transition-all duration-200
                      focus-within:border-violet-500/50 focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]
                      sm:px-4">
        <span className="text-slate-500 text-lg leading-none">⌕</span>
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="bg-transparent border-none outline-none text-slate-200 text-xs sm:text-sm
                     placeholder:text-slate-600 w-24 sm:w-40 md:w-52 font-sans"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="text-slate-500 hover:text-slate-300 transition-colors text-lg leading-none"
          >×</button>
        )}
      </div>
    </nav>
  )
}
