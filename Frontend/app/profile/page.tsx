"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import MyAppointments from "@/components/my-appointments"
import { Badge } from "@/components/ui/badge"
import AvailabilityManager from "@/components/admin/availability-manager"
import { motion } from "framer-motion"
import { User, Shield, Mail, Key, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to view your profile",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-gold" />
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div
      className="min-h-screen py-12 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-0"></div>

      <div
        className="absolute inset-0 z-10 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23d4af37" fillOpacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          transition: "transform 0.3s ease-out",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-white font-playfair">My Profile</h1>
          <motion.div
            className="h-1 w-20 bg-gold mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Manage your account information and appointments</p>
        </motion.div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-gold/20 bg-dark-card/90 backdrop-blur-md shadow-xl h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="bg-gold/20 p-2 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <User className="h-5 w-5 text-gold" />
                    </motion.div>
                    <CardTitle>Profile Information</CardTitle>
                  </div>
                  {isAdmin && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Badge variant="default" className="bg-gold text-black hover:bg-gold/80">
                        Admin
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <CardDescription>Your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div
                    className="p-4 bg-dark-lighter/50 rounded-md border border-gold/10 hover:border-gold/30 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Username</p>
                        <p className="text-white">{user?.userName}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-dark-lighter/50 rounded-md border border-gold/10 hover:border-gold/30 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Email</p>
                        <p className="text-white">{user?.email}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-dark-lighter/50 rounded-md border border-gold/10 hover:border-gold/30 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Account ID</p>
                        <p className="text-white">{user?.id}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-dark-lighter/50 rounded-md border border-gold/10 hover:border-gold/30 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-sm font-medium text-gray-400">Role</p>
                        <p className="text-white">{user?.role || "User"}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isAdmin ? <AvailabilityManager /> : <MyAppointments />}
          </motion.div>
        </div>

        {isAdmin && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <MyAppointments />
          </motion.div>
        )}
      </div>
    </div>
  )
}

