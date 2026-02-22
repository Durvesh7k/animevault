export default function Pagination({ current, total, onPage }) {
  if (total <= 1) return null

  const getPages = () => {
    let start = Math.max(1, current - 2)
    let end   = Math.min(total, current + 2)
    if (current <= 3) end = Math.min(total, 5)
    if (current >= total - 2) start = Math.max(1, total - 4)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return { pages, start, end }
  }

  const { pages, start, end } = getPages()

  const btnBase = `min-w-[40px] h-10 px-2 flex items-center justify-center rounded-xl text-sm font-medium
                   border border-white/[0.08] bg-white/[0.04] text-slate-400
                   transition-all duration-200 cursor-pointer
                   hover:border-violet-500/40 hover:bg-violet-500/15 hover:text-violet-300
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/[0.08]
                   disabled:hover:bg-white/[0.04] disabled:hover:text-slate-400`

  const activeCls = `!bg-gradient-to-br !from-violet-600 !to-violet-900 !border-transparent
                     !text-white font-bold shadow-glow`

  return (
    <nav className="flex items-center justify-center gap-1.5 py-10 flex-wrap">
      <button className={btnBase} onClick={() => onPage(1)}          disabled={current === 1}>«</button>
      <button className={btnBase} onClick={() => onPage(current - 1)} disabled={current === 1}>‹</button>

      {start > 1 && <>
        <button className={btnBase} onClick={() => onPage(1)}>1</button>
        {start > 2 && <span className="text-slate-600 px-1">…</span>}
      </>}

      {pages.map(p => (
        <button key={p} className={`${btnBase} ${p === current ? activeCls : ''}`} onClick={() => onPage(p)}>
          {p}
        </button>
      ))}

      {end < total && <>
        {end < total - 1 && <span className="text-slate-600 px-1">…</span>}
        <button className={btnBase} onClick={() => onPage(total)}>{total}</button>
      </>}

      <button className={btnBase} onClick={() => onPage(current + 1)} disabled={current === total}>›</button>
      <button className={btnBase} onClick={() => onPage(total)}       disabled={current === total}>»</button>
    </nav>
  )
}
