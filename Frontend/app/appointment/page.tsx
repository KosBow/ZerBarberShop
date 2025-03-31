"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { format, isSameDay } from "date-fns"
import { CalendarIcon, Loader2, Scissors, Clock, CalendarPlus2Icon as CalendarIcon2, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { services } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"


import { AlertCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


import { fetchWithAuth } from "@/lib/api"

interface AvailabilityDay {
  id: number
  date: string
  timeSlots: string[]
}

interface ServiceSelection {
  id: number
  selected: boolean
}

export default function AppointmentPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [availableDays, setAvailableDays] = useState<Date[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>(
    services.map((service) => ({ id: service.id, selected: false })),
  )
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const servicesRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })


  const [existingAppointments, setExistingAppointments] = useState<any[]>([])
  const [hasAcceptedAppointment, setHasAcceptedAppointment] = useState(false)
  const [hasPendingAppointment, setHasPendingAppointment] = useState(false)

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
    const fetchAvailability = async () => {
      setIsLoading(true)
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Availability`)

        if (response.ok) {
          const data: AvailabilityDay[] = await response.json()

          const dates = data.map((day) => new Date(day.date))
          setAvailableDays(dates)
        } else {
          console.error("Failed to fetch availability")
          toast({
            title: "No available days",
            description: "There are currently no available days for booking. Please check back later.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchAvailability()
    }
  }, [isAuthenticated, toast])

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to book an appointment",
        variant: "destructive",
      })
      router.push("/login")
    } else {
      router.push("/appointment")
    }
  }, [isAuthenticated, router, toast])


  useEffect(() => {
    let price = 0
    let duration = 0

    selectedServices.forEach((item) => {
      if (item.selected) {
        const service = services.find((s) => s.id === item.id)
        if (service) {
          price += service.price
      
          const durationMinutes = Number.parseInt(service.duration.split(" ")[0])
          duration += durationMinutes
        }
      }
    })

    setTotalPrice(price)
    setTotalDuration(duration)
  }, [selectedServices])


  useEffect(() => {

    const fetchExistingAppointments = async () => {
      if (!isAuthenticated || !user) return

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Reservation/user`)

        if (response.ok) {
          const data = await response.json()
          setExistingAppointments(data)

     
          const hasAccepted = data.some((appointment: any) => appointment.isAccepted)
          setHasAcceptedAppointment(hasAccepted)

    
          const hasPending = data.some((appointment: any) => appointment.isPending)
          setHasPendingAppointment(hasPending)
        }
      } catch (error) {
        console.error("Error fetching existing appointments:", error)
      }
    }

    fetchExistingAppointments()
  }, [isAuthenticated, user])

  const toggleService = (id: number) => {
    setSelectedServices((prev) =>
      prev.map((service) => (service.id === id ? { ...service, selected: !service.selected } : service)),
    )
  }

  const handleNextStep = () => {
    const selectedServiceIds = selectedServices.filter((service) => service.selected).map((service) => service.id)

    if (selectedServiceIds.length === 0) {
      toast({
        title: "Service required",
        description: "Please select at least one service",
        variant: "destructive",
      })
      return
    }

    setStep(2)
   
    setTimeout(() => {
      dateRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handlePrevStep = () => {
    setStep(1)
    setTimeout(() => {
      servicesRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }


  const handleBookAppointment = async () => {
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      })
      return
    }

    const selectedServiceIds = selectedServices.filter((service) => service.selected).map((service) => service.id)

    if (selectedServiceIds.length === 0) {
      toast({
        title: "Service required",
        description: "Please select at least one service",
        variant: "destructive",
      })
      return
    }


    if (hasAcceptedAppointment) {
      toast({
        title: "Appointment already booked",
        description: "You already have an accepted appointment. Please cancel it first if you want to book a new one.",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    try {
      console.log("Sending appointment data:", {
        userId: user?.id,
        email: user?.email,
        username: user?.userName,
        date: date.toISOString(),
        services: selectedServiceIds,
        totalPrice,
        totalDuration,
      })

      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Reservation`, {
        method: "POST",
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          username: user?.userName,
          date: date.toISOString(),
          services: selectedServiceIds,
          totalPrice,
          totalDuration,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Appointment booked",
          description: "Your appointment has been successfully booked",
        })
        router.push("/profile")
      } else {
        toast({
          title: "Booking failed",
          description: data.message || "Failed to book appointment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Error",
        description: "An error occurred while booking your appointment",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')",
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

      <div className="container mx-auto max-w-4xl relative z-20">
        {hasAcceptedAppointment && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Appointment Already Accepted</AlertTitle>
              <AlertDescription>
                You already have an accepted appointment. If you need to change your appointment time or request a
                refund, please contact us directly.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {hasPendingAppointment && !hasAcceptedAppointment && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="warning" className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-500">Pending Appointment</AlertTitle>
              <AlertDescription className="text-amber-400/90">
                You already have a pending appointment. If you book a new one, your previous request will be
                automatically canceled.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-white font-playfair">Book Your Appointment</h1>
          <motion.div
            className="h-1 w-20 bg-gold mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Select your services and preferred time for a premium grooming experience
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-center space-x-2 bg-dark-card/50 backdrop-blur-md p-3 rounded-full border border-gold/20">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${step === 1 ? "bg-gold text-black" : "text-white"}`}
            >
              <Scissors className="h-4 w-4" />
              <span className="font-medium">Services</span>
            </div>
            <div className="text-gold">→</div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${step === 2 ? "bg-gold text-black" : "text-white"}`}
            >
              <CalendarIcon2 className="h-4 w-4" />
              <span className="font-medium">Date & Time</span>
            </div>
          </div>
        </motion.div>

        <Card className="border-gold/20 bg-dark-card/90 backdrop-blur-md shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                  ref={servicesRef}
                >
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <motion.div
                          className="bg-gold/20 p-2 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Scissors className="h-5 w-5 text-gold" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-white">Select Services</h3>
                      </div>

                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        variants={{
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                          },
                        }}
                        initial="hidden"
                        animate="show"
                      >
                        {services.map((service) => (
                          <motion.div
                            key={service.id}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              show: { opacity: 1, y: 0 },
                            }}
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-start space-x-3 p-4 rounded-md border cursor-pointer transition-colors ${
                              selectedServices.find((s) => s.id === service.id)?.selected
                                ? "border-gold bg-gold/10"
                                : "border-dark-border hover:border-gold/50 bg-dark-lighter/50"
                            }`}
                            onClick={() => toggleService(service.id)}
                          >
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={selectedServices.find((s) => s.id === service.id)?.selected || false}
                              onCheckedChange={() => toggleService(service.id)}
                              className="mt-1 data-[state=checked]:bg-gold data-[state=checked]:text-black"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={`service-${service.id}`}
                                className="text-base font-medium cursor-pointer flex justify-between text-white"
                              >
                                <span>{service.title}</span>
                                <span className="text-gold">${service.price}</span>
                              </label>
                              <div className="flex items-center text-sm text-gray-400 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{service.duration}</span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>

                      <AnimatePresence>
                        {selectedServices.some((s) => s.selected) && (
                          <motion.div
                            className="mt-6 p-4 bg-dark-lighter/80 rounded-md border border-gold/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-white">Selected Services</h4>
                                <div className="text-sm text-gray-400 flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Total Duration: {totalDuration} minutes</span>
                                </div>
                              </div>
                              <div className="text-xl font-bold text-gold flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {totalPrice.toFixed(2)}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex justify-end">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          onClick={handleNextStep}
                          className="bg-gold hover:bg-gold/80 text-black"
                          disabled={!selectedServices.some((s) => s.selected)}
                        >
                          Continue to Date Selection
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                  ref={dateRef}
                >
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Scissors className="h-12 w-12 text-gold opacity-50" />
                      </motion.div>
                    </div>
                  ) : availableDays.length === 0 ? (
                    <motion.div
                      className="text-center py-12 text-gray-400"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CalendarIcon2 className="h-16 w-16 mx-auto mb-4 text-gold/30" />
                      <h3 className="text-xl font-medium mb-2 text-white">No Available Dates</h3>
                      <p className="text-gray-400">No available appointment days at the moment.</p>
                      <p className="text-sm mt-2">Please check back later or contact us directly.</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <motion.div
                          className="bg-gold/20 p-2 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <CalendarIcon2 className="h-5 w-5 text-gold" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-white">Select Date and Time</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-dark-lighter/50 p-4 rounded-md border border-gold/20">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => {
                      
                              return !availableDays.some((d) => isSameDay(d, date))
                            }}
                            className="rounded-md border-0"
                            classNames={{
                              day_today: "bg-gold/20 text-white",
                              day_selected:
                                "bg-gold text-black hover:bg-gold/80 hover:text-black focus:bg-gold focus:text-black",
                              day_disabled: "text-muted-foreground opacity-50",
                              day: "h-9 w-9 text-sm font-medium text-white hover:bg-gold/20",
                              head_cell: "text-muted-foreground font-normal text-xs",
                              table: "w-full border-collapse",
                              cell: "text-center p-0 relative",
                              nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 text-white",
                              caption: "text-base font-medium py-1 text-white",
                            }}
                          />
                        </div>

                        <div>
                          {date ? (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <h4 className="font-medium text-white">
                                Available Times for {format(date, "MMMM d, yyyy")}
                              </h4>
                              <div className="grid grid-cols-3 gap-2">
                                {["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(
                                  (time) => {
                                    const [hours, minutes] = time.split(":").map(Number)
                                    const timeDate = new Date(date)
                                    timeDate.setHours(hours, minutes, 0, 0)
                                    const isSelected =
                                      date && date.getHours() === hours && date.getMinutes() === minutes

                                    return (
                                      <motion.div key={time} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant={isSelected ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => {
                                            const newDate = new Date(date)
                                            newDate.setHours(hours, minutes, 0, 0)
                                            setDate(newDate)
                                          }}
                                          className={
                                            isSelected
                                              ? "w-full bg-gold hover:bg-gold/80 text-black"
                                              : "w-full border-gold/30 text-white hover:bg-gold/20"
                                          }
                                        >
                                          {time}
                                        </Button>
                                      </motion.div>
                                    )
                                  },
                                )}
                              </div>
                              <div className="mt-6 p-4 bg-dark-lighter/80 rounded-md border border-gold/20">
                                <h4 className="font-medium text-white mb-2">Appointment Summary</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                  <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="text-white">{format(date, "MMMM d, yyyy")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="text-white">{format(date, "h:mm a")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="text-white">{totalDuration} minutes</span>
                                  </div>
                                  <div className="flex justify-between font-medium">
                                    <span>Total:</span>
                                    <span className="text-gold">${totalPrice.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                              <CalendarIcon className="h-12 w-12 text-gold/30 mb-4" />
                              <p className="text-gray-400">Please select a date from the calendar</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            onClick={handlePrevStep}
                            variant="outline"
                            className="border-gold/30 text-white hover:bg-gold/20"
                          >
                            Back to Services
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            onClick={handleBookAppointment}
                            className="bg-gold hover:bg-gold/80 text-black"
                            disabled={isBooking || !date}
                          >
                            {isBooking ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Booking...
                              </>
                            ) : (
                              <>
                                <Scissors className="mr-2 h-4 w-4" />
                                Book Appointment
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

