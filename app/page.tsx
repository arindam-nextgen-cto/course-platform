import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Hero from '@/components/hero'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />

      {/* Trending Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trending
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what's hot in our learning community. Join the most popular cohorts and trending discussions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-md transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))] rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))]"></div>
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-lg">React Mastery</CardTitle>
                    <p className="text-muted-foreground text-sm">with Sakshi Sharma</p>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  Master modern React patterns, hooks, and state management. Build production-ready applications.
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-[hsl(var(--secondary)/0.2)] text-secondary-foreground">Live Cohort</Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground">12 weeks</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-md transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))] rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))]"></div>
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-lg">Python & AI</CardTitle>
                    <p className="text-muted-foreground text-sm">with Dr. Arjun Kumar</p>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  Dive deep into Python programming and artificial intelligence. Build ML models from scratch.
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-[hsl(var(--secondary))/0.12] text-secondary-foreground">Starting Soon</Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground">10 weeks</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-md transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))]"></div>
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-lg">DevOps Pro</CardTitle>
                    <p className="text-muted-foreground text-sm">with Manish Reddy</p>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  Master cloud infrastructure, CI/CD pipelines, and container orchestration with Kubernetes.
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-[hsl(var(--secondary))/0.12] text-secondary-foreground">Hot</Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground">8 weeks</Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Mentor Connect
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get personalized direction from seasoned mentors — mentor-crafted roadmaps to guide your journey and on-demand 1:1 sessions to unblock progress fast.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Feature / CTA Column */}
            <div className="md:col-span-1">
              <Card className="bg-gradient-to-br from-[hsl(var(--primary))/0.06] to-[hsl(var(--accent-2))/0.04] border border-border p-6 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-foreground text-2xl mb-2">Roadmaps & 1:1 Guidance</CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">
                    Choose a mentor roadmap tailored to your goal — from job-ready engineering tracks to domain-specialized deep dives. Book short, actionable 1:1 sessions on demand.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-primary-foreground font-semibold">R</span>
                      <div className="text-sm text-muted-foreground">Roadmaps crafted by mentors — mapped to hiring outcomes.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--secondary))] text-secondary-foreground font-semibold">1:1</span>
                      <div className="text-sm text-muted-foreground">On-demand 1:1 sessions — focused, actionable, and time-boxed.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-primary-foreground font-semibold">P</span>
                      <div className="text-sm text-muted-foreground">Practical project feedback and interview-ready guidance.</div>
                    </li>
                  </ul>

                  <div className="flex gap-3">
                    <Link href="/mentors">
                      <Button className="bg-[hsl(var(--card))/0.95] hover:opacity-95 text-foreground">Explore Roadmaps</Button>
                    </Link>
                    <Link href="/auth/signin">
                      <Button variant="outline" className="border-border text-muted-foreground">Book 1:1</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mentor Cards */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
              <Card className="bg-card border-border hover:scale-[1.02] transform-gpu transition-transform">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-full overflow-hidden"></div>
                    <div>
                      <h3 className="text-foreground font-semibold">Sakshi Sharma</h3>
                      <p className="text-muted-foreground text-sm">Ex-Meta, Google • React & Frontend</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Badge className="bg-[hsl(var(--primary))] text-primary-foreground">Roadmaps</Badge>
                      <Badge variant="secondary" className="bg-[hsl(var(--secondary))/0.12] text-secondary-foreground">1:1</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">Crafts frontend roadmaps focused on building production apps and interview portfolios. Quick hands-on reviews and UI deep-dives.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sessions from 30 mins</span>
                    <Link href="/auth/signin">
                      <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-2))]">Book</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:scale-[1.02] transform-gpu transition-transform">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))] rounded-full overflow-hidden"></div>
                    <div>
                      <h3 className="text-foreground font-semibold">Dr. Arjun Kumar</h3>
                      <p className="text-muted-foreground text-sm">Ex-OpenAI, Tesla • AI & ML</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Badge className="bg-[hsl(var(--primary))] text-primary-foreground">Roadmaps</Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">1:1</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">Designs ML learning tracks that map to practical projects and hiring signals. Available for detailed model reviews and architecture sessions.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available for office hours</span>
                    <Link href="/auth/signin">
                      <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))]">Book</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:scale-[1.02] transform-gpu transition-transform">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-full overflow-hidden"></div>
                    <div>
                      <h3 className="text-foreground font-semibold">Manish Reddy</h3>
                      <p className="text-muted-foreground text-sm">Ex-AWS, Netflix • DevOps</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Badge className="bg-[hsl(var(--secondary))] text-secondary-foreground">Roadmaps</Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">1:1</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">Infrastructure and SRE roadmaps that prepare you for scaling systems and operational excellence. Offers architecture reviews and incident postmortems.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hands-on workshops</span>
                    <Link href="/auth/signin">
                      <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))]">Book</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:scale-[1.02] transform-gpu transition-transform">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))] rounded-full overflow-hidden"></div>
                    <div>
                      <h3 className="text-foreground font-semibold">Priya Nair</h3>
                      <p className="text-muted-foreground text-sm">Ex-Stripe, Uber • Backend</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Badge className="bg-[hsl(var(--secondary))] text-secondary-foreground">Roadmaps</Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">1:1</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">Backend system design and architecture roadmaps, plus interview coaching for systems-level roles.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">System design focus</span>
                    <Link href="/auth/signin">
                      <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-2))]">Book</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Learning Paths
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Structured learning journeys designed to take you from beginner to job-ready professional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-[hsl(var(--primary))/0.22] to-[hsl(var(--accent-2))/0.22] border-[hsl(var(--primary))/0.3] hover:border-[hsl(var(--primary))/0.4] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-[hsl(var(--primary))] text-primary-foreground">CONCEPT</Badge>
                  <span className="text-[hsl(var(--primary))/0.85] text-sm font-medium">12 weeks</span>
                </div>
                <CardTitle className="text-foreground text-2xl mb-2">Full-Stack Development</CardTitle>
                <CardDescription className="text-muted-foreground mb-4">
                  Master the complete web development stack from frontend to backend, databases, and deployment.
                </CardDescription>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-2"></span>
                    React & TypeScript
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-2"></span>
                    Node.js & Express
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-2"></span>
                    PostgreSQL & Prisma
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-2"></span>
                    AWS Deployment
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">{formatCurrency(2499)}</span>
                  <Button className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] hover:opacity-95">
                    Start Path
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[hsl(var(--secondary))/0.22] to-[hsl(var(--accent-2))/0.22] border-[hsl(var(--secondary))/0.3] hover:border-[hsl(var(--secondary))/0.4] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-[hsl(var(--secondary))] text-secondary-foreground">CONCEPT</Badge>
                  <span className="text-[hsl(var(--secondary))/0.85] text-sm font-medium">10 weeks</span>
                </div>
                <CardTitle className="text-foreground text-2xl mb-2">AI & Machine Learning</CardTitle>
                <CardDescription className="text-muted-foreground mb-4">
                  Build intelligent applications with Python, machine learning, and modern AI frameworks.
                </CardDescription>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--secondary))] rounded-full mr-2"></span>
                    Python & Data Science
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--secondary))] rounded-full mr-2"></span>
                    TensorFlow & PyTorch
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--secondary))] rounded-full mr-2"></span>
                    OpenAI & LangChain
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-[hsl(var(--secondary))] rounded-full mr-2"></span>
                    MLOps & Deployment
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">{formatCurrency(2199)}</span>
                  <Button className="bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))] hover:opacity-95">
                    Start Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="font-medium border-border text-muted-foreground hover:bg-accent/6">
                View All Paths
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Wall of Love
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from our community members who transformed their careers through consistent learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))] rounded-full"></div>
                  <div>
                    <h3 className="text-foreground font-semibold">Jessica Martinez</h3>
                    <p className="text-muted-foreground text-sm">Software Engineer at Google</p>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  "The consistency and community at NextGen-CTO changed everything for me.
                  From zero coding experience to landing my dream job at Google in 8 months.
                  The live cohorts kept me accountable and motivated."
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--accent-2))] rounded-full"></div>
                  <div>
                    <h3 className="text-foreground font-semibold">David Chen</h3>
                    <p className="text-muted-foreground text-sm">ML Engineer at OpenAI</p>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
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
      <section className="py-20 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-2))]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg text-[hsl(var(--primary-foreground))/0.85] mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are building their tech careers through
            consistency, community, and expert guidance. Start your journey today.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] text-primary-foreground font-medium px-8 hover:opacity-95">
              Start Learning Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer moved to a shared Footer component */}
    </div>
  )
}