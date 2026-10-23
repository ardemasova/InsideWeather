import type { SVGProps } from 'react'

export type WeatherKind = 'clear' | 'cloudy' | 'foggy' | 'rainy' | 'stormy'

/** Brand mark: a sun disc partially veiled by a cloud. */
export function LogoMark({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="18.5" cy="12.5" r="7.5" fill={light ? '#A8BBA4' : '#A8BBA4'} />
      <path
        d="M6.5 23.5a5 5 0 0 1 4.3-5 6.2 6.2 0 0 1 11.7 1.6 3.7 3.7 0 0 1 .3 7.4H10a3.5 3.5 0 0 1-3.5-4z"
        fill={light ? '#F7F6F0' : '#183F32'}
      />
    </svg>
  )
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className="h-8 w-8 shrink-0" light={light} />
      <span className={`font-serif text-[1.35rem] leading-none tracking-tight ${light ? 'text-ivory' : 'text-forest'}`}>
        Inner <em className="italic">Weather</em>
      </span>
    </span>
  )
}

/** Weather-map contour lines, used as a quiet background texture. */
export function Isobars({ className = '', stroke = 'currentColor', ...rest }: SVGProps<SVGSVGElement> & { stroke?: string }) {
  const rings = [40, 78, 118, 160, 204, 250, 298]
  return (
    <svg viewBox="0 0 800 600" fill="none" className={className} aria-hidden="true" {...rest}>
      <g stroke={stroke} strokeWidth="1">
        {rings.map((r, i) => (
          <path
            key={r}
            d={`M ${520 - r} ${300}
                C ${520 - r} ${300 - r * 0.7}, ${520 - r * 0.35} ${300 - r * 0.95}, ${520 + r * 0.2} ${300 - r * 0.85}
                C ${520 + r * 0.9} ${300 - r * 0.72}, ${520 + r * 1.05} ${300 - r * 0.1}, ${520 + r * 0.92} ${300 + r * 0.35}
                C ${520 + r * 0.75} ${300 + r * 0.85}, ${520 + r * 0.05} ${300 + r * 0.98}, ${520 - r * 0.5} ${300 + r * 0.78}
                C ${520 - r * 0.92} ${300 + r * 0.6}, ${520 - r} ${300 + r * 0.35}, ${520 - r} ${300} Z`}
            opacity={1 - i * 0.1}
          />
        ))}
      </g>
    </svg>
  )
}

/** Small weather glyphs, drawn to share one stroke language. */
export function WeatherGlyph({ kind, className = '' }: { kind: WeatherKind; className?: string }) {
  const cloud = 'M12 34a8 8 0 0 1 7.2-8 10 10 0 0 1 19-0.6A7 7 0 0 1 39 39.5H15A5.5 5.5 0 0 1 12 34z'
  return (
    <svg viewBox="0 0 52 52" className={className} fill="none" aria-hidden="true">
      {kind === 'clear' && (
        <g>
          <circle cx="26" cy="26" r="10" fill="currentColor" opacity="0.9" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4
            return (
              <line
                key={i}
                x1={26 + Math.cos(a) * 15}
                y1={26 + Math.sin(a) * 15}
                x2={26 + Math.cos(a) * 19}
                y2={26 + Math.sin(a) * 19}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )
          })}
        </g>
      )}
      {kind === 'cloudy' && (
        <g>
          <circle cx="33" cy="18" r="7" fill="currentColor" opacity="0.35" />
          <path d={cloud} fill="currentColor" opacity="0.9" transform="translate(-1 -3)" />
        </g>
      )}
      {kind === 'foggy' && (
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M10 18h22" opacity="0.5" />
          <path d="M16 25h26" />
          <path d="M8 32h28" opacity="0.75" />
          <path d="M18 39h20" opacity="0.45" />
        </g>
      )}
      {kind === 'rainy' && (
        <g>
          <path d={cloud} fill="currentColor" opacity="0.9" transform="translate(-1 -9)" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="rain-lines">
            <path d="M18 36l-2 6" />
            <path d="M26 36l-2 6" />
            <path d="M34 36l-2 6" />
          </g>
        </g>
      )}
      {kind === 'stormy' && (
        <g>
          <path d={cloud} fill="currentColor" opacity="0.9" transform="translate(-1 -9)" />
          <path d="M27 31l-5 8h5l-3 7 8-10h-5l3-5z" fill="currentColor" />
        </g>
      )}
    </svg>
  )
}

/** Abstract assistant avatar: a soft orb with a mist band. */
export function AssistantAvatar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="av-g" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#E1EDE3" />
          <stop offset="55%" stopColor="#A8BBA4" />
          <stop offset="100%" stopColor="#285744" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#av-g)" />
      <path d="M7 23c5-3 9 2 14 0s8-3 12-1" stroke="#F7F6F0" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M10 28c4-2 8 1 12 0" stroke="#F7F6F0" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

/** Large organic hero form. */
export function OrganicForm({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 640" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="of-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8BBA4" />
          <stop offset="100%" stopColor="#8FA78C" />
        </linearGradient>
        <linearGradient id="of-b" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#285744" />
          <stop offset="100%" stopColor="#183F32" />
        </linearGradient>
      </defs>
      <path
        d="M318 22c112 6 214 82 248 196 36 120-18 222-82 304-62 80-170 120-268 96C112 594 30 520 12 416-6 312 40 236 92 162 146 86 214 16 318 22z"
        fill="url(#of-a)"
      />
      <path
        d="M402 188c74 30 132 104 128 196-4 96-74 168-160 196-90 30-176 4-222-64-44-66-28-142 8-206 38-68 92-112 160-128 30-6 58-4 86 6z"
        fill="url(#of-b)"
      />
      <circle cx="210" cy="190" r="58" fill="#F7F6F0" opacity="0.92" />
      <g stroke="#E1EDE3" strokeWidth="1" fill="none" opacity="0.35">
        <path d="M168 420c60-38 140-46 220-20s128 20 170-6" />
        <path d="M176 458c60-30 132-36 206-14s124 18 164-4" />
        <path d="M196 496c56-22 116-26 178-10s108 12 142-4" />
      </g>
    </svg>
  )
}
