import { BrowserRouter } from 'react-router-dom'

import Footer from './components/Footer'
import GlobalStyle from './styles/GlobalStyle'
import AppRoutes from './routes'

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  )
}

export default App
