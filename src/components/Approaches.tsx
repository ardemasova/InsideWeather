import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface Approach {
  key: string
  name: string
  abbr: string
  intro: string
  description: string
  explores: string[]
  theme: 'light' | 'dark' | 'lavender' | 'mint'
  motif: ReactNode
}

const APPROACHES: Approach[] = [
  {
    key: 'cbt',
    name: 'Cognitive Behavioural Therapy',
    abbr: 'CBT',
    intro: 'Explore the connections between thoughts, emotions, and actions.',
    description:
      'Cognitive behavioural approaches often focus on identifying unhelpful thinking patterns, understanding behavioural responses, and practising alternative ways of responding to everyday challenges.',
    explores: ['Thinking patterns', 'Behavioural responses', 'Practising new responses'],
    theme: 'light',
    motif: <CbtMotif />,
  },
  {
    key: 'act',
    name: 'Acceptance and Commitment Therapy',
    abbr: 'ACT',
    intro: 'Make room for difficult feelings while moving toward what matters.',
    description:
      'Acceptance and commitment approaches explore psychological flexibility, helping people relate differently to difficult thoughts and feelings while taking steps guided by their personal values.',
    explores: ['Psychological flexibility', 'Personal values', 'Relating to difficult thoughts'],
    theme: 'dark',
    motif: <ActMotif />,
  },
  {
    key: 'psychodynamic',
    name: 'Psychodynamic Approaches',
    abbr: 'Psychodynamic',
    intro: 'Explore recurring patterns and the meaning behind them.',
    description:
      'Psychodynamic approaches may explore how past experiences, relationships, and less conscious patterns influence present feelings and ways of relating to others.',
    explores: ['Past experiences', 'Relationships', 'Less conscious patterns'],
    theme: 'lavender',
    motif: <PsychodynamicMotif />,
  },
  {
    key: 'humanistic',
    name: 'Humanistic and Person-Centred Approaches',
    abbr: 'Humanistic',
    intro: 'Make space for your own experience, values, and perspective.',
    description:
      'Humanistic and person-centred approaches emphasise empathy, self-understanding, and a supportive relationship in which people can explore their experiences without judgment.',
    explores: ['Empathy', 'Self-understanding', 'A supportive relationship'],
    theme: 'mint',
    motif: <HumanisticMotif />,
  },
]

const THEME = {
  light: { panel: 'bg-white text-ink', title: 'text-forest', sub: 'text-ink/70', tag: 'border-forest/15 text-forest', eyebrow: 'text-moss' },
  dark: { panel: 'bg-forest text-ivory on-dark', title: 'text-ivory', sub: 'text-ivory/75', tag: 'border-ivory/25 text-ivory', eyebrow: 'text-sage' },
  lavender: { panel: 'bg-lavender text-ink', title: 'text-forest', sub: 'text-ink/75', tag: 'border-forest/20 text-forest', eyebrow: 'text-moss' },
  mint: { panel: 'bg-mint text-ink', title: 'text-forest', sub: 'text-ink/75', tag: 'border-forest/20 text-forest', eyebrow: 'text-moss' },
}

