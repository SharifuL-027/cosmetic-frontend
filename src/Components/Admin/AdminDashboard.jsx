import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, PackageOpen, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState('');

  // ডাইনামিক গ্রিটিং (সকাল, দুপুর, রাত অনুযায়ী)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // আপাতত ডামি ডাটা (পরবর্তীতে এগুলো Backend API থেকে আসবে)
  const stats = [
    { title: 'Total Revenue', value: '£24,500.00', change: '+12.5%', isUp: true, icon: DollarSign },
    { title: 'Total Orders', value: '1,245', change: '+8.2%', isUp: true, icon: ShoppingBag },
    { title: 'Total Products', value: '342', change: '-1.5%', isUp: false, icon: Package },
    { title: 'Active Users', value: '8,432', change: '+18.7%', isUp: true, icon: Users },
  ];

  const recentOrders = [
    { id: '#WBB-7842', customer: 'Sarah Jenkins', date: 'Oct 27, 2026', total: '£124.50', status: 'Processing' },
    { id: '#WBB-7841', customer: 'Michael Chen', date: 'Oct 26, 2026', total: '£89.99', status: 'Shipped' },
    { id: '#WBB-7840', customer: 'Emma Watson', date: 'Oct 26, 2026', total: '£345.00', status: 'Delivered' },
    { id: '#WBB-7839', customer: 'Olivia Rodrigo', date: 'Oct 25, 2026', total: '£45.00', status: 'Pending' },
    { id: '#WBB-7838', customer: 'Sophia Taylor', date: 'Oct 24, 2026', total: '£210.00', status: 'Delivered' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-200';
      case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Processing': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-orange-50 text-orange-600 border-orange-200';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-black">
            {greeting}, Admin!
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
            Here is what's happening with your store today.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Date</p>
          <p className="text-sm font-bold text-black">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-[#CB006B]" />
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.title}</h3>
            <h2 className="text-2xl font-black tracking-tight text-black">{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid (Tables & Charts) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Orders Table (Takes up 2 columns on large screens) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-black">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[10px] font-bold text-[#CB006B] uppercase tracking-widest hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-black">{order.id}</td>
                    <td className="p-4 text-xs font-medium text-gray-700">{order.customer}</td>
                    <td className="p-4 text-xs text-gray-500">{order.date}</td>
                    <td className="p-4 text-xs font-bold text-gray-700">{order.total}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-[#CB006B] transition-colors p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Store Status (Takes up 1 column) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Store Overview</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <PackageOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black">12 Products out of stock</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Needs restock immediately</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black">24 Orders Pending</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Awaiting processing</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black">System Status Normal</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">All services running smoothly</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <Link to="/admin/products/add" className="w-full bg-black hover:bg-[#CB006B] text-white py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded">
              <Package className="w-4 h-4" /> Add New Product
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}