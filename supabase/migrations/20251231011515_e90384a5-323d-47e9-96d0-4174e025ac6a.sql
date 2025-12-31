-- Add new fields to tools table for enhanced tool details
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS use_cases text,
ADD COLUMN IF NOT EXISTS best_for text,
ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS youtube_tutorials text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS overview text;

-- Create index for slug
CREATE INDEX IF NOT EXISTS idx_tools_slug ON public.tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_tags ON public.tools USING GIN(tags);

-- Create submitted_tools table for user submissions
CREATE TABLE IF NOT EXISTS public.submitted_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  logo text NOT NULL,
  category text,
  website_url text,
  pricing text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on submitted_tools
ALTER TABLE public.submitted_tools ENABLE ROW LEVEL SECURITY;

-- RLS policies for submitted_tools
CREATE POLICY "Users can submit tools" 
ON public.submitted_tools 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions" 
ON public.submitted_tools 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update submissions" 
ON public.submitted_tools 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete submissions" 
ON public.submitted_tools 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on submitted_tools
CREATE TRIGGER update_submitted_tools_updated_at
BEFORE UPDATE ON public.submitted_tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();