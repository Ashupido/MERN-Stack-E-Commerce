import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Home Page</h1>
      <p>Welcome to the shop!</p>
      <Link to="/products" className="text-blue-500">View Products</Link>
    </div>
  );
}