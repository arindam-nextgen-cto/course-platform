const fs = require('fs')
const path = require('path')

// Create the images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Course thumbnail configurations
const thumbnails = [
  {
    filename: 'react-course.jpg',
    title: 'React Development',
    color: '#61DAFB',
    bgColor: '#20232A'
  },
  {
    filename: 'video-course.jpg',
    title: 'Video Course Demo',
    color: '#FF6B6B',
    bgColor: '#2C3E50'
  },
  {
    filename: 'javascript-course.jpg',
    title: 'JavaScript Tutorial',
    color: '#F7DF1E',
    bgColor: '#323330'
  },
  {
    filename: 'react-fundamentals.jpg',
    title: 'React Fundamentals',
    color: '#61DAFB',
    bgColor: '#282C34'
  },
  {
    filename: 'nodejs-course.jpg',
    title: 'Node.js Backend',
    color: '#68A063',
    bgColor: '#303030'
  },
  {
    filename: 'web-dev-intro.jpg',
    title: 'Web Development',
    color: '#4ECDC4',
    bgColor: '#45B7B8'
  },
  {
    filename: 'course-placeholder.jpg',
    title: 'Course',
    color: '#6C63FF',
    bgColor: '#F8F9FA'
  }
]

// Generate SVG thumbnails
thumbnails.forEach(({ filename, title, color, bgColor }) => {
  const svg = `
<svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${filename}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="225" fill="url(#grad-${filename})"/>
  
  <!-- Pattern overlay -->
  <defs>
    <pattern id="pattern-${filename}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="2" fill="${color}" opacity="0.1"/>
    </pattern>
  </defs>
  <rect width="400" height="225" fill="url(#pattern-${filename})"/>
  
  <!-- Icon background -->
  <circle cx="200" cy="90" r="30" fill="${color}" opacity="0.2"/>
  
  <!-- Play icon or code symbol -->
  ${title.includes('Video') ? 
    `<polygon points="190,80 190,100 210,90" fill="${color}" opacity="0.6"/>` :
    `<text x="200" y="98" font-family="monospace" font-size="24" text-anchor="middle" fill="${color}" opacity="0.6">&lt;/&gt;</text>`
  }
  
  <!-- Title -->
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">
    ${title}
  </text>
  
  <!-- Subtitle -->
  <text x="200" y="175" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="white" opacity="0.8">
    NextGen CTO Course
  </text>
</svg>`.trim()

  const svgPath = path.join(imagesDir, filename.replace('.jpg', '.svg'))
  fs.writeFileSync(svgPath, svg)
  
  // Also create a simple HTML file that can be used to convert to JPG if needed
  const htmlPath = path.join(imagesDir, filename.replace('.jpg', '.html'))
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 20px; background: #f0f0f0; }
    .thumbnail { width: 400px; height: 225px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="thumbnail">
    ${svg}
  </div>
</body>
</html>`.trim()
  
  fs.writeFileSync(htmlPath, html)
  console.log(`✅ Generated thumbnail: ${filename}`)
})

console.log('🎉 All thumbnails generated successfully!')
console.log('📁 Files created in:', imagesDir)
console.log('💡 Tip: You can open the .html files in a browser and take screenshots to create .jpg versions')