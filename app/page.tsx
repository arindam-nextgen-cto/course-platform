import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h1 className="text-xl font-bold text-white">NextGen-CTO</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-300 hover:text-white font-medium transition-colors">
              Courses
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white font-medium transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white font-medium transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="font-medium text-white hover:bg-gray-800">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 bg-gray-800 text-orange-400 border-gray-700">
                🚀 New cohorts starting every month
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Consistency
                <br />
                and <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Community</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Join a structured learning community where consistency meets excellence. 
                Build production-ready skills through live cohorts, peer collaboration, and expert mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/courses">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-medium px-8">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="font-medium px-8 border-gray-600 text-gray-300 hover:bg-gray-800">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Image/Video Placeholder */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                  <p className="text-gray-400">Watch our community in action</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">5000+</div>
              <div className="text-sm text-gray-400">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
              <div className="text-sm text-gray-400">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">4.9/5</div>
              <div className="text-sm text-gray-400">Community Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trending
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover what's hot in our learning community. Join the most popular cohorts and trending discussions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">React Mastery</CardTitle>
                    <p className="text-gray-400 text-sm">with Sarah Chen</p>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  Master modern React patterns, hooks, and state management. Build production-ready applications.
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-blue-900 text-blue-300">Live Cohort</Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">12 weeks</Badge>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600"></div>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Python & AI</CardTitle>
                    <p className="text-gray-400 text-sm">with Dr. Alex Kumar</p>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  Dive deep into Python programming and artificial intelligence. Build ML models from scratch.
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-green-900 text-green-300">Starting Soon</Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">10 weeks</Badge>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">DevOps Pro</CardTitle>
                    <p className="text-gray-400 text-sm">with Mike Rodriguez</p>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  Master cloud infrastructure, CI/CD pipelines, and container orchestration with Kubernetes.
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-purple-900 text-purple-300">Hot</Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">8 weeks</Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Experts
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Learn from industry veterans who've built products at top tech companies and are passionate about teaching.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600"></div>
              </div>
              <h3 className="text-white font-semibold mb-1">Sarah Chen</h3>
              <p className="text-gray-400 text-sm mb-2">Ex-Meta, Google</p>
              <p className="text-gray-500 text-xs">React & Frontend</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
              </div>
              <h3 className="text-white font-semibold mb-1">Dr. Alex Kumar</h3>
              <p className="text-gray-400 text-sm mb-2">Ex-OpenAI, Tesla</p>
              <p className="text-gray-500 text-xs">AI & Machine Learning</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600"></div>
              </div>
              <h3 className="text-white font-semibold mb-1">Mike Rodriguez</h3>
              <p className="text-gray-400 text-sm mb-2">Ex-AWS, Netflix</p>
              <p className="text-gray-500 text-xs">DevOps & Cloud</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
              </div>
              <h3 className="text-white font-semibold mb-1">Lisa Park</h3>
              <p className="text-gray-400 text-sm mb-2">Ex-Stripe, Uber</p>
              <p className="text-gray-500 text-xs">Backend & Systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Learning Paths
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Structured learning journeys designed to take you from beginner to job-ready professional.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-800/30 hover:border-orange-700/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-orange-500 text-white">CONCEPT</Badge>
                  <span className="text-orange-400 text-sm font-medium">12 weeks</span>
                </div>
                <CardTitle className="text-white text-2xl mb-2">Full-Stack Development</CardTitle>
                <CardDescription className="text-gray-300 mb-4">
                  Master the complete web development stack from frontend to backend, databases, and deployment.
                </CardDescription>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    React & TypeScript
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Node.js & Express
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    PostgreSQL & Prisma
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    AWS Deployment
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">$2,499</span>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                    Start Path
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 hover:border-blue-700/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-500 text-white">CONCEPT</Badge>
                  <span className="text-blue-400 text-sm font-medium">10 weeks</span>
                </div>
                <CardTitle className="text-white text-2xl mb-2">AI & Machine Learning</CardTitle>
                <CardDescription className="text-gray-300 mb-4">
                  Build intelligent applications with Python, machine learning, and modern AI frameworks.
                </CardDescription>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Python & Data Science
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    TensorFlow & PyTorch
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    OpenAI & LangChain
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    MLOps & Deployment
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">$2,199</span>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Start Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="font-medium border-gray-600 text-gray-300 hover:bg-gray-800">
                View All Paths
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Wall of Love
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Real stories from our community members who transformed their careers through consistent learning.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full"></div>
                  <div>
                    <h3 className="text-white font-semibold">Jessica Martinez</h3>
                    <p className="text-gray-400 text-sm">Software Engineer at Google</p>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  "The consistency and community at NextGen-CTO changed everything for me. 
                  From zero coding experience to landing my dream job at Google in 8 months. 
                  The live cohorts kept me accountable and motivated."
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                  <div>
                    <h3 className="text-white font-semibold">David Chen</h3>
                    <p className="text-gray-400 text-sm">ML Engineer at OpenAI</p>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  "The AI cohort was incredible. Learning alongside peers who were equally passionate 
                  made all the difference. The projects we built were portfolio-worthy and helped me 
                  transition from finance to AI engineering."
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Start your journey with thousands of learners who are building their tech careers through 
            consistency, community, and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-medium px-8">
                Start Learning Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600 font-medium px-8">
                Talk to Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <h4 className="text-xl font-bold">NextGen-CTO</h4>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Building the future of tech education through consistency, community, and expert mentorship. 
                Join thousands of learners transforming their careers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">Twitter</a>
                <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">GitHub</a>
                <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">Discord</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Learning</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-orange-400 transition-colors">All Courses</Link></li>
                <li><Link href="/paths" className="hover:text-orange-400 transition-colors">Learning Paths</Link></li>
                <li><Link href="/cohorts" className="hover:text-orange-400 transition-colors">Live Cohorts</Link></li>
                <li><Link href="/projects" className="hover:text-orange-400 transition-colors">Projects</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/discord" className="hover:text-orange-400 transition-colors">Discord</Link></li>
                <li><Link href="/events" className="hover:text-orange-400 transition-colors">Events</Link></li>
                <li><Link href="/mentorship" className="hover:text-orange-400 transition-colors">Mentorship</Link></li>
                <li><Link href="/success-stories" className="hover:text-orange-400 transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-orange-400 transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-orange-400 transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; 2024 NextGen-CTO. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">Terms</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">Privacy</Link>
              <Link href="/cookies" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}