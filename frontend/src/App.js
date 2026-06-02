import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard.jsx';
import ProductList from './pages/ProductList.jsx';
import AddProduct from './pages/AddProduct.jsx';
import CustomerList from './pages/CustomerList.jsx';
import AddCustomer from './pages/AddCustomer.jsx';
import OrderPage from './pages/OrderPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList />;
      case 'add-product':
        return <AddProduct />;
      case 'customers':
        return <CustomerList />;
      case 'add-customer':
        return <AddCustomer />;
      case 'orders':
        return <OrderPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Inventory Management System</h1>
        <ul>
          <li><button onClick={() => setCurrentPage('dashboard')}>Dashboard</button></li>
          <li><button onClick={() => setCurrentPage('products')}>Products</button></li>
          <li><button onClick={() => setCurrentPage('add-product')}>Add Product</button></li>
          <li><button onClick={() => setCurrentPage('customers')}>Customers</button></li>
          <li><button onClick={() => setCurrentPage('add-customer')}>Add Customer</button></li>
          <li><button onClick={() => setCurrentPage('orders')}>Orders</button></li>
        </ul>
      </nav>
      
      <main className="content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
