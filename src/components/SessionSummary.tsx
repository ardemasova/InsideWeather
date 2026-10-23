import { useEffect, useRef, useState } from 'react'
import { ChevronDown, FileText, Lock, ShieldCheck, X } from 'lucide-react'

const DEFAULT_SUMMARY =
  'Over the past week, I noticed several moments when I agreed to additional work despite feeling that I did not have the capacity. I would like to explore the fear of disappointing others and how it affects my ability to set boundaries.'

type PanelState = 'review' | 'editing' | 'confirmed'

export function SessionSummary() {
  const [expanded, setExpanded] = useState(true)
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)
  const [toast, setToast] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 6000)
    return () => window.clearTimeout(t)
  }, [toast])

  const closeDrawer = (message?: string) => {
    setOpen(false)
    if (message) setToast(message)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <div className="mt-20 overflow-hidden rounded-[30px] bg-mint">
      <h3 className="m-0">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left md:px-10 md:py-8"
          aria-expanded={expanded}
          aria-controls="summary-preview"
          onClick={() => setExpanded((e) => !e)}
        >
          <span>
            <span className="eyebrow block text-moss">Session preparation · demo</span>
            <span className="mt-2 block font-serif text-3xl text-forest md:text-[2.4rem]">
              What this could look like before a session
            </span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-forest">
            <ChevronDown size={20} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          </span>
        </button>
      </h3>

      <div id="summary-preview" hidden={!expanded} className="px-6 pb-8 md:px-10 md:pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-[24px] bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-serif text-2xl text-forest">Your last 7 days</p>
              <p className="eyebrow text-[0.62rem] text-muted">Fictional sample data</p>
            </div>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="border-t border-forest/10 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Journal entries</dt>
                <dd className="mt-1 font-serif text-5xl leading-none text-forest [font-variant-numeric:tabular-nums]">4</dd>
              </div>
              <div className="border-t border-forest/10 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Topic to explore</dt>
                <dd className="mt-2 font-serif text-2xl leading-tight text-forest">Personal boundaries</dd>
              </div>
              <div className="border-t border-forest/10 pt-4 sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Recurring situation</dt>
                <dd className="mt-2 text-ink/85">Agreeing to extra responsibilities despite wanting to decline.</dd>
              </div>
              <div className="border-t border-forest/10 pt-4 sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Question for the session</dt>
                <dd className="mt-2 font-serif text-xl italic leading-snug text-moss">
                  “How can I learn to say no without feeling constantly guilty?”
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-[24px] bg-forest p-6 text-ivory md:p-8">
            <div>
              <FileText size={22} className="text-sage" aria-hidden="true" />
              <p className="mt-4 font-serif text-2xl leading-snug">A draft you control, written in your own words.</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                Nothing is shared automatically. You review the draft, edit it, and decide whether it goes anywhere at
                all.
              </p>
            </div>
            <button ref={triggerRef} type="button" className="btn btn-light self-start" onClick={() => setOpen(true)}>
              View Draft Summary
            </button>
          </div>
        </div>
        {toast && (
          <p role="status" className="anim-rise mt-5 flex items-center gap-2 text-sm font-semibold text-forest">
            <ShieldCheck size={16} aria-hidden="true" /> {toast}
          </p>
        )}
      </div>

      {open && (
        <SummaryDrawer
          summary={summary}
          onChangeSummary={setSummary}
          onReset={() => setSummary(DEFAULT_SUMMARY)}
          onClose={closeDrawer}
        />
      )}
    </div>
  )
}

