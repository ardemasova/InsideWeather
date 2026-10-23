import { useId, useRef, useState } from 'react'
import { ArrowRight, Check, PenLine, RotateCcw } from 'lucide-react'
import { WeatherGlyph, type WeatherKind } from './Graphics'
import { LeafCluster } from './Leaves'
import { WEATHER_LEAVES } from './leafPresets'

interface WeatherState {
  kind: WeatherKind
  name: string
  feeling: string
  question: string
  followUp: string
  /** Visual treatment: card surface + glyph colour when selected. */
  surface: string
  glyph: string
}

const STATES: WeatherState[] = [
  {
    kind: 'clear',
    name: 'Clear',
    feeling: 'I feel calm or grounded.',
    question: 'What is helping you feel grounded today?',
    followUp: 'Is there something from today you would like to carry with you into tomorrow?',
    surface: 'bg-[#F3F0DF] text-forest',
    glyph: 'text-[#C9B36A]',
  },
  {
    kind: 'cloudy',
    name: 'Cloudy',
    feeling: 'My mind feels busy.',
    question: 'What thought keeps returning to your mind?',
    followUp: 'If that thought could speak plainly, what would it want you to know?',
    surface: 'bg-mint text-forest',
    glyph: 'text-sage',
  },
  {
    kind: 'foggy',
    name: 'Foggy',
    feeling: 'I am not sure what I feel yet.',
    question: 'If you do not need to explain everything yet, what feeling do you notice first?',
    followUp: 'Where do you notice that feeling most — in your body, your thoughts, or the shape of your day?',
    surface: 'bg-lavender text-forest',
    glyph: 'text-[#8C86A8]',
  },
  {
    kind: 'rainy',
    name: 'Rainy',
    feeling: 'Things feel heavy today.',
    question: 'What might make today feel a little softer?',
    followUp: 'Is there someone or something that has felt like shelter lately?',
    surface: 'bg-moss text-ivory',
    glyph: 'text-sage',
  },
  {
    kind: 'stormy',
    name: 'Stormy',
    feeling: 'I feel tense or overwhelmed.',
    question: 'What feels most intense or demanding right now?',
    followUp: 'What would one small moment of steadiness look like for you right now?',
    surface: 'bg-forest text-ivory',
    glyph: 'text-lavender',
  },
]

const TAGS = ['Tired', 'Tense', 'Calm', 'Uncertain', 'Lonely', 'Hopeful']

