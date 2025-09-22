import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraftEventCardProps {
  event: {
    id: string;
    title: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    lastUpdated: Date;
    assignedBy: {
      name: string;
      role: string;
    };
    remarks?: string;
  };
  onEdit: (eventId: string) => void;
}

export const DraftEventCard: React.FC<DraftEventCardProps> = ({ event, onEdit }) => {
  const getStatusBadge = () => {
    switch (event.status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">{event.title}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Assigned by {event.assignedBy.name} ({event.assignedBy.role})
          </p>
          {event.remarks && (
            <p className="text-sm text-muted-foreground italic">
              "{event.remarks}"
            </p>
          )}
        </div>
        {event.status !== 'approved' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(event.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        Last updated {formatDate(event.lastUpdated)}
      </div>
    </Card>
  );
};

const formatDate = (date: Date) => {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    'day'
  );
};