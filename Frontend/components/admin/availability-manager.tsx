"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, CalendarDays, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/lib/api"
import { format, isSameDay, addMonths, isToday } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AvailabilityDay {
  id: number
  date: string
  timeSlots: string[]
}

export default function AvailabilityManager() {
  const [availableDays, setAvailableDays] = useState<Date[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [nextMonth, setNextMonth] = useState<Date>(addMonths(new Date(), 1))
  const { toast } = useToast()


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
        }
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [])


  const toggleDay = (day: Date | undefined) => {
    if (!day) return

    setAvailableDays((prev) => {

      const exists = prev.some((d) => isSameDay(d, day))

      if (exists) {
        // Remove the day
        return prev.filter((d) => !isSameDay(d, day))
      } else {
        // Add the day
        return [...prev, day]
      }
    })
  }

  // Save availability to the server
  const saveAvailability = async () => {
    setIsSaving(true)
    try {
      // Format dates to ISO strings
      const formattedDays = availableDays.map((day) => ({
        date: day.toISOString(),
        timeSlots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
      }))

      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/Availability`, {
        method: "POST",
        body: JSON.stringify(formattedDays),
      })

      if (response.ok) {
        toast({
          title: "Availability saved",
          description: "Your availability has been updated successfully",
        })
      } else {
        toast({
          title: "Failed to save",
          description: "There was an error saving your availability",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving availability:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving your availability",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-gold" />
            <div>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Set the days when you're available for appointments</CardDescription>
            </div>
          </div>
          <Button onClick={saveAvailability} disabled={isSaving} className="bg-gold hover:bg-gold-darker text-black">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Availability
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="march" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="march">{format(currentMonth, "MMMM yyyy")}</TabsTrigger>
            <TabsTrigger value="april">{format(nextMonth, "MMMM yyyy")}</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calendar Column */}
            <div>
              <TabsContent value="march" className="mt-0">
                <Calendar
                  mode="multiple"
                  selected={availableDays}
                  onSelect={(days) => setAvailableDays(days || [])}
                  className="rounded-md border"
                  disabled={(date) => {
                    // Disable past dates
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  classNames={{
                    day_today: "bg-gold/20 text-white",
                    day_selected:
                      "bg-gold text-black hover:bg-gold-darker hover:text-black focus:bg-gold focus:text-black",
                    day_disabled: "text-muted-foreground opacity-50",
                    day: "h-9 w-9 text-sm font-medium",
                    head_cell: "text-muted-foreground font-normal text-xs",
                    table: "w-full border-collapse",
                    cell: "text-center p-0 relative",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
                    caption: "text-base font-medium py-1",
                  }}
                />
              </TabsContent>

              <TabsContent value="april" className="mt-0">
                <Calendar
                  mode="multiple"
                  selected={availableDays}
                  onSelect={(days) => setAvailableDays(days || [])}
                  className="rounded-md border"
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }}
                  month={nextMonth}
                  onMonthChange={setNextMonth}
                  classNames={{
                    day_today: "bg-gold/20 text-white",
                    day_selected:
                      "bg-gold text-black hover:bg-gold-darker hover:text-black focus:bg-gold focus:text-black",
                    day: "h-9 w-9 text-sm font-medium",
                    head_cell: "text-muted-foreground font-normal text-xs",
                    table: "w-full border-collapse",
                    cell: "text-center p-0 relative",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
                    caption: "text-base font-medium py-1",
                  }}
                />
              </TabsContent>
            </div>

            <div className="bg-dark-lighter rounded-lg p-4 h-full">
              <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gold" />
                Selected Available Days
              </h3>

              {availableDays.length === 0 ? (
                <p className="text-sm text-muted-foreground">No days selected</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {availableDays
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((day, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`flex items-center justify-between py-2 px-3 ${isToday(day) ? "border-gold text-gold" : ""}`}
                      >
                        <span>{format(day, "EEE, MMM d, yyyy")}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded-full ml-1 hover:bg-red-500/20"
                          onClick={() => toggleDay(day)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

