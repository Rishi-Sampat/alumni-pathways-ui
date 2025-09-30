import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, Building, ExternalLink } from 'lucide-react';
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

interface Opportunity {
  id: string;
  title: string;
  description: string;
  company_name: string;
  type: 'internship' | 'job' | 'project' | 'volunteering';
  location: string;
  deadline: string;
  skills_required: string[];
  requirements: string[];
  application_url: string;
  created_at: string;
  posted_by: string;
}

const Opportunities = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    company_name: '',
    type: 'internship',
    location: '',
    deadline: '',
    skills_required: '',
    requirements: '',
    application_url: '',
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpportunity = async () => {
    if (!profile?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create opportunities",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('opportunities')
        .insert([{
          title: newOpportunity.title,
          description: newOpportunity.description,
          company_name: newOpportunity.company_name,
          type: newOpportunity.type,
          location: newOpportunity.location,
          deadline: newOpportunity.deadline ? new Date(newOpportunity.deadline).toISOString() : null,
          skills_required: newOpportunity.skills_required.split(',').map(s => s.trim()),
          requirements: newOpportunity.requirements.split('\n').filter(r => r.trim()),
          application_url: newOpportunity.application_url,
          posted_by: profile.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Opportunity created successfully",
      });

      setIsCreateDialogOpen(false);
      setNewOpportunity({
        title: '',
        description: '',
        company_name: '',
        type: 'internship',
        location: '',
        deadline: '',
        skills_required: '',
        requirements: '',
        application_url: '',
      });
      fetchOpportunities();
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to create opportunity",
        variant: "destructive",
      });
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || opportunity.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship': return 'bg-primary/10 text-primary';
      case 'job': return 'bg-success/10 text-success';
      case 'project': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const canCreateOpportunity = profile?.role === 'alumni' || profile?.role === 'admin';

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Opportunities</h1>
            <p className="text-muted-foreground">Discover internships, jobs, and project opportunities</p>
          </div>
          
          {canCreateOpportunity && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Opportunity</DialogTitle>
                  <DialogDescription>
                    Share an opportunity with the community
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Software Engineer Intern"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={newOpportunity.company_name}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Google"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={newOpportunity.type} onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="job">Full-time Job</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newOpportunity.location}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Remote / New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newOpportunity.deadline}
                        onChange={(e) => setNewOpportunity(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the opportunity..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={newOpportunity.skills_required}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, skills_required: e.target.value }))}
                      placeholder="JavaScript, React, Node.js"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      value={newOpportunity.requirements}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Bachelor's degree in CS&#10;2+ years experience&#10;Strong communication skills"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="applicationUrl">Application URL</Label>
                    <Input
                      id="applicationUrl"
                      value={newOpportunity.application_url}
                      onChange={(e) => setNewOpportunity(prev => ({ ...prev, application_url: e.target.value }))}
                      placeholder="https://company.com/apply"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateOpportunity}>Create Opportunity</Button>
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
              placeholder="Search opportunities..."
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
              <SelectItem value="internship">Internships</SelectItem>
              <SelectItem value="job">Jobs</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
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
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover-lift hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">{opportunity.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="mr-1 h-3 w-3" />
                        {opportunity.company_name}
                      </CardDescription>
                    </div>
                    <Badge className={getTypeColor(opportunity.type)}>
                      {opportunity.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {opportunity.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {opportunity.location}
                  </div>
                  
                  {opportunity.deadline && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </div>
                  )}
                  
                  {opportunity.skills_required && opportunity.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {opportunity.skills_required.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {opportunity.skills_required.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{opportunity.skills_required.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {opportunity.application_url && (
                    <Button 
                      asChild 
                      className="w-full"
                      onClick={() => window.open(opportunity.application_url, '_blank')}
                    >
                      <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Apply Now
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No opportunities found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Opportunities;