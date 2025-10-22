-- Create a table to track which signs users have learned
CREATE TABLE public.user_learned_signs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sign_id TEXT NOT NULL REFERENCES public.road_signs(id),
  learned_from TEXT NOT NULL, -- 'lesson', 'quiz', 'flashcard'
  learned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, sign_id)
);

-- Enable RLS
ALTER TABLE public.user_learned_signs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own learned signs"
ON public.user_learned_signs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learned signs"
ON public.user_learned_signs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_learned_signs_user_id ON public.user_learned_signs(user_id);
CREATE INDEX idx_user_learned_signs_sign_id ON public.user_learned_signs(sign_id);