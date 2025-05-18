"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Update the AuthProvider component to include a users array for storing registered users

// Define user type
interface User {
  id: string
  name: string
  phone: string
  password?: string // Add password field
  location?: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (phone: string, password: string) => Promise<boolean>
  register: (userData: User) => void
  logout: () => void
  getRegisteredUsers: () => User[]
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([])

  // Check for existing user session and registered users on mount
  useEffect(() => {
    // Load current user
    const storedUser = localStorage.getItem("agriconnect_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("agriconnect_user")
      }
    }

    // Load registered users
    const storedUsers = localStorage.getItem("agriconnect_registered_users")
    if (storedUsers) {
      try {
        setRegisteredUsers(JSON.parse(storedUsers))
      } catch (error) {
        console.error("Failed to parse stored users:", error)
        localStorage.removeItem("agriconnect_registered_users")
      }
    } else {
      // Add a default user for demo purposes
      const defaultUser = {
        id: "1",
        name: "अनिल यादव",
        phone: "9876543210",
        password: "password123",
        location: "जयपुर, राजस्थान",
      }
      setRegisteredUsers([defaultUser])
      localStorage.setItem("agriconnect_registered_users", JSON.stringify([defaultUser]))
    }

    setLoading(false)
  }, [])

  // Login function - now checks against registered users
  const login = async (phone: string, password: string): Promise<boolean> => {
    // Find user with matching phone and password
    const foundUser = registeredUsers.find((u) => u.phone === phone && u.password === password)

    if (foundUser) {
      // Create a copy without the password for session storage
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password

      setUser(userWithoutPassword)
      localStorage.setItem("agriconnect_user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  // Register function
  const register = (userData: User) => {
    // Generate a unique ID
    const newUser = {
      ...userData,
      id: Date.now().toString(),
    }

    // Add to registered users
    const updatedUsers = [...registeredUsers, newUser]
    setRegisteredUsers(updatedUsers)
    localStorage.setItem("agriconnect_registered_users", JSON.stringify(updatedUsers))

    // Log the user in (without password in session)
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password

    setUser(userWithoutPassword)
    localStorage.setItem("agriconnect_user", JSON.stringify(userWithoutPassword))
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("agriconnect_user")
  }

  // Get registered users (for demo purposes)
  const getRegisteredUsers = () => {
    return registeredUsers.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        getRegisteredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
