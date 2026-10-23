import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { BookOpen, Check, Compass, NotebookPen, Pencil, RotateCcw, Sparkles, X } from 'lucide-react'
import { AssistantAvatar } from './Graphics'
import { getNode } from '../data/journalFlow'
import { initialJournalState, journalReducer, type ChatMessage, type JournalEntry } from '../data/journalMachine'
import { SessionSummary } from './SessionSummary'
import { LeafCluster } from './Leaves'
import { JOURNAL_LEAVES } from './leafPresets'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const FEATURES = [
  { icon: NotebookPen, title: 'Personal Journal', text: 'Capture thoughts and moments whenever you feel ready.' },
  {
    icon: Compass,
    title: 'Gentle Reflection',
    text: 'Explore experiences through thoughtful questions, without being pushed toward a particular conclusion.',
  },
  {
    icon: BookOpen,
    title: 'Session Preparation',
    text: 'Review your notes, create a draft summary, and choose what to share with your psychologist.',
  },
]

export function AIJournal() {
  return (
    <section id="journal" aria-labelledby="journal-title" className="relative overflow-hidden bg-ivory py-24 md:py-32">
      <LeafCluster options={JOURNAL_LEAVES} viewBox="0 0 640 620" className="absolute -left-10 top-[38%] hidden h-[360px] w-[380px] lg:block" />
      <div className="wrap relative">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-moss">The AI Journal</p>
            <h2 id="journal-title" className="display mt-5 text-[2.5rem] text-forest md:text-[3.6rem]">
              Not ready-made answers. <em className="italic text-moss">Space</em> to understand yourself.
            </h2>
            <p className="mt-6 max-w-prose text-lg text-ink/75">
              Your AI journal helps you capture what is happening, explore your reactions, and prepare for conversations
              with your psychologist — at your own pace.
            </p>

            <ul className="mt-10 divide-y divide-forest/10 border-y border-forest/10">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-5 py-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-moss">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.45rem] leading-tight text-forest">{title}</h3>
                    <p className="mt-1.5 text-[0.95rem] text-ink/70">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-lavender/70 px-4 py-2 text-sm font-semibold text-forest">
              <Check size={15} aria-hidden="true" /> No daily check-ins required.
            </p>
            <blockquote className="mt-10 border-l-2 border-sage pl-5 font-serif text-xl italic leading-snug text-moss">
              The AI helps you explore your own thoughts. It does not tell you who you are.
            </blockquote>
          </div>

          <ChatDemo />
        </div>

        <SessionSummary />
      </div>
    </section>
  )
}

