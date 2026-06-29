'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Tạm thời dùng email ảo nếu người dùng chỉ nhập "username"
  const formattedEmail = email.includes('@') ? email : `${email}@doremoney.app`

  const { error } = await supabase.auth.signInWithPassword({
    email: formattedEmail,
    password,
  })

  if (error) {
    return redirect('/login?error=Sai tài khoản hoặc mật khẩu')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return redirect('/signup?error=Mật khẩu nhập lại không khớp!')
  }

  const formattedEmail = email.includes('@') ? email : `${email}@doremoney.app`

  const { error } = await supabase.auth.signUp({
    email: formattedEmail,
    password,
  })

  if (error) {
    return redirect('/signup?error=Lỗi đăng ký: ' + error.message)
  }

  // Bắt buộc đăng xuất để tránh tự động đăng nhập nếu Confirm Email đang tắt
  await supabase.auth.signOut()
  
  redirect('/login?success=Đăng ký thành công! Vui lòng đăng nhập.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
