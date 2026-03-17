import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Pedidos from './pages/Pedidos'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/Pedidos" element={<Pedidos />} />
  </Routes>
)

export default AppRoutes
