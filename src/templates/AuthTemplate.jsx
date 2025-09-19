import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthTemplate = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AuthTemplate