function SummaryDrawer({
  summary,
  onChangeSummary,
  onReset,
  onClose,
}: {
  summary: string
  onChangeSummary: (s: string) => void
  onReset: () => void
  onClose: (message?: string) => void
}) {
  const [mode, setMode] = useState<PanelState>('review')
  const [draft, setDraft] = useState(summary)
  const [error, setError] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Focus management, Escape to close, and a simple focus trap.
  useEffect(() => {
    headingRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea, [href], [tabindex]:not([tabindex="-1"])',
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    if (mode === 'editing') fieldRef.current?.focus()
    if (mode === 'confirmed') headingRef.current?.focus()
  }, [mode])

  const saveEdit = () => {
    if (!draft.trim()) {
      setError('The summary is empty. Write a sentence or two, or cancel to keep the previous version.')
      fieldRef.current?.focus()
      return
    }
    onChangeSummary(draft.trim())
    setError('')
    setMode('review')
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="presentation">
      <div className="absolute inset-0 bg-forest/50 backdrop-blur-[2px]" onClick={() => onClose()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="anim-rise relative flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-ivory shadow-2xl"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-forest/10 px-6 py-4">
          <span className="rounded-full bg-lavender px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-forest">
            Fictional demo data
          </span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-mint"
            aria-label="Close draft summary"
            onClick={() => onClose()}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 px-6 py-8 md:px-8">
          {mode === 'confirmed' ? (
            <div>
              <ShieldCheck size={30} className="text-moss" aria-hidden="true" />
              <h2 id="drawer-title" ref={headingRef} tabIndex={-1} className="display mt-5 text-4xl text-forest">
                Confirmed in demo.
              </h2>
              <p className="mt-4 text-ink/80">
                No real information has been transmitted. This page has no connection to a psychologist, a server, or any
                messaging service.
              </p>
              <div className="mt-6 space-y-4 rounded-2xl bg-mint p-5 text-sm leading-relaxed text-ink/85">
                <p>
                  In a real implementation, a summary would only be shared with your psychologist after you grant
                  permission — and you could withdraw it later.
                </p>
                <p className="flex gap-3">
                  <Lock size={16} className="mt-0.5 shrink-0 text-moss" aria-hidden="true" />
                  Access to your original journal entries would require a separate, explicit permission. Sharing a
                  summary never opens your journal.
                </p>
              </div>
              <button type="button" className="btn btn-primary mt-8" onClick={() => onClose('Demo complete. No data was transmitted.')}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 id="drawer-title" ref={headingRef} tabIndex={-1} className="display text-4xl text-forest">
                Draft session summary
              </h2>
              <p className="mt-2 text-sm text-muted">Based on 4 fictional entries from the last 7 days.</p>

              {mode === 'editing' ? (
                <div className="mt-6">
                  <label htmlFor="summary-edit" className="text-sm font-semibold text-forest">
                    Edit the summary
                  </label>
                  <textarea
                    id="summary-edit"
                    ref={fieldRef}
                    rows={7}
                    className="field mt-2"
                    value={draft}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'summary-edit-error' : undefined}
                    onChange={(e) => {
                      setDraft(e.target.value)
                      if (error) setError('')
                    }}
                  />
                  {error && (
                    <p id="summary-edit-error" className="mt-2 text-sm text-[#8A4B3C]">
                      {error}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className="btn btn-primary btn-sm" onClick={saveEdit}>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setDraft(summary)
                        setError('')
                        setMode('review')
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        onReset()
                        setDraft(DEFAULT_SUMMARY)
                        setError('')
                      }}
                    >
                      Restore original
                    </button>
                  </div>
                </div>
              ) : (
                <blockquote className="mt-6 rounded-[22px] bg-white p-6 font-serif text-[1.35rem] leading-snug text-forest ring-1 ring-forest/10">
                  “{summary}”
                </blockquote>
              )}

              <p className="mt-6 text-sm leading-relaxed text-ink/75">
                This is a draft, not an objective assessment of your psychological state. You can review, edit, or remove
                any part before deciding whether to share it.
              </p>

              <div className="mt-6 rounded-2xl border border-forest/10 p-5 text-sm leading-relaxed text-ink/75">
                <p className="font-semibold text-forest">How sharing would work in a real product</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Only this summary — never your journal — would be offered for sharing.</li>
                  <li>It would reach your psychologist only after you explicitly confirm.</li>
                  <li>Original entries would require a separate, explicit permission.</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {mode !== 'confirmed' && (
          <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-forest/10 bg-ivory px-6 py-4 md:px-8">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={mode === 'editing'}
              onClick={() => {
                setDraft(summary)
                setMode('editing')
              }}
            >
              Edit Summary
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onClose('Sharing cancelled. Nothing was shared or sent.')}
            >
              Do Not Share
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={mode === 'editing'}
              title={mode === 'editing' ? 'Save or cancel your edits first' : undefined}
              onClick={() => setMode('confirmed')}
            >
              Confirm in Demo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
