import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Mail, Phone } from "lucide-react";

interface ContactSupportProps {
  defaultTab?: string;
  isSubmitting?: boolean;
  onSubmitForm?: (data: FormData) => void;
  onStartChat?: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactSupport = ({
  defaultTab = "form",
  isSubmitting = false,
  onSubmitForm = () => {},
  onStartChat = () => {},
}: ContactSupportProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitForm(formData);
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
      <p className="text-muted-foreground mb-8">
        Need help with your ProMouseTuner? Our support team is here to assist
        you.
      </p>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <Mail size={16} />
            <span>Contact Form</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Live Chat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Fill out the form below and our team will get back to you within
                24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please describe your issue in detail"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
                <Send className="ml-2" size={16} />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Start a Live Chat</CardTitle>
              <CardDescription>
                Connect with a support agent instantly for real-time assistance.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-center space-y-4 mb-6">
                <div className="bg-primary/10 p-4 rounded-full inline-block">
                  <MessageSquare size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium">Live Support Available</h3>
                <p className="text-muted-foreground">
                  Our support team is online and ready to help you with any
                  issues you might be experiencing.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <Button onClick={onStartChat} className="flex-1">
                  <MessageSquare className="mr-2" size={16} />
                  Start Chat
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="mr-2" size={16} />
                  Call Support
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Support hours: Monday-Friday, 9AM-6PM EST
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Quick Contact</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            <span>support@promousetuner.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-primary" />
            <span>+1 (800) 555-1234</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
