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


  const getErrorMessage = async (response: Response): Promise<string> => {

    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
  
      try {
        const data = await response.json()
        return data.message || data.title || data.error || JSON.stringify(data)
      } catch (e) {
        console.error("Error parsing JSON response:", e)
      }
    }

    try {
      const text = await response.text()
      return text || "An error occurred"
    } catch (e) {
      console.error("Error getting response text:", e)
      return "Could not retrieve error details"
    }
  }


  const login = async (email: string, password: string): Promise<void> => {
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

      if (!response.ok) {
    
        const errorMessage = await getErrorMessage(response)


        if (response.status === 401 || errorMessage.includes("Invalid credentials")) {
          throw new Error("Incorrect password. Please try again.")
        } else if (response.status === 404) {
          throw new Error("Email not found. Please check your email address or register for an account.")
        } else {
          throw new Error(errorMessage)
        }
      }


      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        throw new Error("Unexpected response format from server")
      }

      if (data && data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken)


        const userData = decodeToken(data.jwtToken)
        if (userData) {
          setUser(userData)
        }
      } else {
        throw new Error("No token received from server")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error 
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, confirmPassword: string): Promise<void> => {
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

      if (!response.ok) {
 
        const errorMessage = await getErrorMessage(response)


        if (response.status === 409 || errorMessage.includes("already registered")) {
          throw new Error("Email already exists. Please use a different email address or try logging in.")
        } else if (response.status === 400) {
          if (errorMessage.includes("password")) {
            throw new Error("Password does not meet requirements. Please use a stronger password.")
          } else if (errorMessage.includes("email")) {
            throw new Error("Invalid email format. Please enter a valid email address.")
          } else {
            throw new Error(errorMessage)
          }
        } else {
          throw new Error(errorMessage)
        }
      }


      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        throw new Error("Unexpected response format from server")
      }

      if (data && data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken)


        const userData = decodeToken(data.jwtToken)
        if (userData) {
          setUser(userData)
        }
      } else {
        throw new Error("No token received from server")
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

