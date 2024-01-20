import React from 'react'
import logo from '../assets/yt.jpg'
const Logo = ({width = '100px'}) => {
  return (
    <div className={`w-[${width}] text-red-800`}>
      <img src={logo} alt="LOGO" width={50}  />
    </div>
  )
}

export default Logo