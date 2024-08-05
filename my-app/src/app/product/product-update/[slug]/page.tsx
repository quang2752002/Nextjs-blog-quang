"use client";

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/Product';
import { Props } from '@/models/Props';


const ProductUpdate: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const productId = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      axios.get(`https://localhost:7183/api/Product/getProduct/${productId}`)
        .then(response => {
          setProduct(response.data.product);
          setLoading(false);
        })
        .catch(() => {
          setError('Product not found');
          setLoading(false);
        });
    }
  }, [productId]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (product) {
      axios.patch(`https://localhost:7183/api/Product/Update`, {
        id: product.Id,
        ten: product.Ten,
        mota: product.MoTa,
        gia: product.Gia,
        giamgia: product.GiamGia,
      })
      .then(response => {
        alert(response.data.message);
        router.push('/products');
      })
      .catch(() => {
        setError('Failed to update product');
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Update Product</h1>
      {product && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input 
              type="text" 
              value={product.Ten || ''} 
              onChange={e => setProduct({ ...product, Ten: e.target.value })} 
            />
          </div>
          <div>
            <label>Description</label>
            <input 
              type="text" 
              value={product.MoTa || ''} 
              onChange={e => setProduct({ ...product, MoTa: e.target.value })} 
            />
          </div>
          <div>
            <label>Price</label>
            <input 
              type="number" 
              value={product.Gia || 0} 
              onChange={e => setProduct({ ...product, Gia: parseFloat(e.target.value) })} 
            />
          </div>
          <div>
            <label>Discount</label>
            <input 
              type="checkbox" 
              checked={product.GiamGia || false} 
              onChange={e => setProduct({ ...product, GiamGia: e.target.checked })} 
            />
          </div>
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default ProductUpdate;
