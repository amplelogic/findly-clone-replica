import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wrench } from "lucide-react";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ToolPageLayout = ({ title, description, children }: ToolPageLayoutProps) => {
  return (
    <>
      <SEOHead
        title={`${title} - Free SEO Tool | Marketing.Tools`}
        description={description}
        canonicalUrl={`https://marketing.tools/tools`}
      />
      <div className="min-h-screen w-full bg-background flex flex-col">
        <Header user={null} />
        
        <main className="flex-1">
          {/* Tool Header */}
          <section className="border-b bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-6 py-8">
              <Link to="/tools">
                <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to All Tools
                </Button>
              </Link>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {title}
                  </h1>
                  <p className="text-muted-foreground max-w-2xl">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tool Content */}
          <section className="container mx-auto px-6 py-8">
            {children}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};
