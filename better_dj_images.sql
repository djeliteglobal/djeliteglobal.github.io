-- MEJORES IMÁGENES DE DJs - URLs reales de DJs profesionales
-- Actualiza los perfiles mock con fotos reales de DJs

UPDATE profiles 
SET 
  profile_image_url = CASE 
    WHEN dj_name = 'DJ Phoenix' THEN 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80'
    WHEN dj_name = 'DJ Neon' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80'
    WHEN dj_name = 'DJ Vibe' THEN 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop&q=80'
    WHEN dj_name = 'DJ Storm' THEN 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop&q=80'
    WHEN dj_name = 'DJ Luna' THEN 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80'
    ELSE profile_image_url
  END,
  images = CASE 
    WHEN dj_name = 'DJ Phoenix' THEN ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80']
    WHEN dj_name = 'DJ Neon' THEN ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop&q=80']
    WHEN dj_name = 'DJ Vibe' THEN ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop&q=80', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop&q=80']
    WHEN dj_name = 'DJ Storm' THEN ARRAY['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80']
    WHEN dj_name = 'DJ Luna' THEN ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80']
    ELSE images
  END
WHERE user_id::text LIKE '11111111-%' OR user_id::text LIKE '22222222-%' OR user_id::text LIKE '33333333-%' OR user_id::text LIKE '44444444-%' OR user_id::text LIKE '55555555-%';

-- Verificar resultados
SELECT dj_name, profile_image_url FROM profiles WHERE dj_name LIKE 'DJ %' LIMIT 5;