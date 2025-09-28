import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderPages from '../components/Header'
import FooterPages from '../components/Footer'

const Hometemplate = () => {
  return (
    <div>
      <HeaderPages />
      <Outlet />
      <FooterPages />
    </div>

  )
}

export default Hometemplate