export function Approaches() {
  return (
    <section id="methods" aria-labelledby="methods-title" className="bg-ivory py-24 md:py-32">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow text-moss">Psychological methods</p>
            <h2 id="methods-title" className="display mt-5 text-[2.5rem] text-forest md:text-6xl">
              Different ways to understand <em className="italic text-moss">what you feel.</em>
            </h2>
          </div>
          <p className="max-w-lg text-lg text-ink/75 lg:justify-self-end">
            There is no single approach that fits everyone. Different psychological methods offer different ways to
            explore thoughts, emotions, relationships, and patterns of behaviour.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {APPROACHES.map((a, i) => {
            const t = THEME[a.theme]
            const flip = i % 2 === 1
            return (
              <article
                key={a.key}
                aria-labelledby={`${a.key}-title`}
                className={`grid overflow-hidden rounded-[32px] ${t.panel} md:grid-cols-[1fr_0.8fr] ${
                  a.theme === 'light' ? 'ring-1 ring-forest/10' : ''
                }`}
              >
                <div className={`flex min-w-0 flex-col justify-between gap-10 p-7 md:p-12 ${flip ? 'md:order-2' : ''}`}>
                  <div>
                    <p className={`eyebrow ${t.eyebrow}`}>
                      {String(i + 1).padStart(2, '0')} · {a.abbr}
                    </p>
                    <h3 id={`${a.key}-title`} className={`display mt-5 text-[2rem] md:text-[2.75rem] ${t.title}`}>
                      {a.name}
                    </h3>
                    <p className={`mt-4 font-serif text-xl italic leading-snug md:text-2xl ${t.title}`}>{a.intro}</p>
                  </div>
                  <div>
                    <p className={`max-w-prose leading-relaxed ${t.sub}`}>{a.description}</p>
                    <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.14em] ${t.sub}`}>Often explores</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {a.explores.map((e) => (
                        <li key={e} className={`rounded-full border px-3 py-1 text-sm ${t.tag}`}>
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={`relative flex min-h-[260px] items-center justify-center p-8 ${flip ? 'md:order-1' : ''} ${
                    a.theme === 'dark' ? 'bg-moss/50' : 'bg-black/[0.025]'
                  }`}
                >
                  {a.motif}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-forest/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            These are general introductions to psychological approaches, not recommendations for a specific individual.
            A qualified professional can help you explore which approach may suit your needs.
          </p>
          <a href="#how-it-works" className="btn btn-primary shrink-0">
            Explore How Inner Weather Works <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ───── Motifs ───── */

function CbtMotif() {
  return (
    <svg viewBox="0 0 320 260" className="h-auto w-full max-w-[340px]" role="img" aria-label="Diagram: thoughts, feelings, and actions influence one another">
      <g fill="none" stroke="#285744" strokeWidth="1.4">
        <path d="M160 58 L72 196" strokeDasharray="3 6" />
        <path d="M160 58 L248 196" strokeDasharray="3 6" />
        <path d="M72 196 L248 196" strokeDasharray="3 6" />
      </g>
      <g fill="#285744">
        <path d="M110 136l-3 9 9-3z" transform="rotate(-57 110 136)" />
        <path d="M210 136l3 9-9-3z" transform="rotate(57 210 136)" />
        <path d="M160 196l-6 -5v10z" />
      </g>
      {[
        { x: 160, y: 58, label: 'Thoughts', fill: '#183F32', text: '#F7F6F0' },
        { x: 72, y: 196, label: 'Feelings', fill: '#A8BBA4', text: '#183F32' },
        { x: 248, y: 196, label: 'Actions', fill: '#E1EDE3', text: '#183F32' },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="42" fill={n.fill} stroke="#183F32" strokeOpacity="0.15" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill={n.text}>
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function ActMotif() {
  return (
    <svg viewBox="0 0 340 260" className="h-auto w-full max-w-[360px]" role="img" aria-label="Illustration: a winding path through misty hills toward a distant light">
      <defs>
        <clipPath id="act-clip">
          <circle cx="170" cy="130" r="122" />
        </clipPath>
      </defs>
      <circle cx="170" cy="130" r="122" fill="#285744" />
      <g clipPath="url(#act-clip)">
      <circle cx="232" cy="78" r="22" fill="#E1EDE3" opacity="0.9" />
      <path d="M0 150 C 60 110, 120 130, 180 112 S 290 96, 340 120 V260 H0Z" fill="#A8BBA4" opacity="0.35" />
      <path d="M0 186 C 70 160, 130 176, 200 156 S 300 148, 340 162 V260 H0Z" fill="#A8BBA4" opacity="0.55" />
      <path d="M0 222 C 80 206, 150 214, 220 198 S 310 196, 340 204 V260 H0Z" fill="#183F32" opacity="0.6" />
      <path
        d="M70 260 C 110 230, 150 222, 140 200 S 200 176, 230 160 S 226 120, 232 100"
        fill="none"
        stroke="#F7F6F0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
      />
      <g stroke="#E1EDE3" strokeOpacity="0.5" strokeLinecap="round">
        <path d="M40 92h70" />
        <path d="M70 102h90" />
      </g>
      </g>
      <circle cx="170" cy="130" r="122" fill="none" stroke="#A8BBA4" strokeOpacity="0.4" />
    </svg>
  )
}

function PsychodynamicMotif() {
  return (
    <svg viewBox="0 0 320 260" className="h-auto w-full max-w-[320px]" role="img" aria-label="Illustration: translucent overlapping layers">
      <ellipse cx="130" cy="140" rx="92" ry="74" fill="#FFFFFF" opacity="0.55" />
      <ellipse cx="180" cy="118" rx="88" ry="70" fill="#A8BBA4" opacity="0.45" />
      <ellipse cx="170" cy="168" rx="70" ry="54" fill="#285744" opacity="0.28" />
      <g fill="none" stroke="#183F32" strokeOpacity="0.4">
        <ellipse cx="160" cy="140" rx="128" ry="100" strokeDasharray="2 6" />
        <ellipse cx="160" cy="140" rx="30" ry="22" />
      </g>
      <circle cx="160" cy="140" r="5" fill="#183F32" />
    </svg>
  )
}

function HumanisticMotif() {
  return (
    <svg viewBox="0 0 320 260" className="h-auto w-full max-w-[320px]" role="img" aria-label="Illustration: an organic form gradually unfolding in soft light">
      <defs>
        <radialGradient id="hm-light" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="110" r="110" fill="url(#hm-light)" />
      {[-56, -28, 0, 28, 56].map((deg, i) => (
        <path
          key={deg}
          d="M160 210 C 130 170, 132 110, 160 70 C 188 110, 190 170, 160 210Z"
          transform={`rotate(${deg} 160 210)`}
          fill={i === 2 ? '#285744' : '#A8BBA4'}
          opacity={i === 2 ? 0.9 : 0.55 - Math.abs(deg) / 200}
        />
      ))}
      <circle cx="160" cy="210" r="6" fill="#183F32" />
    </svg>
  )
}
