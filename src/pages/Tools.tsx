import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { seoTools } from "@/data/toolsData";
import { Wrench, ArrowRight } from "lucide-react";

const Tools = () => {
  const categories = [...new Set(seoTools.map(tool => tool.category))];

  return (
    <>
      <SEOHead
        title="Free SEO Tools - Marketing.Tools"
        description="Free SEO tools including robots.txt generator, schema markup generator, SERP simulator, and more. Boost your search engine optimization."
        canonicalUrl="https://marketing.tools/tools"
      />
      <div className="min-h-screen w-full bg-background flex flex-col">
        <Header user={null} />
        
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6 py-12 md:py-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Free SEO Tools
                </h1>
                <p className="text-muted-foreground mt-1">
                  {seoTools.length} professional tools at your fingertips
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg">
              A comprehensive collection of free tools to help you optimize your website for search engines, 
              improve performance, and grow your online presence.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <main className="flex-1">
          <div className="container mx-auto px-6 py-10">
            {categories.map(category => (
              <div key={category} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                    {category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {seoTools.filter(tool => tool.category === category).length} tools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {seoTools
                    .filter(tool => tool.category === category)
                    .map(tool => (
                      <Link key={tool.id} to={`/tools/${tool.id}`}>
                        <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-card">
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                                <tool.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                                  {tool.name}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <CardDescription className="text-xs leading-relaxed line-clamp-2 mb-3">
                              {tool.description}
                            </CardDescription>
                            <div className="flex items-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Use Tool <ArrowRight className="h-3 w-3 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Tools;
