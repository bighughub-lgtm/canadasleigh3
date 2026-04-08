import './Hero.css'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const HERO_VIDEO_SRC = '/heroooAT.mp4'
const HERO_FALLBACK_IMAGE = '/statiska bilde.jpg'

export default function Hero() {
  const videoRef = useRef(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    let timeoutId = null
    let idleId = null

    const queueVideoLoad = () => {
      setShouldLoadVideo(true)
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(queueVideoLoad, { timeout: 1200 })
    } else {
      timeoutId = window.setTimeout(queueVideoLoad, 140)
    }

    return () => {
      if (idleId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoadVideo || !videoReady || videoFailed) return

    video.muted = muted

    if (!playing) {
      video.pause()
      return
    }

    const playPromise = video.play()
    if (playPromise?.catch) {
      playPromise.catch(() => {
        setPlaying(false)
      })
    }
  }, [muted, playing, shouldLoadVideo, videoReady, videoFailed])

  const togglePlay = () => {
    const v = videoRef.current

    setShouldLoadVideo(true)
    setPlaying((current) => {
      const nextPlaying = !current

      if (!v) return nextPlaying

      if (nextPlaying) {
        const playPromise = v.play()
        if (playPromise?.catch) {
          playPromise.catch(() => {
            setPlaying(false)
          })
        }
      } else {
        v.pause()
      }

      return nextPlaying
    })
  }

  const toggleMute = () => {
    const v = videoRef.current
    setMuted((current) => {
      const nextMuted = !current
      if (v) v.muted = nextMuted
      return nextMuted
    })
  }

  const handleVideoReady = () => {
    setVideoReady(true)
  }

  const handleVideoError = () => {
    setVideoFailed(true)
    setVideoReady(false)
    setPlaying(false)
  }

  return (
    <section className="hero" id="virsraksts">
      <div className="hero-media" aria-hidden="true">
        <img
          className="hero-fallback"
          src={HERO_FALLBACK_IMAGE}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {shouldLoadVideo && !videoFailed ? (
          <video
            ref={videoRef}
            className={`hero-video${videoReady ? ' hero-video--ready' : ''}`}
            src={HERO_VIDEO_SRC}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="metadata"
            poster={HERO_FALLBACK_IMAGE}
            onCanPlay={handleVideoReady}
            onLoadedData={handleVideoReady}
            onError={handleVideoError}
          />
        ) : null}
      </div>
      <div className="hero-gradient" />

      {/* Centered hero content block */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <span className="hero-label">Zviedrijā ražotas · Officiālais izplatītājs Baltijā</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        >
          Canada Pulkan<br />
          <span className="hero-title-accent">Apvidus Ragavas</span>
        </motion.h1>

        <motion.p
          className="hero-slogan"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        >
          Komforts, kad tas ir nepieciešams visvairāk
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <a href="#produkti" className="btn-primary">Skatīties modeļus</a>
          <a href="#kontakti" className="btn-outline">Sazināties</a>
        </motion.div>

        <motion.div
          className="hero-controls"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <button
            type="button"
            className="hero-ctrl-btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pauze' : 'Atskaņot'}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9L5 21V3z" fill="currentColor"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="hero-ctrl-btn"
            onClick={toggleMute}
            aria-label={muted ? 'Ieslēgt skaņu' : 'Izslēgt skaņu'}
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor"/>
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
      >
        <span>Ritināt</span>
        <div className="hero-scroll-line" />
      </motion.div>
    </section>
  )
}
