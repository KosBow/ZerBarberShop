"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Scissors, Mail, Lock, Loader2, ArrowRight, ArrowLeft, User, CheckCircle2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Background animation
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setBackgroundPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }
    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
    setError("") // Clear error when going back
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Clear previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, confirmPassword)

      // Only show success toast and redirect if registration was successful
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      })
      router.push("/")
    } catch (error) {
      // Handle the error - display it and don't redirect
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      setError(errorMessage)
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, text: "" }

    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1

    const texts = ["Weak", "Fair", "Good", "Strong"]
    return {
      strength,
      text: strength > 0 ? texts[strength - 1] : "",
    }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: `${50 + backgroundPosition.x * 5}% ${50 + backgroundPosition.y * 5}%`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full z-10"
      >
        <div className="flex justify-center mb-8">
          <motion.div className="bg-gold p-4 rounded-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Scissors className="h-12 w-12 text-black" />
          </motion.div>
        </div>

        <Card className="border-primary/20 shadow-2xl bg-black/80 backdrop-blur-md border-gold/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Create an Account</CardTitle>
            <CardDescription className="text-center text-gray-400">
              {step === 1 ? "Enter your email to get started" : "Create a secure password"}
            </CardDescription>
          </CardHeader>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleNextStep}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gold" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-black/50 border-gold/30 text-white focus:border-gold"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-gold hover:bg-gold/80 text-black">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="text-center text-sm text-gray-400">
                      Already have an account?{" "}
                      <Link href="/login" className="text-gold hover:underline font-medium">
                        Login
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 bg-black/30 p-2 rounded-md mb-4">
                      <User className="h-5 w-5 text-gold" />
                      <p className="text-sm text-white">{email}</p>
                    </div>

                    {error && (
                      <motion.div
                        className="bg-red-500/10 border border-red-500/30 rounded-md p-3 mb-4 text-red-500 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          {error}
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gold" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-black/50 border-gold/30 text-white focus:border-gold"
                          required
                        />
                      </div>
                      {password && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">Password strength:</span>
                            <span
                              className={`text-xs font-medium ${
                                passwordStrength.strength === 1
                                  ? "text-red-400"
                                  : passwordStrength.strength === 2
                                    ? "text-yellow-400"
                                    : passwordStrength.strength === 3
                                      ? "text-green-400"
                                      : passwordStrength.strength === 4
                                        ? "text-green-500"
                                        : ""
                              }`}
                            >
                              {passwordStrength.text}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                passwordStrength.strength === 1
                                  ? "bg-red-400 w-1/4"
                                  : passwordStrength.strength === 2
                                    ? "bg-yellow-400 w-2/4"
                                    : passwordStrength.strength === 3
                                      ? "bg-green-400 w-3/4"
                                      : passwordStrength.strength === 4
                                        ? "bg-green-500 w-full"
                                        : "w-0"
                              }`}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gold" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 bg-black/50 border-gold/30 text-white focus:border-gold"
                          required
                        />
                      </div>
                      {confirmPassword && password === confirmPassword && (
                        <div className="flex items-center mt-1 text-green-400 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Passwords match
                        </div>
                      )}
                      {confirmPassword && password !== confirmPassword && (
                        <div className="flex items-center mt-1 text-red-400 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="flex space-x-2 w-full">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex-1 border-gold/30 text-white hover:bg-gold/20"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 bg-gold hover:bg-gold/80 text-black" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}

