import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventHostingForm } from '@/components/EventHostingForm';
import { DraftEventCard } from '@/components/DraftEventCard';
import { Plus, Search, Calendar, Users, MapPin, ArrowLeft, FileEdit, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Mock draft events - replace with actual data from your backend
  const [draftEvents, setDraftEvents] = useState([
    {
      id: '1',
      title: 'Tech Symposium 2024',
      status: 'draft' as const,
      lastUpdated: new Date(),
      assignedBy: {
        name: 'Dr. Smith',
        role: 'Faculty',
      },
    },
    {
      id: '2',
      title: 'Coding Challenge',
      status: 'submitted' as const,
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      assignedBy: {
        name: 'Prof. Johnson',
        role: 'Faculty',
      },
    },
  ]);

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Tech Symposium 2024',
      description: 'Annual technology symposium featuring latest innovations',
      date: '2024-03-15',
      location: 'Main Auditorium',
      participants: 250,
      status: 'published',
      category: 'Technical'
    },
    {
      id: 2,
      title: 'Coding Competition',
      description: 'Inter-college coding competition',
      date: '2024-03-20',
      location: 'Computer Lab',
      participants: 120,
      status: 'draft',
      category: 'Competition'
    },
    {
      id: 3,
      title: 'Cultural Fest',
      description: 'Annual cultural celebration',
      date: '2024-04-01',
      location: 'Campus Ground',
      participants: 500,
      status: 'published',
      category: 'Cultural'
    }
  ];

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Event handlers
  const handleCreateEvent = () => {
    setShowCreateForm(true);
  };

  const handleEditDraft = (eventId: string) => {
    // Handle editing draft event
    setShowCreateForm(true);
  };

  return (
    <div>
      {/* Create Event Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] p-0 bg-background overflow-y-auto z-[51]">
          <div className="h-full w-full bg-background">
            <EventHostingForm
              key={showCreateForm ? 'dialog-form' : 'closed'}
              onClose={() => setShowCreateForm(false)}
              inDialog={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-600">
          {user?.role === 'faculty' ? 'Manage your events and create new ones' : 'Discover and join events'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {user?.role === 'student' && draftEvents.length > 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setCurrentTab('drafts')}
            >
              <FileEdit className="h-4 w-4" />
              Draft Events ({draftEvents.length})
            </Button>
          )}
          {user?.role === 'faculty' && (
            <Button
              onClick={handleCreateEvent}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          {user?.role === 'student' && draftEvents.length > 0 && (
            <TabsTrigger value="drafts">My Draft Events</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {event.participants} participants
                    </div>
                    <div className="pt-2">
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                    {user?.role !== 'faculty' && (
                      <div className="pt-2">
                        <Button size="sm" className="w-full">
                          Register
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search criteria' : 'No events available at the moment'}
              </p>
            </div>
          )}
        </TabsContent>

        {user?.role === 'student' && (
          <TabsContent value="drafts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {draftEvents.map((event) => (
                <DraftEventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditDraft}
                />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EventsPage;