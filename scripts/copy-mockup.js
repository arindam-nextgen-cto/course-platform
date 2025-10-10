const fs = require('fs')
const path = require('path')

const src = path.join(process.cwd(), 'app', 'images', 'anuj-clone.png')
const destDir = path.join(process.cwd(), 'public', 'images')
const dest = path.join(destDir, 'anuj-clone.png')

try {
  if (!fs.existsSync(src)) {
    console.warn('Source mockup not found at', src)
    process.exit(0)
  }

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  fs.copyFileSync(src, dest)
  console.log('✅ Copied anuj-clone.png to public/images')
} catch (err) {
  console.error('Failed to copy mockup:', err)
  process.exit(1)
}
