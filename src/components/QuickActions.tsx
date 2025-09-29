import { MessageCircle, Users, Calendar, Briefcase, HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'default' | 'accent' | 'success';
}

interface QuickActionsProps {
  userRole?: 'student' | 'alumni' | 'admin';
}

export const QuickActions = ({ userRole = 'student' }: QuickActionsProps) => {
  const getActionsForRole = (role: string): QuickAction[] => {
    const commonActions: QuickAction[] = [
      {
        id: 'browse-alumni',
        title: 'Browse Alumni',
        description: 'Discover and connect with alumni',
        icon: <Users className="h-5 w-5" />,
        href: '/alumni'
      },
      {
        id: 'events',
        title: 'Upcoming Events',
        description: 'Join networking and career events',
        icon: <Calendar className="h-5 w-5" />,
        href: '/events'
      },
      {
        id: 'opportunities',
        title: 'Opportunities',
        description: 'Find internships and job openings',
        icon: <Briefcase className="h-5 w-5" />,
        href: '/opportunities'
      }
    ];

    if (role === 'student') {
      return [
        {
          id: 'ask-doubt',
          title: 'Ask a Doubt',
          description: 'Get help from experienced alumni',
          icon: <HelpCircle className="h-5 w-5" />,
          href: '/doubts/new',
          variant: 'accent'
        },
        {
          id: 'chat',
          title: 'Start Chat',
          description: 'Message alumni directly',
          icon: <MessageCircle className="h-5 w-5" />,
          href: '/chat'
        },
        ...commonActions
      ];
    }

    if (role === 'alumni') {
      return [
        {
          id: 'post-opportunity',
          title: 'Post Opportunity',
          description: 'Share internships or job openings',
          icon: <Plus className="h-5 w-5" />,
          href: '/opportunities/new',
          variant: 'accent'
        },
        {
          id: 'mentor-students',
          title: 'Mentor Students',
          description: 'Browse students seeking guidance',
          icon: <Users className="h-5 w-5" />,
          href: '/students'
        },
        ...commonActions
      ];
    }

    return commonActions;
  };

  const actions = getActionsForRole(userRole);

  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'accent': return 'default';
      case 'success': return 'outline';
      default: return 'outline';
    }
  };

  const getButtonClassName = (variant?: string) => {
    switch (variant) {
      case 'accent': return 'bg-gradient-accent hover:bg-accent/90 border-0 shadow-lg';
      case 'success': return 'border-success text-success hover:bg-success hover:text-success-foreground';
      default: return '';
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-soft">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Quick Actions</h2>
        <p className="text-muted-foreground text-sm">
          {userRole === 'student' && "Get started with mentorship and opportunities"}
          {userRole === 'alumni' && "Make an impact in the community"}
          {userRole === 'admin' && "Manage the platform effectively"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={getButtonVariant(action.variant)}
            className={`h-auto p-4 justify-start text-left ${getButtonClassName(action.variant)}`}
            asChild
          >
            <a href={action.href}>
              <div className="flex items-start gap-3 w-full">
                <div className={`p-2 rounded-lg ${
                  action.variant === 'accent' 
                    ? 'bg-white/20' 
                    : action.variant === 'success'
                    ? 'bg-success/10'
                    : 'bg-primary/10'
                }`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1">{action.title}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">{action.description}</p>
                </div>
              </div>
            </a>
          </Button>
        ))}
      </div>

      {/* Role-specific CTA */}
      {userRole === 'student' && (
        <div className="mt-6 p-4 bg-gradient-primary rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">Need Career Guidance?</h3>
              <p className="text-sm text-white/90">Connect with alumni in your field</p>
            </div>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
              Get Started
            </Button>
          </div>
        </div>
      )}

      {userRole === 'alumni' && (
        <div className="mt-6 p-4 bg-gradient-accent rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">Make a Difference</h3>
              <p className="text-sm text-white/90">Help the next generation succeed</p>
            </div>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 border-0">
              Start Mentoring
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};