import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ToolDetail from "./pages/ToolDetail";
import Category from "./pages/Category";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Dashboard from "./pages/Dashboard";
import SubmitTool from "./pages/SubmitTool";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Tools from "./pages/Tools";
import RobotsTxtGenerator from "./pages/tools/RobotsTxtGenerator";
import SchemaMarkupGenerator from "./pages/tools/SchemaMarkupGenerator";
import SerpSimulator from "./pages/tools/SerpSimulator";
import HreflangTesting from "./pages/tools/HreflangTesting";
import FetchRender from "./pages/tools/FetchRender";
import PrerenderingTest from "./pages/tools/PrerenderingTest";
import AiBotAccess from "./pages/tools/AiBotAccess";
import HtaccessTester from "./pages/tools/HtaccessTester";
import XmlSitemapGenerator from "./pages/tools/XmlSitemapGenerator";
import RssFeedParser from "./pages/tools/RssFeedParser";
import MobileFirstIndex from "./pages/tools/MobileFirstIndex";
import MobileFriendlyTest from "./pages/tools/MobileFriendlyTest";
import AmpValidator from "./pages/tools/AmpValidator";
import LocalSearchResults from "./pages/tools/LocalSearchResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitTool />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/categories/:category" element={<Category />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/robots-txt-generator" element={<RobotsTxtGenerator />} />
          <Route path="/tools/schema-markup-generator" element={<SchemaMarkupGenerator />} />
          <Route path="/tools/serp-simulator" element={<SerpSimulator />} />
          <Route path="/tools/hreflang-testing" element={<HreflangTesting />} />
          <Route path="/tools/fetch-render" element={<FetchRender />} />
          <Route path="/tools/prerendering-test" element={<PrerenderingTest />} />
          <Route path="/tools/ai-bot-access" element={<AiBotAccess />} />
          <Route path="/tools/htaccess-tester" element={<HtaccessTester />} />
          <Route path="/tools/xml-sitemap-generator" element={<XmlSitemapGenerator />} />
          <Route path="/tools/rss-feed-parser" element={<RssFeedParser />} />
          <Route path="/tools/mobile-first-index" element={<MobileFirstIndex />} />
          <Route path="/tools/mobile-friendly-test" element={<MobileFriendlyTest />} />
          <Route path="/tools/amp-validator" element={<AmpValidator />} />
          <Route path="/tools/local-search-results" element={<LocalSearchResults />} />
          {/* Category/Tool slug routes - e.g., /video-marketing/wistia */}
          <Route path="/:category/:slug" element={<ToolDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
