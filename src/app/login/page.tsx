import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/20 backdrop-blur-3xl border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Doremoney
          </CardTitle>
          <CardDescription>Đăng nhập hoặc Tạo tài khoản mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Tài khoản</Label>
              <Input 
                id="email" 
                name="email" 
                type="text" 
                placeholder="Ví dụ: admin hoặc admin@email.com" 
                required 
                className="bg-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-white/30"
              />
            </div>

            {searchParams.error && (
              <p className="text-sm text-red-500 font-medium">{searchParams.error}</p>
            )}

            <div className="flex flex-col gap-2 pt-4">
              <Button formAction={login} className="w-full h-11 text-base">
                Đăng nhập
              </Button>
              <Button formAction={signup} variant="outline" className="w-full h-11 text-base bg-transparent hover:bg-white/10">
                Đăng ký mới
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
