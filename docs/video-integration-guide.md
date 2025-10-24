# Video Integration Guide

NextGen-CTO supports multiple video platforms and hosting options, making it flexible for various content delivery needs.

## Supported Video Platforms

### 1. YouTube
- **Best for**: Public educational content, leveraging existing YouTube audience
- **URL formats**: 
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
- **Features**: Automatic thumbnail, external link, lazy loading
- **Pros**: Free hosting, great SEO, existing audience
- **Cons**: Ads (unless YouTube Premium), platform dependency

### 2. Vimeo
- **Best for**: Professional content, ad-free experience
- **URL formats**:
  - `https://vimeo.com/VIDEO_ID`
  - `https://vimeo.com/channels/CHANNEL/VIDEO_ID`
  - `https://vimeo.com/groups/GROUP/videos/VIDEO_ID`
- **Features**: Clean interface, privacy controls, high quality
- **Pros**: No ads, professional appearance, better privacy
- **Cons**: Limited free storage, less discovery

### 3. Wistia
- **Best for**: Business training, detailed analytics
- **URL formats**:
  - `https://wistia.com/medias/VIDEO_ID`
  - `https://fast.wistia.net/embed/iframe/VIDEO_ID`
- **Features**: Business-focused player, detailed analytics
- **Pros**: Excellent analytics, lead generation tools, customizable
- **Cons**: Paid service, primarily for business use

### 4. Mux
- **Best for**: High-performance video streaming
- **URL formats**: Custom Mux URLs
- **Features**: Adaptive streaming, global CDN
- **Pros**: Excellent performance, developer-friendly API
- **Cons**: Paid service, requires technical setup

### 5. Self-Hosted Videos
- **Best for**: Complete control, privacy, custom branding
- **Supported formats**: MP4, WebM, OGV
- **Features**: HTML5 video player, full control
- **Pros**: Complete control, no platform dependency, privacy
- **Cons**: Hosting costs, bandwidth management, no built-in analytics

### 6. External/Custom
- **Best for**: Other platforms or custom solutions
- **Features**: Direct embed URL support
- **Use cases**: Custom video platforms, specialized players

## How It Works

### Automatic Detection
The system automatically detects the video platform from the URL:

```typescript
const videoInfo = extractVideoInfo(url)
// Returns: { provider, videoId, embedUrl, watchUrl, thumbnailUrl }
```

### Video Processing Pipeline
1. **URL Input**: User pastes any supported video URL
2. **Provider Detection**: System identifies the platform
3. **ID Extraction**: Extracts video ID using platform-specific regex
4. **URL Generation**: Creates embed and thumbnail URLs
5. **Storage**: Saves all information to database
6. **Playback**: Uses appropriate player for the platform

### Database Schema
```sql
CREATE TYPE "VideoProvider" AS ENUM (
  'YOUTUBE', 'VIMEO', 'WISTIA', 'MUX', 'SELF_HOSTED', 'EXTERNAL'
);

ALTER TABLE lessons ADD COLUMN "videoProvider" "VideoProvider";
ALTER TABLE lessons ADD COLUMN "videoId" TEXT;
ALTER TABLE lessons ADD COLUMN "embedUrl" TEXT;
ALTER TABLE lessons ADD COLUMN "thumbnail" TEXT;
```

## Usage Examples

### Creating a Course with Mixed Video Sources

1. **YouTube Tutorial Series**
   ```
   Section: "Getting Started"
   - Lesson 1: https://www.youtube.com/watch?v=abc123 (Free)
   - Lesson 2: https://www.youtube.com/watch?v=def456 (Paid)
   ```

2. **Professional Vimeo Content**
   ```
   Section: "Advanced Concepts"  
   - Lesson 3: https://vimeo.com/123456789 (Paid)
   - Lesson 4: https://vimeo.com/987654321 (Paid)
   ```

3. **Self-Hosted Premium Content**
   ```
   Section: "Exclusive Content"
   - Lesson 5: https://cdn.yoursite.com/video.mp4 (Paid)
   - Lesson 6: https://storage.yoursite.com/advanced.mp4 (Paid)
   ```

### Best Practices