function ChatDemo() {
  const [state, dispatch] = useReducer(journalReducer, undefined, () => initialJournalState())
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const composeRef = useRef<HTMLTextAreaElement>(null)
  const node = getNode(state.node)
  const typing = state.queue.length > 0

  // Deliver queued assistant lines one at a time with a short "typing" pause.
  useEffect(() => {
    if (!typing) return
    const delay = prefersReducedMotion() ? 120 : 850 + Math.min(state.queue[0].text.length * 6, 650)
    const t = window.setTimeout(() => dispatch({ type: 'deliver' }), delay)
    return () => window.clearTimeout(t)
  }, [typing, state.queue])

  // Keep the newest message in view, scrolling only the chat (never the page).
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [state.messages.length, typing, state.node, editingId])

  useEffect(() => {
    if (node.type === 'compose' && !typing) composeRef.current?.focus({ preventScroll: true })
  }, [node.type, typing])

  const restart = () => {
    setDraft('')
    setDraftError('')
    setEditingId(null)
    dispatch({ type: 'restart' })
  }

  const keepNote = () => {
    if (!draft.trim()) {
      setDraftError('Write a few words to keep, or choose Cancel.')
      composeRef.current?.focus()
      return
    }
    dispatch({ type: 'keepNote', text: draft })
    setDraft('')
    setDraftError('')
  }

  const entryById = (id: string) => state.journal.find((e) => e.id === id)
  const lastEntryMsgId = [...state.messages].reverse().find((m) => m.entryId)?.id

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_40px_80px_-50px_rgba(24,63,50,0.55)] ring-1 ring-forest/10">
        {/* Demo label */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-forest px-5 py-3 text-ivory">
          <p className="eyebrow text-[0.66rem] text-sage">Interactive demo</p>
          <p className="text-xs text-ivory/75">This is a fictional conversation. Choose a response to explore the experience.</p>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-forest/10 px-5 py-4">
          <AssistantAvatar className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-forest">Inner Weather · AI Journal</p>
            <p className="text-xs text-muted" aria-live="off">
              {typing ? 'typing…' : 'Scripted demo · not a live AI'}
            </p>
          </div>
          <button type="button" onClick={restart} className="btn btn-ghost btn-sm" aria-label="Restart conversation">
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="chat-scroll h-[460px] overflow-y-auto bg-[#F2F5EF] px-4 py-6 sm:px-6 md:h-[520px]"
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          tabIndex={0}
        >
          <div className="flex min-h-full flex-col justify-end">
          <p className="mx-auto mb-5 w-fit rounded-full bg-white/80 px-3 py-1 text-[0.7rem] font-medium text-muted">
            Today
          </p>
          <ol className="flex flex-col gap-3">
            {state.messages.map((m, idx) => {
              const prev = state.messages[idx - 1]
              const grouped = prev && prev.from === m.from && !prev.entryId
              if (m.entryId) {
                const entry = entryById(m.entryId)
                if (!entry) return null
                return (
                  <li key={m.id} className="anim-rise">
                    <EntryCard
                      entry={entry}
                      confirmation={m.text}
                      isLatest={m.id === lastEntryMsgId && state.node === 'saved'}
                      editing={editingId === entry.id}
                      onEdit={() => setEditingId(entry.id)}
                      onCancelEdit={() => setEditingId(null)}
                      onSaveEdit={(text) => {
                        dispatch({ type: 'editEntry', id: entry.id, text })
                        setEditingId(null)
                      }}
                      onRestart={restart}
                    />
                  </li>
                )
              }
              return <Bubble key={m.id} msg={m} grouped={!!grouped} />
            })}
            {typing && (
              <li className="flex items-end gap-2" aria-label="The journal is typing">
                <AssistantAvatar className="h-7 w-7 shrink-0" />
                <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-moss" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-moss" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-moss" />
                </span>
              </li>
            )}
          </ol>
          </div>
        </div>

        {/* Response area — driven entirely by the current node type */}
        <div className="border-t border-forest/10 bg-white px-4 py-4 sm:px-6" aria-label="Your response">
          {typing ? (
            <p className="py-2 text-sm text-muted">One moment…</p>
          ) : node.type === 'choice' ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Choose a response</p>
              <div className="flex flex-wrap gap-2">
                {node.replies.map((r) => (
                  <button key={r.label} type="button" className="chip" onClick={() => dispatch({ type: 'reply', reply: r })}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          ) : node.type === 'save' ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => dispatch({ type: 'save' })}>
                <Check size={15} aria-hidden="true" /> Save Observation
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'decline' })}>
                Do Not Save
              </button>
            </div>
          ) : node.type === 'compose' ? (
            <div>
              <label htmlFor="journal-compose" className="block font-serif text-xl text-forest">
                {node.prompt}
              </label>
              <textarea
                id="journal-compose"
                ref={composeRef}
                rows={3}
                className="field mt-3"
                placeholder="Write freely. You can edit before keeping it."
                value={draft}
                aria-invalid={!!draftError}
                aria-describedby="compose-hint"
                onChange={(e) => {
                  setDraft(e.target.value)
                  if (draftError) setDraftError('')
                }}
              />
              <p id="compose-hint" className={`mt-2 text-xs ${draftError ? 'text-[#8A4B3C]' : 'text-muted'}`}>
                {draftError || 'Your note stays on this page. It is not sent anywhere or stored after you leave.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary btn-sm" onClick={keepNote}>
                  Keep This Note
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setDraft('')
                    setDraftError('')
                    dispatch({ type: 'cancelNote' })
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : node.variant === 'saved' ? (
            <p className="py-2 text-sm text-muted">Edit the note above, or try another conversation.</p>
          ) : node.variant === 'finished' ? (
            <button type="button" className="btn btn-primary btn-sm" onClick={restart}>
              <RotateCcw size={15} aria-hidden="true" /> Start Again
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={restart}>
                Start Again
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'finish' })}>
                Finish Demo
              </button>
            </div>
          )}
        </div>
      </div>

      <DemoJournalTray journal={state.journal} />
    </div>
  )
}

