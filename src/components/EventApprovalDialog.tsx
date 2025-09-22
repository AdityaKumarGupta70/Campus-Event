import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface EventApprovalDialogProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    location?: string;
    participants?: number;
    host: {
      id: string;
      name: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export const EventApprovalDialog: React.FC<EventApprovalDialogProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // Add your API call here to approve the event

      // Send notification to the host
      addNotification({
        type: 'approval',
        title: 'Event Approved',
        message: `Your event "${event.title}" has been approved.`,
        eventId: event.id,
        eventTitle: event.title,
        fromUser: {
          id: 'faculty-id', // Replace with actual faculty ID
          name: 'Faculty Name', // Replace with actual faculty name
          role: 'faculty',
        },
        toUser: {
          id: event.host.id,
          name: event.host.name,
          role: 'student',
        },
        remarks: remarks.trim() || 'No additional remarks.',
      });

      onClose();
    } catch (error) {
      console.error('Error approving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      // Show error that remarks are required for rejection
      return;
    }

    setIsSubmitting(true);
    try {
      // Add your API call here to reject the event

      // Send notification to the host
      addNotification({
        type: 'rejection',
        title: 'Event Needs Revision',
        message: `Your event "${event.title}" requires changes.`,
        eventId: event.id,
        eventTitle: event.title,
        fromUser: {
          id: 'faculty-id', // Replace with actual faculty ID
          name: 'Faculty Name', // Replace with actual faculty name
          role: 'faculty',
        },
        toUser: {
          id: event.host.id,
          name: event.host.name,
          role: 'student',
        },
        remarks: remarks,
        actionRequired: true,
      });

      onClose();
    } catch (error) {
      console.error('Error rejecting event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Event Submission</DialogTitle>
          <DialogDescription>
            Review the event details and approve or request changes
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Event Details */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {event.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.participants && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.participants} participants</span>
                </div>
              )}
            </div>

            {/* Host Information */}
            <div>
              <h4 className="text-sm font-medium mb-1">Event Host</h4>
              <p className="text-sm text-muted-foreground">{event.host.name}</p>
            </div>

            {/* Review Comments */}
            <div className="space-y-2">
              <label htmlFor="remarks" className="text-sm font-medium">
                Remarks
                {!remarks.trim() && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (Required for rejection)
                  </span>
                )}
              </label>
              <Textarea
                id="remarks"
                placeholder="Add any comments or feedback about the event..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting || !remarks.trim()}
          >
            Request Changes
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            Approve Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};