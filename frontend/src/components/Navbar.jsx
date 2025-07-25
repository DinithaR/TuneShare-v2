import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

function Navbar() {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner} = useAppContext()

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

  return (
    <nav
      className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b relative transition-all duration-300"
      style={{
        backgroundColor: 'var(--color-light)',
        color: '#374151', // textGray
        borderBottomColor: 'var(--color-borderColor)',
      }}
    >
      {/* Logo */}
      <Link to='/' className="flex-shrink-0">
        <img
          src={assets.navbarLogo}
          alt="Company Logo"
          className="w-30 rounded-xl shadow-md transition-transform hover:scale-105"
          style={{
            width: '120px',
            height: 'auto',
            boxShadow: `0 2px 8px var(--color-borderColor)`,
          }}
        />
      </Link>

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

      {/* Menu Links + Actions */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-80 max-w-full transform transition-transform duration-300 z-40
          sm:relative sm:transform-none sm:w-auto sm:h-auto sm:bg-transparent
          flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8
          pt-20 px-6 sm:pt-0 sm:px-0
          ${open ? "translate-x-0" : "translate-x-full sm:translate-x-0"}
        `}
        style={{
          backgroundColor: open ? 'var(--color-light)' : 'transparent',
          borderLeft: open ? `1px solid var(--color-borderColor)` : 'none',
        }}
      >
        {/* Mobile Search Bar */}
        <div 
          className="flex sm:hidden items-center gap-3 px-4 py-2 rounded-full border transition-all duration-200 hover:shadow-sm focus-within:shadow-md mb-2"
          style={{ 
            borderColor: 'var(--color-borderColor)', 
            backgroundColor: '#ffffff',
            width: '100%'
          }}
        >
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            placeholder="Search anything..."
            style={{ color: '#374151' }}
          />
          <img src={assets.search_icon} alt="Search" className="w-5 h-5 opacity-60" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className="py-2 px-3 rounded-md transition-all duration-200 hover:bg-pink-50"
              style={{
                color: 'var(--color-primary-dull)',
                fontWeight: 500,
                letterSpacing: '0.01em'
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col sm:hidden w-full gap-4 mt-8 border-t pt-6" style={{ borderColor: 'var(--color-borderColor)' }}>
          <button
            onClick={() => { setOpen(false); isOwner ? navigate('/owner') : changeRole(); }}
            className="w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: 'var(--color-borderColor)',
              color: 'var(--color-primary-dull)',
            }}
          >
            {isOwner ? 'Dashboard' : 'List Instruments'}
          </button>
          <button
            onClick={() => { setOpen(false); user ? logout() : setShowLogin(true); }}
            className="w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e854a0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Search Bar (Desktop Only) */}
      <div 
        className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-200 hover:shadow-sm focus-within:shadow-md"
        style={{ 
          borderColor: 'var(--color-borderColor)', 
          backgroundColor: '#ffffff',
          minWidth: '240px',
          maxWidth: '320px'
        }}
      >
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
          placeholder="Search anything..."
          style={{ color: '#374151' }}
        />
        <img src={assets.search_icon} alt="Search" className="w-5 h-5 opacity-60" />
      </div>

      {/* ✅ Fixed: Desktop Action Buttons - Updated to match mobile styling and functionality */}
      <div className="hidden sm:flex items-center gap-4">
        <button
          onClick={() => isOwner ? navigate('/owner') : changeRole()}
          className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: 'var(--color-borderColor)',
            color: 'var(--color-primary-dull)',
          }}
        >
          {isOwner ? 'Dashboard' : 'List Instruments'}
        </button>
        <button
          onClick={() => user ? logout() : setShowLogin(true)}
          className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e854a0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
        >
          {user ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar

