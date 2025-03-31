"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import MyAppointments from "@/components/my-appointments"
import { Badge } from "@/components/ui/badge"
import AvailabilityManager from "@/components/admin/availability-manager"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

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
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {isAdmin && (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  Admin
                </Badge>
              )}
            </div>
            <CardDescription>Your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p>{user?.userName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                <p>{user?.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p>{user?.role || "User"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isAdmin && <MyAppointments />}
      </div>

      {isAdmin && (
        <div className="mt-6 grid gap-6 grid-cols-1">
          <AvailabilityManager />
          <MyAppointments />
        </div>
      )}
    </div>
  )
}

