import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div style={{
      padding:'10px',
      background:'#f5f5f5',
      textAlign:'center',
      fontWeight:"bold"
    }}>
        <Link to="/" className="bg-red-400 m-2 py-2 px-3 rounded-lg text-white capitalize">Home</Link>
        <Link to="/login" className="bg-red-400 m-2 py-2 px-3 rounded-lg text-white capitalize">Login</Link>
        <Link to="/register" className="bg-red-400 m-2 py-2 px-3 rounded-lg text-white capitalize">Register</Link>
        <Link to="/about" className="bg-red-400 m-2 py-2 px-3 rounded-lg text-white capitalize">About</Link>
    </div>
  )
}

export default Header