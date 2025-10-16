'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
    const year = new Date().getFullYear()
    const pathname = usePathname()

    // Hide footer on auth routes to keep auth screens minimal and focused
    if (pathname?.startsWith('/auth')) return null

    return (
        <footer className="bg-card border-t border-border text-foreground py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Link href="/" className="flex items-center space-x-2" aria-label="NextGen-CTO home">
                                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-lg flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">N</span>
                                </div>
                                <h4 className="text-xl font-bold">NextGen-CTO</h4>
                            </Link>
                        </div>
                        <p className="text-muted-foreground mb-4 max-w-md">
                            Building the future of tech education through consistency, community,
                            and expert mentorship. Join thousands of learners transforming their careers.
                        </p>

                        {/* App download buttons omitted (no apps yet). Keeping layout similar to Chaicode. */}
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-foreground">Products</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <Link href="/courses" className="hover:text-[hsl(var(--accent-2))] transition-colors">Courses</Link>
                            </li>
                            <li>
                                <Link href="/cohorts" className="hover:text-[hsl(var(--accent-2))] transition-colors">Cohorts</Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[hsl(var(--accent-2))] transition-colors">Udemy</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-foreground">Resources</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <Link href="/docs" className="hover:text-[hsl(var(--accent-2))] transition-colors">Docs</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-[hsl(var(--accent-2))] transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-[hsl(var(--accent-2))] transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-[hsl(var(--accent-2))] transition-colors">Pricing</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-foreground">Social</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-[hsl(var(--accent-2))] transition-colors">X</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[hsl(var(--accent-2))] transition-colors">Discord</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[hsl(var(--accent-2))] transition-colors">GitHub</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[hsl(var(--accent-2))] transition-colors">YouTube</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">&copy; {year} NextGen-CTO. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/terms" className="text-muted-foreground hover:text-[hsl(var(--accent))] text-sm transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-muted-foreground hover:text-[hsl(var(--accent))] text-sm transition-colors">Privacy</Link>
                        <Link href="/cookies" className="text-muted-foreground hover:text-[hsl(var(--accent))] text-sm transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
