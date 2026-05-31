import { BrowserRouter } from 'react-router-dom'

import Header from './components/Header'
import GlobalStyle from './styles/GlobalStyle'
import AppRoutes from './routes'

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
