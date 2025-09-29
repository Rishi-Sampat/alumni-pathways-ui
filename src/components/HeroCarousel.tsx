import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  type: 'event' | 'announcement' | 'news';
  date?: string;
  location?: string;
  link?: string;
}

const mockSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "Annual Alumni Meetup 2024",
    description: "Join us for the biggest alumni gathering of the year. Connect, network, and celebrate our shared journey.",
    image: "/placeholder.svg",
    type: "event",
    date: "March 15, 2024",
    location: "Main Campus Auditorium",
    link: "/events/alumni-meetup-2024"
  },
  {
    id: 2,
    title: "New Mentorship Program Launch",
    description: "Introducing our enhanced 1:1 mentorship program connecting students with industry leaders.",
    image: "/placeholder.svg",
    type: "announcement",
    date: "February 28, 2024",
    link: "/programs/mentorship"
  },
  {
    id: 3,
    title: "Tech Innovations Summit",
    description: "Explore cutting-edge technologies with our alumni working at top tech companies worldwide.",
    image: "/placeholder.svg",
    type: "event",
    date: "April 10, 2024",
    location: "Innovation Center",
    link: "/events/tech-summit"
  }
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockSlides.length) % mockSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-accent';
      case 'announcement': return 'bg-primary';
      case 'news': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-card bg-gradient-hero">
      {/* Slide Container */}
      <div className="relative h-full">
        {mockSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-hover/90 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl text-white animate-fade-in">
                  {/* Type Badge */}
                  <Badge className={`${getTypeColor(slide.type)} text-white mb-4 capitalize`}>
                    {slide.type}
                  </Badge>
                  
                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                    {slide.description}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-white/80">
                    {slide.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{slide.date}</span>
                      </div>
                    )}
                    {slide.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{slide.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Call to Action */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="lg" 
                      className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-lg"
                    >
                      Learn More
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-primary"
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {mockSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-30 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
      >
        <Play className={`h-4 w-4 ${!isAutoPlaying ? 'opacity-50' : ''}`} />
      </Button>
    </div>
  );
};