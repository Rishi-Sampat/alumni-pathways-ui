"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { StatsStrip } from "@/components/StatsStrip"
import { EventCard } from "@/components/EventCard"
import { QuickActions } from "@/components/QuickActions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Calendar, MessageSquare, Award } from "lucide-react"
import { Link } from "react-router-dom"
import { AlumniCard } from "@/components/AlumniCard"

const Dashboard = () => {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    totalEvents: 0,
    activeDoubts: 0,
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [recentOpportunities, setRecentOpportunities] = useState([])
  const [featuredAlumni, setFeaturedAlumni] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [usersResult, opportunitiesResult, eventsResult, doubtsResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("doubts").select("id", { count: "exact", head: true }).eq("status", "open"),
      ])

      setStats({
        totalUsers: usersResult.count || 0,
        totalOpportunities: opportunitiesResult.count || 0,
        totalEvents: eventsResult.count || 0,
        activeDoubts: doubtsResult.count || 0,
      })

      // Fetch recent events
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3)

      setRecentEvents(events || [])

      // Fetch recent opportunities
      const { data: opportunities } = await supabase
        .from("opportunities")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3)

      setRecentOpportunities(opportunities || [])

      // Fetch featured alumni
      const { data: alumni } = await supabase
        .from("alumni_profiles")
        .select(`
          *,
          profile:profiles!alumni_profiles_profile_id_fkey(
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3)

      setFeaturedAlumni(alumni || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={!!user}
        userRole={profile?.role}
        userName={profile ? ${profile.first_name} ${profile.last_name} : undefined}
      />

      <main className="container mx-auto px-4 py-8">
        <HeroCarousel />

        <div className="mb-8">
          <StatsStrip
            stats={[
              { label: "Active Members", value: stats.totalUsers, icon: Users },
              { label: "Opportunities", value: stats.totalOpportunities, icon: Briefcase },
              { label: "Upcoming Events", value: stats.totalEvents, icon: Calendar },
              { label: "Open Questions", value: stats.activeDoubts, icon: MessageSquare },
            ]}
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <QuickActions userRole={profile?.role} />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Don't miss these upcoming events</CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link to="/events">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No upcoming events</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Featured Alumni
                  </CardTitle>
                  <CardDescription>Connect with successful alumni</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {featuredAlumni.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No featured alumni</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {featuredAlumni.map((alumni) => (
                      <AlumniCard
                        key={alumni.id}
                        alumni={{
                          id: alumni.id,
                          name: ${alumni.profile?.first_name || ""} ${alumni.profile?.last_name || ""},
                          avatar: alumni.profile?.avatar_url || "",
                          position: alumni.current_position || "Alumni",
                          company: alumni.current_company || "",
                          graduationYear: alumni.graduation_year,
                          location: alumni.location || "",
                          achievements: alumni.achievements || [],
                          domains: alumni.domains || [],
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Latest Opportunities
                  </CardTitle>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/opportunities">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOpportunities.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No opportunities available</p>
                ) : (
                  recentOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border-l-2 border-primary pl-4">
                      <h4 className="font-medium text-sm">{opportunity.title}</h4>
                      <p className="text-muted-foreground text-xs">{opportunity.company_name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {opportunity.type}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                  <Link to="/doubts">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask a Question
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                  <Link to="/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming Events
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                  <Link to="/opportunities">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Job Opportunities
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard