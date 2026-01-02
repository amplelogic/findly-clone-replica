import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { seoTools } from "@/data/toolsData";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Wrench } from "lucide-react";

const Tools = () => {
  const categories = [...new Set(seoTools.map(tool => tool.category))];

  return (
    <>
      <SEOHead
        title="Free SEO Tools - Marketing.Tools"
        description="Free SEO tools including robots.txt generator, schema markup generator, SERP simulator, and more. Boost your search engine optimization."
        canonicalUrl="https://marketing.tools/tools"
      />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          <main className="flex-1 w-full flex flex-col">
            <Header user={null} />
            
            <section className="container mx-auto px-6 py-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Free SEO Tools
                </h1>
              </div>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                A collection of free tools to help you optimize your website for search engines. 
                From technical SEO to content optimization, we've got you covered.
              </p>

              {categories.map(category => (
                <div key={category} className="mb-10">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {seoTools
                      .filter(tool => tool.category === category)
                      .map(tool => (
                        <Link key={tool.id} to={`/tools/${tool.id}`}>
                          <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                            <CardHeader className="pb-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                  <tool.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-sm font-medium leading-tight">
                                    {tool.name}
                                  </CardTitle>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <CardDescription className="text-xs line-clamp-2">
                                {tool.description}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </section>

            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Tools;
