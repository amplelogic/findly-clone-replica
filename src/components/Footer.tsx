import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="bg-foreground text-background px-2.5 py-1 rounded font-bold text-xs inline-block mb-3">
              MARKETING.TOOLS
            </div>
            <p className="text-xs text-muted-foreground">
              Find the best digital marketing tools, all in one place.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">Categories</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/categories/seo-tools" className="hover:text-foreground transition-colors">SEO Tools</Link></li>
              <li><Link to="/categories/email-marketing" className="hover:text-foreground transition-colors">Email Marketing</Link></li>
              <li><Link to="/categories/social-media-marketing" className="hover:text-foreground transition-colors">Social Media</Link></li>
              <li><Link to="/categories/analytics-tracking" className="hover:text-foreground transition-colors">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">Resources</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Submit Tool</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Advertise</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Newsletter</a></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">Legal</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Marketing.Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
