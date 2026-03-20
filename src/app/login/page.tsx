import { LoginForm } from '@/features/auth/components/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string
    messageType?: 'error' | 'success' | 'info'
    redirect_to?: string
    state?: string
  }>
}) {
  const { message, messageType, redirect_to, state } = await searchParams;

  return (
    <LoginForm
      message={message}
      messageType={messageType}
      redirectTo={redirect_to}
      state={state}
    />
  );
}
