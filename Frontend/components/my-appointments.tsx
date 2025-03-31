"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/lib/api"
import { format } from "date-fns"
import { Trash2, Search, RefreshCw, Check, Scissors, Clock, Calendar } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Input } from "@/components/ui/input"
import { services } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface Reservation {
  id: number
  userId: number
  username: string
  email: string
  date: string
  isPending: boolean
  isAccepted: boolean
  services?: number[]
  totalPrice?: number
  totalDuration?: number
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Reservation[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { isAdmin } = useAuth()
  const [activeAppointment, setActiveAppointment] = useState<number | null>(null)
  const fetchUserAppointments = async () => {
    setIsLoading(true)
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Reservation/user`)

      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
        setFilteredAppointments(data)
      } else if (response.status === 404) {
        setAppointments([])
        setFilteredAppointments([])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching user appointments:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllAppointments = async () => {
    setIsLoading(true)
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Reservation`)

      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
        setFilteredAppointments(data)
      } else if (response.status === 404) {
        setAppointments([])
        setFilteredAppointments([])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching all appointments:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAllAppointments()
    } else {
      fetchUserAppointments()
    }
  }, [isAdmin])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAppointments(appointments)
    } else {
      const filtered = appointments.filter(
        (appointment) =>
          appointment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          format(new Date(appointment.date), "MMMM d, yyyy").toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredAppointments(filtered)
    }
  }, [searchTerm, appointments])

  const handleAcceptAppointment = async (id: number) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Reservation/${id}/accept`, {
        method: "PATCH",
      })

      if (response.ok) {
        toast({
          title: "Appointment Accepted",
          description: "The appointment has been successfully accepted.",
        })

        if (isAdmin) {
          fetchAllAppointments()
        } else {
          fetchUserAppointments()
        }
      } else {
        const data = await response.json().catch(() => ({}))
        toast({
          title: "Accept failed",
          description: data.message || "Failed to accept appointment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error accepting appointment:", error)
      toast({
        title: "Error",
        description: "An error occurred while accepting the appointment.",
        variant: "destructive",
      })
    }
  }

  const handleCancelAppointment = async (id: number, isAdminAction?: boolean) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Reservation/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Appointment deleted",
          description: "The appointment has been deleted successfully.",
        })

        setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
        setFilteredAppointments((prev) => prev.filter((appointment) => appointment.id !== id))

        refreshAppointments()
      } else {
        const data = await response.json().catch(() => ({}))
        toast({
          title: "Deletion failed",
          description: data.message || "Failed to delete the appointment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the appointment.",
        variant: "destructive",
      })
    }
  }

  const refreshAppointments = () => {
    if (isAdmin) {
      fetchAllAppointments()
    } else {
      fetchUserAppointments()
    }
  }


  const getServiceNames = (serviceIds?: number[]) => {
    if (!serviceIds || serviceIds.length === 0) return "Classic Haircut"

    return serviceIds
      .map((id) => {
        const service = services.find((s) => s.id === id)
        return service ? service.title : ""
      })
      .filter(Boolean)
      .join(", ")
  }


  const getAppointmentPrice = (appointment: Reservation) => {
    if (appointment.totalPrice) {
      return appointment.totalPrice
    }


    if (appointment.services && appointment.services.length > 0) {
      return appointment.services.reduce((total, serviceId) => {
        const service = services.find((s) => s.id === serviceId)
        return total + (service ? service.price : 0)
      }, 0)
    }


    return 25 
  }


  const getStatusColor = (appointment: Reservation) => {
    if (appointment.isPending) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
    if (appointment.isAccepted) return "bg-green-500/20 text-green-500 border-green-500/30"
    return "bg-red-500/20 text-red-500 border-red-500/30"
  }


  const getStatusText = (appointment: Reservation) => {
    if (appointment.isPending) return "Pending"
    if (appointment.isAccepted) return "Accepted"
    return "Cancelled"
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <Card className="w-full border-gold/20 bg-dark-card shadow-xl relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23d4af37" fillOpacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
        }}
      ></div>

      <CardHeader className="relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              className="bg-gold/20 p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Calendar className="h-5 w-5 text-gold" />
            </motion.div>
            <div>
              <CardTitle>{isAdmin ? "All Appointments" : "My Appointments"}</CardTitle>
              <CardDescription>
                {isAdmin ? "View and manage all customer appointments" : "View and manage your upcoming appointments"}
              </CardDescription>
            </div>
          </div>
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshAppointments}
              title="Refresh"
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        {isAdmin && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gold" />
              <Input
                placeholder="Search by name, email or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-gold/30 focus:border-gold bg-dark-lighter"
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Scissors className="h-12 w-12 text-gold opacity-50" />
            </motion.div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <motion.div
            className="text-center py-12 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gold/30" />
            <h3 className="text-xl font-medium mb-2">No Appointments</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "No appointments match your search" : "No appointments scheduled."}
            </p>
            {!searchTerm && !isAdmin && (
              <Button
                variant="outline"
                className="mt-4 border-gold/30 text-gold hover:bg-gold/10"
                onClick={() => (window.location.href = "/appointment")}
              >
                Book an Appointment
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                variants={item}
                layoutId={`appointment-${appointment.id}`}
                onClick={() => setActiveAppointment(activeAppointment === appointment.id ? null : appointment.id)}
                className="cursor-pointer"
              >
                <div
                  className={`p-4 border rounded-md transition-all duration-300 ${
                    activeAppointment === appointment.id
                      ? "border-gold bg-gold/5 shadow-lg"
                      : "border-dark-border hover:border-gold/30 hover:bg-dark-lighter"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full mt-1 ${
                          appointment.isPending
                            ? "bg-yellow-500/10"
                            : appointment.isAccepted
                              ? "bg-green-500/10"
                              : "bg-red-500/10"
                        }`}
                      >
                        <Calendar
                          className={`h-5 w-5 ${
                            appointment.isPending
                              ? "text-yellow-500"
                              : appointment.isAccepted
                                ? "text-green-500"
                                : "text-red-500"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{format(new Date(appointment.date), "MMMM d, yyyy")}</p>
                          <Badge variant="outline" className={getStatusColor(appointment)}>
                            {getStatusText(appointment)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gold">{format(new Date(appointment.date), "h:mm a")}</p>
                        <p className="text-sm text-muted-foreground mt-1">Client: {appointment.username}</p>
                        <p className="text-sm text-muted-foreground">Email: {appointment.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      {isAdmin && appointment.isPending && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAcceptAppointment(appointment.id)
                          }}
                          className="flex items-center border-green-500/30 text-green-500 hover:bg-green-500/10"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      )}
                      {isAdmin && appointment.isAccepted && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelAppointment(appointment.id, true)
                          }}
                          className="flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                      {!isAdmin && !appointment.isAccepted && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelAppointment(appointment.id, false)
                          }}
                          className="flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

   
                  <AnimatePresence>
                    {activeAppointment === appointment.id && (
                      <motion.div
                        className="bg-dark-lighter p-4 rounded-md mt-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start gap-2">
                          <Scissors className="h-4 w-4 text-gold mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Services:</p>
                            <p className="text-sm">{getServiceNames(appointment.services)}</p>
                          </div>
                        </div>

                        {appointment.totalDuration && (
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-gold" />
                            <p className="text-sm">Duration: {appointment.totalDuration} minutes</p>
                          </div>
                        )}

                        <div className="mt-2 text-right">
                          <p className="text-sm font-bold text-gold">${getAppointmentPrice(appointment).toFixed(2)}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

