import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

function AddProduct({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
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
      const response = await axios.post('http://localhost:8000/products/', {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      
      setSuccess(true);
      setFormData({ name: '', sku: '', price: '', quantity: '' });
      
      if (onProductAdded) {
        onProductAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add product');
    }
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Product added successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
