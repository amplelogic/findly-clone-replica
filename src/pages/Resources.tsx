import { Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { resourcesData } from "@/data/resourcesData";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Resources = () => {
  const { user } = useAuth();

  return (
    <>
      <SEOHead
        title="A–Z Digital Marketing Resources | Marketing.Tools"
        description="A practical knowledge base covering all major areas of digital marketing. Structured for easy navigation, learning, and reference."
        canonicalUrl="https://marketing.tools/resources"
      />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <CategorySidebar />
          <div className="flex-1 flex flex-col">
            <Header user={user} />
            <main className="flex-1">
              {/* Hero Section */}
              <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <Badge variant="secondary" className="text-xs font-medium">
                      Knowledge Base
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    A–Z Digital Marketing Resources
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    A practical knowledge base covering all major areas of digital marketing. 
                    This guide is structured for easy navigation, learning, and reference.
                  </p>
                </div>
              </section>

              {/* Resources Grid */}
              <section className="py-10 md:py-14">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resourcesData.map((resource) => {
                      const IconComponent = resource.icon;
                      return (
                        <Link 
                          key={resource.id} 
                          to={`/resources/${resource.id}`}
                          className="group"
                        >
                          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 group-hover:-translate-y-1">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {resource.number.toString().padStart(2, '0')}
                                  </Badge>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <CardTitle className="text-lg mt-4 group-hover:text-primary transition-colors">
                                {resource.title}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {resource.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-1.5">
                                {resource.sections.slice(0, 3).map((section, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="secondary" 
                                    className="text-xs font-normal"
                                  >
                                    {section.title}
                                  </Badge>
                                ))}
                                {resource.sections.length > 3 && (
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs font-normal"
                                  >
                                    +{resource.sections.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            </main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Resources;
