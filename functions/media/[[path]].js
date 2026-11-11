import { serveMedia } from '../../server/media.js'

export const onRequestGet = (context) => serveMedia(context)
export const onRequestHead = (context) => serveMedia(context)
