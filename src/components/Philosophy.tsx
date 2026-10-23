import { Isobars } from './Graphics'
import { LeafCluster } from './Leaves'
import { DARK_LEAVES } from './leafPresets'

const IDEAS = [
  { n: '01', title: 'Notice', text: 'Capture thoughts, feelings, and meaningful moments as they happen.' },
  {
    n: '02',
    title: 'Reflect',
    text: 'Explore your experience through gentle questions, without being given a ready-made interpretation.',
  },
  {
    n: '03',
    title: 'Reconnect',
    text: 'Review your reflections before a session and choose what feels important to discuss.',
  },
]

export function Philosophy() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="on-dark relative overflow-hidden bg-forest py-24 text-ivory md:py-32"
    >
      <Isobars className="pointer-events-none absolute -left-60 -top-24 h-[900px] w-[1200px] text-moss" />
      <LeafCluster options={DARK_LEAVES} viewBox="0 0 640 620" className="absolute -bottom-6 -right-20 h-[520px] w-[540px] opacity-90" />
      <div className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-sage">Our approach</p>
            <h2 id="approach-title" className="display mt-6 text-[2.6rem] sm:text-5xl lg:text-[4.4rem]">
              Some of the important work happens <em className="italic text-sage">between</em> sessions.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-ivory/80">
            A thought may appear late at night. A familiar reaction may become clear only after several days. Inner
            Weather helps you keep track of these moments, so you can return to them when you are ready.
          </p>
        </div>

        <ol className="mt-20 grid gap-px overflow-hidden rounded-[28px] bg-ivory/10 md:grid-cols-3">
          {IDEAS.map((i) => (
            <li key={i.n} className="flex flex-col bg-forest p-7 md:p-9">
              <span className="font-serif text-6xl italic leading-none text-sage/70">{i.n}</span>
              <h3 className="mt-8 font-serif text-3xl">{i.title}</h3>
              <p className="mt-3 max-w-xs text-ivory/75">{i.text}</p>
            </li>
          ))}
        </ol>

        {/* Note → reflection → optional summary */}
        <figure className="mt-16">
          <figcaption className="eyebrow mb-6 text-sage/80">How a moment can travel</figcaption>
          <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <SequenceCard label="A personal note · 23:40" tone="raw">
              “Said yes to the extra project again. Felt tight in my chest afterwards.”
            </SequenceCard>
            <Connector />
            <SequenceCard label="A reflection · two days later" tone="mid">
              “It happens most when I am worried about letting the team down.”
            </SequenceCard>
            <Connector />
            <SequenceCard label="Optional session summary · your choice" tone="calm">
              “I would like to talk about saying no without feeling guilty.”
            </SequenceCard>
          </div>
          <p className="mt-6 text-sm text-ivory/60">
            Each step is optional. You decide what is kept, what is reflected on, and what — if anything — is shared.
          </p>
        </figure>
      </div>
    </section>
  )
}

function SequenceCard({ label, tone, children }: { label: string; tone: 'raw' | 'mid' | 'calm'; children: string }) {
  const styles = {
    raw: 'bg-moss/60 border border-ivory/10 border-dashed',
    mid: 'bg-moss',
    calm: 'bg-ivory text-forest',
  }[tone]
  return (
    <div className={`flex flex-col justify-between gap-6 rounded-[22px] p-6 ${styles}`}>
      <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${tone === 'calm' ? 'text-moss' : 'text-sage'}`}>
        {label}
      </p>
      <p className="font-serif text-[1.35rem] leading-snug">{children}</p>
    </div>
  )
}

function Connector() {
  return (
    <div className="flex items-center justify-center py-1 md:px-1" aria-hidden="true">
      <svg viewBox="0 0 60 24" className="h-6 w-14 rotate-90 text-sage md:rotate-0">
        <path d="M2 12c10-8 20 8 30 0s16-4 22 0" stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M50 7l5 5-5 5" stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}
