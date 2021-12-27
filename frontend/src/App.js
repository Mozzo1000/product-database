import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import ProductsPage from './pages/Products'
import CategoriesPage from './pages/Categories'
import Brandspage from './pages/Brands';
import BrandPage from './pages/Brand';
import CategoryPage from './pages/Category';
import ProductPage from './pages/Product';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route index element={<h1>product-database</h1>} />
          <Route path="/products" element={<ProductsPage/>} />
          <Route path="/category" element={<CategoriesPage/>} />
          <Route path="/brand" element={<Brandspage/>} />
          <Route path="/brand/:id" element={<BrandPage/>} />
          <Route path="/category/:id" element={<CategoryPage/>} />
          <Route path="/product/:id" element={<ProductPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
