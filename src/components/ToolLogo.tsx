import { iconMap } from "@/data/toolsData";

interface ToolLogoProps {
  logo: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ToolLogo = ({ logo, name, size = "md", className = "" }: ToolLogoProps) => {
  const sizeClasses = {
    sm: "w-7 h-7 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-12 h-12 text-xl"
  };

  const iconSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-6 w-6"
  };

  // Check if it's a URL (image)
  if (logo.startsWith("http") || logo.startsWith("data:")) {
    return (
      <img 
        src={logo} 
        alt={name} 
        className={`${sizeClasses[size]} rounded-lg object-cover ${className}`}
      />
    );
  }

  // Check if it's an icon name from iconMap
  const IconComponent = iconMap[logo];
  if (IconComponent) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-primary/10 flex items-center justify-center ${className}`}>
        <IconComponent className={`${iconSizeClasses[size]} text-primary`} />
      </div>
    );
  }

  // Fallback: treat as emoji or single character
  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-muted flex items-center justify-center font-bold text-foreground ${className}`}>
      {logo}
    </div>
  );
};
