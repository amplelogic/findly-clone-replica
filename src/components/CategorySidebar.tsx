import { Home, Search, Megaphone, Mail, Share2, BarChart3, PenTool, Target, TrendingUp, MousePointerClick, FileText, Video, Palette, Users, Globe, Smartphone, MessageSquare, Zap, Link2, ShoppingBag, Send } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "All Tools", icon: Home, path: "/" },
  { name: "SEO Tools", icon: Search, path: "/categories/seo-tools" },
  { name: "Social Media Marketing", icon: Share2, path: "/categories/social-media-marketing" },
  { name: "Email Marketing", icon: Mail, path: "/categories/email-marketing" },
  { name: "Content Marketing", icon: FileText, path: "/categories/content-marketing" },
  { name: "PPC & Advertising", icon: MousePointerClick, path: "/categories/ppc-advertising" },
  { name: "Analytics & Tracking", icon: BarChart3, path: "/categories/analytics-tracking" },
  { name: "Marketing Automation", icon: Zap, path: "/categories/marketing-automation" },
  { name: "Copywriting Tools", icon: PenTool, path: "/categories/copywriting-tools" },
  { name: "Video Marketing", icon: Video, path: "/categories/video-marketing" },
  { name: "Influencer Marketing", icon: Users, path: "/categories/influencer-marketing" },
  { name: "Affiliate Marketing", icon: Link2, path: "/categories/affiliate-marketing" },
  { name: "Conversion Optimization", icon: Target, path: "/categories/conversion-optimization" },
  { name: "Lead Generation", icon: TrendingUp, path: "/categories/lead-generation" },
  { name: "Design & Creatives", icon: Palette, path: "/categories/design-creatives" },
  { name: "Website Builders", icon: Globe, path: "/categories/website-builders" },
  { name: "E-commerce Marketing", icon: ShoppingBag, path: "/categories/ecommerce-marketing" },
  { name: "Mobile Marketing", icon: Smartphone, path: "/categories/mobile-marketing" },
  { name: "Chatbots & Messaging", icon: MessageSquare, path: "/categories/chatbots-messaging" },
  { name: "Campaign Management", icon: Megaphone, path: "/categories/campaign-management" },
];

export const CategorySidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };
  
  return (
    <Sidebar className="border-r border-border bg-sidebar" collapsible="offcanvas">
      <SidebarContent className="bg-sidebar">
        {/* Logo at top */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-foreground text-background px-2.5 py-1.5 rounded font-bold text-sm">
              MARKETING.TOOLS
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((category) => {
                  const Icon = category.icon;
                  const active = isActive(category.path);
                  return (
                    <SidebarMenuItem key={category.path}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={category.path} 
                          className={`flex items-center gap-3 transition-colors ${
                            active 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'hover:bg-sidebar-accent'
                          }`}
                        >
                          <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                          {open && <span className="truncate text-sm">{category.name}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      {/* Submit Tool button at bottom */}
      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar">
        <Link to="/submit">
          <Button className="w-full" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Submit Tool
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
};
