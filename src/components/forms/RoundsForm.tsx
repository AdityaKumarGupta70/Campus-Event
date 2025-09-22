import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Clock, FileText, MessageSquare, Upload, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: any;
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface Round {
  id: string;
  name: string;
  type: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  criteria: string;
}

const roundTypes = [
  { value: 'quiz', label: 'Quiz Round', icon: MessageSquare },
  { value: 'submission', label: 'Submission Upload', icon: Upload },
  { value: 'presentation', label: 'Presentation', icon: Video },
  { value: 'interview', label: 'Interview', icon: MessageSquare },
  { value: 'coding', label: 'Coding Challenge', icon: FileText },
  { value: 'written', label: 'Written Test', icon: FileText },
  { value: 'other', label: 'Other', icon: Clock },
];

export const RoundsForm: React.FC<Props> = ({ data, updateData }) => {
  const [rounds, setRounds] = useState<Round[]>(data.rounds || []);

  const addRound = () => {
    const newRound: Round = {
      id: Date.now().toString(),
      name: '',
      type: '',
      description: '',
      startDate: null,
      endDate: null,
      startTime: '',
      endTime: '',
      criteria: '',
    };
    const updatedRounds = [...rounds, newRound];
    setRounds(updatedRounds);
    updateData('rounds', updatedRounds);
  };

  const removeRound = (id: string) => {
    const updatedRounds = rounds.filter(round => round.id !== id);
    setRounds(updatedRounds);
    updateData('rounds', updatedRounds);
  };

  const updateRound = (id: string, field: keyof Round, value: any) => {
    const updatedRounds = rounds.map(round =>
      round.id === id ? { ...round, [field]: value } : round
    );
    setRounds(updatedRounds);
    updateData('rounds', updatedRounds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Event Rounds & Stages</h3>
          <p className="text-muted-foreground">Define the structure and timeline of your event</p>
        </div>
        <Button onClick={addRound} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Round
        </Button>
      </div>

      {rounds.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No rounds added yet</h3>
            <p className="text-muted-foreground mb-4">
              Add rounds to structure your event. You can create multiple stages like quiz, submissions, presentations, etc.
            </p>
            <Button onClick={addRound} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Round
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rounds.map((round, index) => (
            <Card key={round.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    Round {index + 1}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeRound(round.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`round-name-${round.id}`}>Round Name *</Label>
                    <Input
                      id={`round-name-${round.id}`}
                      placeholder="e.g., Quiz Round, Final Pitch"
                      value={round.name}
                      onChange={(e) => updateRound(round.id, 'name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`round-type-${round.id}`}>Round Type *</Label>
                    <Select value={round.type} onValueChange={(value) => updateRound(round.id, 'type', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select round type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roundTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`round-description-${round.id}`}>Description & Instructions</Label>
                  <Textarea
                    id={`round-description-${round.id}`}
                    placeholder="Describe what participants need to do in this round"
                    value={round.description}
                    onChange={(e) => updateRound(round.id, 'description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !round.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {round.startDate ? format(round.startDate, "MMM dd") : "Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={round.startDate}
                          onSelect={(date) => updateRound(round.id, 'startDate', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor={`start-time-${round.id}`}>Start Time</Label>
                    <Input
                      id={`start-time-${round.id}`}
                      type="time"
                      value={round.startTime}
                      onChange={(e) => updateRound(round.id, 'startTime', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !round.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {round.endDate ? format(round.endDate, "MMM dd") : "Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={round.endDate}
                          onSelect={(date) => updateRound(round.id, 'endDate', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor={`end-time-${round.id}`}>End Time</Label>
                    <Input
                      id={`end-time-${round.id}`}
                      type="time"
                      value={round.endTime}
                      onChange={(e) => updateRound(round.id, 'endTime', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`round-criteria-${round.id}`}>Evaluation Criteria</Label>
                  <Textarea
                    id={`round-criteria-${round.id}`}
                    placeholder="How will participants be evaluated in this round? What are the judging criteria?"
                    value={round.criteria}
                    onChange={(e) => updateRound(round.id, 'criteria', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {rounds.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button onClick={addRound} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Another Round
          </Button>
        </div>
      )}
    </div>
  );
};