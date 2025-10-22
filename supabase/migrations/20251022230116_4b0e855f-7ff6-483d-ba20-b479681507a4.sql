-- Create storage bucket for road signs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'road-signs',
  'road-signs',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
);

-- Create RLS policies for road signs bucket (public read access)
CREATE POLICY "Public can view road signs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'road-signs');

CREATE POLICY "Authenticated users can upload road signs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'road-signs');

-- Create road_signs table
CREATE TABLE public.road_signs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('information', 'prohibition', 'warning', 'regulation')),
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on road_signs
ALTER TABLE public.road_signs ENABLE ROW LEVEL SECURITY;

-- Public read access to road signs
CREATE POLICY "Anyone can view road signs"
  ON public.road_signs FOR SELECT
  USING (true);

-- Only authenticated users can manage signs
CREATE POLICY "Authenticated users can insert road signs"
  ON public.road_signs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update road signs"
  ON public.road_signs FOR UPDATE
  TO authenticated
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_road_signs_updated_at
  BEFORE UPDATE ON public.road_signs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert road sign data
INSERT INTO public.road_signs (id, name, category, image_url, description) VALUES
  ('national-road', 'National Road', 'information', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/National%20road.png', 'Indicates a national highway route'),
  ('prefectural-road', 'Prefectural Road', 'information', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/Prefectural%20Road.png', 'Indicates a prefectural road route'),
  ('one-way', 'One-Way', 'regulation', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/One-Way.png', 'Traffic must proceed in one direction only'),
  ('no-parking', 'No Parking', 'prohibition', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/No%20Parking.png', 'Parking is prohibited in this area'),
  ('no-stopping', 'No Stopping', 'prohibition', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/No%20Stopping.png', 'Stopping and parking are both prohibited'),
  ('no-u-turn', 'No U-turn', 'prohibition', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/No%20U-turn.png', 'U-turns are not permitted'),
  ('no-entry', 'No Entry', 'prohibition', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/No%20entry.png', 'Entry is prohibited for all vehicles'),
  ('road-closed', 'Road Closed', 'prohibition', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/Road%20Closed.png', 'The road ahead is closed to traffic'),
  ('stop', 'Stop', 'regulation', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/Stop.png', 'Come to a complete stop before proceeding'),
  ('speed-limit', 'Speed Limit', 'regulation', 'https://getvlmzpzggiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/Speed%20Limit.png', 'Maximum speed allowed on this road'),
  ('designated-directions', 'Only Designated Directions Permitted', 'regulation', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/Only%20Designated%20Directions%20Permitted.png', 'Vehicles must follow the indicated directions'),
  ('scooters', 'Scooters', 'warning', 'https://getvlmzpzgiihhslhcvq.supabase.co/storage/v1/object/public/road-signs/Scooters.png', 'Warning: scooter or motorcycle area ahead');

-- Create index for category filtering
CREATE INDEX idx_road_signs_category ON public.road_signs(category);