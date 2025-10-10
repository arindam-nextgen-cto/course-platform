import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import anuj from '@/app/images/anuj-clone.png'

export default function Hero() {
    return (
        <section className="pt-24 pb-16 px-4 relative">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">
                    <div className="lg:w-6/12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="trusted-pill text-sm text-gray-300">Trusted by <strong className="ml-1">1.5M+</strong></span>
                            <Badge variant="secondary" className="ml-2 bg-transparent text-gray-300 border-gray-700">🚀 New cohorts monthly</Badge>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Learn consistently,
                            <br />
                            build with <span className="gradient-text">community</span>
                        </h1>

                        <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                            Cohort-based learning, project-backed portfolios, and active mentor support — designed for people who ship. Join focused live batches and a thriving developer community.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Link href="/courses">
                                <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] hover:opacity-95 font-medium px-8 text-white">
                                    Explore Courses
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button variant="outline" size="lg" className="font-medium px-8 border-gray-600 text-gray-300 hover:bg-[color:var(--glass)]">
                                    Get Started — Free
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">5k+</div>
                                <div className="text-sm text-gray-400">Learners</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">95%</div>
                                <div className="text-sm text-gray-400">Success Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">50+</div>
                                <div className="text-sm text-gray-400">Mentors</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">4.9</div>
                                <div className="text-sm text-gray-400">Community Rating</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative hero-illustration flex justify-center lg:justify-end">
                        <div className="hero-image-frame flex items-center">
                            <div className="hero-image-wrapper lg:h-full w-full">
                                <Image
                                    src={anuj}
                                    alt="Course app mockup"
                                    fill
                                    className="hero-image"
                                    priority
                                    sizes="(min-width: 1024px) 560px, 80vw"
                                />
                            </div>
                            <div className="hero-image-gradient" aria-hidden />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
