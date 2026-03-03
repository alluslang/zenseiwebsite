CREATE TABLE promo_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text_id TEXT NOT NULL,
  text_en TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active promo data
INSERT INTO promo_content (text_id, text_en, is_active) VALUES 
('🎉 PROMO SPESIAL: Diskon 20% untuk semua produk Ready-to-Eat khusus bulan ini! Yuk pesan sekarang sebelum kehabisan! 🔥', '🎉 SPECIAL PROMO: 20% off all Ready-to-Eat products this month! Order now before we run out! 🔥', true);

-- Make it public read
ALTER TABLE promo_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON promo_content FOR SELECT USING (true);
