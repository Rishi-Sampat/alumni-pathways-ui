import { useState } from "react";
import { Filter, TrendingUp, Calendar, Users, Briefcase, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { StatsStrip } from "@/components/StatsStrip";
import { AlumniSpotlight } from "@/components/AlumniSpotlight";
import { QuickActions } from "@/components/QuickActions";
import { EventCard } from "@/components/EventCard";
import { AlumniCard } from "@/components/AlumniCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [userRole] = useState<'student' | 'alumni' | 'admin'>('student');
  const [isAuthenticated] = useState(false);

  // Mock data
  const recentEvents = [
    {
      id: "1",
      title: "Tech Career Panel Discussion",
      description: "Join industry leaders discussing career paths in technology",
      date: "Mar 20, 2024",
      time: "6:00 PM",
      location: "Virtual Event",
      type: "virtual" as const,
      category: "seminar",
      attendees: 89,
      maxAttendees: 150,
      organizer: "Alumni Tech Network",
      image: "/placeholder.svg",
      isRegistered: false,
      isPast: false
    },
    {
      id: "2",
      title: "Alumni Networking Mixer",
      description: "Connect with alumni from various industries over coffee",
      date: "Mar 25, 2024",
      time: "3:00 PM",
      location: "Campus Cafeteria",
      type: "physical" as const,
      category: "networking",
      attendees: 45,
      maxAttendees: 60,
      organizer: "Alumni Association",
      image: "/placeholder.svg",
      isRegistered: true,
      isPast: false
    },
    {
      id: "3",
      title: "Entrepreneurship Workshop",
      description: "Learn from successful alumni entrepreneurs",
      date: "Apr 2, 2024",
      time: "2:00 PM",
      location: "Innovation Lab",
      type: "hybrid" as const,
      category: "workshop",
      attendees: 32,
      maxAttendees: 40,
      organizer: "Startup Alumni Club",
      image: "/placeholder.svg",
      isRegistered: false,
      isPast: false
    }
  ];

  const featuredAlumni = [
    {
      id: "1",
      name: "Arjun Mehta",
      avatar: "/placeholder.svg",
      graduationYear: 2020,
      department: "Computer Science",
      currentCompany: "Microsoft",
      position: "Senior Developer",
      location: "Bangalore",
      domain: ["Software Engineering", "Cloud Computing", "AI/ML"],
      rating: 4.8,
      totalReviews: 24,
      resolvedDoubts: 67,
      isVerified: true
    },
    {
      id: "2", 
      name: "Kavya Singh",
      avatar: "/placeholder.svg",
      graduationYear: 2019,
      department: "Mechanical Engineering",
      currentCompany: "SpaceX",
      position: "Aerospace Engineer",
      location: "California, US",
      domain: ["Aerospace", "Design", "Manufacturing"],
      rating: 4.9,
      totalReviews: 31,
      resolvedDoubts: 43,
      isVerified: true
    },
    {
      id: "3",
      name: "Rohit Sharma",
      avatar: "/placeholder.svg", 
      graduationYear: 2021,
      department: "Data Science",
      currentCompany: "Netflix",
      position: "Data Scientist",
      location: "Mumbai",
      domain: ["Data Science", "Analytics", "Machine Learning"],
      rating: 4.7,
      totalReviews: 18,
      resolvedDoubts: 29,
      isVerified: true
    }
  ];

  const recentOpportunities = [
    {
      id: "1",
      title: "Software Engineering Intern",
      company: "Amazon",
      location: "Bangalore",
      type: "Internship",
      duration: "3 months",
      posted: "2 days ago",
      applications: 23
    },
    {
      id: "2", 
      title: "Product Manager - Entry Level",
      company: "Flipkart",
      location: "Bangalore",
      type: "Full-time",
      duration: "Permanent",
      posted: "5 days ago",
      applications: 41
    },
    {
      id: "3",
      title: "UI/UX Design Intern",
      company: "Zomato",
      location: "Delhi",
      type: "Internship", 
      duration: "6 months",
      posted: "1 week ago",
      applications: 17
    }
  ];

  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", points: 1240, badge: "🥇" },
    { rank: 2, name: "Rahul Kumar", points: 1180, badge: "🥈" },
    { rank: 3, name: "Sneha Patel", points: 1150, badge: "🥉" },
    { rank: 4, name: "Arjun Mehta", points: 980, badge: "" },
    { rank: 5, name: "Kavya Singh", points: 920, badge: "" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        userName={isAuthenticated ? "Student Name" : undefined}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Carousel */}
        <section className="animate-fade-in">
          <HeroCarousel />
        </section>

        {/* Stats Strip */}
        <section className="animate-slide-up">
          <StatsStrip />
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Alumni Spotlight */}
            <section className="animate-scale-in">
              <AlumniSpotlight />
            </section>

            {/* Recent Events */}
            <section className="reveal-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upcoming Events</h2>
                  <p className="text-muted-foreground">Don't miss these networking opportunities</p>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All Events</DropdownMenuItem>
                      <DropdownMenuItem>Virtual</DropdownMenuItem>
                      <DropdownMenuItem>Physical</DropdownMenuItem>
                      <DropdownMenuItem>Hybrid</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm">View All</Button>
                </div>
              </div>
              
              <div className="grid gap-4">
                <EventCard event={recentEvents[0]} viewMode="featured" />
                <div className="grid md:grid-cols-2 gap-4">
                  {recentEvents.slice(1).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Alumni */}
            <section className="reveal-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Connect with Alumni</h2>
                  <p className="text-muted-foreground">Top-rated alumni ready to help</p>
                </div>
                <Button size="sm">Browse All</Button>
              </div>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredAlumni.map(alumni => (
                  <AlumniCard key={alumni.id} alumni={alumni} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <QuickActions userRole={userRole} />

            {/* Recent Opportunities */}
            <div className="bg-card border rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Latest Opportunities</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {recentOpportunities.map(opportunity => (
                  <div key={opportunity.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-foreground line-clamp-1">
                        {opportunity.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {opportunity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{opportunity.company}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{opportunity.location}</span>
                      <span>{opportunity.applications} applied</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{opportunity.posted}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-card border rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Top Contributors</h3>
                <Badge className="bg-accent text-accent-foreground">
                  <Award className="h-3 w-3 mr-1" />
                  This Month
                </Badge>
              </div>
              
              <div className="space-y-3">
                {leaderboardData.map(person => (
                  <div key={person.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{person.badge || `#${person.rank}`}</span>
                      <span className="font-medium text-sm">{person.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{person.points}pts</span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Full Leaderboard
              </Button>
            </div>

            {/* Latest Announcements */}
            <div className="bg-card border rounded-xl p-6 shadow-soft">
              <h3 className="font-semibold text-foreground mb-4">Announcements</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">
                    New Mentorship Program Live!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enhanced 1:1 mentoring now available
                  </p>
                </div>
                
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Career Fair Registration Open
                  </p>
                  <p className="text-xs text-muted-foreground">
                    March 30th - Register now for early access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">AP</span>
                </div>
                <span className="font-semibold text-lg">Alumni Portal</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting students and alumni for lifelong mentorship and growth.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="/alumni" className="text-muted-foreground hover:text-primary">Browse Alumni</a>
                <a href="/events" className="text-muted-foreground hover:text-primary">Events</a>
                <a href="/opportunities" className="text-muted-foreground hover:text-primary">Opportunities</a>
                <a href="/leaderboard" className="text-muted-foreground hover:text-primary">Leaderboard</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <a href="/help" className="text-muted-foreground hover:text-primary">Help Center</a>
                <a href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</a>
                <a href="/guidelines" className="text-muted-foreground hover:text-primary">Community Guidelines</a>
                <a href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary">LinkedIn</a>
                <a href="#" className="text-muted-foreground hover:text-primary">Twitter</a>
                <a href="#" className="text-muted-foreground hover:text-primary">Instagram</a>
                <a href="#" className="text-muted-foreground hover:text-primary">Facebook</a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Alumni Portal. All rights reserved. Built with ❤️ for our community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;