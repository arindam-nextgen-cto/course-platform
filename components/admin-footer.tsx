'use client'

import Link from 'next/link'

export default function AdminFooter() {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-card border-t border-border text-foreground py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-2))] rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xs">N</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            &copy; {year} NextGen-CTO. All rights reserved.
                        </p>
                    </div>
                    
                    <div className="flex space-x-6">
                        <Link 
                            href="/terms" 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms
                        </Link>
                        <Link 
                            href="/privacy" 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link 
                            href="/cookies" 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}