function Bubble({ msg, grouped }: { msg: ChatMessage; grouped: boolean }) {
  const ai = msg.from === 'ai'
  return (
    <li className={`anim-rise flex items-end gap-2 ${ai ? '' : 'flex-row-reverse'} ${grouped ? '-mt-1' : ''}`}>
      {ai ? (
        <span className="h-7 w-7 shrink-0">{!grouped && <AssistantAvatar className="h-7 w-7" />}</span>
      ) : null}
      <div
        className={`max-w-[84%] px-4 py-2.5 text-[0.93rem] leading-relaxed shadow-sm sm:max-w-[78%] ${
          ai ? 'rounded-2xl rounded-bl-md bg-white text-ink' : 'rounded-2xl rounded-br-md bg-[#CFE3D2] text-forest'
        }`}
      >
        <span className="sr-only">{ai ? 'Journal: ' : 'You: '}</span>
        <span className="whitespace-pre-wrap">{msg.text}</span>
        <span className={`ml-3 inline-block translate-y-0.5 text-[0.66rem] ${ai ? 'text-muted' : 'text-moss/70'}`}>
          {msg.time}
        </span>
      </div>
    </li>
  )
}

function EntryCard({
  entry,
  confirmation,
  isLatest,
  editing,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onRestart,
}: {
  entry: JournalEntry
  confirmation: string
  isLatest: boolean
  editing: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: (text: string) => void
  onRestart: () => void
}) {
  const [value, setValue] = useState(entry.text)
  const [err, setErr] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      setValue(entry.text)
      setErr('')
      requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }))
    }
  }, [editing, entry.text])

  const fieldId = `edit-${entry.id}`

  return (
    <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[22px] border border-sage/70 bg-white">
      <div className="flex items-center justify-between bg-mint px-5 py-2.5">
        <p className="eyebrow text-[0.65rem] text-moss">{entry.kind === 'observation' ? 'Observation' : 'Note'}</p>
        {entry.edited && <span className="text-[0.68rem] text-muted">Edited</span>}
      </div>
      <div className="p-5">
        {editing ? (
          <>
            <label htmlFor={fieldId} className="text-sm font-semibold text-forest">
              Edit your {entry.kind === 'observation' ? 'observation' : 'note'}
            </label>
            <textarea
              id={fieldId}
              ref={ref}
              rows={4}
              className="field mt-2"
              value={value}
              aria-invalid={!!err}
              aria-describedby={err ? `${fieldId}-err` : undefined}
              onChange={(e) => {
                setValue(e.target.value)
                if (err) setErr('')
              }}
            />
            {err && (
              <p id={`${fieldId}-err`} className="mt-2 text-xs text-[#8A4B3C]">
                {err}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => (value.trim() ? onSaveEdit(value) : setErr('The note cannot be empty. Cancel to keep the original.'))}
              >
                Save Changes
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onCancelEdit}>
                <X size={14} aria-hidden="true" /> Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="whitespace-pre-wrap font-serif text-[1.3rem] leading-snug text-forest">“{entry.text}”</p>
        )}
        {entry.kind === 'observation' && (
          <p className="mt-4 text-xs leading-relaxed text-muted">
            A draft for personal reflection — not a diagnosis or a definitive psychological conclusion.
          </p>
        )}
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-moss" role="status">
          <Check size={15} aria-hidden="true" />
          {confirmation}
        </p>
        {isLatest && !editing && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-forest/10 pt-4">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>
              <Pencil size={14} aria-hidden="true" /> Edit Note
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={onRestart}>
              Try Another Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function DemoJournalTray({ journal }: { journal: JournalEntry[] }) {
  return (
    <div className="mt-4 rounded-[22px] border border-dashed border-forest/20 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-forest">
          <Sparkles size={15} className="text-moss" aria-hidden="true" />
          Demo journal · {journal.length} {journal.length === 1 ? 'entry' : 'entries'}
        </p>
        <p className="text-xs text-muted">Held in page memory only · cleared when you reload</p>
      </div>
      {journal.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Nothing kept yet. Entries appear here only if you choose to save them.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {journal.map((e) => (
            <li key={e.id} className="flex gap-3 text-sm text-ink/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
              <span className="min-w-0">
                <span className="font-semibold text-moss">{e.kind === 'observation' ? 'Observation' : 'Note'}:</span> {e.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
