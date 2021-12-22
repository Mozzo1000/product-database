import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import ProductsPage from './pages/Products'

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route index element={<h1>product-database</h1>} />
          <Route path="/products" element={<ProductsPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
