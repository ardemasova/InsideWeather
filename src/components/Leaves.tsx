import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

/**
 * Procedural foliage — long, sword-like leaves (dracaena / lily family),
 * drawn as two-tone SVG paths. Each leaf sways gently around its base.
 * Animation pauses off-screen and is disabled for reduced-motion users.
 */

export interface LeafSpec {
  x: number
  y: number
  angle: number
  length: number
  width: number
  bend: number
  color: string
  light: string
  rib: string
  sway: number
  dur: number
  delay: number
  opacity?: number
}

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface ClusterOptions {
  seed: number
  count: number
  /** Base point range for leaf roots. */
  x: [number, number]
  y: [number, number]
  angle: [number, number]
  length: [number, number]
  width: [number, number]
  palette: { color: string; light: string; rib: string }[]
  sway?: [number, number]
  opacity?: [number, number]
}

export function cluster(o: ClusterOptions): LeafSpec[] {
  const r = rng(o.seed)
  const lerp = ([a, b]: [number, number]) => a + (b - a) * r()
  return Array.from({ length: o.count }, () => {
    const p = o.palette[Math.floor(r() * o.palette.length)]
    const angle = lerp(o.angle)
    const length = lerp(o.length)
    return {
      x: lerp(o.x),
      y: lerp(o.y),
      angle,
      length,
      width: lerp(o.width),
      // Leaves droop slightly in the direction they lean.
      bend: (angle % 180 >= 0 ? 1 : -1) * length * (0.1 + r() * 0.28),
      ...p,
      sway: lerp(o.sway ?? [1.2, 3.2]),
      dur: 5.5 + r() * 4.5,
      delay: -r() * 9,
      opacity: o.opacity ? lerp(o.opacity) : 1,
    }
  })
}

function leafPaths(L: number, W: number, bend: number) {
  const outlineR = `M0 0 C ${W * 0.95} ${-L * 0.22}, ${W * 0.7 + bend * 0.55} ${-L * 0.68}, ${bend} ${-L}`
  const outlineL = `C ${bend * 0.55 - W * 0.7} ${-L * 0.68}, ${-W * 0.95} ${-L * 0.22}, 0 0 Z`
  const rib = `Q ${bend * 0.42} ${-L * 0.52}, ${bend} ${-L}`
  return {
    full: `${outlineR} ${outlineL}`,
    half: `${outlineR} Q ${bend * 0.42} ${-L * 0.52}, 0 0 Z`,
    rib: `M0 0 ${rib}`,
  }
}

export function Leaf({ spec, animate = true }: { spec: LeafSpec; animate?: boolean }) {
  const d = leafPaths(spec.length, spec.width, spec.bend)
  const style = {
    '--sway': `${spec.sway}deg`,
    animationDuration: `${spec.dur}s`,
    animationDelay: `${spec.delay}s`,
  } as CSSProperties
  return (
    <g transform={`translate(${spec.x} ${spec.y}) rotate(${spec.angle})`} opacity={spec.opacity}>
      <g className={animate ? 'leaf-sway' : undefined} style={animate ? style : undefined}>
        <path d={d.full} fill={spec.color} />
        <path d={d.half} fill={spec.light} />
        <path d={d.rib} stroke={spec.rib} strokeWidth={Math.max(1, spec.width * 0.06)} fill="none" strokeLinecap="round" opacity="0.7" />
      </g>
    </g>
  )
}

/** Pause animation while the element is outside the viewport. */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, inView }
}

export const PALETTE = {
  light: [
    { color: '#8FAA8C', light: '#A8BBA4', rib: '#C9D6C3' },
    { color: '#6E9274', light: '#86A688', rib: '#B6C8B2' },
    { color: '#5C8263', light: '#739775', rib: '#A8BBA4' },
  ],
  deep: [
    { color: '#1F4A39', light: '#2E6049', rib: '#5C8263' },
    { color: '#285744', light: '#3A6F57', rib: '#6E9274' },
    { color: '#183F32', light: '#285744', rib: '#4F7A60' },
  ],
  onDark: [
    { color: '#1F4A39', light: '#285744', rib: '#3A6F57' },
    { color: '#285744', light: '#2F6450', rib: '#4F7A60' },
  ],
}

