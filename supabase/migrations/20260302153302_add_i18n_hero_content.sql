-- Add language-specific columns to hero_content
ALTER TABLE public.hero_content
ADD COLUMN badge_text_en TEXT,
ADD COLUMN badge_text_id TEXT,
ADD COLUMN heading_en TEXT,
ADD COLUMN heading_id TEXT,
ADD COLUMN subheading_en TEXT,
ADD COLUMN subheading_id TEXT,
ADD COLUMN primary_button_text_en TEXT,
ADD COLUMN primary_button_text_id TEXT;

-- Migrate existing data to both language columns as defaults
UPDATE public.hero_content
SET 
    badge_text_en = badge_text,
    badge_text_id = badge_text,
    heading_en = heading,
    heading_id = heading,
    subheading_en = subheading,
    subheading_id = subheading,
    primary_button_text_en = primary_button_text,
    primary_button_text_id = 'Pesan Sekarang'; -- basic manual translation for the existing record

-- Now we can optionally drop the old columns later, but we'll keep them for safety for now.
