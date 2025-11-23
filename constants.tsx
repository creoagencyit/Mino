
import { TextureOption, ColorOption } from './types';
import { Sparkles, Layers, Component, Palette, Box, VenetianMask, Zap, Brush, Grid, Rocket, Wand2, Baby, Pencil } from 'lucide-react';
import React from 'react';

export const TEXTURES: TextureOption[] = [
  // Kids / Nursery Themes
  {
    id: 'kids-fairy',
    name: 'Fiaba Incantata',
    description: 'Foresta magica, acquerello e colori pastello.',
    promptMod: 'magical fairy tale forest pattern, soft watercolor illustration style, cute woodland animals, mushrooms, pastel pink and green colors, nursery decor'
  },
  {
    id: 'kids-space',
    name: 'Esploratore Spaziale',
    description: 'Razzi, pianeti e stelle su sfondo blu notte.',
    promptMod: 'cute outer space cartoon pattern, rockets, planets and stars, deep blue background, vector art style for kids room'
  },
  {
    id: 'kids-doodle',
    name: 'Piccoli Artisti',
    description: 'Disegni a pastello colorati su sfondo bianco.',
    promptMod: 'playful hand-drawn crayon doodle pattern on white paper texture, colorful scribbles, child drawing style, happy vibe'
  },
  {
    id: 'kids-dinos',
    name: 'Dino Park',
    description: 'Dinosauri simpatici e natura stilizzata.',
    promptMod: 'cute dinosaur pattern, cartoon style, stylized plants, green and orange tones, fun wallpaper design'
  },

  // Artistic / Graphic Patterns
  {
    id: 'art-giotto',
    name: 'Stile Giotto',
    description: 'Affresco medievale, blu lapislazzuli e oro.',
    promptMod: 'printed graphic design of a Giotto di Bondone fresco painting, deep lapis lazuli blue sky, gold halos, medieval italian art style, pictorial finish'
  },
  {
    id: 'art-majolica',
    name: 'Maiolica Siciliana',
    description: 'Ceramica decorata con motivi gialli e blu.',
    promptMod: 'traditional sicilian majolica ceramic tile pattern, lemon yellow and cobalt blue geometric floral design'
  },
  
  // Standard Materials
  {
    id: 'cover-matte-pvc',
    name: 'Opaco Soft Touch',
    description: 'Finitura moderna liscia e non riflettente.',
    promptMod: 'smooth soft-touch matte PVC finish, solid color'
  },
  {
    id: 'cover-wood-texture',
    name: 'Effetto Legno Scuro',
    description: 'Texture realistica rovere scuro.',
    promptMod: 'realistic dark oak wood grain texture'
  },
  {
    id: 'cover-light-wood',
    name: 'Legno Chiaro',
    description: 'Essenza naturale luminosa (Pino/Frassino).',
    promptMod: 'realistic light pine or ash wood grain texture, bright natural finish'
  },
  {
    id: 'cover-brushed-metal',
    name: 'Metallo Spazzolato',
    description: 'Look metallico in alluminio o acciaio.',
    promptMod: 'brushed aluminum metallic texture'
  },
  {
    id: 'cover-carbon',
    name: 'Fibra di Carbonio',
    description: 'Look tecnico e industriale.',
    promptMod: 'carbon fiber pattern'
  }
];

export const COLORS: ColorOption[] = [
  // Neutrals
  { id: 'pure-white', name: 'Bianco Puro', hex: '#FFFFFF' },
  { id: 'cream', name: 'Crema', hex: '#F5F5DC' },
  { id: 'pearl-grey', name: 'Grigio Perla', hex: '#e5e7eb' },
  { id: 'anthracite', name: 'Antracite', hex: '#383e42' },
  { id: 'jet-black', name: 'Nero Assoluto', hex: '#1a1a1a' },

  // Classics
  { id: 'ruby-red', name: 'Rosso Rubino', hex: '#9b111e' },
  { id: 'moss-green', name: 'Verde Muschio', hex: '#2F4538' },
  { id: 'navy-blue', name: 'Blu Notte', hex: '#191970' },
  { id: 'chocolate', name: 'Cioccolato', hex: '#3e2723' },

  // Vivid / Pastel
  { id: 'baby-blue', name: 'Azzurro Cielo', hex: '#89CFF0' },
  { id: 'baby-pink', name: 'Rosa Confetto', hex: '#FFB7C5' },
  { id: 'mint', name: 'Verde Menta', hex: '#98FF98' },
  { id: 'lavender', name: 'Lavanda', hex: '#E6E6FA' },
  { id: 'sun-yellow', name: 'Giallo Sole', hex: '#FDB813' },
  { id: 'purple', name: 'Viola', hex: '#800080' },

  // Wood / Metals
  { id: 'golden-oak', name: 'Rovere Dorato', hex: '#b58c56' },
  { id: 'walnut', name: 'Noce Scuro', hex: '#5d4037' },
  { id: 'mahogany', name: 'Mogano', hex: '#6d2a25' },
  { id: 'silver', name: 'Argento', hex: '#C0C0C0' },
  { id: 'bronze', name: 'Bronzo', hex: '#cd7f32' },
  { id: 'gold', name: 'Oro', hex: '#D4AF37' },
];

export const TEXTURE_ICONS: Record<string, React.ReactNode> = {
  'kids-fairy': <Wand2 className="w-5 h-5 text-pink-500" />,
  'kids-space': <Rocket className="w-5 h-5 text-indigo-500" />,
  'kids-doodle': <Pencil className="w-5 h-5 text-orange-500" />,
  'kids-dinos': <Baby className="w-5 h-5 text-green-600" />,
  'art-giotto': <Brush className="w-5 h-5 text-indigo-600" />,
  'art-majolica': <Grid className="w-5 h-5 text-yellow-600" />,
  'art-mosaic': <Component className="w-5 h-5 text-amber-600" />,
  'cover-matte-pvc': <Box className="w-5 h-5" />,
  'cover-gloss-pvc': <Sparkles className="w-5 h-5" />,
  'cover-wood-texture': <Component className="w-5 h-5" />,
  'cover-light-wood': <Component className="w-5 h-5 text-amber-400" />,
  'cover-brushed-metal': <Zap className="w-5 h-5" />,
  'cover-fabric-pattern': <Layers className="w-5 h-5" />,
  'cover-leather': <VenetianMask className="w-5 h-5" />,
  'cover-carbon': <Palette className="w-5 h-5" />
};
