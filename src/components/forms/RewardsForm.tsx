import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Gift, DollarSign, Award, Plus, Trash2, Medal, Star } from 'lucide-react';

interface Props {
  data: any;
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface Prize {
  id: string;
  position: string;
  type: string;
  amount: string;
  description: string;
}

const prizeTypes = [
  { value: 'cash', label: 'Cash Prize', icon: DollarSign },
  { value: 'voucher', label: 'Vouchers/Coupons', icon: Gift },
  { value: 'goods', label: 'Goodies/Products', icon: Gift },
  { value: 'internship', label: 'Internship Opportunity', icon: Trophy },
  { value: 'ppo', label: 'Pre-Placement Offer', icon: Award },
  { value: 'other', label: 'Other', icon: Star },
];

export const RewardsForm: React.FC<Props> = ({ data, updateData }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = {
      prizes: [],
      certificates: {
        winner: false,
        participation: false,
        topPerformers: false,
        collegeWise: false,
      },
      specialMentions: '',
    };
    
    return {
      ...defaults,
      ...data.rewards,
      certificates: {
        ...defaults.certificates,
        ...(data.rewards?.certificates || {})
      }
    };
  });

  const addPrize = () => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      position: '',
      type: '',
      amount: '',
      description: '',
    };
    const updatedPrizes = [...formData.prizes, newPrize];
    updateFormData('prizes', updatedPrizes);
  };

  const removePrize = (id: string) => {
    const updatedPrizes = formData.prizes.filter((prize: Prize) => prize.id !== id);
    updateFormData('prizes', updatedPrizes);
  };

  const updatePrize = (id: string, field: keyof Prize, value: string) => {
    const updatedPrizes = formData.prizes.map((prize: Prize) =>
      prize.id === id ? { ...prize, [field]: value } : prize
    );
    updateFormData('prizes', updatedPrizes);
  };

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData('rewards', newData);
  };

  const updateCertificate = (type: string, value: boolean) => {
    const newCertificates = { ...formData.certificates, [type]: value };
    updateFormData('certificates', newCertificates);
  };

  const positions = ['1st Place', '2nd Place', '3rd Place', 'Runner Up', 'Special Prize', 'Category Winner'];

  return (
    <div className="space-y-6">
      {/* Prizes Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Prizes & Rewards
            </CardTitle>
            <Button onClick={addPrize} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Prize
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.prizes.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">No prizes added yet</h3>
              <p className="text-muted-foreground mb-4">Add prizes to motivate participants</p>
              <Button onClick={addPrize} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Prize
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.prizes.map((prize: Prize, index: number) => (
                <Card key={prize.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Medal className="h-5 w-5 text-primary" />
                        <span className="font-medium">Prize {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePrize(prize.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Position/Rank</Label>
                        <Select value={prize.position} onValueChange={(value) => updatePrize(prize.id, 'position', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {positions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Prize Type</Label>
                        <Select value={prize.type} onValueChange={(value) => updatePrize(prize.id, 'type', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {prizeTypes.map((type) => (
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
                      
                      <div>
                        <Label>Amount/Value</Label>
                        <Input
                          placeholder="e.g., $500, ₹10000"
                          value={prize.amount}
                          onChange={(e) => updatePrize(prize.id, 'amount', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label>Prize Description</Label>
                      <Textarea
                        placeholder="Detailed description of the prize"
                        value={prize.description}
                        onChange={(e) => updatePrize(prize.id, 'description', e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificates & Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Winner Certificates</Label>
                  <p className="text-sm text-muted-foreground">For prize winners</p>
                </div>
                <Switch
                  checked={formData.certificates.winner}
                  onCheckedChange={(checked) => updateCertificate('winner', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Participation Certificates</Label>
                  <p className="text-sm text-muted-foreground">For all participants</p>
                </div>
                <Switch
                  checked={formData.certificates.participation}
                  onCheckedChange={(checked) => updateCertificate('participation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Top Performers</Label>
                  <p className="text-sm text-muted-foreground">For top 10 participants</p>
                </div>
                <Switch
                  checked={formData.certificates.topPerformers}
                  onCheckedChange={(checked) => updateCertificate('topPerformers', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">College-wise Recognition</Label>
                  <p className="text-sm text-muted-foreground">Best college performers</p>
                </div>
                <Switch
                  checked={formData.certificates.collegeWise}
                  onCheckedChange={(checked) => updateCertificate('collegeWise', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Mentions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Special Mentions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="specialMentions">Additional Recognition</Label>
            <Textarea
              id="specialMentions"
              placeholder="Any other special mentions, category-wise awards, or recognition you want to provide"
              value={formData.specialMentions}
              onChange={(e) => updateFormData('specialMentions', e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};