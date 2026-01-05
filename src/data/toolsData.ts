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
  MapPin,
  Link,
  Hash,
  Type,
  BarChart3,
  Clock,
  FileSearch,
  Shield,
  Gauge,
  Palette,
  Binary,
  QrCode,
  FileJson,
  Heading,
  ListChecks,
  Percent
} from "lucide-react";

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
}

export const seoTools: ToolInfo[] = [
  // Technical SEO
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
    id: "xml-sitemap-generator",
    name: "XML Sitemap Generator",
    description: "Generate XML sitemaps with hreflang support for multilingual sites.",
    icon: Map,
    category: "Technical SEO"
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
    id: "canonical-url-checker",
    name: "Canonical URL Checker",
    description: "Verify canonical tags are properly implemented across your pages.",
    icon: Link,
    category: "Technical SEO"
  },
  {
    id: "redirect-checker",
    name: "Redirect Chain Checker",
    description: "Analyze redirect chains and identify redirect loops on your site.",
    icon: Link,
    category: "Technical SEO"
  },

  // On-Page SEO
  {
    id: "serp-simulator",
    name: "SERP Simulator",
    description: "Preview how your pages will appear in Google search results.",
    icon: Search,
    category: "On-Page SEO"
  },
  {
    id: "meta-tag-analyzer",
    name: "Meta Tag Analyzer",
    description: "Analyze and optimize your page's meta titles and descriptions.",
    icon: Hash,
    category: "On-Page SEO"
  },
  {
    id: "heading-structure-checker",
    name: "Heading Structure Checker",
    description: "Validate your page's H1-H6 heading hierarchy for SEO.",
    icon: Heading,
    category: "On-Page SEO"
  },
  {
    id: "keyword-density-checker",
    name: "Keyword Density Checker",
    description: "Analyze keyword usage and density in your content.",
    icon: Percent,
    category: "On-Page SEO"
  },
  {
    id: "word-counter",
    name: "Word & Character Counter",
    description: "Count words, characters, sentences, and reading time for your content.",
    icon: Type,
    category: "On-Page SEO"
  },

  // International SEO
  {
    id: "hreflang-testing",
    name: "Hreflang Tags Testing Tool",
    description: "Validate your hreflang tags for international SEO.",
    icon: Globe,
    category: "International SEO"
  },

  // Mobile SEO
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

  // Local SEO
  {
    id: "local-search-results",
    name: "Local Search Results Tool",
    description: "Preview local search results for different locations.",
    icon: MapPin,
    category: "Local SEO"
  },

  // Content Tools
  {
    id: "rss-feed-parser",
    name: "RSS Feed Parser",
    description: "Parse and validate RSS feeds for content syndication.",
    icon: Rss,
    category: "Content"
  },
  {
    id: "readability-analyzer",
    name: "Readability Analyzer",
    description: "Check content readability score using Flesch-Kincaid formula.",
    icon: FileSearch,
    category: "Content"
  },
  {
    id: "duplicate-content-checker",
    name: "Duplicate Content Checker",
    description: "Compare text to find duplicate or similar content.",
    icon: ListChecks,
    category: "Content"
  },

  // Performance & Analytics
  {
    id: "page-speed-insights",
    name: "Page Speed Analyzer",
    description: "Analyze page load time and get optimization suggestions.",
    icon: Gauge,
    category: "Performance"
  },
  {
    id: "http-header-checker",
    name: "HTTP Header Checker",
    description: "Inspect HTTP response headers for any URL.",
    icon: FileJson,
    category: "Performance"
  },
  {
    id: "ssl-checker",
    name: "SSL Certificate Checker",
    description: "Verify SSL certificate validity and security configuration.",
    icon: Shield,
    category: "Performance"
  },

  // Utility Tools
  {
    id: "url-encoder-decoder",
    name: "URL Encoder/Decoder",
    description: "Encode or decode URLs for safe transmission.",
    icon: Binary,
    category: "Utilities"
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes for URLs and marketing campaigns.",
    icon: QrCode,
    category: "Utilities"
  },
  {
    id: "color-contrast-checker",
    name: "Color Contrast Checker",
    description: "Check WCAG accessibility compliance for color combinations.",
    icon: Palette,
    category: "Utilities"
  },
  {
    id: "utm-builder",
    name: "UTM Link Builder",
    description: "Build campaign URLs with UTM parameters for tracking.",
    icon: BarChart3,
    category: "Utilities"
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    icon: Clock,
    category: "Utilities"
  }
];

// Map of icon names to components for dynamic rendering
export const iconMap: Record<string, any> = {
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
  MapPin,
  Link,
  Hash,
  Type,
  BarChart3,
  Clock,
  FileSearch,
  Shield,
  Gauge,
  Palette,
  Binary,
  QrCode,
  FileJson,
  Heading,
  ListChecks,
  Percent
};
