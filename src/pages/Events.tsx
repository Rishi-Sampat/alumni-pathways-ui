import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'workshop' | 'webinar' | 'networking' | 'career_fair' | 'social' | 'meetup' | 'seminar';
  location: string;
  event_date: string;
  max_attendees: number;
  current_attendees: number;
  registration_deadline: string;
  image_url: string;
  created_at: string;
  organizer_id: string;
}

const Events = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    location: '',
    event_date: '',
    max_attendees: '',
    registration_deadline: '',
    image_url: '',
  });

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchRegisteredEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', profile.id);

      if (error) throw error;
      setRegisteredEvents(new Set(data?.map(reg => reg.event_id) || []));
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!profile?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create events",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          description: newEvent.description,
          event_type: newEvent.event_type,
          location: newEvent.location,
          event_date: new Date(newEvent.event_date).toISOString(),
          max_attendees: newEvent.max_attendees ? parseInt(newEvent.max_attendees) : null,
          registration_deadline: newEvent.registration_deadline ? new Date(newEvent.registration_deadline).toISOString() : null,
          image_url: newEvent.image_url || null,
          organizer_id: profile.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setIsCreateDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        event_type: 'workshop',
        location: '',
        event_date: '',
        max_attendees: '',
        registration_deadline: '',
        image_url: '',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleRegisterForEvent = async (eventId: string) => {
    if (!profile?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: profile.id,
        });

      if (error) throw error;

      // Update local state
      setRegisteredEvents(prev => new Set([...prev, eventId]));
      
      // Update event attendee count
      const event = events.find(e => e.id === eventId);
      if (event) {
        setEvents(prev => prev.map(e => 
          e.id === eventId 
            ? { ...e, current_attendees: e.current_attendees + 1 }
            : e
        ));
      }

      toast({
        title: "Registered!",
        description: "You've successfully registered for this event",
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.event_type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-primary/10 text-primary';
      case 'webinar': return 'bg-accent/10 text-accent';
      case 'networking': return 'bg-success/10 text-success';
      case 'career_fair': return 'bg-warning/10 text-warning';
      case 'social': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const canCreateEvent = profile?.role === 'alumni' || profile?.role === 'admin';
  const isPastEvent = (eventDate: string) => new Date(eventDate) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isAuthenticated={!!user} 
        userRole={profile?.role} 
        userName={profile ? `${profile.first_name} ${profile.last_name}` : undefined}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
            <p className="text-muted-foreground">Join workshops, webinars, and networking events</p>
          </div>
          
          {canCreateEvent && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Organize an event for the community
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Web Development Workshop"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Event Type</Label>
                      <Select value={newEvent.event_type} onValueChange={(value) => setNewEvent(prev => ({ ...prev, event_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="career_fair">Career Fair</SelectItem>
                          <SelectItem value="social">Social Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Online / Conference Room A"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event_date">Event Date & Time</Label>
                      <Input
                        id="event_date"
                        type="datetime-local"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, event_date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_attendees">Max Attendees (Optional)</Label>
                      <Input
                        id="max_attendees"
                        type="number"
                        value={newEvent.max_attendees}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, max_attendees: e.target.value }))}
                        placeholder="50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registration_deadline">Registration Deadline (Optional)</Label>
                    <Input
                      id="registration_deadline"
                      type="datetime-local"
                      value={newEvent.registration_deadline}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, registration_deadline: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the event..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Event Image URL (Optional)</Label>
                    <Input
                      id="image_url"
                      value={newEvent.image_url}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="webinar">Webinars</SelectItem>
              <SelectItem value="networking">Networking</SelectItem>
              <SelectItem value="career_fair">Career Fairs</SelectItem>
              <SelectItem value="social">Social Events</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover-lift hover:shadow-soft transition-all duration-300 overflow-hidden">
                {event.image_url && (
                  <div className="h-48 bg-gradient-hero relative overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        {event.location}
                      </CardDescription>
                    </div>
                    <Badge className={getTypeColor(event.event_type)}>
                      {event.event_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(event.event_date).toLocaleDateString()} at {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  {event.max_attendees && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-3 w-3" />
                      {event.current_attendees} / {event.max_attendees} registered
                    </div>
                  )}
                  
                  {event.registration_deadline && !isPastEvent(event.registration_deadline) && (
                    <div className="flex items-center text-sm text-warning">
                      <Clock className="mr-1 h-3 w-3" />
                      Register by {new Date(event.registration_deadline).toLocaleDateString()}
                    </div>
                  )}
                  
                  {user && !isPastEvent(event.event_date) && (
                    <Button
                      className="w-full"
                      onClick={() => handleRegisterForEvent(event.id)}
                      disabled={
                        registeredEvents.has(event.id) ||
                        (event.max_attendees && event.current_attendees >= event.max_attendees) ||
                        (event.registration_deadline && isPastEvent(event.registration_deadline))
                      }
                    >
                      {registeredEvents.has(event.id) 
                        ? 'Registered ✓' 
                        : event.max_attendees && event.current_attendees >= event.max_attendees
                        ? 'Event Full'
                        : event.registration_deadline && isPastEvent(event.registration_deadline)
                        ? 'Registration Closed'
                        : 'Register'
                      }
                    </Button>
                  )}
                  
                  {isPastEvent(event.event_date) && (
                    <Badge variant="secondary" className="w-full justify-center">
                      Event Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No events found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;