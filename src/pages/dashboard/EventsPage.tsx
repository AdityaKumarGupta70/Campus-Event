import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventHostingForm } from '@/components/EventHostingForm';
import { DraftEventCard } from '@/components/DraftEventCard';
import { ApprovalPendingEventCard } from '@/components/ApprovalPendingEventCard';
import { StudentHostNotificationCard } from '@/components/StudentHostNotificationCard';
import { Plus, Search, Calendar, Users, MapPin, ArrowLeft, FileEdit, Loader2, Clock, AlertCircle } from 'lucide-react';
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
import { useNotifications } from '@/contexts/NotificationContext';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const { getNotificationsForUser } = useNotifications();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Get host assignment notifications for the current user
  const hostNotifications = user ? getNotificationsForUser(user.id).filter(
    notification => notification.type === 'host-assignment' && notification.status === 'unread'
  ) : [];
  
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
      description: 'Annual technology symposium featuring latest innovations',
      hostAssigned: true,
      completionStatus: 'pending-host-input',
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
      description: 'Inter-college competitive programming event',
      hostAssigned: true,
      completionStatus: 'awaiting-approval',
    },
  ]);

  // Mock pending approval events for faculty
  const [pendingApprovalEvents, setPendingApprovalEvents] = useState([
    {
      id: 'pending-1',
      title: 'Cultural Night 2024',
      description: 'Annual cultural celebration with performances and exhibitions',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      submittedBy: {
        id: 'f1',
        name: 'Prof. Sarah Wilson',
        role: 'Faculty',
      },
      host: {
        id: 's3',
        name: 'Rahul Singh',
        branch: 'Computer Science',
      },
      assignedRoles: {
        teachers: [
          { id: 't1', name: 'Dr. John Smith', branch: 'Computer Science' },
          { id: 't2', name: 'Prof. Jane Doe', branch: 'Electronics' },
        ],
        coHosts: [
          { id: 's4', name: 'Sneha Sharma', branch: 'Information Technology' },
        ],
        coordinators: [
          { id: 's5', name: 'Amit Gupta', branch: 'Mechanical' },
        ],
        volunteers: [
          { id: 's6', name: 'Riya Agarwal', branch: 'Electronics' },
        ],
      },
      status: 'submitted' as const,
      priority: 'high' as const,
      eventDate: '2024-04-15',
      location: 'Main Auditorium',
    },
    {
      id: 'pending-2',
      title: 'Hackathon 2024',
      description: '48-hour coding marathon with exciting challenges',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      submittedBy: {
        id: 'f2',
        name: 'Dr. Mike Johnson',
        role: 'Faculty',
      },
      host: {
        id: 's1',
        name: 'Alex Kumar',
        branch: 'Computer Science',
      },
      assignedRoles: {
        teachers: [
          { id: 't3', name: 'Dr. Mike Johnson', branch: 'Mechanical' },
        ],
        coHosts: [],
        coordinators: [
          { id: 's2', name: 'Priya Patel', branch: 'Electronics' },
        ],
        volunteers: [
          { id: 's5', name: 'Amit Gupta', branch: 'Mechanical' },
          { id: 's6', name: 'Riya Agarwal', branch: 'Electronics' },
        ],
      },
      status: 'submitted' as const,
      priority: 'medium' as const,
      eventDate: '2024-05-01',
      location: 'Computer Lab Complex',
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
          {user?.role === 'student' && hostNotifications.length > 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => setCurrentTab('host-requests')}
            >
              <AlertCircle className="h-4 w-4" />
              Host Requests ({hostNotifications.length})
            </Button>
          )}
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
          {user?.role === 'faculty' && pendingApprovalEvents.length > 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => setCurrentTab('pending-approval')}
            >
              <Clock className="h-4 w-4" />
              Pending Approval ({pendingApprovalEvents.length})
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
          {user?.role === 'student' && hostNotifications.length > 0 && (
            <TabsTrigger value="host-requests">Host Requests ({hostNotifications.length})</TabsTrigger>
          )}
          {user?.role === 'student' && draftEvents.length > 0 && (
            <TabsTrigger value="drafts">My Draft Events ({draftEvents.length})</TabsTrigger>
          )}
          {user?.role === 'faculty' && pendingApprovalEvents.length > 0 && (
            <TabsTrigger value="pending-approval">Pending Approval ({pendingApprovalEvents.length})</TabsTrigger>
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
          <>
            {/* Host Requests Tab */}
            <TabsContent value="host-requests" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-semibold">Host Assignment Requests</h2>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    {hostNotifications.length} Pending
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  You have been assigned as the host for the following events. Please review and respond to each request.
                </p>
                
                {hostNotifications.map((notification) => (
                  <StudentHostNotificationCard
                    key={notification.id}
                    notification={notification}
                    onAccept={() => {
                      // Handle acceptance logic
                      console.log('Accepted host role for', notification.eventTitle);
                    }}
                    onDecline={() => {
                      // Handle decline logic
                      console.log('Declined host role for', notification.eventTitle);
                    }}
                  />
                ))}
                
                {hostNotifications.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No host requests</h3>
                    <p className="text-gray-600">
                      You don't have any pending host assignment requests at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Draft Events Tab */}
            <TabsContent value="drafts" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileEdit className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">My Draft Events</h2>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {draftEvents.length} Drafts
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {draftEvents.map((event) => (
                  <DraftEventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditDraft}
                  />
                ))}
              </div>
              
              {draftEvents.length === 0 && (
                <div className="text-center py-12">
                  <FileEdit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No draft events</h3>
                  <p className="text-gray-600">
                    You don't have any draft events assigned to you at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </>
        )}

        {user?.role === 'faculty' && (
          <TabsContent value="pending-approval" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Events Pending Approval</h2>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {pendingApprovalEvents.length} Pending
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Review and approve events that have been submitted by faculty members and their assigned hosts.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApprovalEvents.map((event) => (
                <ApprovalPendingEventCard
                  key={event.id}
                  event={event}
                  onApprove={(eventId) => {
                    console.log('Approved event:', eventId);
                    // Handle approval logic
                  }}
                  onReject={(eventId) => {
                    console.log('Rejected event:', eventId);
                    // Handle rejection logic
                  }}
                  onView={(eventId) => {
                    console.log('View event details:', eventId);
                    // Handle view details logic
                  }}
                />
              ))}
            </div>
            
            {pendingApprovalEvents.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                <p className="text-gray-600">
                  All submitted events have been reviewed. New submissions will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EventsPage;