import { Navigate, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import RestaurantDetails from './pages/RestaurantDetails'
import Pedidos from './pages/Pedidos'
import Cart from './pages/Cart'
import Manager from './pages/Manager'
import ManagerDashboard from './pages/Manager/Dashboard'
import ManagerRestaurants from './pages/Manager/Restaurants'
import ManagerRestaurantWorkspace from './pages/Manager/RestaurantWorkspace'
import ManagerMenu from './pages/Manager/Menu'
import ManagerOrders from './pages/Manager/Orders'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/restaurants" element={<Home />} />
    <Route path="/restaurants/:id" element={<RestaurantDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/orders" element={<Pedidos />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/manager" element={<Manager />}>
      <Route index element={<ManagerDashboard />} />
      <Route path="restaurants" element={<ManagerRestaurants />} />
      <Route path="restaurants/:restaurantId" element={<ManagerRestaurantWorkspace />}>
        <Route index element={<Navigate to="menu" replace />} />
        <Route path="menu" element={<ManagerMenu />} />
        <Route path="orders" element={<ManagerOrders />} />
      </Route>
    </Route>
    <Route path="/Pedidos" element={<Navigate to="/orders" replace />} />
    <Route path="*" element={<Home />} />
  </Routes>
)

export default AppRoutes
