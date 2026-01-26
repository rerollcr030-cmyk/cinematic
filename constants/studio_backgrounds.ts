// Studio Backgrounds Database - 43 Diverse Setups
// Professional themed studio backgrounds for TikTok affiliate videos

export interface StudioBackground {
    name: string;
    background: string;
    props: string;
    lighting: string;
    floor: string;
    vibe: string;
    bestFor: string;
    isDefault?: boolean;
}

export interface StudioCategory {
    category: string;
    productMatch: string[];
    studios: StudioBackground[];
}

export const STUDIO_BACKGROUNDS: StudioCategory[] = [
    // 1. ÁO DÀI / VIETNAMESE TRADITIONAL (7 styles)
    {
        category: 'aodai',
        productMatch: ['aodai'],
        studios: [
            {
                name: 'Traditional Cultural',
                background: 'Soft ivory-to-warm-beige gradient seamless backdrop',
                props: 'Small ceramic vase with apricot blossoms on wooden pedestal (background), traditional wooden folding screen (1 panel visible), small silk lantern hanging',
                lighting: 'Warm golden hour simulation (2700K-3200K) with soft rim light',
                floor: 'Light polished wooden planks',
                vibe: 'Classic Vietnamese elegant',
                bestFor: 'Traditional áo dài, formal Vietnamese wear',
                isDefault: true
            },
            {
                name: 'Modern Fusion',
                background: 'Pure white seamless with gold geometric accent line',
                props: 'Single orchid in contemporary vase, brass circular mirror frame edge visible',
                lighting: 'Clean white with warm accent lighting',
                floor: 'White marble-look polished',
                vibe: 'Contemporary Vietnamese chic',
                bestFor: 'Modern áo dài, fusion styles'
            },
            {
                name: 'Heritage Minimalist',
                background: 'Soft gray gradient backdrop',
                props: 'Vietnamese calligraphy scroll (background), simple ceramic bowl on pedestal',
                lighting: 'Natural soft diffused daylight',
                floor: 'Stone gray smooth',
                vibe: 'Refined cultural minimal',
                bestFor: 'Minimalist áo dài designs'
            },
            {
                name: 'Festive Tet',
                background: 'Warm red-to-gold gradient (subtle, not overwhelming)',
                props: 'Kumquat tree branch in vase, red envelopes (background), gold accents',
                lighting: 'Warm vibrant golden glow',
                floor: 'Dark polished wood',
                vibe: 'Lunar New Year celebration',
                bestFor: 'Tet/New Year áo dài'
            },
            {
                name: 'Garden Poetry',
                background: 'Soft green-to-cream gradient',
                props: 'Lotus flower in water bowl, bamboo screen texture visible',
                lighting: 'Natural soft daylight',
                floor: 'Light natural wood',
                vibe: 'Vietnamese garden tranquil',
                bestFor: 'Romantic áo dài styles'
            },
            {
                name: 'Royal Palace',
                background: 'Deep burgundy gradient to gold',
                props: 'Ornate gold frame edge, silk cushion corner visible',
                lighting: 'Dramatic warm with rim light',
                floor: 'Dark polished wood',
                vibe: 'Imperial elegant luxe',
                bestFor: 'Luxury áo dài, formal events'
            },
            {
                name: 'Countryside Charm',
                background: 'Warm beige with subtle natural texture',
                props: 'Conical hat (nón lá) on decorative stand, woven basket',
                lighting: 'Warm natural sunlight',
                floor: 'Natural unpolished wood',
                vibe: 'Rural authentic Vietnamese',
                bestFor: 'Casual áo dài, countryside theme'
            }
        ]
    },

    // 2. PROFESSIONAL WEAR (7 styles)
    {
        category: 'professional',
        productMatch: ['suit', 'blouse', 'dress', 'pants'],
        studios: [
            {
                name: 'Corporate Minimal',
                background: 'Light gray gradient to white seamless',
                props: 'Modern desk corner visible, closed notebook and pen, coffee cup (empty)',
                lighting: 'Bright clean daylight simulation (5000K-6000K)',
                floor: 'Polished concrete gray',
                vibe: 'CEO professional aspirational',
                bestFor: 'Office wear, blazers, professional attire',
                isDefault: true
            },
            {
                name: 'Tech Startup',
                background: 'White brick texture (subtle painted)',
                props: 'MacBook edge visible, modern succulent plant, iPhone on desk',
                lighting: 'Bright natural daylight white',
                floor: 'Light wood contemporary',
                vibe: 'Silicon Valley modern innovative',
                bestFor: 'Smart casual, tech professional'
            },
            {
                name: 'Law Firm Classic',
                background: 'Dark wood paneling (partial wall)',
                props: 'Leather-bound books stack, brass desk lamp (off)',
                lighting: 'Warm professional focused',
                floor: 'Dark polished hardwood',
                vibe: 'Traditional authority trust',
                bestFor: 'Formal suits, traditional professional'
            },
            {
                name: 'Creative Agency',
                background: 'Concrete texture with color accent (teal or coral wash)',
                props: 'Design sketches on board, modern abstract art piece',
                lighting: 'Directional bright with colored gel accents',
                floor: 'Industrial concrete polished',
                vibe: 'Creative professional dynamic',
                bestFor: 'Creative industry, fashion-forward professional'
            },
            {
                name: 'Medical Healthcare',
                background: 'Clean white seamless pure',
                props: 'Minimalist extreme - single green plant only',
                lighting: 'Clinical bright even lighting',
                floor: 'White sterile-look smooth',
                vibe: 'Professional trust clean',
                bestFor: 'Healthcare, medical professional wear'
            },
            {
                name: 'Finance Banking',
                background: 'Navy blue gradient to charcoal gray',
                props: 'Modern wall clock, metal geometric accents, structured minimal',
                lighting: 'Cool professional directional',
                floor: 'Black polished marble-look',
                vibe: 'Corporate luxury elite',
                bestFor: 'Finance, banking, executive wear'
            },
            {
                name: 'Architect Studio',
                background: 'White seamless with geometric architectural lines',
                props: 'Architectural scale model, ruler and tools aesthetic display',
                lighting: 'Dramatic shadows creating geometric patterns',
                floor: 'Light concrete smooth',
                vibe: 'Design professional precision',
                bestFor: 'Designer wear, architectural professional'
            }
        ]
    },

    // 3. CASUAL WEAR (7 styles)
    {
        category: 'casual',
        productMatch: ['tshirt', 'jeans', 'shorts', 'casual'],
        studios: [
            {
                name: 'Urban Cool',
                background: 'Light gray seamless with subtle concrete texture',
                props: 'Decorative industrial pipe visible frame edge, small succulent, neon sign outline (off)',
                lighting: 'Natural bright daylight with soft shadows',
                floor: 'Concrete-look or white smooth',
                vibe: 'Instagram street style urban',
                bestFor: 'Streetwear, casual urban styles',
                isDefault: true
            },
            {
                name: 'Scandinavian Minimal',
                background: 'Pure white seamless clean',
                props: 'Hanging plants (background), simple wooden stool corner',
                lighting: 'Bright airy soft natural',
                floor: 'White wood planks',
                vibe: 'Nordic clean fresh',
                bestFor: 'Minimalist casual, basics'
            },
            {
                name: 'Vintage Retro',
                background: 'Warm mustard or burnt orange gradient',
                props: 'Vintage radio, retro poster frame, vinyl record display',
                lighting: 'Warm nostalgic glow',
                floor: 'Checkered tile pattern vintage',
                vibe: '70s throwback nostalgic',
                bestFor: 'Vintage styles, retro casual'
            },
            {
                name: 'Bohemian Free',
                background: 'Cream seamless with macramé wall hanging',
                props: 'Woven baskets, dried flowers arrangement, dreamcatcher',
                lighting: 'Warm soft golden natural',
                floor: 'Natural jute or rattan look',
                vibe: 'Boho chic relaxed free-spirit',
                bestFor: 'Boho styles, free-spirited casual'
            },
            {
                name: 'Industrial Loft',
                background: 'Exposed brick texture (printed backdrop)',
                props: 'Metal shelving unit edge, Edison bulb hanging, concrete block',
                lighting: 'Edison bulb warm glow',
                floor: 'Raw concrete industrial',
                vibe: 'Urban loft living edgy',
                bestFor: 'Edgy casual, urban loft style'
            },
            {
                name: 'Coastal Beach',
                background: 'Sandy beige to sky blue gradient',
                props: 'Seashells display, driftwood piece, white coral',
                lighting: 'Bright sunny beach simulation',
                floor: 'White sand-look textured',
                vibe: 'Beachy relaxed vacation',
                bestFor: 'Beach casual, summer styles'
            },
            {
                name: 'Coffee Shop',
                background: 'Warm brown wood texture wall',
                props: 'Coffee cup, pastry on plate, open book, potted plant',
                lighting: 'Warm cozy cafe ambiance',
                floor: 'Wood planks cafe-style',
                vibe: 'Cafe casual lifestyle',
                bestFor: 'Lifestyle casual, coffee culture'
            }
        ]
    },

    // 4. EVENING / COCKTAIL (6 styles)
    {
        category: 'evening',
        productMatch: ['dress', 'maxi_dress', 'bodycon', 'mini_dress'],
        studios: [
            {
                name: 'Glamorous Bokeh',
                background: 'Dark charcoal gradient with gold bokeh lights (string lights out of focus)',
                props: 'Empty champagne flute on small table, velvet chair corner (burgundy), pearl strand draped',
                lighting: 'Dramatic warm gold key light with rim lighting',
                floor: 'Black reflective polished',
                vibe: 'Luxury gala upscale event',
                bestFor: 'Evening gowns, cocktail dresses',
                isDefault: true
            },
            {
                name: 'Art Deco Glam',
                background: 'Black seamless with gold geometric art deco pattern',
                props: 'Gold ornate mirror frame edge, crystal vase, art deco accents',
                lighting: 'Theatrical spotlight dramatic',
                floor: 'Black marble polished',
                vibe: '1920s Gatsby glamorous',
                bestFor: 'Vintage evening wear, gatsby style'
            },
            {
                name: 'Modern Elegance',
                background: 'Champagne gold gradient to cream',
                props: 'Crystal vase with single rose, elegant mirror frame edge',
                lighting: 'Soft warm golden glow',
                floor: 'Cream marble-look',
                vibe: 'Contemporary sophistication',
                bestFor: 'Modern evening dresses, elegant'
            },
            {
                name: 'Red Carpet',
                background: 'Deep burgundy velvet texture backdrop',
                props: 'Gold rope barrier edge visible, spotlight beam',
                lighting: 'Hollywood spotlight bright',
                floor: 'Red carpet textured',
                vibe: 'Celebrity premiere paparazzi',
                bestFor: 'Red carpet styles, celebrity looks'
            },
            {
                name: 'Garden Party',
                background: 'Soft twilight purple-blue gradient',
                props: 'Fairy lights string, fresh flowers arrangement, elegant arch edge',
                lighting: 'Twilight romantic soft',
                floor: 'Stone pathway textured',
                vibe: 'Outdoor elegant evening garden',
                bestFor: 'Garden party dresses, romantic evening'
            },
            {
                name: 'Ballroom Classic',
                background: 'Cream seamless with chandelier reflection glow',
                props: 'Ornate chair corner, candelabra (unlit), flower arrangement',
                lighting: 'Soft romantic chandelier glow simulation',
                floor: 'Polished ballroom wood',
                vibe: 'Formal dance ballroom elegant',
                bestFor: 'Ballroom gowns, formal evening'
            }
        ]
    },

    // 5. SPORTSWEAR / ATHLEISURE (6 styles)
    {
        category: 'sportswear',
        productMatch: ['sport'],
        studios: [
            {
                name: 'Clean Active',
                background: 'Pure white seamless clean',
                props: 'Rolled yoga mat standing (background), small snake plant',
                lighting: 'Bright energetic daylight (5500K)',
                floor: 'White or light gray smooth',
                vibe: 'Fresh healthy active lifestyle',
                bestFor: 'Athletic wear, yoga wear, general sportswear',
                isDefault: true
            },
            {
                name: 'Gym Minimal',
                background: 'Light gray seamless',
                props: 'Single dumbbell (decorative background), geometric wall art minimal',
                lighting: 'Bright with slight contrast',
                floor: 'Gray rubber-look textured',
                vibe: 'Athletic performance focused',
                bestFor: 'Gym wear, training clothes'
            },
            {
                name: 'Yoga Studio',
                background: 'Soft lavender gradient calming',
                props: 'Meditation cushion, singing bowl, unlit candle',
                lighting: 'Calm soft diffused natural',
                floor: 'Light wood smooth',
                vibe: 'Zen mindful peaceful',
                bestFor: 'Yoga wear, mindfulness athletic'
            },
            {
                name: 'Outdoor Active',
                background: 'Sky blue to white gradient bright',
                props: 'Bike wheel edge visible, greenery plant, water bottle',
                lighting: 'Bright sunny outdoor light simulation',
                floor: 'Concrete outdoor textured',
                vibe: 'Adventure active outdoor',
                bestFor: 'Outdoor sports, cycling, running wear'
            },
            {
                name: 'Dance Studio',
                background: 'White with mirror edge barely visible',
                props: 'Dance barre visible, portable speaker',
                lighting: 'Bright studio even',
                floor: 'Light wood sprung floor look',
                vibe: 'Dance fitness energetic',
                bestFor: 'Dance wear, fitness classes'
            },
            {
                name: 'Sports Brand',
                background: 'Bold color block (orange or teal) with geometric shapes',
                props: 'Minimal props, brand-focus clean aesthetic',
                lighting: 'Dynamic directional creating shadows',
                floor: 'Matching brand color accent',
                vibe: 'Athletic brand campaign bold',
                bestFor: 'Brand sportswear, athletic marketing'
            }
        ]
    },

    // 6. SLEEPWEAR / LOUNGEWEAR (5 styles)
    {
        category: 'sleepwear',
        productMatch: ['sleepwear'],
        studios: [
            {
                name: 'Cozy Minimal',
                background: 'Warm cream to soft peach gradient',
                props: 'Soft throw blanket draped on stool, unlit candle, book stack',
                lighting: 'Warm soft ambient (2700K-3000K)',
                floor: 'Warm natural wood',
                vibe: 'Inviting comfortable cozy',
                bestFor: 'Sleepwear, loungewear, robes',
                isDefault: true
            },
            {
                name: 'Luxury Hotel',
                background: 'White linen texture backdrop',
                props: 'Plush pillows stack, breakfast tray aesthetic',
                lighting: 'Soft morning light warm',
                floor: 'Beige carpet textured',
                vibe: '5-star hotel suite luxury',
                bestFor: 'Luxury sleepwear, silk robes'
            },
            {
                name: 'Spa Retreat',
                background: 'Soft sage green calming',
                props: 'Eucalyptus stems, rolled towels, aromatherapy candles (unlit)',
                lighting: 'Soft zen ambient peaceful',
                floor: 'Bamboo-look natural',
                vibe: 'Wellness calm spa',
                bestFor: 'Spa robes, wellness loungewear'
            },
            {
                name: 'Reading Nook',
                background: 'Warm library brown wood texture',
                props: 'Stacked vintage books, reading lamp (off), tea cup',
                lighting: 'Warm cozy reading light',
                floor: 'Warm carpet comfortable',
                vibe: 'Literary cozy bookish',
                bestFor: 'Comfortable loungewear, reading robes'
            },
            {
                name: 'Scandinavian Hygge',
                background: 'Off-white warm seamless',
                props: 'Chunky knit blanket, multiple candles (unlit), minimal Nordic',
                lighting: 'Soft warm candlelight glow',
                floor: 'Light natural wood',
                vibe: 'Nordic hygge comfort',
                bestFor: 'Cozy loungewear, hygge style'
            }
        ]
    },

    // 7. ACCESSORIES (5 styles)
    {
        category: 'accessories',
        productMatch: ['handbag', 'jewelry', 'shoes', 'sunglasses'],
        studios: [
            {
                name: 'Product Showcase',
                background: 'Pure white or light gray seamless',
                props: 'Minimalist display pedestal (white/marble-look), single decorative leaf',
                lighting: 'Clean bright with fill to eliminate harsh shadows',
                floor: 'White reflective smooth',
                vibe: 'High-end product photography',
                bestFor: 'All accessories, product focus',
                isDefault: true
            },
            {
                name: 'Luxury Boutique',
                background: 'Cream seamless with subtle gold accents',
                props: 'Velvet display cushion, ornate mirror frame edge',
                lighting: 'Warm elegant soft',
                floor: 'Cream marble polished',
                vibe: 'Designer boutique exclusive',
                bestFor: 'Luxury accessories, designer items'
            },
            {
                name: 'Modern Geometric',
                background: 'White with geometric shapes pattern',
                props: 'Acrylic display stands minimal, geometric accent',
                lighting: 'Directional creating clean shadows',
                floor: 'White clean smooth',
                vibe: 'Contemporary art gallery modern',
                bestFor: 'Modern accessories, contemporary'
            },
            {
                name: 'Vintage Display',
                background: 'Warm wood texture natural',
                props: 'Vintage tray, lace doily, antique jewelry box',
                lighting: 'Warm nostalgic soft glow',
                floor: 'Vintage wood aged',
                vibe: 'Antique charm vintage',
                bestFor: 'Vintage accessories, retro items'
            },
            {
                name: 'Editorial Magazine',
                background: 'Bold color block (pink, blue, or yellow solid)',
                props: 'Fashion magazine, minimal modern clean',
                lighting: 'Fashion editorial bright directional',
                floor: 'Matching color floor',
                vibe: 'Fashion magazine spread editorial',
                bestFor: 'Fashion-forward accessories, editorial'
            }
        ]
    }
];

// Helper function to get studio by category
export function getStudiosByCategory(category: string): StudioBackground[] {
    const found = STUDIO_BACKGROUNDS.find(cat => cat.category === category);
    return found ? found.studios : [];
}

// Helper function to get default studio for category
export function getDefaultStudio(category: string): StudioBackground | null {
    const studios = getStudiosByCategory(category);
    return studios.find(s => s.isDefault) || studios[0] || null;
}

// Helper function to match product type to category
export function matchProductToStudioCategory(productType: string): string {
    for (const cat of STUDIO_BACKGROUNDS) {
        if (cat.productMatch.includes(productType)) {
            return cat.category;
        }
    }
    // Default fallbacks
    if (['dress', 'maxi_dress', 'mini_dress', 'bodycon'].includes(productType)) return 'evening';
    if (['suit', 'blouse'].includes(productType)) return 'professional';
    if (['tshirt', 'jeans', 'shorts'].includes(productType)) return 'casual';
    if (['sport'].includes(productType)) return 'sportswear';
    return 'casual'; // Ultimate default
}
