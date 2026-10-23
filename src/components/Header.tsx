import { useEffect, useRef, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Wordmark } from './Graphics'

export const NAV = [
  { label: 'Our Approach', href: '#approach' },
  { label: 'AI Journal', href: '#journal' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Psychological Methods', href: '#methods' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)
  const solid = scrolled || open

  return (
    <header
      className={`sticky z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? 'border-b border-forest/10 bg-ivory/95 backdrop-blur-md'
          : 'on-dark border-b border-ivory/10 bg-transparent'
      }`}
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <a href="#main" className="sr-only-focusable btn btn-primary btn-sm absolute left-4 top-3 z-50">
        Skip to content
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <a href="#top" aria-label="Inner Weather, back to top" className="shrink-0 rounded-md" onClick={close}>
          <Wordmark light={!solid} />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className={`link-underline text-[0.92rem] font-medium transition-colors ${solid ? 'text-ink/80 hover:text-forest' : 'text-ivory/85 hover:text-ivory'}`}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href="#weather" className={`btn btn-sm hidden sm:inline-flex ${solid ? 'btn-primary' : 'btn-light'}`}>
            Explore the Experience
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${solid ? 'border-forest/15 text-forest hover:bg-mint' : 'border-ivory/30 text-ivory hover:bg-ivory/10'}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="lg:hidden">
        <nav aria-label="Mobile" className="wrap pb-6 pt-2">
          <ul className="flex flex-col divide-y divide-forest/10 border-t border-forest/10">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={close}
                  className="flex items-center justify-between py-4 font-serif text-2xl text-forest"
                >
                  {n.label}
                  <ArrowRight size={18} className="text-sage" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <a href="#weather" onClick={close} className="btn btn-primary mt-5 w-full">
            Explore the Experience
          </a>
        </nav>
      </div>
    </header>
  )
}
