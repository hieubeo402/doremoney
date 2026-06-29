import { signup } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignupPage({
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
          <CardDescription>Tạo tài khoản mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Tài khoản</Label>
              <Input 
                id="email" 
                name="email" 
                type="text" 
                placeholder="Nhập tên tài khoản (VD: admin)" 
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
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                required 
                className="bg-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                placeholder="Xác nhận lại mật khẩu"
                required 
                className="bg-white/30"
              />
            </div>

            {searchParams.error && (
              <p className="text-sm text-red-500 font-medium">{searchParams.error}</p>
            )}

            <div className="flex flex-col gap-4 pt-4">
              <Button type="submit" formAction={signup} className="w-full h-11 text-base bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                Đăng ký mới
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-purple-600 font-semibold hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
