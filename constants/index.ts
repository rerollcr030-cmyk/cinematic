// Re-export all constants
export { JSON_OUTPUT_SCHEMA } from './schema';

// Import raw text instructions (Vite ?raw import)
import DIRECTOR_SYSTEM_INSTRUCTION from '../instructions/director.txt?raw';
import TIKTOK_SYSTEM_INSTRUCTION from '../instructions/tiktok.txt?raw';
import TIKTOK_SHOP_SYSTEM_INSTRUCTION from '../instructions/tiktokShop.txt?raw';
import VIDEO_REFINEMENT_INSTRUCTION from '../instructions/videoRefinement.txt?raw';
import STUDIO_MODE_GUIDE from '../instructions/studio_mode_guide.txt?raw';
import TRENDING_INTELLIGENCE from '../instructions/trending_intelligence.txt?raw';
import CINEMATIC_FASHION_SCENES from '../instructions/cinematic_fashion_scenes.txt?raw';
import SPORTSWEAR_RULES from '../instructions/sportswear_rules.txt?raw';
import EMOTIONAL_ARC_GUIDE from '../instructions/emotional_arc_guide.txt?raw';

// Export instructions
export {
  DIRECTOR_SYSTEM_INSTRUCTION,
  TIKTOK_SYSTEM_INSTRUCTION,
  TIKTOK_SHOP_SYSTEM_INSTRUCTION,
  VIDEO_REFINEMENT_INSTRUCTION,
  STUDIO_MODE_GUIDE,
  TRENDING_INTELLIGENCE,
  CINEMATIC_FASHION_SCENES,
  SPORTSWEAR_RULES,
  EMOTIONAL_ARC_GUIDE
};

// Export data constants
export {
  INITIAL_BRIEF,
  BODY_TEMPLATES,
  PRODUCT_TYPE_GROUPS,
  PRODUCT_TYPES,
  VIDEO_STYLES,
  LOCATION_REGIONS,
  STUDIO_CATEGORIES
} from './data';