#### Content Strategy
- **Free lessons**: Use YouTube for maximum reach and SEO
- **Premium content**: Use Vimeo or self-hosted for ad-free experience
- **Business training**: Consider Wistia for analytics and lead generation
- **High-performance needs**: Use Mux for adaptive streaming

#### Technical Considerations
- **Bandwidth**: YouTube/Vimeo handle bandwidth, self-hosted requires planning
- **Analytics**: Wistia provides detailed analytics, others are basic
- **Privacy**: Self-hosted offers maximum privacy control
- **Reliability**: Established platforms have better uptime guarantees

#### User Experience
- **Consistent interface**: All videos use the same player interface
- **Lazy loading**: Videos load only when user clicks play
- **Responsive design**: Works on all device sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Implementation Details

### Video Player Component
```typescript
<VideoPlayer
  provider="YOUTUBE"
  videoId="W6NZfCO5SIk"
  title="Introduction to JavaScript"
  showTitle={true}
  autoplay={false}
/>
```

### Supported Props
- `provider`: Video platform type
- `videoId`: Platform-specific video identifier
- `embedUrl`: Custom embed URL (optional)
- `watchUrl`: External watch URL (optional)
- `thumbnailUrl`: Video thumbnail (optional)
- `title`: Video title
- `className`: Custom CSS classes
- `autoplay`: Auto-play on load (default: false)
- `showTitle`: Show title and external link (default: true)

### URL Processing
```typescript
import { extractVideoInfo } from '@/lib/video-utils'

const videoInfo = extractVideoInfo('https://www.youtube.com/watch?v=abc123')
// Returns:
// {
//   provider: 'YOUTUBE',
//   videoId: 'abc123',
//   embedUrl: 'https://www.youtube.com/embed/abc123',
//   watchUrl: 'https://www.youtube.com/watch?v=abc123',
//   thumbnailUrl: 'https://img.youtube.com/vi/abc123/hqdefault.jpg'
// }
```

## Migration Guide

### From YouTube-Only to Multi-Platform

If you're upgrading from a YouTube-only system:

1. **Database Migration**: Add new columns for video provider and metadata
2. **Update Components**: Replace YouTube-specific components with universal ones
3. **URL Processing**: Update URL processing to handle multiple platforms
4. **Player Updates**: Use the new VideoPlayer component

### Existing Content
- Existing YouTube videos will continue to work
- Database migration automatically sets provider to 'YOUTUBE'
- No content re-upload required

## Troubleshooting

### Common Issues

1. **Video Not Loading**
   - Check if URL is valid and accessible
   - Verify video privacy settings (especially Vimeo)
   - Ensure embed permissions are enabled

2. **Thumbnail Not Showing**
   - YouTube: Thumbnails are automatic
   - Vimeo: May require API call for thumbnails
   - Self-hosted: Provide custom thumbnail URL

3. **Autoplay Not Working**
   - Most browsers block autoplay without user interaction
   - Use click-to-play approach (implemented by default)

4. **Mobile Issues**
   - Ensure responsive design is enabled
   - Test on various device sizes
   - Consider mobile-specific optimizations

### Platform-Specific Notes

#### YouTube
- Respects user's YouTube Premium status
- May show related videos at end (can be disabled)
- Supports closed captions if available

#### Vimeo
- Respects video privacy settings
- May require Vimeo Pro for some embed features
- Better for professional/business content

#### Self-Hosted
- Requires proper MIME types on server
- Consider multiple formats for browser compatibility
- Implement your own analytics if needed

## Future Enhancements

### Planned Features
- **Video Analytics**: Track viewing progress and completion
- **Adaptive Streaming**: Automatic quality adjustment
- **Offline Support**: Download for offline viewing
- **Interactive Elements**: Quizzes and annotations within videos
- **Live Streaming**: Support for live video sessions

### API Integrations
- **YouTube Data API**: Fetch video metadata automatically
- **Vimeo API**: Get thumbnails and video information
- **Wistia API**: Advanced analytics integration
- **Custom Analytics**: Track detailed viewing behavior

This flexible video system ensures your course content can be delivered through the best platform for each specific need while maintaining a consistent user experience.