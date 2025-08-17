import React, { useState } from 'react'
import Loader from './Loader'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

function Navbar() {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner, role, authLoading } = useAppContext()

  const location = useLocation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const changeRole = async () => {
    try {
      const {data} = await axios.post('/api/owner/change-role')
      if(data.success) {
        setIsOwner(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (authLoading) {
    return (
      <nav className="w-full border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 flex items-center justify-center h-20">
        <Loader />
      </nav>
    );
  }

  return (
    <nav
      className="w-full border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
      style={{ borderBottomColor: 'var(--color-borderColor)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 md:px-8 py-3">
        {/* Logo */}
        <Link to='/' className="flex-shrink-0 flex items-center gap-2">
          <img
            src={assets.navbarLogo}
            alt="TuneShare Logo"
            className="w-28 h-auto rounded-xl shadow-md hover:scale-105 transition-transform"
            style={{ boxShadow: `0 2px 8px var(--color-borderColor)` }}
          />
        </Link>

        {/* Search Bar (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus-within:shadow-md min-w-[220px] max-w-[320px] flex-1">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            placeholder="Search anything..."
            style={{ color: '#374151' }}
          />
          <img src={assets.search_icon} alt="Search" className="w-5 h-5 opacity-60" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="text-base font-semibold text-gray-700 hover:text-pink-600 transition-colors px-2 py-1 rounded"
              style={{ letterSpacing: '0.01em' }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Dashboard/List Buttons */}
        {role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 font-semibold rounded-lg transition-all duration-200 bg-pink-500 text-white hover:bg-pink-600 shadow-sm"
          >
            Admin Dashboard
          </button>
        )}
        <button
          onClick={() => isOwner ? navigate('/owner') : changeRole()}
          className="px-4 py-2 font-semibold rounded-lg transition-all duration-200 bg-gray-100 text-pink-700 hover:bg-gray-200 shadow-sm"
        >
          {isOwner ? 'Dashboard' : 'List Instruments'}
        </button>

        {/* Welcome, Profile, Logout */}
        {user && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-primary font-semibold whitespace-nowrap">Welcome, {user.name}!</span>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-white hover:shadow-md transition"
              title="Profile"
            >
              <img
                src={user.image || '/src/assets/user_profile.jpg'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        )}
        <button
          onClick={() => user ? logout() : setShowLogin(true)}
          className="px-4 py-2 font-semibold rounded-lg transition-all duration-200 bg-pink-400 text-white hover:bg-pink-500 shadow-sm ml-2"
        >
          {user ? 'Logout' : 'Login'}
        </button>

        {/* Hamburger Menu Button */}
        <button
          className="sm:hidden cursor-pointer z-50 p-2 rounded-md hover:bg-pink-50 transition-colors"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
        >
          <img 
            src={open ? assets.close_icon : assets.menu_icon} 
            alt={open ? "Close menu" : "Open menu"}
            className="w-6 h-6"
          />
        </button>

        {/* Mobile Menu Overlay */}
        {open && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </div>
    </nav>
  )
}

export default Navbar

