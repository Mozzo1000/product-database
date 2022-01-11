import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import ProductsPage from './pages/Products'
import CategoriesPage from './pages/Categories'
import Brandspage from './pages/Brands';
import BrandPage from './pages/Brand';
import CategoryPage from './pages/Category';
import ProductPage from './pages/Product';
import LoginPage from './pages/Login';
import AuthService from './services/auth.service';

function PrivateRoute({ children }) {
  const auth = AuthService.getCurrentUser()
  return auth ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route index element={<PrivateRoute><h1>product-database</h1></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><ProductsPage/></PrivateRoute>} />
          <Route path="/category" element={<PrivateRoute><CategoriesPage/></PrivateRoute>} />
          <Route path="/brand" element={<PrivateRoute><Brandspage/></PrivateRoute>} />
          <Route path="/brand/:id" element={<PrivateRoute><BrandPage/></PrivateRoute>} />
          <Route path="/category/:id" element={<PrivateRoute><CategoryPage/></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><ProductPage/></PrivateRoute>} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
