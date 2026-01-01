import { 
  Search, 
  DollarSign, 
  FileText, 
  Share2, 
  Mail, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Star, 
  Target,
  LucideIcon
} from "lucide-react";

export interface ResourceSubtopic {
  title: string;
  description: string;
  points: string[];
}

export interface ResourceSection {
  title: string;
  description: string;
  subtopics: ResourceSubtopic[];
}

export interface Resource {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  sections: ResourceSection[];
}

export const resourcesData: Resource[] = [
  {
    id: "seo",
    number: 1,
    title: "Search Engine Optimization (SEO)",
    shortTitle: "SEO",
    description: "Search Engine Optimization focuses on improving website visibility in organic search results.",
    icon: Search,
    sections: [
      {
        title: "On-Page SEO",
        description: "Techniques applied directly on web pages to improve rankings and relevance.",
        subtopics: [
          {
            title: "Keyword Research",
            description: "Identifying search terms users use to find products or information.",
            points: ["Search intent analysis", "Keyword difficulty evaluation", "Long-tail keyword targeting"]
          },
          {
            title: "Meta Titles and Descriptions",
            description: "Optimizing page titles and meta descriptions for higher click-through rates.",
            points: ["Clear keyword usage", "Character length optimization", "Unique meta tags per page"]
          },
          {
            title: "Header Structure (H1–H6)",
            description: "Logical content hierarchy using heading tags.",
            points: ["One H1 per page", "Proper subheading flow", "Improved readability and SEO clarity"]
          },
          {
            title: "Content Optimization",
            description: "Improving content quality and relevance.",
            points: ["Keyword placement", "Content depth", "Readability improvements"]
          },
          {
            title: "Internal Linking",
            description: "Linking pages within the same website.",
            points: ["Contextual linking", "Improved crawlability", "Passing link equity"]
          }
        ]
      },
      {
        title: "Technical SEO",
        description: "Backend optimizations that help search engines crawl and index a website.",
        subtopics: [
          {
            title: "Site Speed Optimization",
            description: "Improving page load time.",
            points: ["Image optimization", "Caching", "Code minification"]
          },
          {
            title: "Mobile Optimization",
            description: "Ensuring the site works well on mobile devices.",
            points: ["Responsive design", "Mobile usability checks", "Touch-friendly layouts"]
          },
          {
            title: "Crawlability and Indexing",
            description: "Helping search engines discover and index pages.",
            points: ["XML sitemaps", "Robots.txt", "Canonical tags"]
          },
          {
            title: "Schema Markup",
            description: "Structured data that helps search engines understand content.",
            points: ["Rich results eligibility", "JSON-LD implementation", "Entity relationships"]
          },
          {
            title: "Core Web Vitals",
            description: "User experience metrics defined by Google.",
            points: ["Largest Contentful Paint (LCP)", "Interaction to Next Paint (INP)", "Cumulative Layout Shift (CLS)"]
          }
        ]
      },
      {
        title: "Off-Page SEO",
        description: "Activities performed outside the website to build authority.",
        subtopics: [
          {
            title: "Link Building",
            description: "Earning backlinks from other websites.",
            points: ["Guest posting", "Resource links", "Editorial links"]
          },
          {
            title: "Digital PR",
            description: "Online brand visibility through publications.",
            points: ["Press releases", "Media mentions", "Influencer outreach"]
          },
          {
            title: "Brand Mentions",
            description: "Unlinked mentions of a brand name.",
            points: ["Citation tracking", "Brand authority signals"]
          },
          {
            title: "Directory Listings",
            description: "Listing business information on directories.",
            points: ["Business accuracy", "Niche directories", "Trust signals"]
          }
        ]
      },
      {
        title: "Local SEO",
        description: "Optimizing visibility for location-based searches.",
        subtopics: [
          {
            title: "Google Business Profile Optimization",
            description: "Improving local business presence.",
            points: ["Profile completeness", "Category selection", "Photo updates"]
          },
          {
            title: "Local Citations",
            description: "Consistent business information across platforms.",
            points: ["NAP consistency", "Location trust signals"]
          },
          {
            title: "Reviews Management",
            description: "Handling customer reviews.",
            points: ["Review generation", "Response strategy", "Reputation building"]
          },
          {
            title: "Location-Based Keywords",
            description: "Keywords targeting geographic areas.",
            points: ["City-based searches", "Service-area optimization"]
          }
        ]
      }
    ]
  },
  {
    id: "paid-advertising",
    number: 2,
    title: "Paid Advertising (Performance Marketing)",
    shortTitle: "Paid Ads",
    description: "Paid campaigns designed to generate immediate traffic and conversions.",
    icon: DollarSign,
    sections: [
      {
        title: "Search Ads",
        description: "Text ads displayed on search engines.",
        subtopics: [
          {
            title: "Google Search Ads",
            description: "Advertising on Google search results.",
            points: ["Keyword bidding", "Ad copy optimization", "Quality score improvement"]
          },
          {
            title: "Bing Ads",
            description: "Search advertising on Microsoft Bing.",
            points: ["Lower CPC opportunities", "B2B targeting advantages"]
          }
        ]
      },
      {
        title: "Display Advertising",
        description: "Visual ads shown across websites.",
        subtopics: [
          {
            title: "Google Display Network",
            description: "Banner ads across partner sites.",
            points: ["Audience targeting", "Placement targeting"]
          },
          {
            title: "Banner Ads",
            description: "Static or animated visual ads.",
            points: ["Brand awareness", "Retargeting support"]
          }
        ]
      },
      {
        title: "Social Media Ads",
        description: "Paid ads on social platforms.",
        subtopics: [
          {
            title: "LinkedIn Ads",
            description: "B2B-focused advertising.",
            points: ["Job title targeting", "Account-based campaigns"]
          },
          {
            title: "Facebook & Instagram Ads",
            description: "Visual and conversion-focused ads.",
            points: ["Audience segmentation", "Creative testing"]
          },
          {
            title: "Twitter (X) Ads",
            description: "Conversation-driven promotions.",
            points: ["Trend targeting", "Engagement campaigns"]
          }
        ]
      },
      {
        title: "Remarketing",
        description: "Targeting users who previously interacted with your brand.",
        subtopics: [
          {
            title: "Website Remarketing",
            description: "Re-engaging website visitors.",
            points: []
          },
          {
            title: "Lead Remarketing",
            description: "Targeting existing leads.",
            points: []
          },
          {
            title: "App Remarketing",
            description: "Reaching users who installed an app.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "content-marketing",
    number: 3,
    title: "Content Marketing",
    shortTitle: "Content",
    description: "Creating and distributing valuable content to attract and retain audiences.",
    icon: FileText,
    sections: [
      {
        title: "Content Strategy",
        description: "Planning content aligned with business goals.",
        subtopics: [
          {
            title: "Content Planning",
            description: "Topic and format planning.",
            points: []
          },
          {
            title: "Buyer Journey Mapping",
            description: "Content for awareness, consideration, and decision stages.",
            points: []
          },
          {
            title: "Editorial Calendar",
            description: "Content scheduling and publishing roadmap.",
            points: []
          }
        ]
      },
      {
        title: "Content Creation",
        description: "Producing content assets.",
        subtopics: [
          {
            title: "Blog Writing",
            description: "Educational and SEO-focused articles.",
            points: []
          },
          {
            title: "Landing Page Content",
            description: "Conversion-focused copy.",
            points: []
          },
          {
            title: "Website Copy",
            description: "Core brand and service messaging.",
            points: []
          },
          {
            title: "Case Studies & Whitepapers",
            description: "In-depth business content.",
            points: []
          }
        ]
      },
      {
        title: "Content Distribution",
        description: "Promoting content across channels.",
        subtopics: [
          {
            title: "Blog Publishing",
            description: "Publishing on owned platforms.",
            points: []
          },
          {
            title: "Email Distribution",
            description: "Sharing content via newsletters.",
            points: []
          },
          {
            title: "Social Sharing",
            description: "Promoting content on social platforms.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "social-media-marketing",
    number: 4,
    title: "Social Media Marketing (Organic)",
    shortTitle: "Social Media",
    description: "Managing brand presence without paid promotion.",
    icon: Share2,
    sections: [
      {
        title: "Account Management",
        description: "Setting up and maintaining social accounts.",
        subtopics: [
          {
            title: "Profile Setup & Optimization",
            description: "Optimizing bios, visuals, and links.",
            points: []
          },
          {
            title: "Branding and Consistency",
            description: "Maintaining brand voice and visuals.",
            points: []
          }
        ]
      },
      {
        title: "Content Posting",
        description: "Creating and publishing social content.",
        subtopics: [
          {
            title: "Static Posts",
            description: "Single-image or text posts.",
            points: []
          },
          {
            title: "Carousels",
            description: "Multi-slide educational posts.",
            points: []
          },
          {
            title: "Short Videos",
            description: "Reels, Shorts, and short-form videos.",
            points: []
          }
        ]
      },
      {
        title: "Community Management",
        description: "Engaging with your audience.",
        subtopics: [
          {
            title: "Comment Management",
            description: "Engaging with audience comments.",
            points: []
          },
          {
            title: "Message Handling",
            description: "Responding to DMs and inquiries.",
            points: []
          },
          {
            title: "Brand Monitoring",
            description: "Tracking brand mentions and conversations.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "email-marketing",
    number: 5,
    title: "Email Marketing & Marketing Automation",
    shortTitle: "Email Marketing",
    description: "Using email to nurture and convert leads.",
    icon: Mail,
    sections: [
      {
        title: "Email Campaigns",
        description: "Different types of email communications.",
        subtopics: [
          {
            title: "Newsletters",
            description: "Regular informational emails.",
            points: []
          },
          {
            title: "Product Updates",
            description: "Feature and release announcements.",
            points: []
          },
          {
            title: "Promotional Emails",
            description: "Sales and offer-driven emails.",
            points: []
          }
        ]
      },
      {
        title: "Automation",
        description: "Automated email workflows.",
        subtopics: [
          {
            title: "Lead Nurturing Workflows",
            description: "Automated email sequences.",
            points: []
          },
          {
            title: "Drip Campaigns",
            description: "Timed email delivery.",
            points: []
          },
          {
            title: "Trigger-Based Emails",
            description: "Action-based automation.",
            points: []
          }
        ]
      },
      {
        title: "List Management",
        description: "Managing email subscribers.",
        subtopics: [
          {
            title: "Segmentation",
            description: "Targeted audience groups.",
            points: []
          },
          {
            title: "List Hygiene",
            description: "Removing inactive contacts.",
            points: []
          },
          {
            title: "GDPR Compliance",
            description: "Data protection and consent management.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "conversion-optimization",
    number: 6,
    title: "Conversion Rate Optimization (CRO)",
    shortTitle: "CRO",
    description: "Improving website conversion performance.",
    icon: TrendingUp,
    sections: [
      {
        title: "Landing Page Optimization",
        description: "Improving landing page performance.",
        subtopics: [
          {
            title: "Page Layout Improvements",
            description: "Design and structure optimization.",
            points: []
          },
          {
            title: "CTA Optimization",
            description: "Improving call-to-action effectiveness.",
            points: []
          },
          {
            title: "Form Optimization",
            description: "Reducing friction in forms.",
            points: []
          }
        ]
      },
      {
        title: "User Behavior Analysis",
        description: "Understanding how users interact with your site.",
        subtopics: [
          {
            title: "Heatmaps",
            description: "Visual click and scroll data.",
            points: []
          },
          {
            title: "Session Recordings",
            description: "User interaction replays.",
            points: []
          },
          {
            title: "Funnel Analysis",
            description: "Drop-off analysis.",
            points: []
          }
        ]
      },
      {
        title: "A/B Testing",
        description: "Testing variations to improve performance.",
        subtopics: [
          {
            title: "Headlines",
            description: "Testing messaging.",
            points: []
          },
          {
            title: "CTAs",
            description: "Testing button text and placement.",
            points: []
          },
          {
            title: "Page Layouts",
            description: "Design experimentation.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "analytics-reporting",
    number: 7,
    title: "Analytics & Reporting",
    shortTitle: "Analytics",
    description: "Measuring performance and outcomes.",
    icon: BarChart3,
    sections: [
      {
        title: "Tracking Setup",
        description: "Implementing tracking tools.",
        subtopics: [
          {
            title: "Google Analytics",
            description: "Website traffic tracking.",
            points: []
          },
          {
            title: "Google Tag Manager",
            description: "Centralized tag management.",
            points: []
          },
          {
            title: "Conversion Tracking",
            description: "Goal and event measurement.",
            points: []
          }
        ]
      },
      {
        title: "Performance Reporting",
        description: "Regular performance analysis.",
        subtopics: [
          {
            title: "Monthly Reports",
            description: "Regular performance summaries.",
            points: []
          },
          {
            title: "Campaign Performance Analysis",
            description: "Channel-wise insights.",
            points: []
          },
          {
            title: "ROI Tracking",
            description: "Return on investment measurement.",
            points: []
          }
        ]
      },
      {
        title: "Insights & Optimization",
        description: "Turning data into action.",
        subtopics: [
          {
            title: "Data-Driven Recommendations",
            description: "Actionable insights.",
            points: []
          },
          {
            title: "Growth Opportunities",
            description: "Scaling strategies.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "marketing-technology",
    number: 8,
    title: "Marketing Technology & Tools",
    shortTitle: "MarTech",
    description: "Technology that supports marketing execution.",
    icon: Settings,
    sections: [
      {
        title: "MarTech Setup",
        description: "Core marketing technology infrastructure.",
        subtopics: [
          {
            title: "CRM Integration",
            description: "Sales and marketing alignment.",
            points: []
          },
          {
            title: "Marketing Automation Tools",
            description: "Email and workflow automation.",
            points: []
          }
        ]
      },
      {
        title: "Tracking Tools",
        description: "Visitor and lead tracking.",
        subtopics: [
          {
            title: "Visitor Tracking",
            description: "Anonymous visitor identification.",
            points: []
          },
          {
            title: "Lead Intelligence Tools",
            description: "Company-level insights.",
            points: []
          }
        ]
      },
      {
        title: "Dashboarding",
        description: "Visualizing marketing data.",
        subtopics: [
          {
            title: "Custom Dashboards",
            description: "Tailored reporting views.",
            points: []
          },
          {
            title: "KPI Monitoring",
            description: "Tracking key metrics.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "reputation-management",
    number: 9,
    title: "Online Reputation Management (ORM)",
    shortTitle: "ORM",
    description: "Managing brand perception online.",
    icon: Star,
    sections: [
      {
        title: "Review Management",
        description: "Managing customer reviews.",
        subtopics: [
          {
            title: "Review Generation",
            description: "Encouraging customer reviews.",
            points: []
          },
          {
            title: "Review Responses",
            description: "Engaging with feedback.",
            points: []
          }
        ]
      },
      {
        title: "Brand Monitoring",
        description: "Tracking brand mentions.",
        subtopics: [
          {
            title: "Mentions Tracking",
            description: "Monitoring brand mentions.",
            points: []
          },
          {
            title: "Sentiment Analysis",
            description: "Understanding public opinion.",
            points: []
          }
        ]
      },
      {
        title: "Crisis Management",
        description: "Handling reputation challenges.",
        subtopics: [
          {
            title: "Negative Review Handling",
            description: "Damage control strategies.",
            points: []
          },
          {
            title: "Public Response Strategy",
            description: "Brand communication planning.",
            points: []
          }
        ]
      }
    ]
  },
  {
    id: "abm",
    number: 10,
    title: "B2B & Account-Based Marketing (ABM)",
    shortTitle: "ABM",
    description: "Targeted marketing for high-value accounts.",
    icon: Target,
    sections: [
      {
        title: "Target Account Research",
        description: "Identifying and researching target accounts.",
        subtopics: [
          {
            title: "Ideal Customer Profiling",
            description: "Defining best-fit accounts.",
            points: []
          },
          {
            title: "Account List Building",
            description: "Creating target account lists.",
            points: []
          }
        ]
      },
      {
        title: "Personalized Campaigns",
        description: "Account-specific marketing campaigns.",
        subtopics: [
          {
            title: "LinkedIn ABM Ads",
            description: "Account-level targeting.",
            points: []
          },
          {
            title: "Email Personalization",
            description: "Customized messaging.",
            points: []
          }
        ]
      },
      {
        title: "Sales Enablement",
        description: "Supporting the sales process.",
        subtopics: [
          {
            title: "Lead Handover Process",
            description: "Marketing-to-sales alignment.",
            points: []
          },
          {
            title: "CRM Alignment",
            description: "Unified data flow.",
            points: []
          }
        ]
      }
    ]
  }
];

export const getResourceById = (id: string): Resource | undefined => {
  return resourcesData.find(r => r.id === id);
};
