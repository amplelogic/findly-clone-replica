import { Home, Search, Megaphone, Mail, Share2, BarChart3, PenTool, Target, TrendingUp, MousePointerClick, FileText, Video, Palette, Users, Globe, Smartphone, MessageSquare, Zap, Link2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  return (
    <Sidebar className="border-r border-border" collapsible="offcanvas">
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <SidebarMenuItem key={category.path}>
                      <SidebarMenuButton asChild>
                        <Link to={category.path} className="flex items-center gap-3">
                          <Icon className="h-4 w-4 flex-shrink-0" />
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
    </Sidebar>
  );
};
