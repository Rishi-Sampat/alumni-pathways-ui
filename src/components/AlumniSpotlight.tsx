import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Building, Award, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SpotlightAlumni {
  id: string;
  name: string;
  avatar: string;
  graduationYear: number;
  department: string;
  currentPosition: string;
  company: string;
  achievements: string[];
  quote: string;
  rating: number;
  totalMentored: number;
}

const spotlightAlumni: SpotlightAlumni[] = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "/placeholder.svg",
    graduationYear: 2018,
    department: "Computer Science",
    currentPosition: "Senior Software Engineer",
    company: "Google",
    achievements: ["Top Performer 2023", "Innovation Award", "Mentor of the Year"],
    quote: "The connections I made here opened doors to incredible opportunities. Now I'm here to do the same for others.",
    rating: 4.9,
    totalMentored: 47
  },
  {
    id: "2", 
    name: "Rahul Kumar",
    avatar: "/placeholder.svg",
    graduationYear: 2016,
    department: "Mechanical Engineering",
    currentPosition: "Product Manager",
    company: "Tesla",
    achievements: ["Sustainability Champion", "Leadership Excellence", "Innovation Leader"],
    quote: "Every challenge at college prepared me for the innovations we're building at Tesla today.",
    rating: 4.8,
    totalMentored: 32
  },
  {
    id: "3",
    name: "Sneha Patel",
    avatar: "/placeholder.svg", 
    graduationYear: 2019,
    department: "Data Science",
    currentPosition: "ML Research Scientist",
    company: "Microsoft",
    achievements: ["Research Excellence", "AI Pioneer", "Women in Tech Award"],
    quote: "The analytical thinking I developed here became the foundation of my AI research career.",
    rating: 5.0,
    totalMentored: 28
  }
];

export const AlumniSpotlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextAlumni = () => {
    setCurrentIndex((prev) => (prev + 1) % spotlightAlumni.length);
  };

  const prevAlumni = () => {
    setCurrentIndex((prev) => (prev - 1 + spotlightAlumni.length) % spotlightAlumni.length);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const currentAlumni = spotlightAlumni[currentIndex];

  return (
    <div className="bg-gradient-card border rounded-xl p-8 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Alumni Spotlight</h2>
          <p className="text-muted-foreground">Celebrating success stories from our community</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevAlumni}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextAlumni}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {spotlightAlumni.map((alumni, index) => (
            <div key={alumni.id} className="w-full flex-shrink-0">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Alumni Info */}
                <div className="space-y-6">
                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={alumni.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                        {getInitials(alumni.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{alumni.name}</h3>
                      <p className="text-muted-foreground">
                        {alumni.department} • Class of {alumni.graduationYear}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="font-medium">{alumni.currentPosition}</span>
                        <span className="text-muted-foreground">at {alumni.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center text-warning mb-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold text-lg">{alumni.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground mb-1">{alumni.totalMentored}</div>
                      <p className="text-xs text-muted-foreground">Students Mentored</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4 text-accent" />
                      <span className="font-medium text-foreground">Achievements</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {alumni.achievements.map((achievement, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full sm:w-auto">
                    Connect with {alumni.name.split(' ')[0]}
                  </Button>
                </div>

                {/* Right: Quote */}
                <div className="bg-muted/50 rounded-lg p-6 relative">
                  <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" />
                  <blockquote className="text-lg text-foreground italic leading-relaxed pt-4">
                    "{alumni.quote}"
                  </blockquote>
                  <div className="mt-4 flex items-center justify-between">
                    <cite className="text-sm text-muted-foreground not-italic">
                      — {alumni.name}
                    </cite>
                    <Badge className="bg-primary/10 text-primary">Featured Alumni</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {spotlightAlumni.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};