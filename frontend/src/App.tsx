import { BrowserRouter, useLocation } from 'react-router-dom'

import Header from './components/Header'
import GlobalStyle from './styles/GlobalStyle'
import AppRoutes from './routes'

function AppShell() {
  const location = useLocation()

  const showGlobalHeader = !location.pathname.startsWith('/manager')

  return (
    <>
      <GlobalStyle />
      {showGlobalHeader ? <Header /> : null}
      <AppRoutes />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
