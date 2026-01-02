import { 
  FileText, 
  Code, 
  Search, 
  Globe, 
  Eye, 
  Server, 
  Bot, 
  Settings, 
  Map, 
  Rss, 
  Smartphone, 
  CheckSquare, 
  Zap, 
  MapPin 
} from "lucide-react";

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
}

export const seoTools: ToolInfo[] = [
  {
    id: "robots-txt-generator",
    name: "Robots.txt Generator",
    description: "Generate a robots.txt file to control how search engines crawl your website.",
    icon: FileText,
    category: "Technical SEO"
  },
  {
    id: "schema-markup-generator",
    name: "Schema Markup Generator",
    description: "Create structured data markup to enhance your search engine listings.",
    icon: Code,
    category: "Technical SEO"
  },
  {
    id: "serp-simulator",
    name: "SERP Simulator",
    description: "Preview how your pages will appear in Google search results.",
    icon: Search,
    category: "On-Page SEO"
  },
  {
    id: "hreflang-testing",
    name: "Hreflang Tags Testing Tool",
    description: "Validate your hreflang tags for international SEO.",
    icon: Globe,
    category: "International SEO"
  },
  {
    id: "fetch-render",
    name: "Fetch & Render",
    description: "See how search engines view and render your web pages.",
    icon: Eye,
    category: "Technical SEO"
  },
  {
    id: "prerendering-test",
    name: "Pre-rendering Testing Tool",
    description: "Test if your JavaScript content is properly pre-rendered for SEO.",
    icon: Server,
    category: "Technical SEO"
  },
  {
    id: "ai-bot-access",
    name: "AI Bot Access Testing Tool",
    description: "Check if AI crawlers can access your website content.",
    icon: Bot,
    category: "Technical SEO"
  },
  {
    id: "htaccess-tester",
    name: ".htaccess Tester",
    description: "Test and validate your .htaccess redirect rules.",
    icon: Settings,
    category: "Technical SEO"
  },
  {
    id: "xml-sitemap-generator",
    name: "XML Sitemap Generator",
    description: "Generate XML sitemaps with hreflang support for multilingual sites.",
    icon: Map,
    category: "Technical SEO"
  },
  {
    id: "rss-feed-parser",
    name: "RSS Feed Parser",
    description: "Parse and validate RSS feeds for content syndication.",
    icon: Rss,
    category: "Content"
  },
  {
    id: "mobile-first-index",
    name: "Mobile-First Index Tool",
    description: "Compare mobile vs desktop versions of your website.",
    icon: Smartphone,
    category: "Mobile SEO"
  },
  {
    id: "mobile-friendly-test",
    name: "Mobile-Friendly Test",
    description: "Bulk test multiple URLs for mobile-friendliness.",
    icon: CheckSquare,
    category: "Mobile SEO"
  },
  {
    id: "amp-validator",
    name: "AMP Validator",
    description: "Validate your Accelerated Mobile Pages for compliance.",
    icon: Zap,
    category: "Mobile SEO"
  },
  {
    id: "local-search-results",
    name: "Local Search Results Tool",
    description: "Preview local search results for different locations.",
    icon: MapPin,
    category: "Local SEO"
  }
];
