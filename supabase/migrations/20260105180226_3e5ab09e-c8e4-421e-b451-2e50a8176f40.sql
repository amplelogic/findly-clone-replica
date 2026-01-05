-- Create table for free SEO tools management
CREATE TABLE public.free_seo_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'FileText',
  category TEXT NOT NULL DEFAULT 'Technical SEO',
  is_active BOOLEAN NOT NULL DEFAULT true,
  custom_script TEXT,
  tool_content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.free_seo_tools ENABLE ROW LEVEL SECURITY;

-- Anyone can view active free tools
CREATE POLICY "Anyone can view active free tools"
ON public.free_seo_tools
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert free tools
CREATE POLICY "Admins can insert free tools"
ON public.free_seo_tools
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update free tools
CREATE POLICY "Admins can update free tools"
ON public.free_seo_tools
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete free tools
CREATE POLICY "Admins can delete free tools"
ON public.free_seo_tools
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_free_seo_tools_updated_at
BEFORE UPDATE ON public.free_seo_tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();