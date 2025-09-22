import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { BasicDetailsForm } from './forms/BasicDetailsForm';
import { AboutEventForm } from './forms/AboutEventForm';
import { EligibilityForm } from './forms/EligibilityForm';
import { RoundsForm } from './forms/RoundsForm';
import { RewardsForm } from './forms/RewardsForm';
import { FeaturesForm } from './forms/FeaturesForm';
import { PreviewPublishForm } from './forms/PreviewPublishForm';
import { EventData } from '@/types';

interface EventHostingFormProps {
  onClose?: () => void;
  inDialog?: boolean;
}

const steps = [
  { id: 1, title: 'Basic Details', component: BasicDetailsForm },
  { id: 2, title: 'About Event', component: AboutEventForm },
  { id: 3, title: 'Eligibility', component: EligibilityForm },
  { id: 4, title: 'Rounds/Stages', component: RoundsForm },
  { id: 5, title: 'Rewards', component: RewardsForm },
  { id: 6, title: 'Features', component: FeaturesForm },
  { id: 7, title: 'Preview & Publish', component: PreviewPublishForm },
];

const isStepValid = (step: number, data: EventData): boolean => {
  switch(step) {
    case 1: // Basic Details
      return Boolean(
        data.basicDetails.eventTitle &&
        data.basicDetails.assignedRoles?.teachers.length &&
        data.basicDetails.assignedRoles?.teachers.length > 0 &&
        data.basicDetails.assignedRoles?.host &&
        data.basicDetails.whoFillsForm
      );
    case 2: // About Event
      return Boolean(
        data.aboutEvent.description &&
        data.aboutEvent.category &&
        data.aboutEvent.mode &&
        (data.aboutEvent.mode === 'online' || data.aboutEvent.location)
      );
    case 3: // Eligibility
      return Boolean(
        data.eligibility.minTeamSize &&
        data.eligibility.maxTeamSize &&
        data.eligibility.minTeamSize <= data.eligibility.maxTeamSize
      );
    case 4: // Rounds
      return data.rounds.length > 0 && data.rounds.every(round => 
        round.title && round.description
      );
    case 5: // Rewards
      return true; // Rewards are optional
    case 6: // Features
      return true; // Features are optional
    case 7: // Preview
      return true; // Always valid for preview
    default:
      return false;
  }
};

const isFormComplete = (data: EventData): boolean => {
  return [1, 2, 3, 4, 5, 6].every(step => isStepValid(step, data));
};

export const EventHostingForm: React.FC<EventHostingFormProps> = ({ onClose, inDialog = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [eventData, setEventData] = useState<EventData>({
    basicDetails: {
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
    },
    aboutEvent: {
      description: '',
      category: '',
      mode: 'online',
      location: '',
    },
    eligibility: {
      minTeamSize: 1,
      maxTeamSize: 1,
      allowSoloParticipation: true,
      restrictions: [],
      requirements: [],
    },
    rounds: [],
    rewards: {
      prizes: [],
      certificates: true,
      otherRewards: [],
    },
    features: {
      features: [],
      requirements: [],
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const updateEventData = (section: keyof EventData, data: unknown) => {
    setEventData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const CurrentComponent = steps[currentStep - 1].component;
  const progressPercentage = (currentStep / steps.length) * 100;

  const containerClass = inDialog
    ? "relative flex flex-col h-[90vh] bg-background"
    : "min-h-screen bg-background flex flex-col";

  const headerClass = inDialog
    ? "bg-gradient-primary px-6 py-6"
    : "bg-gradient-primary px-6 py-8";

  const contentClass = inDialog
    ? "flex-1 overflow-auto p-6"
    : "flex-1 container mx-auto px-6 py-8";

  const containerStyles = inDialog 
    ? "w-full h-full bg-background flex flex-col overflow-hidden"
    : "min-h-screen bg-background";

  const headerStyles = inDialog
    ? "bg-gradient-to-r from-primary to-primary/80 px-6 py-4 relative z-10 shadow-md"
    : "bg-gradient-primary px-6 py-8";

  const contentStyles = inDialog
    ? "flex-1 overflow-y-auto px-6 py-4 custom-scrollbar"
    : "container mx-auto px-6 py-8";

  return (
    <div className={containerStyles}>
      {/* Close button - only show in dialog mode */}
      {onClose && inDialog && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}

      {/* Header */}
      <div className={headerStyles}>
        <h1 className="text-2xl font-bold text-white mb-1">Create Your Event</h1>
        <p className="text-white/80 text-sm">Build and manage your event with our comprehensive platform</p>
      </div>

      <div className={contentStyles}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Step Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Progress</CardTitle>
                  <Progress value={progressPercentage} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Step {currentStep} of {steps.length}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 custom-scrollbar" style={{ maxHeight: inDialog ? 'calc(80vh - 200px)' : 'auto' }}>
                  {steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        currentStep === step.id
                          ? 'bg-primary text-primary-foreground shadow-elegant'
                          : completedSteps.includes(step.id)
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className={`h-5 w-5 ${
                          currentStep === step.id ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`} />
                      )}
                      <span className="text-sm font-medium">{step.title}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CurrentComponent
                    data={eventData}
                    updateData={updateEventData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between sticky bottom-0 bg-white p-4 -mx-6 mt-6 border-t shadow-sm">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {currentStep < steps.length ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep, eventData)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 border-0 shadow-elegant hover:shadow-lg transition-shadow"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (isFormComplete(eventData)) {
                        console.log('Publishing event:', eventData);
                        onClose?.();
                      }
                    }}
                    disabled={!isFormComplete(eventData)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 border-0 shadow-elegant hover:shadow-lg transition-shadow"
                  >
                    Publish Event
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};