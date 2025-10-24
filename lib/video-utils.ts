/**
 * Comprehensive video utilities for multiple platforms
 */

export type VideoProvider = 'YOUTUBE' | 'VIMEO' | 'WISTIA' | 'MUX' | 'SELF_HOSTED' | 'EXTERNAL'

export interface VideoInfo {
  provider: VideoProvider
  videoId: string
  embedUrl: string
  watchUrl: string
  thumbnailUrl: string
}

export interface VideoOptions {
  autoplay?: boolean
  start?: number
  end?: number
  modestbranding?: boolean
  rel?: boolean
  controls?: boolean
  muted?: boolean
}

/**
 * Detect video provider from URL
 */
export function detectVideoProvider(url: string): VideoProvider {
  if (!url) return 'EXTERNAL'
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'YOUTUBE'
  }
  if (url.includes('vimeo.com')) {
    return 'VIMEO'
  }
  if (url.includes('wistia.com') || url.includes('wi.st')) {
    return 'WISTIA'
  }
  if (url.includes('mux.com')) {
    return 'MUX'
  }
  
  return 'EXTERNAL'
}

/**
 * Extract video information from URL
 */
export function extractVideoInfo(url: string): VideoInfo | null {
  if (!url) return null
  
  const provider = detectVideoProvider(url)
  
  switch (provider) {
    case 'YOUTUBE':
      return extractYouTubeInfo(url)
    case 'VIMEO':
      return extractVimeoInfo(url)
    case 'WISTIA':
      return extractWistiaInfo(url)
    case 'MUX':
      return extractMuxInfo(url)
    default:
      return {
        provider: 'EXTERNAL',
        videoId: '',
        embedUrl: url,
        watchUrl: url,
        thumbnailUrl: ''
      }
  }
}

/**
 * YouTube utilities
 */
export function extractYouTubeId(url: string): string {
  if (!url) return ''
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  
  return (match && match[2].length === 11) ? match[2] : ''
}

export function extractYouTubeInfo(url: string): VideoInfo | null {
  const videoId = extractYouTubeId(url)
  if (!videoId) return null
  
  return {
    provider: 'YOUTUBE',
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }
}

/**
 * Vimeo utilities
 */
export function extractVimeoId(url: string): string {
  if (!url) return ''
  
  const regExp = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|))(\d+)(?:$|\/|\?)/
  const match = url.match(regExp)
  
  return match ? match[1] : ''
}

export function extractVimeoInfo(url: string): VideoInfo | null {
  const videoId = extractVimeoId(url)
  if (!videoId) return null
  
  return {
    provider: 'VIMEO',
    videoId,
    embedUrl: `https://player.vimeo.com/video/${videoId}`,
    watchUrl: `https://vimeo.com/${videoId}`,
    thumbnailUrl: '' // Vimeo thumbnails require API call
  }
}

/**
 * Wistia utilities
 */
