import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Eye, Hand, KeyRound, Leaf, X } from 'lucide-react'
import { Isobars, Wordmark } from './Graphics'
import { LeafCluster } from './Leaves'
import { CTA_LEAVES, PRIVACY_LEAVES } from './leafPresets'
import { NAV } from './Header'

const PRINCIPLES = [
  { icon: Eye, title: 'You Choose What to Share', text: 'Review and edit any session summary before deciding whether to share it.' },
  {
    icon: KeyRound,
    title: 'Access Is Not Automatic',
    text: 'A psychologist should only receive information that you have explicitly agreed to share under clear access settings.',
  },
  { icon: Leaf, title: 'AI Is Not a Diagnosis', text: 'The journal supports reflection and preparation. It does not replace a qualified professional.' },
  { icon: Hand, title: 'Participation Is Optional', text: 'You can use the journal when it feels helpful, without mandatory daily reports.' },
]

export function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="relative overflow-hidden bg-mint py-24 md:py-32">
      <Isobars className="pointer-events-none absolute -bottom-72 -right-48 h-[700px] w-[940px] text-sage/60" />
      <LeafCluster options={PRIVACY_LEAVES} viewBox="0 0 640 620" className="absolute -bottom-6 -left-16 hidden h-[360px] w-[380px] md:block" />
      <div className="wrap relative">
        <div className="max-w-3xl">
          <p className="eyebrow text-moss">Privacy and AI boundaries</p>
          <h2 id="privacy-title" className="display mt-5 text-[2.5rem] text-forest md:text-6xl">
            Your reflections should remain <em className="italic text-moss">yours</em> to manage.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-ink/75">
            Personal notes are a sensitive part of psychological work. You should understand what is saved, who can
            access it, and what you choose to share.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="border-t border-forest/20 pt-6">
              <Icon size={22} className="text-moss" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-[1.6rem] leading-tight text-forest">{title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-16 max-w-3xl rounded-[22px] bg-white/70 p-6 text-sm leading-relaxed text-ink/80 ring-1 ring-forest/10">
          <strong className="font-semibold text-forest">A note on this website.</strong> This is a conceptual demonstration.
          Actual data storage, retention, deletion, security, and third-party processing policies must be implemented and
          disclosed before a real launch.
        </p>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" className="on-dark relative overflow-hidden bg-forest py-28 text-ivory md:py-40">
      <div className="pointer-events-none absolute right-[18%] top-[14%] h-40 w-40 rounded-full bg-sage/30 blur-2xl" aria-hidden="true" />
      <LeafCluster options={CTA_LEAVES} viewBox="0 0 680 820" className="absolute -bottom-4 -right-40 h-[620px] w-[520px] sm:-right-24 md:h-[760px] md:w-[640px]" />
      <div className="wrap relative">
        <div className="max-w-3xl">
          <h2 id="cta-title" className="display text-[2.7rem] sm:text-6xl lg:text-[5rem]">
            You do not have to understand <em className="italic text-sage">everything</em> at once.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/80">
            Sometimes it is enough to notice what is happening inside. You can explore the rest gradually, at your own
            pace, with the support that feels right for you.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#weather" className="btn btn-light">
              Explore the Experience <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a href="#journal" className="btn btn-outline-light">
              Try the AI Journal
            </a>
          </div>
          <p className="mt-10 text-sm text-sage">No pressure. No perfect answers. Just room to reflect.</p>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <footer className="bg-ivory pb-10 pt-20" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}>
      <div className="wrap">
        <div className="grid gap-12 border-b border-forest/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-xs font-serif text-2xl leading-snug text-forest">
              A space for a more thoughtful relationship with yourself.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow text-muted">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-underline text-ink/80 hover:text-forest">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-muted">About this concept</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#approach" className="link-underline text-ink/80 hover:text-forest">
                  The product concept
                </a>
              </li>
              <li>
                <a href="#methods" className="link-underline text-ink/80 hover:text-forest">
                  Psychological approaches
                </a>
              </li>
              <li>
                <a href="#privacy" className="link-underline text-ink/80 hover:text-forest">
                  Privacy and AI boundaries
                </a>
              </li>
              <li>
                <button
                  ref={btnRef}
                  type="button"
                  className="link-underline text-left text-ink/80 hover:text-forest"
                  onClick={() => setPrivacyOpen(true)}
                >
                  Conceptual privacy notice
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 pt-8 text-sm leading-relaxed text-muted md:grid-cols-[1.4fr_1fr]">
          <p>
            The Inner Weather AI journal is a reflection tool. It does not replace professional psychological support,
            diagnosis, or treatment, and it cannot help in an emergency. If you are in crisis or feel unsafe, please
            contact your local emergency services.
          </p>
          <p className="md:text-right">Inner Weather is a design concept. All conversations and data shown are fictional.</p>
        </div>
      </div>

      {privacyOpen && (
        <PrivacyNotice
          onClose={() => {
            setPrivacyOpen(false)
            requestAnimationFrame(() => btnRef.current?.focus())
          }}
        />
      )}
    </footer>
  )
}

function PrivacyNotice({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-forest/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-notice-title"
        className="anim-rise relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-ivory p-7 shadow-2xl sm:rounded-[28px] md:p-10"
        style={{ paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-mint"
          aria-label="Close privacy notice"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <p className="eyebrow text-moss">Conceptual privacy notice</p>
        <h2 id="privacy-notice-title" className="display mt-4 text-4xl text-forest">
          What this demo does with your words
        </h2>
        <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-ink/80">
          <p>
            <strong className="text-forest">This page.</strong> Anything you type into the weather selector, the AI journal,
            or the session summary stays in your browser’s memory while the page is open. It is not sent to a server, not
            processed by an AI service, and not written to browser storage. Reloading the page clears it.
          </p>
          <p>
            <strong className="text-forest">The conversation.</strong> The AI journal on this page is a scripted
            demonstration. There is no live AI and no connection to any messaging app.
          </p>
          <p>
            <strong className="text-forest">A real product.</strong> Before launch, a real Inner Weather service would need
            to define and publish how data is stored, how long it is kept, how it can be deleted, how it is protected, and
            which third parties — if any — process it. Sharing with a psychologist would require your explicit
            permission, with separate permission for original journal entries.
          </p>
        </div>
        <button type="button" className="btn btn-primary mt-8" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
