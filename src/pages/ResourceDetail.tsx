import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { getResourceById, resourcesData } from "@/data/resourcesData";
import { useAuth } from "@/hooks/useAuth";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const resource = id ? getResourceById(id) : undefined;
  
  useEffect(() => {
    if (!resource && id) {
      navigate("/resources");
    }
  }, [resource, id, navigate]);

  if (!resource) {
    return null;
  }

  const IconComponent = resource.icon;
  
  // Find previous and next resources
  const currentIndex = resourcesData.findIndex(r => r.id === id);
  const prevResource = currentIndex > 0 ? resourcesData[currentIndex - 1] : null;
  const nextResource = currentIndex < resourcesData.length - 1 ? resourcesData[currentIndex + 1] : null;

  return (
    <>
      <SEOHead
        title={`${resource.title} | Digital Marketing Resources`}
        description={resource.description}
        canonicalUrl={`https://marketing.tools/resources/${resource.id}`}
      />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <CategorySidebar />
          <div className="flex-1 flex flex-col">
            <Header user={user} />
            <main className="flex-1">
              {/* Hero Section */}
              <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
                  <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link to="/">Home</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link to="/resources">Resources</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{resource.shortTitle}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {resource.number.toString().padStart(2, '0')} / 10
                    </Badge>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    {resource.title}
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-3xl">
                    {resource.description}
                  </p>
                </div>
              </section>

              {/* Table of Contents */}
              <section className="py-8 border-b border-border">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">In This Guide</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resource.sections.map((section, idx) => (
                      <a 
                        key={idx}
                        href={`#section-${idx}`}
                        className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </div>
                </div>
              </section>

              {/* Content Sections */}
              <section className="py-10 md:py-14">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="max-w-4xl">
                    {resource.sections.map((section, sectionIdx) => (
                      <div 
                        key={sectionIdx} 
                        id={`section-${sectionIdx}`}
                        className="mb-12 scroll-mt-24"
                      >
                        <Card>
                          <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                Section {sectionIdx + 1}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl md:text-2xl">
                              {section.title}
                            </CardTitle>
                            <p className="text-muted-foreground mt-2">
                              {section.description}
                            </p>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Accordion type="multiple" className="w-full">
                              {section.subtopics.map((subtopic, subtopicIdx) => (
                                <AccordionItem 
                                  key={subtopicIdx} 
                                  value={`${sectionIdx}-${subtopicIdx}`}
                                  className="border-border"
                                >
                                  <AccordionTrigger className="text-left hover:no-underline hover:text-primary py-4">
                                    <span className="font-medium">{subtopic.title}</span>
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-4">
                                    <p className="text-muted-foreground mb-4">
                                      {subtopic.description}
                                    </p>
                                    {subtopic.points.length > 0 && (
                                      <ul className="space-y-2">
                                        {subtopic.points.map((point, pointIdx) => (
                                          <li 
                                            key={pointIdx}
                                            className="flex items-start gap-2 text-sm"
                                          >
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground">{point}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Navigation */}
              <section className="py-8 border-t border-border bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    {prevResource ? (
                      <Link to={`/resources/${prevResource.id}`} className="flex-1">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                          <div className="text-left">
                            <div className="text-xs text-muted-foreground">Previous</div>
                            <div className="font-medium truncate">{prevResource.shortTitle}</div>
                          </div>
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                    
                    {nextResource ? (
                      <Link to={`/resources/${nextResource.id}`} className="flex-1">
                        <Button variant="outline" className="w-full justify-end gap-2 h-auto py-4">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Next</div>
                            <div className="font-medium truncate">{nextResource.shortTitle}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 flex-shrink-0" />
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
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

export default ResourceDetail;
