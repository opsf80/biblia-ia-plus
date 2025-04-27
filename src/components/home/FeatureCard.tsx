
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className = "" }: FeatureCardProps) => {
  return (
    <Card className={`h-full transition-all hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="w-12 h-12 rounded-full bg-biblia-purple-100 dark:bg-biblia-purple-900/30 flex items-center justify-center text-biblia-purple-500 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
