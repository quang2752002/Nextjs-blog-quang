"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '@/models/Product'; 

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7183/api/Product/getList');
        setProducts(response.data);
      } catch (error) {
        console.error("There was an error fetching the product list!", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map(product => (
          <li key={product.Id}>
            {product.Ten} - {product.MoTa} - ${product.Gia} - {product.GiamGia ? 'Discounted' : 'Not Discounted'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
