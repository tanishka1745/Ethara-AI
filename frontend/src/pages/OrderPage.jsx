import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import './OrderPage.css';

function OrderPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([{ product_id: null, quantity: 1 }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCustomersAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let total = 0;
    orderItems.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    setTotalAmount(total);
  }, [orderItems, products]);

  const fetchCustomersAndProducts = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        apiClient.get('/customers/'),
        apiClient.get('/products/'),
      ]);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    }
  };


  const handleAddItem = () => {
    setOrderItems([...orderItems, { product_id: null, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = field === 'quantity' ? parseInt(value) : parseInt(value);
    setOrderItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    if (orderItems.some(item => !item.product_id || item.quantity < 1)) {
      setError('Please select products and quantities');
      return;
    }

    try {
      await apiClient.post('/orders/', {
        customer_id: selectedCustomer,
        items: orderItems,
      });
      
      setSuccess(true);
      setSelectedCustomer(null);
      setOrderItems([{ product_id: null, quantity: 1 }]);
      setTotalAmount(0);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order');
    }
  };

  return (
    <div className="order-page">
      <h2>Create Order</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Order created successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer:</label>
          <select 
            value={selectedCustomer || ''} 
            onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="items-section">
          <h3>Order Items</h3>
          {orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <select 
                value={item.product_id || ''} 
                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
              >
                <option value="">Select product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.quantity})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>Add Item</button>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        </div>

        <button type="submit">Create Order</button>
      </form>
    </div>
  );
}

export default OrderPage;
