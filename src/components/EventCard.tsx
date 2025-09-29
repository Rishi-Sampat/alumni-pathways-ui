import { Calendar, Clock, MapPin, Users, ExternalLink, BookmarkPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: 'virtual' | 'physical' | 'hybrid';
    category: string;
    attendees: number;
    maxAttendees?: number;
    organizer: string;
    image: string;
    isRegistered: boolean;
    isPast: boolean;
  };
  viewMode?: 'card' | 'featured';
}

export const EventCard = ({ event, viewMode = 'card' }: EventCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'virtual': return 'bg-primary text-primary-foreground';
      case 'physical': return 'bg-success text-success-foreground';
      case 'hybrid': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'networking': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'workshop': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'seminar': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'meetup': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  if (viewMode === 'featured') {
    return (
      <div className="bg-card border rounded-xl overflow-hidden shadow-card hover-lift group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={getTypeColor(event.type)} variant="secondary">
              {event.type}
            </Badge>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
              <BookmarkPlus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Description */}
          <h3 className="font-semibold text-xl text-foreground mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-foreground">{event.date}</span>
              <Clock className="h-4 w-4 text-primary ml-2" />
              <span className="text-foreground">{event.time}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground">{event.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground">
                {event.attendees} attending
                {event.maxAttendees && ` • ${event.maxAttendees - event.attendees} spots left`}
              </span>
            </div>
          </div>

          {/* Organizer */}
          <p className="text-xs text-muted-foreground mb-4">
            Organized by {event.organizer}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            {event.isRegistered ? (
              <Button className="flex-1 bg-success hover:bg-success/90" disabled={event.isPast}>
                {event.isPast ? 'Event Completed' : 'Registered'}
              </Button>
            ) : (
              <Button className="flex-1" disabled={event.isPast}>
                {event.isPast ? 'Event Ended' : 'Register Now'}
              </Button>
            )}
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-4 hover-lift">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{event.title}</h3>
            <div className="flex gap-1 ml-2">
              <Badge className={getTypeColor(event.type)} variant="secondary">
                {event.type}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {event.attendees}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
            
            <div className="flex gap-2">
              {event.isRegistered ? (
                <Badge className="bg-success text-success-foreground text-xs">
                  Registered
                </Badge>
              ) : (
                <Button size="sm" disabled={event.isPast}>
                  {event.isPast ? 'Ended' : 'Register'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};