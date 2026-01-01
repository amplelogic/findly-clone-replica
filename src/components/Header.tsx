import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { User } from "lucide-react";

interface HeaderProps {
  user: any | null;
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="lg:hidden" />
            <Link to="/">
              <div className="bg-foreground text-background px-2.5 py-1 rounded font-bold text-xs">
                MARKETING.TOOLS
              </div>
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-accent/10 rounded text-xs font-medium text-accent-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              CERTIFIED DOMAIN RATING
            </div>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/" 
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/resources" 
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Resources
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/blog" 
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/submit" 
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Submit Tool
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <User className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Admin
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-xs">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
