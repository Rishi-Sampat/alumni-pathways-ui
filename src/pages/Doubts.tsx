import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MessageSquare, Clock, CheckCircle, User } from 'lucide-react';
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

interface Doubt {
  id: string;
  title: string;
  description: string;
  domain_tags: string[];
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'assigned' | 'resolved' | 'in_progress';
  rating: number | null;
  feedback: string | null;
  created_at: string;
  student_id: string;
  assigned_alumni_id: string | null;
  resolved_at: string | null;
  student?: {
    first_name: string;
    last_name: string;
  };
  alumni?: {
    first_name: string;
    last_name: string;
  };
}

const Doubts = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDoubt, setNewDoubt] = useState({
    title: '',
    description: '',
    domain_tags: '',
    urgency: 'medium',
  });

  useEffect(() => {
    fetchDoubts();
  }, [profile]);

  const fetchDoubts = async () => {
    try {
      let query = supabase
        .from('doubts')
        .select(`
          *,
          student:profiles!doubts_student_id_fkey(first_name, last_name),
          alumni:profiles!doubts_assigned_alumni_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      // Filter based on user role
      if (profile?.role === 'student') {
        query = query.eq('student_id', profile.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDoubts(data || []);
    } catch (error) {
      console.error('Error fetching doubts:', error);
      toast({
        title: "Error",
        description: "Failed to load doubts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoubt = async () => {
    if (!profile?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post doubts",
        variant: "destructive",
      });
      return;
    }

    if (profile.role !== 'student') {
      toast({
        title: "Access denied",
        description: "Only students can post doubts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('doubts')
        .insert({
          title: newDoubt.title,
          description: newDoubt.description,
          domain_tags: newDoubt.domain_tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          urgency: newDoubt.urgency as 'low' | 'medium' | 'high',
          student_id: profile.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your doubt has been posted successfully",
      });

      setIsCreateDialogOpen(false);
      setNewDoubt({
        title: '',
        description: '',
        domain_tags: '',
        urgency: 'medium',
      });
      fetchDoubts();
    } catch (error) {
      console.error('Error creating doubt:', error);
      toast({
        title: "Error",
        description: "Failed to post doubt",
        variant: "destructive",
      });
    }
  };

  const handleAssignDoubt = async (doubtId: string) => {
    if (!profile?.id || profile.role !== 'alumni') {
      toast({
        title: "Access denied",
        description: "Only alumni can take doubts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('doubts')
        .update({
          assigned_alumni_id: profile.id,
          status: 'assigned',
        })
        .eq('id', doubtId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You've taken this doubt. You can now help the student!",
      });

      fetchDoubts();
    } catch (error) {
      console.error('Error assigning doubt:', error);
      toast({
        title: "Error",
        description: "Failed to take doubt",
        variant: "destructive",
      });
    }
  };

  const handleResolveDoubt = async (doubtId: string) => {
    try {
      const { error } = await supabase
        .from('doubts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', doubtId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Doubt marked as resolved",
      });

      fetchDoubts();
    } catch (error) {
      console.error('Error resolving doubt:', error);
      toast({
        title: "Error",
        description: "Failed to resolve doubt",
        variant: "destructive",
      });
    }
  };

  const filteredDoubts = doubts.filter(doubt => {
    const matchesSearch = doubt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doubt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doubt.domain_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || doubt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-warning/10 text-warning';
      case 'assigned': return 'bg-primary/10 text-primary';
      case 'resolved': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-muted/10 text-muted-foreground';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'high': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const canCreateDoubt = profile?.role === 'student';
  const canTakeDoubts = profile?.role === 'alumni' || profile?.role === 'admin';

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Doubts & Questions</h1>
            <p className="text-muted-foreground">
              {profile?.role === 'student' 
                ? "Ask questions and get help from experienced alumni"
                : "Help students by answering their questions"
              }
            </p>
          </div>
          
          {canCreateDoubt && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Ask Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ask a Question</DialogTitle>
                  <DialogDescription>
                    Describe your doubt clearly to get the best help from alumni
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Question Title</Label>
                    <Input
                      id="title"
                      value={newDoubt.title}
                      onChange={(e) => setNewDoubt(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief description of your question"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      value={newDoubt.description}
                      onChange={(e) => setNewDoubt(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Explain your doubt in detail..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="domain_tags">Domain Tags (comma-separated)</Label>
                      <Input
                        id="domain_tags"
                        value={newDoubt.domain_tags}
                        onChange={(e) => setNewDoubt(prev => ({ ...prev, domain_tags: e.target.value }))}
                        placeholder="JavaScript, React, Data Structures"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select value={newDoubt.urgency} onValueChange={(value) => setNewDoubt(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Can wait</SelectItem>
                          <SelectItem value="medium">Medium - Normal</SelectItem>
                          <SelectItem value="high">High - Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateDoubt}>Post Question</Button>
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
              placeholder="Search doubts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Doubts Grid */}
        {loading ? (
          <div className="grid gap-6">
            {[...Array(5)].map((_, i) => (
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
          <div className="grid gap-6">
            {filteredDoubts.map((doubt) => (
              <Card key={doubt.id} className="hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{doubt.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          Asked by {doubt.student?.first_name} {doubt.student?.last_name}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(doubt.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(doubt.status)}>
                        {doubt.status}
                      </Badge>
                      <Badge className={getUrgencyColor(doubt.urgency)}>
                        {doubt.urgency}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {doubt.description}
                  </p>
                  
                  {doubt.domain_tags && doubt.domain_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {doubt.domain_tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {doubt.assigned_alumni_id && doubt.alumni && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Being helped by {doubt.alumni.first_name} {doubt.alumni.last_name}
                    </div>
                  )}
                  
                  {doubt.status === 'resolved' && doubt.resolved_at && (
                    <div className="flex items-center text-sm text-success">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Resolved on {new Date(doubt.resolved_at).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {doubt.status === 'open' && canTakeDoubts && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleAssignDoubt(doubt.id)}
                      >
                        Take This Question
                      </Button>
                    )}
                    
                    {doubt.status === 'assigned' && 
                     ((profile?.role === 'alumni' && doubt.assigned_alumni_id === profile.id) ||
                      (profile?.role === 'student' && doubt.student_id === profile.id) ||
                      profile?.role === 'admin') && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleResolveDoubt(doubt.id)}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredDoubts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No doubts found</p>
              <p className="text-sm">
                {profile?.role === 'student' 
                  ? "Start by asking your first question!"
                  : "No questions match your search criteria"
                }
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Doubts;