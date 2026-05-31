import { Navigate, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import RestaurantDetails from './pages/RestaurantDetails'
import Pedidos from './pages/Pedidos'
import Cart from './pages/Cart'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/restaurants" element={<Home />} />
    <Route path="/restaurants/:id" element={<RestaurantDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/orders" element={<Pedidos />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/Pedidos" element={<Navigate to="/orders" replace />} />
    <Route path="*" element={<Home />} />
  </Routes>
)

export default AppRoutes
