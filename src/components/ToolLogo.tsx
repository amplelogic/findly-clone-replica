import { iconMap } from "@/data/toolsData";

interface ToolLogoProps {
  logo: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ToolLogo = ({ logo, name, size = "md", className = "" }: ToolLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-14 h-14 text-2xl"
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7"
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
