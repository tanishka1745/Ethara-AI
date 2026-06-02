import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import './CustomerList.css';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/customers/');
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    }
    setLoading(false);
  };

  const deleteCustomer = async (id) => {
    try {
      await apiClient.delete(`/customers/${id}`);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete customer');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customer-list">
      <h2>Customers</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.full_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <button onClick={() => deleteCustomer(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
