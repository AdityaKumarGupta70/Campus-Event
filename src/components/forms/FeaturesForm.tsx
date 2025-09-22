import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, HelpCircle, FileText, CreditCard, Users } from 'lucide-react';

interface Props {
  data: any;
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const FeaturesForm: React.FC<Props> = ({ data, updateData }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = {
      faqs: [],
      rulesGuidelines: '',
      termsConditions: '',
      registrationFee: {
        isFree: true,
        amount: '',
        paymentLink: '',
      },
    };
    
    return {
      ...defaults,
      ...data.features,
      registrationFee: {
        ...defaults.registrationFee,
        ...(data.features?.registrationFee || {})
      }
    };
  });

  const addFAQ = () => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: '',
      answer: '',
    };
    const updatedFAQs = [...formData.faqs, newFAQ];
    updateFormData('faqs', updatedFAQs);
  };

  const removeFAQ = (id: string) => {
    const updatedFAQs = formData.faqs.filter((faq: FAQ) => faq.id !== id);
    updateFormData('faqs', updatedFAQs);
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    const updatedFAQs = formData.faqs.map((faq: FAQ) =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    updateFormData('faqs', updatedFAQs);
  };

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData('features', newData);
  };

  const updateRegistrationFee = (field: string, value: any) => {
    const newRegistrationFee = { ...formData.registrationFee, [field]: value };
    updateFormData('registrationFee', newRegistrationFee);
  };

  return (
    <div className="space-y-6">
      {/* FAQs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <Button onClick={addFAQ} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.faqs.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">No FAQs added yet</h3>
              <p className="text-muted-foreground mb-4">Add common questions and answers to help participants</p>
              <Button onClick={addFAQ} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First FAQ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.faqs.map((faq: FAQ, index: number) => (
                <Card key={faq.id} className="border-l-4 border-l-info">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-info text-info-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">FAQ {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFAQ(faq.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`question-${faq.id}`}>Question</Label>
                        <Input
                          id={`question-${faq.id}`}
                          placeholder="What is the common question participants might ask?"
                          value={faq.question}
                          onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
                        <Textarea
                          id={`answer-${faq.id}`}
                          placeholder="Provide a clear and helpful answer"
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rules & Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Rules & Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="rulesGuidelines">Event Rules & Guidelines</Label>
            <Textarea
              id="rulesGuidelines"
              placeholder="List all the important rules, guidelines, and policies for your event. Include code of conduct, submission guidelines, disqualification criteria, etc."
              value={formData.rulesGuidelines}
              onChange={(e) => updateFormData('rulesGuidelines', e.target.value)}
              className="mt-1 min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="termsConditions">Terms & Conditions</Label>
            <Textarea
              id="termsConditions"
              placeholder="Include legal terms, privacy policy, intellectual property rights, liability disclaimers, and other legal considerations"
              value={formData.termsConditions}
              onChange={(e) => updateFormData('termsConditions', e.target.value)}
              className="mt-1 min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Registration Fees */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Registration Fees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.registrationFee.isFree ? 'free' : 'paid'}
            onValueChange={(value) => updateRegistrationFee('isFree', value === 'free')}
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="free" id="free" />
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-success" />
                <div>
                  <Label htmlFor="free" className="font-medium cursor-pointer">Free Registration</Label>
                  <p className="text-sm text-muted-foreground">No registration fee required</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="paid" id="paid" />
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <Label htmlFor="paid" className="font-medium cursor-pointer">Paid Registration</Label>
                  <p className="text-sm text-muted-foreground">Charge registration fee</p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {!formData.registrationFee.isFree && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="amount">Registration Amount</Label>
                <Input
                  id="amount"
                  placeholder="e.g., 500, $50"
                  value={formData.registrationFee.amount}
                  onChange={(e) => updateRegistrationFee('amount', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paymentLink">Payment Link</Label>
                <Input
                  id="paymentLink"
                  placeholder="https://payment-gateway-link.com"
                  value={formData.registrationFee.paymentLink}
                  onChange={(e) => updateRegistrationFee('paymentLink', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};