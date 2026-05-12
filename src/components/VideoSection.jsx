import './VideoSection.css'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const fallbackVideos = [
  {
    id: 'vannas-lat',
    type: 'local',
    src: '/Vannas LAT.mp4',
    previewTime: 1.4,
    title: 'Pilns process no A-Z',
    desc: 'Pilns darba process no sākuma līdz gatavam rezultātam.',
  },
  {
    id: 'small-vid',
    type: 'local',
    src: '/small vid.mp4',
    previewTime: 0.8,
    title: 'Kā mazā vanna ielien dzīvnieks',
    desc: 'Praktisks piemērs, kā mazā vanna tiek izmantota medījuma ievietošanai un transportēšanai.',
  },
  {
    id: '9uT6r90BZwY',
    type: 'youtube',
    title: 'Ragavas darbībā',
    desc: 'Reāls piemērs, kā ragavas uzvedas praktiskā lietošanā dabā.',
  },
  {
    id: 'izPM9_FGDE0',
    type: 'youtube',
    title: 'Lietošana bezceļā',
    desc: 'Skats uz ragavu lietošanu sarežģītākos apstākļos un reljefā.',
  },
  {
    id: 'dp_ivalzEe8',
    type: 'youtube',
    title: 'Pārvietošana un vilkšana',
    desc: 'Kā ragavas tiek vilktas un izmantotas ikdienas darbā.',
  },
  {
    id: 'CKOWTuo_WJg',
    type: 'youtube',
    title: 'Kravnesība praksē',
    desc: 'Praktisks ieskats ragavu ietilpībā un to izmantošanā smagākām kravām.',
  },
  {
    id: 'v2EYZRFkakw',
    type: 'youtube',
    title: 'Darbs meža apstākļos',
    desc: 'Ragavu pielietojums mežā, starp kokiem, celmiem un nelīdzenā segumā.',
  },
  {
    id: 't8JmTwOfBss',
    type: 'youtube',
    title: 'Izturība un pielietojums',
    desc: 'Vēl viens piemērs, kas parāda ragavu izturību un praktisko vērtību.',
  },
  {
    id: 'KEZ34NNd6dY',
    type: 'youtube',
    title: 'Papildu demonstrācija',
    desc: 'Vēl viens reāls demonstrācijas video par ragavu lietošanu praksē.',
  },
]

function textFallback(item, field, fallback = '') {
  return item[`${field}_lv`] || item[`${field}_en`] || item[`${field}_ru`] || item[`${field}_lt`] || item[`${field}_est`] || fallback
}

function getYouTubeId(videoUrl) {
  if (!videoUrl) return null

  if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) return videoUrl

  try {
    const url = new URL(videoUrl)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (url.pathname === '/watch') return url.searchParams.get('v')
      const parts = url.pathname.split('/').filter(Boolean)
      if (['embed', 'shorts', 'live'].includes(parts[0])) return parts[1] || null
    }
  } catch {
    return null
  }

  return null
}

function mapCmsVideos(items) {
  return items.map((item) => {
    const youtubeId = getYouTubeId(item.video_url)

    return {
      id: item.id,
      type: youtubeId ? 'youtube' : 'local',
      videoId: youtubeId,
      src: item.video_url,
      thumbnailUrl: item.thumbnail_url,
      title: textFallback(item, 'title', 'Video'),
      desc: textFallback(item, 'description', ''),
    }
  })
}

function LocalVideoThumbnail({ src, previewTime = 0.1 }) {
  const previewRef = useRef(null)

  useEffect(() => {
    const video = previewRef.current
    if (!video) return

    const setPreviewFrame = () => {
      if (!Number.isFinite(video.duration)) return

      const targetTime = Math.min(previewTime, Math.max(video.duration - 0.1, 0))
      const handleSeeked = () => {
        video.pause()
      }

      video.addEventListener('seeked', handleSeeked, { once: true })

      if (targetTime > 0) {
        video.currentTime = targetTime
      }
    }

    if (video.readyState >= 1) {
      setPreviewFrame()
    } else {
      video.addEventListener('loadedmetadata', setPreviewFrame, { once: true })
    }
  }, [previewTime, src])

  return (
    <video
      ref={previewRef}
      className="video-thumb-media"
      src={src}
      muted
      playsInline
      preload="metadata"
      tabIndex={-1}
      aria-hidden="true"
    />
  )
}

