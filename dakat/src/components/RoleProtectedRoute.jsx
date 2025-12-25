import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  const [userRole, setUserRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    if (user && user.email) {
      // Fetch user role from backend
      const fetchUserRole = async () => {
        try {
          const token = localStorage.getItem('authToken')
          const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          const data = await response.json()
          setUserRole(data.userType)
        } catch (err) {
          console.error('Error fetching user role:', err)
        } finally {
          setRoleLoading(false)
        }
      }
      fetchUserRole()
    } else {
      setRoleLoading(false)
    }
  }, [user])

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#00ff41] font-mono text-xl">
          <div className="animate-pulse">[ VERIFYING ACCESS... ]</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 font-mono text-xl mb-4">[ ACCESS DENIED ]</p>
          <p className="text-gray-400 font-mono">Your role ({userRole}) is not authorized for this resource</p>
        </div>
      </div>
    )
  }

  return children
}

export default RoleProtectedRoute