export function extractWistiaId(url: string): string {
  if (!url) return ''
  
  // Wistia URLs can be complex, try multiple patterns
  const patterns = [
    /wistia\.com\/medias\/([a-zA-Z0-9]+)/,
    /wi\.st\/medias\/([a-zA-Z0-9]+)/,
    /fast\.wistia\.net\/embed\/iframe\/([a-zA-Z0-9]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return ''
}

export function extractWistiaInfo(url: string): VideoInfo | null {
  const videoId = extractWistiaId(url)
  if (!videoId) return null
  
  return {
    provider: 'WISTIA',
    videoId,
    embedUrl: `https://fast.wistia.net/embed/iframe/${videoId}`,
    watchUrl: `https://wistia.com/medias/${videoId}`,
    thumbnailUrl: `https://embed-ssl.wistia.com/deliveries/${videoId}.jpg`
  }
}

/**
 * Mux utilities
 */
export function extractMuxId(url: string): string {
  if (!url) return ''
  
  const regExp = /mux\.com\/v\/([a-zA-Z0-9]+)/
  const match = url.match(regExp)
  
  return match ? match[1] : ''
}

export function extractMuxInfo(url: string): VideoInfo | null {
  const videoId = extractMuxId(url)
  if (!videoId) return null
  
  return {
    provider: 'MUX',
    videoId,
    embedUrl: `https://stream.mux.com/${videoId}.m3u8`,
    watchUrl: url,
    thumbnailUrl: `https://image.mux.com/${videoId}/thumbnail.jpg`
  }
}

/**
 * Generate embed URL with options
 */
export function getVideoEmbedUrl(provider: VideoProvider, videoId: string, options: VideoOptions = {}): string {
  if (!videoId) return ''
  
  switch (provider) {
    case 'YOUTUBE':
      return getYouTubeEmbedUrl(videoId, options)
    case 'VIMEO':
      return getVimeoEmbedUrl(videoId, options)
    case 'WISTIA':
      return getWistiaEmbedUrl(videoId, options)
    case 'MUX':
      return getMuxEmbedUrl(videoId, options)
    default:
      return ''
  }
}

export function getYouTubeEmbedUrl(videoId: string, options: VideoOptions = {}): string {
  if (!videoId) return ''
  
  const params = new URLSearchParams()
  
  if (options.autoplay) params.set('autoplay', '1')
  if (options.start) params.set('start', options.start.toString())
  if (options.end) params.set('end', options.end.toString())
  if (options.modestbranding !== false) params.set('modestbranding', '1')
  if (options.rel === false) params.set('rel', '0')
  if (options.controls === false) params.set('controls', '0')
  
  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? '?' + queryString : ''}`
}

export function getVimeoEmbedUrl(videoId: string, options: VideoOptions = {}): string {
  if (!videoId) return ''
  
  const params = new URLSearchParams()
  
  if (options.autoplay) params.set('autoplay', '1')
  if (options.start) params.set('t', `${options.start}s`)
  if (options.muted) params.set('muted', '1')
  
  const queryString = params.toString()
  return `https://player.vimeo.com/video/${videoId}${queryString ? '?' + queryString : ''}`
}

export function getWistiaEmbedUrl(videoId: string, options: VideoOptions = {}): string {
  if (!videoId) return ''
  
  const params = new URLSearchParams()
  
  if (options.autoplay) params.set('autoPlay', 'true')
  if (options.muted) params.set('muted', 'true')
  
  const queryString = params.toString()
  return `https://fast.wistia.net/embed/iframe/${videoId}${queryString ? '?' + queryString : ''}`
}

export function getMuxEmbedUrl(videoId: string, options: VideoOptions = {}): string {
  if (!videoId) return ''
  
  // Mux typically uses HLS streams
  return `https://stream.mux.com/${videoId}.m3u8`
}

/**
 * Get video thumbnail
 */
export function getVideoThumbnail(provider: VideoProvider, videoId: string, quality: string = 'high'): string {
  if (!videoId) return ''
  
  switch (provider) {
    case 'YOUTUBE':
      return getYouTubeThumbnail(videoId, quality as any)
    case 'VIMEO':
      return '' // Requires API call
    case 'WISTIA':
      return `https://embed-ssl.wistia.com/deliveries/${videoId}.jpg`
    case 'MUX':
      return `https://image.mux.com/${videoId}/thumbnail.jpg`
    default:
      return ''
  }
}

export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
  if (!videoId) return ''
  
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg', 
    high: 'hqdefault.jpg',
    standard: 'sddefault.jpg',
    maxres: 'maxresdefault.jpg'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`
}

/**
 * Validate video ID format
 */
export function isValidVideoId(provider: VideoProvider, videoId: string): boolean {
  if (!videoId) return false
  
  switch (provider) {
    case 'YOUTUBE':
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
    case 'VIMEO':
      return /^\d+$/.test(videoId)
    case 'WISTIA':
      return /^[a-zA-Z0-9]+$/.test(videoId)
    case 'MUX':
      return /^[a-zA-Z0-9]+$/.test(videoId)
    default:
      return true
  }
}