export default function VideoSection() {
  const [videos, setVideos] = useState(fallbackVideos)
  const [activeIdx, setActiveIdx] = useState(0)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const playlistRef = useRef(null)
  const playerRef = useRef(null)
  const active = videos[activeIdx]

  useEffect(() => {
    let mounted = true

    import('../lib/cmsApi')
      .then(({ getActiveVideos }) => getActiveVideos())
      .then((items) => {
        if (!mounted || items.length === 0) return
        setVideos(mapCmsVideos(items))
        setActiveIdx(0)
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const playlist = playlistRef.current
    if (!playlist) return

    const updateScrollState = () => {
      const remainingScroll = playlist.scrollHeight - playlist.clientHeight - playlist.scrollTop
      setCanScrollDown(remainingScroll > 8)
    }

    updateScrollState()

    playlist.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      playlist.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  const handleSelectVideo = (index) => {
    setActiveIdx(index)

    if (!window.matchMedia('(max-width: 1024px)').matches) return

    window.requestAnimationFrame(() => {
      const player = playerRef.current
      if (!player) return

      const top = player.getBoundingClientRect().top + window.scrollY - 86
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
  }

  const handlePlaylistCueClick = () => {
    const playlist = playlistRef.current
    if (!playlist) return

    playlist.scrollBy({
      top: Math.max(playlist.clientHeight * 0.8, 180),
      behavior: 'smooth',
    })
  }

  return (
    <section className="section video-section" id="video">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-label">Videoklipi</span>
          <h2 className="section-title">Skaties ragavas darbībā</h2>
          <p className="section-subtitle">
            Reāli video no lauka — kā Canada apvidus ragavas darbojas skarbajos apstākļos.
          </p>
        </motion.div>

        <div className="video-layout">
          <motion.div
            className="video-main"
            ref={playerRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="video-embed">
              {active.type === 'local' ? (
                <video
                  key={active.src}
                  className="video-embed-player"
                  src={active.src}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <iframe
                  key={active.videoId || active.id}
                  className="video-embed-player"
                  src={`https://www.youtube.com/embed/${active.videoId || active.id}?rel=0&modestbranding=1`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="video-active-info">
              <span className="video-active-label">Aktīvais video</span>
              <h3>{active.title}</h3>
              <p>{active.desc}</p>
            </div>
          </motion.div>

          <motion.div
            className={`video-playlist-shell${canScrollDown ? '' : ' video-playlist-shell--end'}`}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="video-playlist-head">
              <span className="video-playlist-label">Atskaņošanas saraksts</span>
              <span className="video-playlist-count">{videos.length} video</span>
            </div>

            <div className="video-playlist" ref={playlistRef}>
              {videos.map((v, i) => (
                <motion.button
                  key={v.id}
                  className={`video-card${activeIdx === i ? ' video-card--active' : ''}`}
                  onClick={() => handleSelectVideo(i)}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.42 }}
                >
                  <div className={`video-thumb${v.type === 'local' ? ' video-thumb--local' : ''}`}>
                    {v.type === 'youtube' ? (
                      <img
                        className="video-thumb-media"
                        src={v.thumbnailUrl || `https://img.youtube.com/vi/${v.videoId || v.id}/mqdefault.jpg`}
                        alt={v.title}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : v.thumbnailUrl ? (
                      <img
                        className="video-thumb-media"
                        src={v.thumbnailUrl}
                        alt={v.title}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <LocalVideoThumbnail src={v.src} previewTime={v.previewTime} />
                    )}
                    <div className={`video-play-icon${activeIdx === i ? ' video-play-icon--active' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 3l14 9L5 21V3z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <div className="video-card-body">
                    <span className="video-num">0{i + 1}</span>
                    <div className="video-copy">
                      <div className="video-card-title">{v.title}</div>
                      <div className="video-card-desc">{v.desc}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <button
              type="button"
              className={`video-playlist-cue${canScrollDown ? '' : ' video-playlist-cue--hidden'}`}
              onClick={handlePlaylistCueClick}
              aria-label="Rādīt vēl videoklipus"
            >
              <span>Vairāk video zemāk</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
