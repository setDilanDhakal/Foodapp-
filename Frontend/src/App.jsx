import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './admin/AdminLayout.jsx'
import Dashboard from './admin/Dashboard.jsx'
import Orders from './admin/Orders.jsx'
import Products from './admin/Products.jsx'
import Users from './admin/Users.jsx'
import AddProduct from './admin/AddProduct.jsx'
import Categories from './admin/Categories.jsx'
import CreateAdmin from './admin/CreateAdmin.jsx'
import NotFound from './admin/NotFound.jsx'
import Navbar from './Components/navbar.jsx'
import Footer from './Components/footer.jsx'
import About from './pages/About.jsx'
import Cart from './pages/Cart.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Login from './auth/Login.jsx'
import Menu from './pages/Menu.jsx'
import FoodDetails from './pages/FoodDetails.jsx'
import Offers from './pages/Offers.jsx'
import Register from './auth/Register.jsx'
import ForgotPassword from './auth/ForgotPassword.jsx'
import Profile from './pages/Profile.jsx'
import MyOrders from './pages/MyOrders.jsx'
import UserChangePassword from './pages/UserChangePassword.jsx'
import { CartProvider } from './context/CartContext.jsx'
import ChangePassword from './admin/ChangePassword.jsx'
import EditAdminProfile from './admin/EditAdminProfile.jsx'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'


function MainLayout() {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/menu' element={<Menu />} />
            <Route path='/menu/:dishName' element={<FoodDetails />} />
            <Route path='/offers' element={<Offers />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/change-password' element={<UserChangePassword />} />
          </Route>
          
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='products' element={<Products />} />
            <Route path='products/add' element={<AddProduct />} />
            <Route path='categories' element={<Categories />} />
            <Route path='administrators/add' element={<CreateAdmin />} />
            <Route path='orders' element={<Orders />} />
            <Route path='users' element={<Users />} />
            <Route path='/admin/settings/changepassword' element={<ChangePassword />} />
            <Route path='/admin/settings/editprofile' element={<EditAdminProfile />} />
            <Route path='*' element={<NotFound />} />
          </Route>

        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
