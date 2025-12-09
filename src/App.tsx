import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from './providers/theme.provider'
import { AppRoutes } from './routes'
import { ReactQueryProvider } from './providers/react-query.provider'
import { StudentSituationProvider } from './providers/student-situation'

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="uma-ui-theme">
      <ReactQueryProvider>
        <StudentSituationProvider>
          <AppRoutes />
        </StudentSituationProvider>
        <Toaster richColors closeButton />
      </ReactQueryProvider>
    </ThemeProvider>
  )
}