/** A self-contained decorative cluster for section edges. */
export function LeafCluster({
  options,
  viewBox,
  className = '',
}: {
  options: ClusterOptions
  viewBox: string
  className?: string
}) {
  const { ref, inView } = useInView<SVGSVGElement>()
  const leaves = useMemo(() => cluster(options), [options])
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={`pointer-events-none select-none ${className}`}
      data-paused={!inView || undefined}
      aria-hidden="true"
      focusable="false"
    >
      {leaves.map((l, i) => (
        <Leaf key={i} spec={l} />
      ))}
    </svg>
  )
}

/* ───────── Hero cover scene ───────── */

const HERO = {
  back: cluster({
    seed: 11,
    count: 16,
    x: [-40, 1640],
    y: [940, 1000],
    angle: [-55, 55],
    length: [520, 860],
    width: [56, 92],
    palette: [
      { color: '#A3B8A0', light: '#B4C6B0', rib: '#C9D6C3' },
      { color: '#94AD92', light: '#A8BBA4', rib: '#C2D1BE' },
    ],
    opacity: [0.55, 0.85],
  }),
  mid: [
    ...cluster({
      seed: 23,
      count: 10,
      x: [980, 1640],
      y: [900, 980],
      angle: [-62, 18],
      length: [440, 760],
      width: [54, 84],
      palette: PALETTE.light,
      sway: [1, 2.4],
    }),
    ...cluster({
      seed: 37,
      count: 7,
      x: [-60, 380],
      y: [920, 980],
      angle: [-10, 58],
      length: [380, 640],
      width: [48, 76],
      palette: PALETTE.light,
      sway: [1, 2.4],
    }),
  ],
  front: [
    ...cluster({
      seed: 51,
      count: 9,
      x: [1220, 1680],
      y: [920, 1000],
      angle: [-62, -2],
      length: [520, 900],
      width: [66, 104],
      palette: PALETTE.deep,
      sway: [1.6, 3.4],
    }),
    ...cluster({
      seed: 67,
      count: 6,
      x: [-120, 220],
      y: [940, 1000],
      angle: [-35, 40],
      length: [300, 520],
      width: [58, 90],
      palette: PALETTE.deep,
      sway: [1.6, 3.4],
    }),
  ],
  /* Leaves arching in from above, like a plant on a shelf just out of frame */
  hanging: cluster({
    seed: 89,
    count: 6,
    x: [1300, 1680],
    y: [-80, -30],
    angle: [150, 215],
    length: [300, 520],
    width: [50, 80],
    palette: PALETTE.light,
    sway: [1.4, 2.8],
    opacity: [0.75, 0.95],
  }),
}

export function HeroScene() {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" data-paused={!inView || undefined} aria-hidden="true">
      {/* Wall + light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 72% 18%, rgba(247,246,240,0.85) 0%, rgba(247,246,240,0) 70%), linear-gradient(160deg, #D5E0D0 0%, #B9CBB5 42%, #8EA88B 100%)',
        }}
      />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <filter id="hero-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Light falling through a window */}
        <g opacity="0.55" className="beam-breathe">
          <polygon points="980,-20 1120,-20 760,900 560,900" fill="url(#beam)" />
          <polygon points="1180,-20 1250,-20 1000,900 900,900" fill="url(#beam)" opacity="0.7" />
          <polygon points="1320,-20 1460,-20 1260,900 1080,900" fill="url(#beam)" opacity="0.5" />
        </g>
        {/* Out-of-focus background foliage (static, blurred once) */}
        <g filter="url(#hero-soft)">
          {HERO.back.map((l, i) => (
            <Leaf key={i} spec={l} animate={false} />
          ))}
        </g>
        {HERO.mid.map((l, i) => (
          <Leaf key={i} spec={l} />
        ))}
        {HERO.hanging.map((l, i) => (
          <Leaf key={i} spec={l} />
        ))}
        {HERO.front.map((l, i) => (
          <Leaf key={i} spec={l} />
        ))}
      </svg>
      {/* Legibility veil for the headline */}
      <div className="hero-veil absolute inset-0" />
      <div className="grain absolute inset-0 opacity-70" />
    </div>
  )
}
