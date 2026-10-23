import { BookOpen, Compass, NotebookPen, Users } from 'lucide-react'

type Lane = 'platform' | 'human' | 'journal'

const STEPS: { n: string; title: string; text: string; lane: Lane; icon: typeof Compass }[] = [
  {
    n: '01',
    title: 'Find Your Approach',
    text: 'Explore different psychological approaches and learn what each one may help you understand.',
    lane: 'platform',
    icon: Compass,
  },
  {
    n: '02',
    title: 'Work with a Human Professional',
    text: 'Build a relationship with a psychologist and explore what matters to you together.',
    lane: 'human',
    icon: Users,
  },
  {
    n: '03',
    title: 'Reflect Between Sessions',
    text: 'Use your journal whenever you want to capture a thought or explore a recurring experience.',
    lane: 'journal',
    icon: NotebookPen,
  },
  {
    n: '04',
    title: 'Return to What Matters',
    text: 'Review your reflections before a session and choose what you want to discuss.',
    lane: 'human',
    icon: BookOpen,
  },
]

const LANE_LABEL: Record<Lane, string> = {
  platform: 'On the platform',
  human: 'With your psychologist',
  journal: 'In your journal',
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-hidden bg-white/60 py-24 md:py-32">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow text-moss">How it works</p>
            <h2 id="how-title" className="display mt-5 text-[2.5rem] text-forest md:text-6xl">
              A little more continuity. <em className="italic text-moss">One step at a time.</em>
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink/75 lg:justify-self-end">
            The psychologist stays at the center. The journal sits beside the work, holding the moments that happen in
            between.
          </p>
        </div>

        {/* Desktop: two lanes around a shared time axis */}
        <div className="mt-20 hidden lg:grid lg:grid-cols-[150px_repeat(4,minmax(0,1fr))] lg:grid-rows-[auto_64px_auto]">
          <div className="flex items-center justify-end pr-6 text-right">
            <span className="eyebrow text-[0.65rem] text-moss">With your psychologist</span>
          </div>
          {STEPS.map((s, i) => (
            <div
              key={`top-${s.n}`}
              className={`relative bg-mint/70 px-6 pb-10 pt-8 ${i === 0 ? 'rounded-tl-[28px]' : ''} ${i === 3 ? 'rounded-tr-[28px]' : ''}`}
            >
              {s.lane === 'human' && (
                <>
                  <StepBody step={s} />
                  <span className="absolute bottom-0 left-[46px] h-10 w-px bg-moss/40" aria-hidden="true" />
                </>
              )}
            </div>
          ))}

          <div className="flex items-center justify-end pr-6">
            <span className="text-xs italic text-muted">over time →</span>
          </div>
          {STEPS.map((s, i) => (
            <div
              key={`axis-${s.n}`}
              className={`relative ${s.lane === 'human' ? 'bg-gradient-to-b from-mint/70 to-ivory' : 'bg-gradient-to-b from-mint/70 to-ivory'}`}
              aria-hidden="true"
            >
              <span className={`absolute top-1/2 h-px bg-sage ${i === 0 ? 'left-[46px] right-0' : i === 3 ? 'left-0 right-6' : 'inset-x-0'}`} />
              <span className="absolute left-[46px] top-1/2 h-10 w-px -translate-y-1/2 bg-moss/40" />
              <span className="absolute left-[46px] top-1/2 flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ivory bg-moss" />
            </div>
          ))}

          <div className="flex items-center justify-end pr-6 text-right">
            <span className="eyebrow text-[0.65rem] text-muted">On your own time</span>
          </div>
          {STEPS.map((s, i) => (
            <div
              key={`bottom-${s.n}`}
              className={`relative bg-ivory px-6 pb-8 pt-10 ${i === 0 ? 'rounded-bl-[28px]' : ''} ${i === 3 ? 'rounded-br-[28px]' : ''}`}
            >
              {s.lane !== 'human' && (
                <>
                  <span className="absolute left-[46px] top-0 h-10 w-px bg-moss/40" aria-hidden="true" />
                  <StepBody step={s} />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Mobile / tablet: vertical sequence */}
        <ol className="relative mt-14 space-y-4 lg:hidden">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className={`rounded-[24px] p-6 ${s.lane === 'human' ? 'bg-mint' : 'border border-forest/10 bg-ivory'} ${
                s.lane === 'journal' ? 'sm:ml-12' : ''
              }`}
            >
              <StepBody step={s} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function StepBody({ step }: { step: (typeof STEPS)[number] }) {
  const Icon = step.icon
  return (
    <div className="max-w-[260px]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-ivory">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span className="font-serif text-2xl italic text-sage">{step.n}</span>
      </div>
      <p className="eyebrow mt-4 text-[0.62rem] text-muted">{LANE_LABEL[step.lane]}</p>
      <h3 className="mt-1.5 font-serif text-[1.6rem] leading-tight text-forest">{step.title}</h3>
      <p className="mt-2 text-[0.93rem] leading-relaxed text-ink/70">{step.text}</p>
    </div>
  )
}
