import React from 'react'
import AdminSideBar from './AdminSideBar'

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row"}}>
      <div>
        <AdminSideBar />
      </div>
      <div>
      <h1>Admin Dashboard</h1>
      </div>
      
    </div>
  )
}

export default AdminDashboard
