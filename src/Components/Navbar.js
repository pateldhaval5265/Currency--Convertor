import React, { useState } from 'react'

export default function Navbar() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
   <>
        <nav className="navbar mt-md-1 navbar-expand-lg navbar-light bg-light shadow">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">Currency Convertor</a>
    <button 
      className="navbar-toggler" 
      type="button" 
      onClick={handleNavCollapse}
      aria-controls="navbarNavAltMarkup" 
      aria-expanded={!isNavCollapsed} 
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNavAltMarkup">
      <div className=" ms-auto navbar-nav">
        <a className="nav-link active mx-md-3" aria-current="page" href="/">Home</a>
        <a className="nav-link active mx-md-3" href="#currency">Currency</a>
        <a className="nav-link active mx-md-3" href="#about">About</a>
        <a className="nav-link active mx-md-3" href="#contact" >Contact</a>
      </div>
    </div>
  </div>
</nav>
   </>
  )
}
