
import { ThemeProvider } from './providers/theme.provider'
import { AppRoutes } from './routes'

export function App() {


  return (
    <ThemeProvider defaultTheme="dark" storageKey="uma-ui-theme">
     <AppRoutes />
    </ThemeProvider>
  )
}


