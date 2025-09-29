import { useState } from "react";
import { Search, Menu, X, Sun, Moon, Globe, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: 'student' | 'alumni' | 'admin';
  userName?: string;
}

export const Navbar = ({ isAuthenticated = false, userRole, userName }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const NavItems = () => (
    <>
      <a href="/alumni" className="text-foreground hover:text-primary transition-colors">Alumni</a>
      <a href="/events" className="text-foreground hover:text-primary transition-colors">Events</a>
      <a href="/opportunities" className="text-foreground hover:text-primary transition-colors">Opportunities</a>
      <a href="/leaderboard" className="text-foreground hover:text-primary transition-colors">Leaderboard</a>
      {userRole === 'student' && (
        <a href="/doubts" className="text-foreground hover:text-primary transition-colors">Ask Doubts</a>
      )}
      {userRole === 'admin' && (
        <a href="/admin" className="text-foreground hover:text-primary transition-colors">Admin Panel</a>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AP</span>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">Alumni Portal</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavItems />
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search alumni, events, opportunities..."
              className="pl-10 bg-muted/50 border-border focus:bg-background"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>हिंदी</DropdownMenuItem>
              <DropdownMenuItem>தமிழ்</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications (if authenticated) */}
          {isAuthenticated && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
                3
              </Badge>
            </Button>
          )}

          {/* User Menu or Auth Buttons */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="hidden sm:block">{userName || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm" className="bg-gradient-primary">Sign Up</Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-card">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
            
            {/* Mobile Navigation */}
            <div className="space-y-2 pt-2">
              <NavItems />
            </div>

            {/* Mobile Theme & Language */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                Theme
              </Button>
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Language
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};