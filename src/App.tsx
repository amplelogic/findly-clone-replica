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
import CanonicalUrlChecker from "./pages/tools/CanonicalUrlChecker";
import RedirectChecker from "./pages/tools/RedirectChecker";
import MetaTagAnalyzer from "./pages/tools/MetaTagAnalyzer";
import HeadingStructureChecker from "./pages/tools/HeadingStructureChecker";
import KeywordDensityChecker from "./pages/tools/KeywordDensityChecker";
import WordCounter from "./pages/tools/WordCounter";
import ReadabilityAnalyzer from "./pages/tools/ReadabilityAnalyzer";
import DuplicateContentChecker from "./pages/tools/DuplicateContentChecker";
import PageSpeedAnalyzer from "./pages/tools/PageSpeedAnalyzer";
import HttpHeaderChecker from "./pages/tools/HttpHeaderChecker";
import SslChecker from "./pages/tools/SslChecker";
import UrlEncoderDecoder from "./pages/tools/UrlEncoderDecoder";
import QrCodeGenerator from "./pages/tools/QrCodeGenerator";
import ColorContrastChecker from "./pages/tools/ColorContrastChecker";
import UtmBuilder from "./pages/tools/UtmBuilder";
import TimestampConverter from "./pages/tools/TimestampConverter";

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
          <Route path="/tools/canonical-url-checker" element={<CanonicalUrlChecker />} />
          <Route path="/tools/redirect-checker" element={<RedirectChecker />} />
          <Route path="/tools/meta-tag-analyzer" element={<MetaTagAnalyzer />} />
          <Route path="/tools/heading-structure-checker" element={<HeadingStructureChecker />} />
          <Route path="/tools/keyword-density-checker" element={<KeywordDensityChecker />} />
          <Route path="/tools/word-counter" element={<WordCounter />} />
          <Route path="/tools/readability-analyzer" element={<ReadabilityAnalyzer />} />
          <Route path="/tools/duplicate-content-checker" element={<DuplicateContentChecker />} />
          <Route path="/tools/page-speed-insights" element={<PageSpeedAnalyzer />} />
          <Route path="/tools/http-header-checker" element={<HttpHeaderChecker />} />
          <Route path="/tools/ssl-checker" element={<SslChecker />} />
          <Route path="/tools/url-encoder-decoder" element={<UrlEncoderDecoder />} />
          <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
          <Route path="/tools/color-contrast-checker" element={<ColorContrastChecker />} />
          <Route path="/tools/utm-builder" element={<UtmBuilder />} />
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/:category/:slug" element={<ToolDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
