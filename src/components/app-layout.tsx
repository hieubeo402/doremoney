import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageTransition } from "@/components/page-transition"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AppLayoutProps {
  children: React.ReactNode
}

export async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/20 dark:border-white/10 bg-background/40 backdrop-blur-3xl px-4 md:px-6 shadow-sm">
          <div className="md:hidden">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Doremoney</h1>
          </div>
          <div className="flex-1 md:hidden" />
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8 ring-1 ring-white/20 shadow-md">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user.email?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <LogoutButton />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button size="sm" variant="outline" className="font-semibold shadow-sm border-purple-200 text-purple-700 bg-white/50 hover:bg-white/80 transition-all">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="font-semibold shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all text-white">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

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
