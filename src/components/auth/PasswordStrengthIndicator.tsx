import React from "react";
import { Shield } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak password";
    if (passwordStrength <= 50) return "Fair password";
    if (passwordStrength <= 75) return "Good password";
    return "Strong password";
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${passwordStrength}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs text-muted-foreground">{getStrengthText()}</p>
        {passwordStrength <= 50 && (
          <p className="text-xs text-amber-500">Use a stronger password</p>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
