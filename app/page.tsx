import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">NextGen-CTO</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/courses" className="text-gray-600 hover:text-gray-900">
              Courses
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Learn Tech Skills Through
            <span className="text-blue-600"> Live Cohorts</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join structured learning cohorts with live sessions, peer interaction, and hands-on projects. 
            Build real skills with guidance from industry experts.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/courses">
              <Button size="lg">Browse Courses</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose NextGen-CTO?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Live Cohorts</CardTitle>
                <CardDescription>
                  Learn alongside peers in structured cohorts with scheduled live sessions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Industry Projects</CardTitle>
                <CardDescription>
                  Build real-world projects that showcase your skills to potential employers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expert Mentorship</CardTitle>
                <CardDescription>
                  Get guidance from experienced developers and industry professionals
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">NextGen-CTO</h4>
              <p className="text-gray-400">
                Empowering the next generation of tech leaders through cohort-based learning.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-white">All Courses</Link></li>
                <li><Link href="/courses?category=web" className="hover:text-white">Web Development</Link></li>
                <li><Link href="/courses?category=mobile" className="hover:text-white">Mobile Development</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NextGen-CTO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}