import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 text-xl font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Carousel />

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium border transition-colors ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryClick('')}
          >
            All
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === 'Men'
                ? 'bg-primary text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryClick('Men')}
          >
            Men
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === 'Women'
                ? 'bg-primary text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryClick('Women')}
          >
            Women
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === 'Accessories'
                ? 'bg-primary text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryClick('Accessories')}
          >
            Accessories
          </button>
        </div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-primary mb-10">
            {selectedCategory
              ? `🛍️ ${selectedCategory} Collection`
              : '🛒 All Products'}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">No products found in this category.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;