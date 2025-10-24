'use client'

import { useState } from 'react'
import { Play, ExternalLink, Youtube, Video } from 'lucide-react'
import { VideoProvider, getVideoEmbedUrl, getVideoThumbnail } from '@/lib/video-utils'

interface VideoPlayerProps {
  provider: VideoProvider
  videoId: string
  embedUrl?: string
  watchUrl?: string
  thumbnailUrl?: string
  title?: string
  className?: string
  autoplay?: boolean
  showTitle?: boolean
}

export default function VideoPlayer({ 
  provider,
  videoId,
  embedUrl,
  watchUrl,
  thumbnailUrl,
  title, 
  className = '', 
  autoplay = false,
  showTitle = true 
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Generate URLs if not provided
  const finalEmbedUrl = embedUrl || getVideoEmbedUrl(provider, videoId, { autoplay })
  const finalWatchUrl = watchUrl || (provider === 'YOUTUBE' ? `https://www.youtube.com/watch?v=${videoId}` : '')
  const finalThumbnailUrl = thumbnailUrl || getVideoThumbnail(provider, videoId)

  if (!videoId && !embedUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500">No video available</p>
      </div>
    )
  }

  const getProviderIcon = () => {
    switch (provider) {
      case 'YOUTUBE':
        return <Youtube className="h-4 w-4 text-red-500" />
      case 'VIMEO':
        return <Video className="h-4 w-4 text-blue-500" />
      case 'WISTIA':
        return <Video className="h-4 w-4 text-green-500" />
      case 'MUX':
        return <Video className="h-4 w-4 text-purple-500" />
      default:
        return <Video className="h-4 w-4 text-gray-500" />
    }
  }

  const getProviderName = () => {
    switch (provider) {
      case 'YOUTUBE': return 'YouTube'
      case 'VIMEO': return 'Vimeo'
      case 'WISTIA': return 'Wistia'
      case 'MUX': return 'Mux'
      case 'SELF_HOSTED': return 'Self-hosted'
      default: return 'External'
    }
  }

  const getPlayButtonColor = () => {
    switch (provider) {
      case 'YOUTUBE': return 'bg-red-600 hover:bg-red-700'
      case 'VIMEO': return 'bg-blue-600 hover:bg-blue-700'
      case 'WISTIA': return 'bg-green-600 hover:bg-green-700'
      case 'MUX': return 'bg-purple-600 hover:bg-purple-700'
      default: return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {showTitle && title && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title}</h3>
          {finalWatchUrl && (
            <a
              href={finalWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              {getProviderIcon()}
              <span className="ml-1">Watch on {getProviderName()}</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      )}
      
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            {finalThumbnailUrl && (
              <img
                src={finalThumbnailUrl}
                alt={title || 'Video thumbnail'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => setIsLoaded(true)}
              className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-colors z-10 ${getPlayButtonColor()}`}
            >
              <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
            </button>
          </div>
        )}
        
        {isLoaded && finalEmbedUrl && (
          <>
            {provider === 'MUX' ? (
              // For Mux, we might need a special player
              <video
                src={finalEmbedUrl}
                controls
                autoPlay={autoplay}
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <iframe
                src={finalEmbedUrl}
                title={title || `${getProviderName()} video`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Backward compatibility - YouTube-specific component
export function YouTubePlayer(props: Omit<VideoPlayerProps, 'provider'>) {
  return <VideoPlayer {...props} provider="YOUTUBE" />
}