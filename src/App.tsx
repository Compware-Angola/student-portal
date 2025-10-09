import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from './providers/theme.provider'
import { AppRoutes } from './routes'

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="uma-ui-theme">
      <AppRoutes />
      <Toaster richColors closeButton />
    </ThemeProvider>
  )
}
