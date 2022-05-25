import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import BrandPage from './pages/Brand';
import CategoryPage from './pages/Category';
import ProductPage from './pages/Product';
import LoginPage from './pages/Login';
import AuthService from './services/auth.service';
import Box from '@mui/material/Box';
import SettingsPage from './pages/Settings';
import AboutPage from './pages/About';
import Footer from './components/Footer';
import RegisterPage from './pages/Register';

function PrivateRoute({ children }) {
  const auth = AuthService.getCurrentUser()
  return auth ? children : <Navigate to="/login" />;
}

const NavbarLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
        </Routes>
        <Box sx={{flexGrow: 1, p: 3, paddingTop: "80px", paddingLeft: { md: "240px", sm: "0px" } }}>
          <Routes>
            <Route element={<NavbarLayout/>}>
              <Route index element={<HomePage/>} />
              <Route path="/products" element={<ProductsPage/>} />
              <Route path="/brand/:id" element={<PrivateRoute><BrandPage/></PrivateRoute>} />
              <Route path="/category/:id" element={<PrivateRoute><CategoryPage/></PrivateRoute>} />
              <Route path="/product/:id" element={<ProductPage/>} />
              <Route path="/settings" element={<PrivateRoute><SettingsPage/></PrivateRoute>} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
          </Routes>
        </Box>
      </Router>
    </div>
  );
}

export default App;
