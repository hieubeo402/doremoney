import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageTransition } from "@/components/page-transition"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-background/70 backdrop-blur-xl px-4 md:px-6 shadow-sm">
          <div className="md:hidden">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Doremoney</h1>
          </div>
          <div className="flex-1 md:hidden" />
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
