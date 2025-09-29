import { TrendingUp, Users, Calendar, Briefcase, Award, MessageCircle } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

const stats: Stat[] = [
  {
    label: "Active Alumni",
    value: "2,847",
    icon: <Users className="h-5 w-5" />,
    trend: "+12%",
    trendDirection: "up"
  },
  {
    label: "Live Events",
    value: "23",
    icon: <Calendar className="h-5 w-5" />,
    trend: "This month",
  },
  {
    label: "Open Opportunities", 
    value: "156",
    icon: <Briefcase className="h-5 w-5" />,
    trend: "+8%",
    trendDirection: "up"
  },
  {
    label: "Resolved Doubts",
    value: "1,249",
    icon: <MessageCircle className="h-5 w-5" />,
    trend: "+24%",
    trendDirection: "up"
  },
  {
    label: "Success Stories",
    value: "89",
    icon: <Award className="h-5 w-5" />,
    trend: "This year",
  }
];

export const StatsStrip = () => {
  return (
    <div className="w-full bg-gradient-card rounded-lg shadow-soft border p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center group hover-lift cursor-pointer"
          >
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {stat.icon}
              </div>
            </div>
            
            {/* Value */}
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            
            {/* Label */}
            <div className="text-sm text-muted-foreground mb-2">
              {stat.label}
            </div>
            
            {/* Trend */}
            {stat.trend && (
              <div className={`text-xs flex items-center justify-center gap-1 ${
                stat.trendDirection === 'up' 
                  ? 'text-success' 
                  : stat.trendDirection === 'down'
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }`}>
                {stat.trendDirection === 'up' && <TrendingUp className="h-3 w-3" />}
                <span>{stat.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};