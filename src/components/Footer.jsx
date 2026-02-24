export default function Footer() {
  return (
    <footer className="relative z-10 py-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2 text-sm text-slate-400">
        <span>Made by</span>
        <a
          href="https://github.com/durvesh7k"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 transition-colors duration-200 font-semibold hover:underline"
        >
          Durvesh
        </a>
        <span>with</span>
        <span className="text-red-500 animate-pulse">❤</span>
      </div>
    </footer>
  )
}