export function WeatherSelector() {
  const [selected, setSelected] = useState<WeatherKind | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [step, setStep] = useState<'question' | 'journal'>('question')
  const [note, setNote] = useState('')
  const [kept, setKept] = useState<string | null>(null)
  const [error, setError] = useState('')
  const groupName = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const current = STATES.find((s) => s.kind === selected) ?? null

  const choose = (k: WeatherKind) => {
    setSelected(k)
    setStep('question')
    setKept(null)
    setError('')
  }

  const toggleTag = (t: string) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  const continueReflecting = () => {
    setStep('journal')
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const keepNote = () => {
    if (!note.trim()) {
      setError('Write a few words first, or simply leave the page as it is. Writing is always optional.')
      textareaRef.current?.focus()
      return
    }
    setError('')
    setKept(note.trim())
  }

  const reset = () => {
    setSelected(null)
    setTags([])
    setStep('question')
    setNote('')
    setKept(null)
    setError('')
  }

  return (
    <section id="weather" aria-labelledby="weather-title" className="relative overflow-hidden bg-white/60 py-24 md:py-32">
      <LeafCluster options={WEATHER_LEAVES} viewBox="0 0 640 620" className="absolute -right-16 -top-20 hidden h-[420px] w-[440px] -scale-y-100 md:block" />
      <div className="wrap relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow text-moss">A gentle beginning · Interactive</p>
            <h2 id="weather-title" className="display mt-5 text-4xl text-forest md:text-6xl">
              What is your inner <em className="italic text-moss">weather</em> today?
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink/75 lg:justify-self-end">
            Sometimes it is easier to begin with a feeling than with an explanation.
          </p>
        </div>

        <fieldset className="mt-14">
          <legend className="sr-only">Choose the weather closest to how you feel</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STATES.map((s) => {
              const active = selected === s.kind
              return (
                <label
                  key={s.kind}
                  className={`group relative flex min-h-[176px] cursor-pointer flex-col justify-between overflow-hidden rounded-[26px] border p-5 transition-all duration-300 ${
                    s.kind === 'stormy' ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    active
                      ? `${s.surface} border-transparent shadow-[0_24px_50px_-28px_rgba(24,63,50,0.7)] -translate-y-1`
                      : 'border-forest/10 bg-ivory text-forest hover:-translate-y-0.5 hover:border-forest/30'
                  } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-moss`}
                >
                  <input
                    type="radio"
                    name={groupName}
                    value={s.kind}
                    checked={active}
                    onChange={() => choose(s.kind)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between">
                    <WeatherGlyph
                      kind={s.kind}
                      className={`h-14 w-14 transition-colors duration-300 ${active ? s.glyph : 'text-moss/70 group-hover:text-moss'}`}
                    />
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                        active ? 'border-current' : 'border-forest/20'
                      }`}
                      aria-hidden="true"
                    >
                      {active && <Check size={14} strokeWidth={2.5} />}
                    </span>
                  </span>
                  <span>
                    <span className="block font-serif text-[1.7rem] leading-none">{s.name}</span>
                    <span className={`mt-2 block text-[0.88rem] leading-snug ${active ? 'opacity-85' : 'text-muted'}`}>
                      {s.feeling}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {/* Reflection panel */}
        <div className="mt-6 rounded-[30px] border border-forest/10 bg-ivory p-6 md:p-10" aria-live="polite">
          {!current ? (
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
              <p className="font-serif text-2xl text-forest/80">Choose the weather that feels closest.</p>
              <p className="text-sm text-muted">There is no right or wrong answer, and nothing is scored.</p>
            </div>
          ) : (
            <div key={current.kind + step} className="anim-rise grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="min-w-0">
                <p className="eyebrow text-muted">
                  {step === 'question' ? 'A question for today' : 'Continue reflecting'}
                </p>
                <p className="display mt-4 text-3xl text-forest md:text-[2.6rem] md:leading-[1.1]">
                  {step === 'question' ? current.question : current.followUp}
                </p>

                {step === 'question' ? (
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button type="button" className="btn btn-primary" onClick={continueReflecting}>
                      Continue Reflecting <ArrowRight size={17} aria-hidden="true" />
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                      <RotateCcw size={15} aria-hidden="true" /> Start over
                    </button>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="max-w-lg text-ink/75">
                      You do not have to solve the feeling. You can simply notice it, or write a few thoughts to return
                      to later.
                    </p>
                    {!kept ? (
                      <>
                        <label htmlFor="weather-note" className="mt-6 block text-sm font-semibold text-forest">
                          Your note <span className="font-normal text-muted">(optional)</span>
                        </label>
                        <textarea
                          id="weather-note"
                          ref={textareaRef}
                          rows={4}
                          className="field mt-2"
                          placeholder="A few words are enough…"
                          value={note}
                          aria-invalid={!!error}
                          aria-describedby={error ? 'weather-note-error weather-note-hint' : 'weather-note-hint'}
                          onChange={(e) => {
                            setNote(e.target.value)
                            if (error) setError('')
                          }}
                        />
                        {error && (
                          <p id="weather-note-error" className="mt-2 text-sm text-[#8A4B3C]">
                            {error}
                          </p>
                        )}
                        <p id="weather-note-hint" className="mt-2 text-xs text-muted">
                          Demo only: your note stays in this page’s memory and is never sent or stored.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button type="button" className="btn btn-primary" onClick={keepNote}>
                            <PenLine size={16} aria-hidden="true" /> Write a Note
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                            Start over
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-sage/60 bg-white p-5" role="status">
                        <p className="flex items-center gap-2 text-sm font-semibold text-moss">
                          <Check size={16} aria-hidden="true" /> Note kept in this demo
                        </p>
                        <p className="mt-3 whitespace-pre-wrap font-serif text-xl leading-snug text-forest">“{kept}”</p>
                        <p className="mt-3 text-xs text-muted">
                          Nothing was saved or sent. This note exists only on this page and disappears when you reload
                          it.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setKept(null)}>
                            Edit note
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                            Choose another weather
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="min-w-0 lg:border-l lg:border-forest/10 lg:pl-10">
                <p className="eyebrow text-muted" id="tags-label">
                  Words that might fit <span className="normal-case tracking-normal">(optional)</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-labelledby="tags-label">
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="chip"
                      aria-pressed={tags.includes(t)}
                      onClick={() => toggleTag(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted">
                  These words are for you. They are not a score, a label, or an assessment — feelings can be mixed,
                  and they can change within the same day.
                </p>
                {current.kind === 'stormy' && (
                  <p className="mt-4 rounded-2xl bg-lavender/60 p-4 text-sm leading-relaxed text-ink">
                    If you feel unsafe or in crisis right now, please contact your local emergency services or a crisis
                    line in your area. This demo cannot offer urgent help.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-muted">Interactive demonstration · nothing you enter here leaves this page.</p>
      </div>
    </section>
  )
}
