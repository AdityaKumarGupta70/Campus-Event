import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Users, GraduationCap, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: any;
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Post Graduate'];
const branches = [
  'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 
  'Civil', 'Chemical', 'Electrical', 'Biotechnology', 'MBA', 'Other'
];

export const EligibilityForm: React.FC<Props> = ({ data, updateData }) => {
  const [formData, setFormData] = useState(data.eligibility || {
    targetAudience: [],
    yearOfStudy: [],
    branches: [],
    participationType: 'individual',
    minTeamSize: 1,
    maxTeamSize: 1,
    registrationStart: null,
    registrationEnd: null,
    eventStart: null,
    eventEnd: null,
  });

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData('eligibility', newData);
  };

  const handleArrayToggle = (field: string, value: string) => {
    const currentArray = formData[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const targetAudienceOptions = [
    { value: 'students', label: 'Students', icon: GraduationCap },
    { value: 'professionals', label: 'Professionals', icon: Briefcase },
    { value: 'freshers', label: 'Recent Graduates', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Who Can Participate?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {targetAudienceOptions.map((option) => (
              <div
                key={option.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.targetAudience?.includes(option.value)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleArrayToggle('targetAudience', option.value)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={formData.targetAudience?.includes(option.value)}
                  />
                  <option.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Details */}
      {formData.targetAudience?.includes('students') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              Academic Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Year of Study</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {studyYears.map((year) => (
                  <div
                    key={year}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                      formData.yearOfStudy?.includes(year)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleArrayToggle('yearOfStudy', year)}
                  >
                    <Checkbox
                      checked={formData.yearOfStudy?.includes(year)}
                      className="mr-2"
                    />
                    {year}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Eligible Branches</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {branches.map((branch) => (
                  <div
                    key={branch}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                      formData.branches?.includes(branch)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleArrayToggle('branches', branch)}
                  >
                    <Checkbox
                      checked={formData.branches?.includes(branch)}
                      className="mr-2"
                    />
                    {branch}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participation Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Participation Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.participationType}
            onValueChange={(value) => {
              handleInputChange('participationType', value);
              if (value === 'individual') {
                handleInputChange('minTeamSize', 1);
                handleInputChange('maxTeamSize', 1);
              }
            }}
          >
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="cursor-pointer">Individual Participation</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="team" id="team" />
              <Label htmlFor="team" className="cursor-pointer">Team Participation</Label>
            </div>
          </RadioGroup>

          {formData.participationType === 'team' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="minTeamSize">Minimum Team Size</Label>
                <Input
                  id="minTeamSize"
                  type="number"
                  min="2"
                  value={formData.minTeamSize}
                  onChange={(e) => handleInputChange('minTeamSize', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                <Input
                  id="maxTeamSize"
                  type="number"
                  min={formData.minTeamSize || 2}
                  value={formData.maxTeamSize}
                  onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Registration Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.registrationStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registrationStart ? format(formData.registrationStart, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.registrationStart}
                    onSelect={(date) => handleInputChange('registrationStart', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Registration End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.registrationEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registrationEnd ? format(formData.registrationEnd, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.registrationEnd}
                    onSelect={(date) => handleInputChange('registrationEnd', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Event Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.eventStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.eventStart ? format(formData.eventStart, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.eventStart}
                    onSelect={(date) => handleInputChange('eventStart', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Event End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.eventEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.eventEnd ? format(formData.eventEnd, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.eventEnd}
                    onSelect={(date) => handleInputChange('eventEnd', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};