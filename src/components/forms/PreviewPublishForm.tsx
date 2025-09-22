import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  Save, 
  Rocket, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Building
} from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  data: any;
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PreviewPublishForm: React.FC<Props> = ({ data }) => {
  const [isDraft, setIsDraft] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const { basicDetails, aboutEvent, eligibility, rounds, rewards, features } = data;

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log('Saving as draft...', data);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Publish logic
    setTimeout(() => {
      setIsPublishing(false);
      console.log('Event published!', data);
    }, 2000);
  };

  const getCompletionStatus = () => {
    const sections = [
      { name: 'Basic Details', completed: basicDetails?.eventTitle && basicDetails?.organizerName },
      { name: 'About Event', completed: aboutEvent?.description && aboutEvent?.category },
      { name: 'Eligibility', completed: eligibility?.targetAudience?.length > 0 },
      { name: 'Rounds', completed: rounds?.length > 0 },
      { name: 'Rewards', completed: true }, // Optional section
      { name: 'Features', completed: true }, // Optional section
    ];
    
    const completed = sections.filter(s => s.completed).length;
    return { completed, total: sections.length, sections };
  };

  const { completed, total, sections } = getCompletionStatus();
  const completionPercentage = (completed / total) * 100;

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Event Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{completed}/{total} sections completed</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sections.map((section) => (
                <div key={section.name} className="flex items-center gap-2">
                  {section.completed ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-sm ${section.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {section.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Event Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{basicDetails?.eventTitle || 'Event Title'}</h2>
              <p className="text-muted-foreground">{basicDetails?.tagline || 'Event tagline'}</p>
            </div>
            
            {basicDetails?.banner && (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Event Banner Preview</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {aboutEvent?.category && (
                <Badge variant="secondary" className="capitalize">
                  {aboutEvent.category.replace('-', ' ')}
                </Badge>
              )}
              {aboutEvent?.mode && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {aboutEvent.mode === 'online' ? <Globe className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                  {aboutEvent.mode}
                </Badge>
              )}
              {eligibility?.participationType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {eligibility.participationType}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Organizer Info */}
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{basicDetails?.organizerName || 'Organizer Name'}</p>
              <p className="text-sm text-muted-foreground">{basicDetails?.contactEmail || 'contact@email.com'}</p>
            </div>
          </div>

          {/* Important Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibility?.registrationStart && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Registration Opens</p>
                  <p className="text-sm text-muted-foreground">
                    {format(eligibility.registrationStart, 'PPP')}
                  </p>
                </div>
              </div>
            )}
            
            {eligibility?.eventStart && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm font-medium">Event Starts</p>
                  <p className="text-sm text-muted-foreground">
                    {format(eligibility.eventStart, 'PPP')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {aboutEvent?.description && (
            <div>
              <h3 className="font-semibold mb-2">About This Event</h3>
              <p className="text-muted-foreground leading-relaxed">{aboutEvent.description}</p>
            </div>
          )}

          {/* Rounds Preview */}
          {rounds?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Event Rounds ({rounds.length})
              </h3>
              <div className="space-y-2">
                {rounds.map((round: any, index: number) => (
                  <div key={round.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{round.name || `Round ${index + 1}`}</p>
                      <p className="text-sm text-muted-foreground capitalize">{round.type}</p>
                    </div>
                    {round.startDate && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(round.startDate, 'MMM dd')}</p>
                        <p className="text-xs text-muted-foreground">{round.startTime}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prizes Preview */}
          {rewards?.prizes?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Prizes & Rewards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rewards.prizes.slice(0, 4).map((prize: any, index: number) => (
                  <div key={prize.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="font-medium">{prize.position}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{prize.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Publishing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Save as Draft</Label>
              <p className="text-sm text-muted-foreground">Save your progress and continue editing later</p>
            </div>
            <Switch checked={isDraft} onCheckedChange={setIsDraft} />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="flex-1 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            
            <Button
              onClick={handlePublish}
              disabled={isPublishing || completionPercentage < 50}
              className="flex-1 flex items-center gap-2 bg-gradient-primary border-0"
            >
              {isPublishing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Publish Event
                </>
              )}
            </Button>
          </div>
          
          {completionPercentage < 50 && (
            <p className="text-sm text-destructive flex items-center gap-2 mt-2">
              <AlertCircle className="h-4 w-4" />
              Complete at least 50% of the form to publish your event
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};