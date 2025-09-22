import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { RoleAssignmentForm } from './RoleAssignmentForm';

interface Props {
  data: {
    basicDetails: {
      eventTitle?: string;
      tagline?: string;
      banner?: File | null;
      organizerName?: string;
      contactEmail?: string;
      contactPhone?: string;
      websiteUrl?: string;
      assignedRoles?: {
        teachers: Array<{
          id: string;
          name: string;
          branch: string;
          role: 'teacher';
        }>;
        host: {
          id: string;
          name: string;
          branch: string;
          role: 'host';
        } | null;
        coHosts: Array<{
          id: string;
          name: string;
          branch: string;
          role: 'co-host';
        }>;
        coordinators: Array<{
          id: string;
          name: string;
          branch: string;
          role: 'coordinator';
        }>;
        volunteers: Array<{
          id: string;
          name: string;
          branch: string;
          role: 'volunteer';
        }>;
      };
      whoFillsForm?: 'teacher' | 'host' | null;
    };
  };
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const BasicDetailsForm: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [formData, setFormData] = useState(data.basicDetails || {
    eventTitle: '',
    tagline: '',
    banner: null,
    organizerName: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    assignedRoles: {
      teachers: [],
      host: null,
      coHosts: [],
      coordinators: [],
      volunteers: [],
    },
    whoFillsForm: null,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData('basicDetails', newData);
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      handleInputChange('banner', file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Title and Tagline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Event Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="eventTitle">Event Title *</Label>
            <Input
              id="eventTitle"
              placeholder="Enter your event title"
              value={formData.eventTitle}
              onChange={(e) => handleInputChange('eventTitle', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline / Short Description</Label>
            <Textarea
              id="tagline"
              placeholder="A brief description of your event"
              value={formData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment */}
      <RoleAssignmentForm
        data={{
          assignedRoles: formData.assignedRoles,
          whoFillsForm: formData.whoFillsForm
        }}
        updateData={(section, data) => {
          if (section === 'assignedRoles') {
            handleInputChange('assignedRoles', data);
          } else if (section === 'whoFillsForm') {
            handleInputChange('whoFillsForm', data);
          }
        }}
      />

      {/* Event Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Event Banner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formData.banner ? (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleInputChange('banner', null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formData.banner.name || 'Banner uploaded'}
                </p>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Upload Event Banner</p>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                <Button variant="outline" asChild>
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />
                    Choose File
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 1920x1080px, Max 5MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Organizer Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Organizer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="organizerName">Organizer Name *</Label>
            <Input
              id="organizerName"
              placeholder="College/Club/Company Name"
              value={formData.organizerName}
              onChange={(e) => handleInputChange('organizerName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@example.com"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="+1 (555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="websiteUrl">Website/LinkedIn URL</Label>
            <Input
              id="websiteUrl"
              placeholder="https://www.example.com"
              value={formData.websiteUrl}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};