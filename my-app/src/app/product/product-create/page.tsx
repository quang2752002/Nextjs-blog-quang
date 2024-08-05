"use client";

import { useState } from 'react';
import axios from 'axios';

const ProductCreate = () => {
  const [ten, setTen] = useState('');
  const [moTa, setMoTa] = useState('');
  const [gia, setGia] = useState<number | undefined>(undefined);
  const [giamGia, setGiamGia] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('ten', ten);
      formData.append('mota', moTa);
      formData.append('gia', gia?.toString() || '0');
      formData.append('giamgia', giamGia.toString());

      await axios.post('https://localhost:7183/api/Product/Create', formData);
      alert('Product created/updated successfully!');
      // Clear the form
      setTen('');
      setMoTa('');
      setGia(undefined);
      setGiamGia(false);
    } catch (error) {
      console.error('There was an error creating/updating the product!', error);
      alert('Failed to create/update product.');
    }
  };

  return (
    <div>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ten">Name:</label>
          <input
            type="text"
            id="ten"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="moTa">Description:</label>
          <textarea
            id="moTa"
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gia">Price:</label>
          <input
            type="number"
            id="gia"
            value={gia}
            onChange={(e) => setGia(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="giamGia">Discount:</label>
          <input
            type="checkbox"
            id="giamGia"
            checked={giamGia}
            onChange={(e) => setGiamGia(e.target.checked)}
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default ProductCreate;
