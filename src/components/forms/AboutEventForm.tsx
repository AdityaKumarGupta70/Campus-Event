import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, MapPin, Globe } from 'lucide-react';

interface Props {
  data: any;
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const eventCategories = [
  'Hackathon',
  'Case Study Competition',
  'Quiz',
  'Workshop',
  'Seminar',
  'Cultural Event',
  'Sports Tournament',
  'Tech Talk',
  'Coding Competition',
  'Design Competition',
  'Business Plan Competition',
  'Other'
];

export const AboutEventForm: React.FC<Props> = ({ data, updateData }) => {
  const [formData, setFormData] = useState(data.aboutEvent || {
    description: '',
    category: '',
    mode: 'online',
    location: '',
  });

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData('aboutEvent', newData);
  };

  return (
    <div className="space-y-6">
      {/* Event Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Event Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide a comprehensive description of your event. Include objectives, what participants can expect, key highlights, and any special features."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This will be displayed on your event page. Use this space to attract participants.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Event Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Event Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="category">Select Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose event category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Event Mode and Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Event Mode & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Event Mode *</Label>
            <RadioGroup
              value={formData.mode}
              onValueChange={(value) => handleInputChange('mode', value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="online" id="online" />
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-info" />
                  <div>
                    <Label htmlFor="online" className="font-medium cursor-pointer">Online</Label>
                    <p className="text-sm text-muted-foreground">Virtual event conducted online</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="offline" id="offline" />
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-success" />
                  <div>
                    <Label htmlFor="offline" className="font-medium cursor-pointer">Offline</Label>
                    <p className="text-sm text-muted-foreground">Physical event at a venue</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <Label htmlFor="hybrid" className="font-medium cursor-pointer">Hybrid</Label>
                    <p className="text-sm text-muted-foreground">Both online and offline participation</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {(formData.mode === 'offline' || formData.mode === 'hybrid') && (
            <div>
              <Label htmlFor="location">Event Location *</Label>
              <Textarea
                id="location"
                placeholder="Enter the complete address of the venue including building name, street, city, state, and pincode"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};