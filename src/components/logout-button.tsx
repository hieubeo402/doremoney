'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/login/actions'

export function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
      onClick={() => logout()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Đăng xuất
    </Button>
  )
}
