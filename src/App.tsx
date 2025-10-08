
import { ThemeProvider } from './providers/theme.provider'
import { AppRoutes } from './routes'

export function App() {
  

  return (
    <ThemeProvider defaultTheme="light" storageKey="uma-ui-theme">
     <AppRoutes />
    </ThemeProvider>
  )
}


