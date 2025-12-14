import LoginUI from '@/module/auth/components/login-ui'
import { requireUnAuth } from '@/module/auth/utils/auth-utils'

const LoginPage = async () => {
  await requireUnAuth()

  return (
    <LoginUI/>
  )
}

export default LoginPage