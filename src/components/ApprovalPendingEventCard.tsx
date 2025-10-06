import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Users, Eye, CheckCircle, XCircle } from 'lucide-react';
import { EventApprovalDialog } from './EventApprovalDialog';

interface ApprovalPendingEvent {
  id: string;
  title: string;
  description?: string;
  submittedAt: Date;
  submittedBy: {
    id: string;
    name: string;
    role: string;
  };
  host: {
    id: string;
    name: string;
    branch: string;
  };
  assignedRoles: {
    teachers: Array<{ id: string; name: string; branch: string }>;
    coHosts: Array<{ id: string; name: string; branch: string }>;
    coordinators: Array<{ id: string; name: string; branch: string }>;
    volunteers: Array<{ id: string; name: string; branch: string }>;
  };
  status: 'submitted' | 'under-review';
  priority?: 'high' | 'medium' | 'low';
  eventDate?: string;
  location?: string;
}

interface ApprovalPendingEventCardProps {
  event: ApprovalPendingEvent;
  onApprove?: (eventId: string) => void;
  onReject?: (eventId: string) => void;
  onView?: (eventId: string) => void;
}

export const ApprovalPendingEventCard: React.FC<ApprovalPendingEventCardProps> = ({
  event,
  onApprove,
  onReject,
  onView,
}) => {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTotalMembers = () => {
    return event.assignedRoles.teachers.length + 
           1 + // host
           event.assignedRoles.coHosts.length +
           event.assignedRoles.coordinators.length +
           event.assignedRoles.volunteers.length;
  };

  const handleApprovalClose = () => {
    setShowApprovalDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>Submitted by {event.submittedBy.name}</span>
                <Badge variant="outline" className="text-xs">
                  {event.submittedBy.role}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                Pending Approval
              </Badge>
              {event.priority && (
                <Badge variant="outline" className={`text-xs ${getPriorityColor(event.priority)}`}>
                  {event.priority} priority
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Submitted {getTimeAgo(event.submittedAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{getTotalMembers()} team members</span>
            </div>
            {event.eventDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.eventDate).toLocaleDateString()}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Host Information */}
          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Event Host:</span>
              <span>{event.host.name}</span>
              <Badge variant="outline" className="text-xs">{event.host.branch}</Badge>
            </div>
          </div>

          {/* Team Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Team Structure</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {event.assignedRoles.teachers.length > 0 && (
                <Badge variant="secondary">
                  {event.assignedRoles.teachers.length} Teachers
                </Badge>
              )}
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                1 Host
              </Badge>
              {event.assignedRoles.coHosts.length > 0 && (
                <Badge variant="secondary">
                  {event.assignedRoles.coHosts.length} Co-hosts
                </Badge>
              )}
              {event.assignedRoles.coordinators.length > 0 && (
                <Badge variant="secondary">
                  {event.assignedRoles.coordinators.length} Coordinators
                </Badge>
              )}
              {event.assignedRoles.volunteers.length > 0 && (
                <Badge variant="secondary">
                  {event.assignedRoles.volunteers.length} Volunteers
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(event.id)}
              className="flex items-center gap-2 flex-1"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApprovalDialog(true)}
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4" />
              Review & Approve
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <EventApprovalDialog
        event={{
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.eventDate,
          location: event.location,
          participants: getTotalMembers(),
          host: event.host,
        }}
        isOpen={showApprovalDialog}
        onClose={handleApprovalClose}
      />
    </>
  );
};