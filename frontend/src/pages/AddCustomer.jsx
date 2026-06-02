import React, { useState } from 'react';
import apiClient from '../api/client';
import './AddCustomer.css';

function AddCustomer({ onCustomerAdded }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await apiClient.post('/customers/', formData);
      
      setSuccess(true);
      setFormData({ full_name: '', email: '', phone: '' });
      
      if (onCustomerAdded) {
        onCustomerAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add customer');
    }
  };

  return (
    <div className="add-customer">
      <h2>Add Customer</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Customer added successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default AddCustomer;
