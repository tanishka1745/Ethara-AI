import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        apiClient.get('/products/'),
        apiClient.get('/customers/'),
        apiClient.get('/orders/'),
      ]);

      const products = productsRes.data;
      const lowStockProducts = products.filter(p => p.quantity < 10);

      setStats({
        totalProducts: products.length,
        totalCustomers: customersRes.data.length,
        totalOrders: ordersRes.data.length,
        lowStockProducts: lowStockProducts,
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-value">{stats.totalCustomers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
      </div>

      <div className="low-stock-section">
        <h2>Low Stock Products</h2>
        {stats.lowStockProducts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td className="low-stock">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>All products have sufficient stock</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
