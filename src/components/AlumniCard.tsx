import { MapPin, Building, MessageCircle, Users, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AlumniCardProps {
  alumni: {
    id: string;
    name: string;
    avatar: string;
    graduationYear: number;
    department: string;
    currentCompany: string;
    position: string;
    location: string;
    domain: string[];
    rating: number;
    totalReviews: number;
    resolvedDoubts: number;
    isVerified: boolean;
  };
  viewMode?: 'card' | 'list';
  showActions?: boolean;
}

export const AlumniCard = ({ alumni, viewMode = 'card', showActions = true }: AlumniCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card border rounded-lg p-4 hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={alumni.avatar} />
              <AvatarFallback>{getInitials(alumni.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{alumni.name}</h3>
                {alumni.isVerified && (
                  <Badge className="bg-success text-success-foreground text-xs">Verified</Badge>
                )}
                <span className="text-sm text-muted-foreground">'{alumni.graduationYear.toString().slice(-2)}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {alumni.currentCompany}
                </span>
                <span>{alumni.position}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alumni.location}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                {alumni.domain.slice(0, 2).map((domain, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {domain}
                  </Badge>
                ))}
                {alumni.domain.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{alumni.domain.length - 2} more</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right text-sm">
              <div className="flex items-center gap-1 text-warning">
                <Star className="h-3 w-3 fill-current" />
                <span className="font-medium">{alumni.rating}</span>
                <span className="text-muted-foreground">({alumni.totalReviews})</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {alumni.resolvedDoubts} doubts resolved
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Talk
                </Button>
                <Button size="sm">
                  View Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl p-6 hover-lift shadow-soft group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage src={alumni.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(alumni.name)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-foreground">{alumni.name}</h3>
              {alumni.isVerified && (
                <Badge className="bg-success text-success-foreground text-xs">Verified</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {alumni.department} • Class of {alumni.graduationYear}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Position */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Building className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{alumni.currentCompany}</span>
        </div>
        <p className="text-sm text-muted-foreground ml-6">{alumni.position}</p>
        <div className="flex items-center gap-1 mt-1 ml-6">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{alumni.location}</span>
        </div>
      </div>

      {/* Domains */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {alumni.domain.map((domain, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {domain}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-warning">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-medium">{alumni.rating}</span>
            <span className="text-muted-foreground">({alumni.totalReviews})</span>
          </div>
          <div className="text-muted-foreground">
            {alumni.resolvedDoubts} doubts resolved
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Talk
          </Button>
          <Button className="flex-1" size="sm">
            View Profile
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};