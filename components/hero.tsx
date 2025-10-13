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
                            <span className="trusted-pill text-sm text-muted-foreground">Trusted by <strong className="ml-1">1.5M+</strong></span>
                            <Badge variant="secondary" className="ml-2 bg-transparent text-muted-foreground border-border">🚀 New cohorts monthly</Badge>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Learn consistently,
                            <br />
                            build with <span className="gradient-text">community</span>
                        </h1>

                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                            Cohort-based learning, project-backed portfolios, and active mentor support — designed for people who ship. Join focused live batches and a thriving developer community.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Link href="/courses">
                                <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] hover:opacity-95 font-medium px-8 text-primary-foreground">
                                    Explore Courses
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button variant="outline" size="lg" className="font-medium px-8 border-border !text-muted-foreground hover:bg-[color:var(--glass)] hover:!text-foreground">
                                    Get Started — Free
                                </Button>
                            </Link>
                        </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">5k+</div>
                                <div className="text-sm text-muted-foreground">Learners</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">95%</div>
                                <div className="text-sm text-muted-foreground">Success Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">50+</div>
                                <div className="text-sm text-muted-foreground">Mentors</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">4.9</div>
                                <div className="text-sm text-muted-foreground">Community Rating</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative hero-illustration flex justify-center lg:justify-end">
                        {/* make the mockup responsive: allow the frame to scale down and give the wrapper explicit heights for Image.fill */}
                        <div className="hero-image-frame flex items-center w-full max-w-[560px]">
                            <div className="hero-image-wrapper w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-full">
                                <Image
                                    src={anuj}
                                    alt="Course app mockup"
                                    fill
                                    className="hero-image rounded-lg"
                                    priority
                                    sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 90vw"
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
