'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
    const year = new Date().getFullYear()
    const pathname = usePathname()

    // Hide footer on auth routes to keep auth screens minimal and focused
    if (pathname?.startsWith('/auth')) return null

    return (
        <footer className="bg-black border-t border-gray-800 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Link href="/" className="flex items-center space-x-2" aria-label="NextGen-CTO home">
                                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">N</span>
                                </div>
                                <h4 className="text-xl font-bold">NextGen-CTO</h4>
                            </Link>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-md">
                            Building the future of tech education through consistency, community,
                            and expert mentorship. Join thousands of learners transforming their careers.
                        </p>

                        {/* App download buttons omitted (no apps yet). Keeping layout similar to Chaicode. */}
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Products</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="/courses" className="hover:text-orange-400 transition-colors">Courses</Link>
                            </li>
                            <li>
                                <Link href="/cohorts" className="hover:text-orange-400 transition-colors">Cohorts</Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-400 transition-colors">Udemy</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="/docs" className="hover:text-orange-400 transition-colors">Docs</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-orange-400 transition-colors">Pricing</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Social</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="#" className="hover:text-orange-400 transition-colors">X</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-400 transition-colors">Discord</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-400 transition-colors">GitHub</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-400 transition-colors">YouTube</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">&copy; {year} NextGen-CTO. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/terms" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">Privacy</Link>
                        <Link href="/cookies" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
