import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          <main className="flex-1 w-full flex flex-col">
            <Header user={null} />
            
            <section className="container mx-auto px-6 py-6">
              <Link to="/tools">
                <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Tools
                </Button>
              </Link>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {title}
              </h1>
              <p className="text-muted-foreground mb-6 max-w-2xl">
                {description}
              </p>

              {children}
            </section>

            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};
