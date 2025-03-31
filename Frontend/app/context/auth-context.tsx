"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

import { fetchWithAuth } from "@/lib/api"

interface User {
  id: string
  email: string
  userName: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()


  const decodeToken = (token: string) => {
    try {

      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("Invalid token format")
      }


      const payload = parts[1]
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      const decoded = JSON.parse(jsonPayload)

      return {
        id: decoded.sub,
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User",
      }
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  }

  useEffect(() => {

    const checkAuthStatus = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null

        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }


        const userData = decodeToken(token)
        if (userData) {
          setUser(userData)
        }


        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/user-only`)

        if (!response.ok) {

          localStorage.removeItem("jwtToken")
          setUser(null)
        }
      } catch (error) {

        if (typeof window !== "undefined") {
          localStorage.removeItem("jwtToken")
        }
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])


  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })


      const data = await response.json().catch(() => null)

      if (!response.ok) {

        if (response.status === 401) {
          throw new Error("Invalid email or password")
        } else if (response.status === 404) {
          throw new Error("User not found")
        } else if (data && data.message) {
          throw new Error(data.message)
        } else {
          throw new Error("Login failed")
        }
      }


      if (data && data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken)

        // Decode token to get user info
        const userData = decodeToken(data.jwtToken)
        if (userData) {
          setUser(userData)
        }
      } else {
        throw new Error("No token received")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }


  const register = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          passwordsMatch: password === confirmPassword,
        }),
        credentials: "include",
      })


      const data = await response.json().catch(() => null)

      if (!response.ok) {

        if (response.status === 409) {
          throw new Error("Email already exists")
        } else if (response.status === 400 && data && data.message && data.message.includes("password")) {
          throw new Error("Password does not meet requirements")
        } else if (data && data.message) {
          throw new Error(data.message)
        } else {
          throw new Error("Registration failed")
        }
      }


      if (data && data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken)

        // Decode token to get user info
        const userData = decodeToken(data.jwtToken)
        if (userData) {
          setUser(userData)
        }
      } else {
        throw new Error("No token received")
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/Logout`, {
        method: "POST",
        credentials: "include",
      })


      localStorage.removeItem("jwtToken")

      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === "Admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

