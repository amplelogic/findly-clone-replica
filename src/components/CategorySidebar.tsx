import { Home, ShoppingCart, Sparkles, TrendingUp, Megaphone, Search, FolderOpen, Zap, Code2, FileCode, Pencil, Palette, Layers, Users, Mail, Chrome, Briefcase, BarChart3, Bot, Share2, FileText, DollarSign, ShoppingBag, Layout, Smartphone, Video, Activity, Globe, MessageSquare, FileEdit } from "lucide-react";
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
  { name: "All", icon: Home, path: "/" },
  { name: "For Sale", icon: ShoppingCart, path: "/categories/for-sale" },
  { name: "Artificial intelligence", icon: Sparkles, path: "/categories/ai" },
  { name: "Productivity", icon: TrendingUp, path: "/categories/productivity" },
  { name: "Marketing", icon: Megaphone, path: "/categories/marketing" },
  { name: "SEO", icon: Search, path: "/categories/seo" },
  { name: "Directories", icon: FolderOpen, path: "/categories/directories" },
  { name: "Automation", icon: Zap, path: "/categories/automation" },
  { name: "Boilerplates", icon: Code2, path: "/categories/boilerplates" },
  { name: "Developer tools", icon: FileCode, path: "/categories/developer-tools" },
  { name: "Writing", icon: Pencil, path: "/categories/writing" },
  { name: "Design", icon: Palette, path: "/categories/design" },
  { name: "No code", icon: Layers, path: "/categories/no-code" },
  { name: "Community", icon: Users, path: "/categories/community" },
  { name: "Email marketing", icon: Mail, path: "/categories/email-marketing" },
  { name: "Chrome extensions", icon: Chrome, path: "/categories/chrome-extensions" },
  { name: "Freelancer tools", icon: Briefcase, path: "/categories/freelancer-tools" },
  { name: "Analytics", icon: BarChart3, path: "/categories/analytics" },
  { name: "AI agents", icon: Bot, path: "/categories/ai-agents" },
  { name: "Social media", icon: Share2, path: "/categories/social-media" },
  { name: "Content creation", icon: FileText, path: "/categories/content-creation" },
  { name: "Fintech", icon: DollarSign, path: "/categories/fintech" },
  { name: "E-commerce", icon: ShoppingBag, path: "/categories/ecommerce" },
  { name: "Website builders", icon: Layout, path: "/categories/website-builders" },
  { name: "iOS", icon: Smartphone, path: "/categories/ios" },
  { name: "Video", icon: Video, path: "/categories/video" },
  { name: "Monitoring", icon: Activity, path: "/categories/monitoring" },
  { name: "Remote work", icon: Globe, path: "/categories/remote-work" },
  { name: "Chatbots", icon: MessageSquare, path: "/categories/chatbots" },
  { name: "Blogging", icon: FileEdit, path: "/categories/blogging" },
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
