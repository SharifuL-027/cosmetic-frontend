import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ডাটাবেস থেকে প্রোডাক্ট ফেচ করা
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // সার্চ ফাংশনালিটি
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category?.main?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-black">Products</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Manage your store inventory
          </p>
        </div>
        
        <Link 
          to="/admin/products/add" 
          className="bg-black hover:bg-[#CB006B] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white p-4 rounded-t-lg border-b border-gray-100 flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#CB006B] transition-colors"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-b-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Product</th>
              <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
              <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price</th>
              <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock/Status</th>
              <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-10 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#CB006B] mx-auto" />
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={product._id} 
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Product Image & Name */}
                  <td className="p-4 flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover bg-gray-100 border border-gray-200"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-black uppercase tracking-wider">{product.name}</span>
                      {product.badge && (
                        <span className="text-[9px] font-bold text-[#CB006B] uppercase tracking-widest mt-1">
                          Badge: {product.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Category Structure */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                        {product.category?.main || 'N/A'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {product.category?.sub} {product.category?.subChild && `> ${product.category?.subChild}`}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-4 text-xs font-bold text-gray-600">
                    £{product.price.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className="bg-green-50 text-green-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-green-200">
                      In Stock
                    </span>
                  </td>

                  {/* Actions (Edit / Delete) */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}