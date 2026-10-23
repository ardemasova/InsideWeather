import { ArrowDown, MessageCircle } from 'lucide-react'
import { AssistantAvatar, WeatherGlyph } from './Graphics'
import { HeroScene } from './Leaves'

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="on-dark relative -mt-[72px] overflow-hidden bg-forest text-ivory"
    >
      <HeroScene />
      <div className="wrap relative grid min-h-[680px] items-end gap-12 pb-16 pt-[136px] md:min-h-[760px] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-24 lg:pt-[160px]">
        <div className="relative z-10 min-w-0">
          <p className="eyebrow flex items-center gap-3 text-[#D5E0D0]">
            <span className="h-px w-8 bg-[#D5E0D0]/60" aria-hidden="true" />
            Psychological support, reimagined
          </p>
          <h1 id="hero-title" className="display mt-6 text-[2.9rem] text-ivory sm:text-6xl lg:text-[5.4rem]">
            Your inner world deserves <em className="italic text-[#CFDCCB]">room</em> to change.
          </h1>
          <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-ivory/85">
            Inner Weather brings together human-centered psychological support and a gentle AI journal, giving you more
            space to notice, reflect, and reconnect with what matters between sessions.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#weather" className="btn btn-light">
              Explore the Experience
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a href="#journal" className="btn btn-outline-light">
              Meet Your AI Journal
            </a>
          </div>
          <p className="mt-10 flex items-center gap-3 text-sm text-ivory/75">
            <span className="inline-block h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
            Technology for reflection. Human connection at the center.
          </p>
        </div>

        {/* Floating product moments, set among the leaves */}
        <div className="relative z-10 mx-auto w-full max-w-[380px] lg:mr-0 lg:mt-24" aria-hidden="true">
          <div className="mb-3 flex items-end gap-2 pl-4">
            <AssistantAvatar className="h-7 w-7 shrink-0" />
            <div className="rounded-2xl rounded-bl-md bg-white/95 px-4 py-3 text-[0.88rem] leading-snug text-ink shadow-[0_20px_40px_-24px_rgba(24,63,50,0.7)]">
              What has been taking more energy than you expected?
            </div>
          </div>
          <div className="anim-float rounded-[24px] bg-ivory/95 p-5 text-forest shadow-[0_30px_60px_-28px_rgba(24,63,50,0.8)] ring-1 ring-white/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-[0.62rem] text-muted">Your inner weather</p>
              <span className="text-[0.7rem] text-muted">Tue · 21:14</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-moss">
                <WeatherGlyph kind="cloudy" className="h-8 w-8" />
              </span>
              <p className="font-serif text-[1.35rem] leading-tight">
                Partly cloudy, <em className="italic">finding clarity</em>
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-forest/10 pt-4">
              <span className="flex items-center gap-2 text-[0.78rem] font-medium text-moss">
                <MessageCircle size={14} /> AI Journal · via messenger
              </span>
              <span className="rounded-full bg-forest px-3 py-1 text-[0.7rem] font-semibold text-ivory">Demo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
