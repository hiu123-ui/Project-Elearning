import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderPages from '../components/Header'

const Hometemplate = () => {
  return (
    <div>
      <HeaderPages />
      <Outlet />
    </div>

  )
}

export default Hometemplate