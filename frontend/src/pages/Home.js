import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import { fetchProducts } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import heroimage from './img5.jpg'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        setFeaturedProducts(products.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-secondary to-primary overflow-hidden">
        <img
          src={heroimage}
          alt="Hero Background"
          className="absolute w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow mb-6">
            <span className="text-accent">Elevate</span> Your Style
          </h1>
          <p className="text-2xl md:text-3xl text-white opacity-90 mb-10 max-w-3xl">
            Discover the latest trends and premium products tailored for you
          </p>
          <div className="space-x-4">
            <Link to="/products" className="btn-primary text-lg px-8 py-3 rounded-full hover:scale-110 transition-transform shadow-lg">
              Shop Now
            </Link>
            {user === null && (
              <Link
                to="/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-secondary transition-all shadow-md"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', title: 'Free Shipping', desc: 'On orders over ₹499' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Secure Payments', desc: '100% secure checkout' },
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Easy Returns', desc: '30 days return policy' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <svg className="h-16 w-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                </svg>
                <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-4xl font-bold text-center mb-8">✨ Featured Collections</h2>
        </div>
        <Carousel />
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { path: '/products?category=Men', img: '/img/img4.png', title: "Men's Fashion", desc: 'Explore stylish collection' },
              { path: '/products?category=Women', img: '/img/img5.jpg', title: "Women's Fashion", desc: "Trendy women's collection" },
              { path: '/products?category=Accessories', img: '/img/img6.jpg', title: 'Accessories', desc: 'Complete your look' },
            ].map((cat, i) => (
              <Link key={i} to={cat.path} className="group block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transform transition-transform">
                <div className="relative h-80">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center px-4 py-6 bg-black bg-opacity-60 rounded-lg group-hover:scale-105 transform transition">
                      <h3 className="text-2xl font-bold text-primary mb-1">{cat.title}</h3>
                      <p className="text-white mb-2">{cat.desc}</p>
                      <span className="inline-block px-4 py-2 border border-primary text-white rounded-full group-hover:bg-primary transition-colors">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">🔥 Popular Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-5 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                    <p className="text-xl font-bold text-primary mb-3">₹{product.price}</p>
                    <Link to="/products" className="btn-primary w-full text-center py-2">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/products" className="bg-secondary text-white px-8 py-3 rounded-full hover:bg-primary transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-primary bg-opacity-10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-lg text-gray-600 mb-8">
              Get updates on new products, special offers and discounts!
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-r-lg hover:bg-hover transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;