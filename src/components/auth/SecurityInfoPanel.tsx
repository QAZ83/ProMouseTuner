import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";

const SecurityInfoPanel = () => {
  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security Features
        </CardTitle>
        <CardDescription>
          Your account is protected by these security measures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Leaked Password Protection</p>
              <p className="text-sm text-muted-foreground">
                Your password is checked against known data breaches to ensure
                it hasn't been compromised
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Password Strength Enforcement</p>
              <p className="text-sm text-muted-foreground">
                We require strong passwords that meet minimum security
                requirements
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Secure Authentication</p>
              <p className="text-sm text-muted-foreground">
                Your credentials are securely stored and processed
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SecurityInfoPanel;
