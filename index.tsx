import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Upload, Image as ImageIcon, Sparkles, Film, ArrowRight, Wand2, RefreshCcw, Download, X, Ruler, Clock, Camera, Aperture, Lightbulb, ChevronRight, ChevronDown, FileText, Video, BrainCircuit, Copy, Check, Layers, Clapperboard, RotateCcw, Music, History, Trash2, ShoppingBag, MapPin } from 'lucide-react';

// --- Import all constants from modular files ---
import {
   JSON_OUTPUT_SCHEMA,
   DIRECTOR_SYSTEM_INSTRUCTION,
   TIKTOK_SYSTEM_INSTRUCTION,
   TIKTOK_SHOP_SYSTEM_INSTRUCTION,
   VIDEO_REFINEMENT_INSTRUCTION,
   STUDIO_MODE_GUIDE,
   TRENDING_INTELLIGENCE,
   CINEMATIC_FASHION_SCENES,
   SPORTSWEAR_RULES,
   EMOTIONAL_ARC_GUIDE,
   INITIAL_BRIEF,
   BODY_TEMPLATES,
   PRODUCT_TYPE_GROUPS,
   PRODUCT_TYPES,
   VIDEO_STYLES,
   LOCATION_REGIONS,
   STUDIO_CATEGORIES
} from './constants';

// --- Components ---

const CopyButton = ({ text }: { text: string }) => {
   const [copied, setCopied] = useState(false);

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(text);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error('Failed to copy', err);
      }
   };

   return (
      <button
         onClick={handleCopy}
         className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all border z-20
        ${copied
               ? 'bg-green-500/20 border-green-500/50 text-green-400'
               : 'bg-zinc-800/80 border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
         title="Copy to clipboard"
      >
         {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
   );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
   <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all
      ${active
            ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
   >
      <Icon className="w-3 h-3" />
      {label}
   </button>
);

const App = () => {
   // State
   const [step, setStep] = useState<'input' | 'director'>('input');
   const [appMode, setAppMode] = useState<'cinematic' | 'tiktok' | 'tiktok_shop'>('cinematic');
   const [activeTab, setActiveTab] = useState<'master' | 'keyframes' | 'scenes' | 'refined' | 'production'>('master');

   const [faceImage, setFaceImage] = useState<string | null>(null);
   const [outfitImage, setOutfitImage] = useState<string | null>(null);

   // Body Configuration
   const [gender, setGender] = useState('Female');
   const [bodyMode, setBodyMode] = useState<'preset' | 'custom'>('preset');
   const [bodyType, setBodyType] = useState('Balanced');
   const [measurements, setMeasurements] = useState({
      height: '175',
      weight: '55',
      bust: '86',
      waist: '60',
      hips: '90',
      size: 'M'
   });

   // Product type for TikTok Shop (default to auto-detect)
   const [productType, setProductType] = useState<string>('auto');

   // Video style for TikTok Shop (including Beauty & Personal Care styles + Mirror OOTD + Handheld Voice + Viral Trending 2025-2026 + Áo Dài)
   const [videoStyle, setVideoStyle] = useState<'body_real' | 'before_after' | 'before_after_fashion_show' | 'ao_dai_traditional' | 'ao_dai_transition' | 'ao_dai_catwalk' | 'ao_dai_modern' | 'fabric_focus' | 'sleepwear_cozy' | 'editorial_inner' | 'flatlay_inner' | 'handheld_inner' | 'handheld_voice' | 'mannequin_inner' | 'asmr_fabric' | 'floor_display' | 'beauty_demo' | 'device_review' | 'body_shaper_demo' | 'skincare_routine' | 'makeup_tutorial' | 'mirror_ootd' | 'ootd_novoice' | 'grwm' | 'outfit_change_viral' | 'ootd_grwm' | 'try_on_haul' | 'personal_branding' | 'fit_check' | 'style_challenge' | 'unbox_demo' | 'problem_solution' | 'feature_showcase' | 'before_after_home' | 'day_in_life' | 'comparison_test' | 'installation_guide' | 'smart_home_tour'>('body_real');

   // Product Details for TikTok Shop (user input)
   const [fabricMaterial, setFabricMaterial] = useState<string>('');
   const [productHighlights, setProductHighlights] = useState<string>('');
   const [availableSizes, setAvailableSizes] = useState<string>('S-XXL');

   // Additional Description - User custom notes
   const [additionalDescription, setAdditionalDescription] = useState<string>('');

   // Video Config only (Cine is auto)
   const [videoDuration, setVideoDuration] = useState<string>('24');

   const [brief, setBrief] = useState(INITIAL_BRIEF);

   // Location Region preference
   const [locationRegion, setLocationRegion] = useState<string>('auto');

   // Studio Mode - Professional themed studio backgrounds for TikTok affiliate
   const [studioMode, setStudioMode] = useState<boolean>(false);

   // Editorial Mode (18+) - foundation-free silhouette
   const [editorialMode, setEditorialMode] = useState<boolean>(false);

   // Wallpaper Mode - phone wallpaper friendly composition
   const [wallpaperMode, setWallpaperMode] = useState<boolean>(false);

   // Lookbook Mode - 10 images only, no video
   const [lookbookMode, setLookbookMode] = useState<boolean>(false);

   // Seductive Mode - TikTok safe alluring style
   const [seductiveMode, setSeductiveMode] = useState<boolean>(false);

   // Sexy Mode - Private mode for Nano Banana Pro & Veo 3.1
   const [sexyMode, setSexyMode] = useState<boolean>(false);

   // Auto-disable Seductive when Sexy Mode is ON (vocabulary conflict)
   React.useEffect(() => {
      if (sexyMode && seductiveMode) {
         setSeductiveMode(false);
      }
   }, [sexyMode]);

   // Aspect Ratio - 9:16 (vertical) or 16:9 (horizontal)
   const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');

   // API Key - Gemini API key with localStorage persistence
   const [apiKey, setApiKey] = useState<string>(() => {
      if (typeof window !== 'undefined') {
         return localStorage.getItem('gemini_api_key') || 'AIzaSyAuU0dc583Vhq-6eEiEdNyvSb_n0_P0kvo';
      }
      return 'AIzaSyAuU0dc583Vhq-6eEiEdNyvSb_n0_P0kvo';
   });
   const [showApiKey, setShowApiKey] = useState(false);

   // Gemini Model Selection - with localStorage persistence
   const [geminiModel, setGeminiModel] = useState<'gemini-2.5-flash' | 'gemini-3-flash-preview'>(() => {
      if (typeof window !== 'undefined') {
         const saved = localStorage.getItem('gemini_model');
         return (saved === 'gemini-3-flash-preview' ? 'gemini-3-flash-preview' : 'gemini-2.5-flash') as 'gemini-2.5-flash' | 'gemini-3-flash-preview';
      }
      return 'gemini-2.5-flash';
   });

   // Persist API Key
   useEffect(() => {
      if (apiKey) {
         localStorage.setItem('gemini_api_key', apiKey);
      }
   }, [apiKey]);

   // Persist Gemini Model
   useEffect(() => {
      localStorage.setItem('gemini_model', geminiModel);
   }, [geminiModel]);

   // Auto-select Video Style based on Product Type
   React.useEffect(() => {
      // TikTok Shop Mode - Auto select video style
      if (appMode === 'tiktok_shop') {
         // Áo Dài → Auto select ao_dai_traditional
         if (productType === 'aodai') {
            setVideoStyle('ao_dai_traditional');
         }
         // Nội y/Bikini → Auto select safe styles
         else if (productType === 'lingerie' || productType === 'bikini') {
            setVideoStyle('editorial_inner');
         }
         // Đồ ngủ → Auto select sleepwear_cozy
         else if (productType === 'sleepwear') {
            setVideoStyle('sleepwear_cozy');
         }
         // Gen nịt → Auto select body_shaper_demo
         else if (productType === 'body_shaper') {
            setVideoStyle('body_shaper_demo');
         }
         // Beauty products → Auto select beauty styles
         else if (['skincare', 'makeup', 'hair_care'].includes(productType)) {
            setVideoStyle('beauty_demo');
         }
         // Smart home devices → Auto select unbox_demo
         else if (['smart_device', 'cleaning', 'kitchen', 'home_decor', 'storage'].includes(productType)) {
            setVideoStyle('unbox_demo');
         }
      }

      // Cinematic Mode - Auto select location region for Áo Dài
      if (appMode === 'cinematic') {
         // Áo Dài → Auto select for_aodai location region
         if (productType === 'aodai') {
            setLocationRegion('for_aodai');
         }
      }
   }, [productType, appMode]);

   // Location Vault State - now stores detailed location history
   const [locationVault, setLocationVault] = useState<{
      id: string;
      location: string;
      region: string;
      timestamp: number;
      productType?: string;
   }[]>(() => {
      if (typeof window !== 'undefined') {
         try {
            const saved = localStorage.getItem('cinematic_location_vault_v2');
            return saved ? JSON.parse(saved) : [];
         } catch (e) {
            return [];
         }
      }
      return [];
   });

   // Script Vault State - stores script hooks to avoid repetition
   const [scriptVault, setScriptVault] = useState<{
      id: string;
      hook: string; // Scene 1 script (the unique opener)
      productType: string;
      timestamp: number;
   }[]>(() => {
      if (typeof window !== 'undefined') {
         try {
            const saved = localStorage.getItem('tiktok_script_vault');
            return saved ? JSON.parse(saved) : [];
         } catch (e) {
            return [];
         }
      }
      return [];
   });

   // Persist Location Vault
   useEffect(() => {
      localStorage.setItem('cinematic_location_vault_v2', JSON.stringify(locationVault));
   }, [locationVault]);

   // Persist Script Vault
   useEffect(() => {
      localStorage.setItem('tiktok_script_vault', JSON.stringify(scriptVault));
   }, [scriptVault]);

   // Add script hook to vault
   const addToScriptVault = (hook: string, productType: string) => {
      const newEntry = {
         id: Date.now().toString(),
         hook: hook.trim(),
         productType,
         timestamp: Date.now()
      };
      setScriptVault(prev => [newEntry, ...prev].slice(0, 30)); // Keep last 30 hooks
   };

   // Clear script vault
   const clearScriptVault = () => {
      if (confirm("Xóa lịch sử script? AI có thể tạo script tương tự.")) {
         setScriptVault([]);
         localStorage.removeItem('tiktok_script_vault');
      }
   };

   // Get script hooks blocklist
   const getScriptBlocklist = () => {
      return scriptVault.map(item => item.hook);
   };

   // Studio Category preference (for Studio Mode)
   const [studioCategory, setStudioCategory] = useState<string>('auto');

   // Studio Vault State - stores used studios to avoid repetition
   const [studioVault, setStudioVault] = useState<{
      id: string;
      studio: string;
      category: string;
      timestamp: number;
      productType?: string;
   }[]>(() => {
      if (typeof window !== 'undefined') {
         try {
            const saved = localStorage.getItem('studio_vault');
            return saved ? JSON.parse(saved) : [];
         } catch (e) {
            return [];
         }
      }
      return [];
   });

   // Persist Studio Vault
   useEffect(() => {
      localStorage.setItem('studio_vault', JSON.stringify(studioVault));
   }, [studioVault]);

   // Add studio to vault
   const addToStudioVault = (studio: string, category: string, productType?: string) => {
      const newEntry = {
         id: Date.now().toString(),
         studio: studio.trim().slice(0, 100), // Store only first 100 chars for comparison
         category,
         timestamp: Date.now(),
         productType
      };
      setStudioVault(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
   };

   // Get studio blocklist
   const getStudioBlocklist = () => {
      return studioVault.map(item => item.studio);
   };

   // Get random studios from category (excluding used ones)
   const getRandomStudios = (category: string, count: number = 5) => {
      const usedStudios = getStudioBlocklist();

      if (category === 'auto') {
         // Collect studios from all categories
         const allStudios: string[] = [];
         STUDIO_CATEGORIES.forEach(cat => {
            if (cat.value !== 'auto' && cat.studios) {
               allStudios.push(...cat.studios);
            }
         });

         // Filter used studios
         const available = allStudios.filter(studio => {
            const studioShort = studio.split(' | ')[0].toLowerCase();
            return !usedStudios.some(used =>
               used.toLowerCase().includes(studioShort) ||
               studioShort.includes(used.toLowerCase().slice(0, 30))
            );
         });

         // Fisher-Yates shuffle
         const shuffled = [...available];
         for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
         }
         return shuffled.slice(0, count);
      }

      // For specific category
      const categoryData = STUDIO_CATEGORIES.find(c => c.value === category);
      if (!categoryData || !categoryData.studios) return [];

      const available = categoryData.studios.filter(studio => {
         const studioShort = studio.split(' | ')[0].toLowerCase();
         return !usedStudios.some(used =>
            used.toLowerCase().includes(studioShort) ||
            studioShort.includes(used.toLowerCase().slice(0, 30))
         );
      });

      // Fisher-Yates shuffle
      const shuffled = [...available];
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
   };

   // Clear studio vault
   const clearStudioVault = () => {
      if (confirm("Xóa lịch sử studio? AI có thể tái sử dụng các studio cũ.")) {
         setStudioVault([]);
         localStorage.removeItem('studio_vault');
      }
   };

   // Add new location to vault
   const addToLocationVault = (location: string, region: string, productType?: string) => {
      const newEntry = {
         id: Date.now().toString(),
         location: location.trim(),
         region,
         timestamp: Date.now(),
         productType
      };
      setLocationVault(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
   };

   // Remove specific location from vault
   const removeFromVault = (id: string) => {
      setLocationVault(prev => prev.filter(item => item.id !== id));
   };

   const clearLocationVault = () => {
      if (confirm("Xóa toàn bộ lịch sử bối cảnh? AI có thể tái sử dụng các bối cảnh cũ.")) {
         setLocationVault([]);
         localStorage.removeItem('cinematic_location_vault_v2');
      }
   };

   // Get unique locations as blocklist
   const getLocationBlocklist = () => {
      return locationVault.map(item => item.location);
   };

   // Get suggested locations based on region (excluding used ones) - RANDOM selection
   const getSuggestedLocations = (region: string, count: number = 10) => {
      const regionData = LOCATION_REGIONS.find(r => r.value === region);
      if (!regionData || region === 'auto') return [];

      const usedLocations = getLocationBlocklist();
      const availableLocations = regionData.locations.filter(loc =>
         !usedLocations.some(used =>
            used.toLowerCase().includes(loc.toLowerCase().slice(0, 20)) ||
            loc.toLowerCase().includes(used.toLowerCase().slice(0, 20))
         )
      );

      // Shuffle array randomly using Fisher-Yates algorithm
      const shuffled = [...availableLocations];
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled.slice(0, count);
   };

   // Get random locations from multiple regions for AI Auto mode
   const getRandomLocationsForAuto = (count: number = 5) => {
      const allLocations: string[] = [];
      const usedLocations = getLocationBlocklist();

      // Collect all locations from all regions
      LOCATION_REGIONS.forEach(region => {
         if (region.value !== 'auto' && region.locations) {
            const available = region.locations.filter(loc =>
               !usedLocations.some(used =>
                  used.toLowerCase().includes(loc.toLowerCase().slice(0, 20)) ||
                  loc.toLowerCase().includes(used.toLowerCase().slice(0, 20))
               )
            );
            allLocations.push(...available);
         }
      });

      // Shuffle and return random selection
      const shuffled = [...allLocations];
      for (let i = shuffled.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled.slice(0, count);
   };

   // Processing State
   const [directorThinking, setDirectorThinking] = useState(false);
   const [videoRefining, setVideoRefining] = useState(false);
   const [directorOutput, setDirectorOutput] = useState<{
      fullText: string;
      sections: {
         master: string;
         keyframes: string;
         scenes: string;
         production: string;
         metadata: string;
         refinedScenes?: string;
      };
      jsonData?: any;
   } | null>(null);

   const fileInputFaceRef = useRef<HTMLInputElement>(null);
   const fileInputOutfitRef = useRef<HTMLInputElement>(null);

   // --- Handlers ---

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setter(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const applyTemplate = (template: typeof BODY_TEMPLATES[0]) => {
      setGender(template.gender);
      setBodyMode(template.mode);
      setBodyType(template.bodyType);
      setMeasurements(template.measurements);
   };

   const parseDirectorOutput = (text: string) => {
      // ================================================
      // TRY JSON FORMAT FIRST (Nano Banana Pro / Veo 3.1 optimized)
      // ================================================
      try {
         // Extract JSON from response (may be wrapped in ```json ... ```)
         let jsonText = text;
         const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
         if (jsonMatch) {
            jsonText = jsonMatch[1];
         } else {
            // Try to find raw JSON object
            const rawJsonMatch = text.match(/\{[\s\S]*"masterPrompt"[\s\S]*\}/);
            if (rawJsonMatch) {
               jsonText = rawJsonMatch[0];
            }
         }

         const jsonData = JSON.parse(jsonText);

         // Support both video mode (keyframes) and lookbook mode (images only)
         if (jsonData.masterPrompt && (jsonData.keyframes || jsonData.images)) {
            // Successfully parsed JSON - convert to display format

            // Build Master Prompt string from JSON
            const mp = jsonData.masterPrompt;
            const masterContent = [
               // CRITICAL: Face preservation MUST be first
               mp.facePreservation || "Exact facial features of the reference image, mirroring the subject's unique facial structure, eye shape, nose bridge, lip contour, and skin tone with photorealistic fidelity",
               mp.subject,
               mp.outfit,
               mp.pose,
               `Shot on location at ${mp.environment}`,
               mp.lighting,
               mp.camera,
               mp.style
            ].filter(Boolean).join('. ');

            // Build Keyframes string from JSON array (support both 'keyframes' and 'images')
            const keyframesArray = jsonData.keyframes || jsonData.images || [];
            const keyframesContent = keyframesArray.map((kf: any, index: number) => {
               // Defensive: handle missing fields gracefully
               const id = kf.id || (index + 1);
               const timestamp = kf.timestamp || `${index * 8}s`;

               // PRIORITY 1: Check if AI returned full prompt in single field (most common)
               const fullPrompt = kf.imagePrompt || kf.prompt || kf.description;
               if (fullPrompt) {
                  return `Image ${id} (${timestamp}): ${fullPrompt}`;
               }

               // PRIORITY 2: Try structured fields
               const subject = kf.subject || '';
               const action = kf.action || '';
               const environment = kf.environment || '';
               const lighting = kf.lighting || '';
               const camera = kf.camera || '';
               const style = kf.style || '';

               // Build prompt with only available fields
               const parts = [subject, action].filter(Boolean);
               const details = [environment, lighting, camera, style].filter(Boolean);

               // PRIORITY 3: Fallback if no data
               if (parts.length === 0 && details.length === 0) {
                  return `Image ${id} (${timestamp}): [Data missing - check Full Output]`;
               }

               return `Image ${id} (${timestamp}): ${parts.join(', ')}${details.length > 0 ? '. ' + details.join('. ') : ''}`;
            }).join('\n\n');

            // Build Scenes string from JSON array
            const scenesContent = jsonData.scenes ? jsonData.scenes.map((sc: any) => {
               let sceneText = `Scene ${sc.id} (${sc.timeRange}): ${sc.shotType}. ${sc.subjectMotion}. Camera: ${sc.cameraMotion}. Atmosphere: ${sc.atmosphere}. START_POSE: ${sc.startPose}. END_POSE: ${sc.endPose}.`;
               if (sc.script) {
                  sceneText += `\nSCRIPT: "${sc.script}"`;
               }
               if (sc.voiceConfig) {
                  // Support both old format (voice, accent, speed, pitch) and new format (voice_profile, vocal_tone, sync)
                  if (sc.voiceConfig.voice_profile) {
                     // New Veo 3.1 optimized format
                     sceneText += `\nVOICE: ${sc.voiceConfig.voice_profile} | Tone: ${sc.voiceConfig.vocal_tone} | Sync: ${sc.voiceConfig.sync}`;
                  } else if (sc.voiceConfig.voice) {
                     // Legacy format fallback
                     sceneText += `\nVOICE: ${sc.voiceConfig.voice}${sc.voiceConfig.accent ? ` | Accent: ${sc.voiceConfig.accent}` : ''} | Speed: ${sc.voiceConfig.speed} | Pitch: ${sc.voiceConfig.pitch}`;
                  }
               }
               return sceneText;
            }).join('\n\n') : '';

            // Build Metadata string
            const meta = jsonData.metadata || {};
            const metadataContent = [
               meta.location ? `Specific Location: ${meta.location}` : '',
               meta.duration ? `Duration: ${meta.duration}s` : '',
               meta.aspectRatio ? `Aspect Ratio: ${meta.aspectRatio}` : '',
               meta.productType ? `Product Type: ${meta.productType}` : '',
               meta.musicVibe ? `Music Vibe: ${meta.musicVibe}` : ''
            ].filter(Boolean).join('\n');

            console.log(`✅ JSON format parsed successfully (${jsonData.images ? 'Lookbook Mode' : 'Video Mode'} - Nano Banana Pro / Veo 3.1 optimized)`);

            return {
               master: masterContent,
               keyframes: keyframesContent,
               scenes: scenesContent,
               production: '',
               metadata: metadataContent,
               refinedScenes: '', // Will be populated by Phase 2
               jsonData: jsonData // Keep original JSON for advanced usage
            };
         }
      } catch (e) {
         // JSON parsing failed, fall back to text parsing
         console.log('ℹ️ JSON parsing failed, using text format parser');
      }

      // ================================================
      // FALLBACK: TEXT FORMAT PARSING (Legacy support)
      // ================================================
      // Robust parsing based on sections - support multiple formats
      // Try SECTION X: format first
      let masterMatch = text.match(/SECTION 1:[\s\S]*?(?=SECTION 2:|Image 1|SCENE 1|$)/i);
      let keyframesMatch = text.match(/SECTION 2:[\s\S]*?(?=SECTION 3:|SCENE 1|$)/i);
      let scenesMatch = text.match(/SECTION 3:[\s\S]*?(?=SECTION 4:|SECTION 5:|PRODUCTION|$)/i);
      let productionMatch = text.match(/SECTION 4:[\s\S]*?(?=SECTION 5:|METADATA|$)/i);
      let metadataMatch = text.match(/SECTION 5:[\s\S]*$/i) || text.match(/SECTION 4:\s*METADATA[\s\S]*$/i);

      // If SECTION format not found, try alternative formats
      if (!masterMatch) {
         masterMatch = text.match(/(?:MASTER PROMPT|COMMON MASTER PROMPT)[:\s]*[\s\S]*?(?=KEYFRAME|IMAGE 1|SCENE 1|$)/i);
      }
      if (!keyframesMatch) {
         // Try Image 1, Image 2... format (common in TikTok Shop mode)
         keyframesMatch = text.match(/(?:KEYFRAME PROMPTS?|IMAGE SEQUENCE)[:\s]*[\s\S]*?(?=SCENE|VEO|$)/i);
         if (!keyframesMatch) {
            // Try to find Image 1 through Image 5 directly
            const imageMatch = text.match(/Image 1[\s\S]*?(?=SCENE 1|\*\*\*VOICE|$)/i);
            if (imageMatch) keyframesMatch = imageMatch;
         }
      }
      if (!scenesMatch) {
         // Try SCENE 1, SCENE 2... format (TikTok Shop mode)
         scenesMatch = text.match(/(?:SCENE PROMPTS?|VEO SCENE|SCENES? & SCRIPT)[:\s]*[\s\S]*?(?=PRODUCTION|METADATA|SECTION 4|$)/i);
         if (!scenesMatch) {
            // Try to find SCENE 1 through SCENE 4 directly
            const sceneMatch = text.match(/(?:\*\*\*VOICE SETTING|\bSCENE 1\b)[\s\S]*?(?=SECTION 4:|PRODUCTION|METADATA|$)/i);
            if (sceneMatch) scenesMatch = sceneMatch;
         }
      }
      if (!productionMatch) {
         productionMatch = text.match(/(?:PRODUCTION NOTES?|SECTION 4:\s*PRODUCTION)[:\s]*[\s\S]*?(?=METADATA|SECTION 5|$)/i);
      }
      if (!metadataMatch) {
         metadataMatch = text.match(/(?:METADATA|Specific Location:)[:\s]*[\s\S]*$/i);
      }

      const cleanSection = (raw: string, sectionHeaderRegex: RegExp) => {
         if (!raw) return "";
         // Remove the main section header (e.g. "SECTION 1: ...")
         let content = raw.replace(sectionHeaderRegex, '').trim();

         // Remove common redundant sub-headers that models sometimes add
         const redundantHeaders = [
            /^SECTION \d+:?\s*[^\n]*\n?/i,
            /^Common Master Prompt:?\s*/i,
            /^Master Prompt:?\s*/i,
            /^Keyframe Prompts?:?\s*/i,
            /^Image Sequence:?\s*/i,
            /^Veo Scene Prompts?:?\s*/i,
            /^Scene Prompts?.*?:?\s*/i,
            /^Scenes? & Script.*?:?\s*/i,
            /^Production Notes?:?\s*/i,
            /^Prompts?:?\s*/i,
            /^Output:?\s*/i,
            /^\*+[^\n]*\*+\s*/i,
            /^---+\s*/i,
         ];

         for (const regex of redundantHeaders) {
            content = content.replace(regex, '');
         }
         return content.trim();
      };

      // If still no master prompt found, try to extract first substantial paragraph
      let masterContent = masterMatch ? cleanSection(masterMatch[0], /SECTION 1:.*?\n?|MASTER PROMPT:?\s*|COMMON MASTER PROMPT:?\s*/i) : "";
      if (!masterContent && text.includes("Exact facial features")) {
         const exactMatch = text.match(/Exact facial features[\s\S]*?(?=\n\n|Image 1|SCENE 1|$)/i);
         if (exactMatch) masterContent = exactMatch[0].trim();
      }

      // Extract keyframes - handle both Image X format and SECTION 2 format
      let keyframesContent = "";
      if (keyframesMatch) {
         keyframesContent = cleanSection(keyframesMatch[0], /SECTION 2:.*?\n?|KEYFRAME PROMPTS?:?\s*|IMAGE SEQUENCE:?\s*/i);
      }
      if (!keyframesContent || keyframesContent === "Keyframes unavailable") {
         // Try to extract Image 1, Image 2... directly from text
         const allImages = text.match(/Image \d+\s*\([^)]+\):[\s\S]*?(?=Image \d+|SCENE 1|\*\*\*VOICE|SECTION|$)/gi);
         if (allImages && allImages.length > 0) {
            keyframesContent = allImages.join('\n\n');
         }
      }

      // Extract scenes - handle SCENE 1, SCENE 2... format
      let scenesContent = "";
      if (scenesMatch) {
         scenesContent = cleanSection(scenesMatch[0], /SECTION 3:.*?\n?|SCENE PROMPTS?.*?:?\s*|VEO SCENE.*?:?\s*/i);
      }
      if (!scenesContent || scenesContent === "Scenes unavailable") {
         // Try to extract SCENE 1, SCENE 2... directly
         const allScenes = text.match(/SCENE \d+\s*\([^)]+\)[\s\S]*?(?=SCENE \d+\s*\(|SECTION 4|PRODUCTION|METADATA|$)/gi);
         if (allScenes && allScenes.length > 0) {
            scenesContent = allScenes.join('\n\n');
         }
      }

      return {
         master: masterContent || "Master prompt unavailable - AI may have used different format. Check full output.",
         keyframes: keyframesContent || "Keyframes unavailable",
         scenes: scenesContent || "Scenes unavailable",
         production: productionMatch ? cleanSection(productionMatch[0], /SECTION 4:.*?\n?|PRODUCTION NOTES?:?\s*/i) : "",
         metadata: metadataMatch ? cleanSection(metadataMatch[0], /SECTION 5:.*?\n?|METADATA:?\s*/i) : "",
         refinedScenes: '' // Will be populated by Phase 2
      };
   };

   // Improved parser for Keyframes and Scenes to handle individual copying
   const parseSegments = (text: string, type: 'image' | 'scene') => {
      const segments: { title: string; content: string }[] = [];

      // Multiple regex patterns to match various AI output formats
      const patterns = type === 'image'
         ? [
            /(Image \d+[^:\n]*:)/gi,           // "Image 1 (00s):" or "Image 1:"
            /(\d+s\s*:)/gi,                     // "00s:" or "08s :"
            /(\(\d+s\)\s*:)/gi,                 // "(00s):" 
            /(Keyframe \d+[^:\n]*:)/gi,        // "Keyframe 1:"
         ]
         : [
            /(Scene \d+[^:\n]*:)/gi,           // "Scene 1 (00s-08s):"
            /(\d+s\s*-\s*\d+s\s*:)/gi,         // "00s-08s:"
            /(\(\d+s-\d+s\)\s*:)/gi,           // "(00s-08s):"
         ];

      let matches: { match: string; index: number }[] = [];

      // Try each pattern until we find matches
      for (const regex of patterns) {
         matches = [];
         let match;
         // Reset regex
         regex.lastIndex = 0;
         while ((match = regex.exec(text)) !== null) {
            matches.push({ match: match[0], index: match.index });
         }
         if (matches.length >= 2) break; // Found valid segments
      }

      // If still no matches, try line-by-line split for numbered format
      if (matches.length < 2) {
         const lines = text.split('\n').filter(line => line.trim());
         const lineMatches: { match: string; index: number; content: string }[] = [];

         for (const line of lines) {
            // Match patterns like "00s: content" or "1. (00s): content"
            const lineMatch = line.match(/^(\d+s|\d+\.\s*\(?\d+s\)?|Image \d+[^:]*)\s*:\s*(.+)$/i);
            if (lineMatch) {
               lineMatches.push({
                  match: lineMatch[1],
                  index: 0,
                  content: lineMatch[2].trim()
               });
            }
         }

         if (lineMatches.length >= 2) {
            return lineMatches.map((m, idx) => ({
               title: type === 'image' ? `Image ${idx + 1} (${m.match})` : `Scene ${idx + 1} (${m.match})`,
               content: m.content
            }));
         }
      }

      // If still no matches, return as single block
      if (matches.length === 0) {
         return [{ title: type === 'image' ? 'All Keyframes' : 'All Scenes', content: text.trim() }];
      }

      // Extract content between matches
      for (let i = 0; i < matches.length; i++) {
         const currentMatch = matches[i];
         const nextMatch = matches[i + 1];

         let title = currentMatch.match.replace(/:$/, '').trim();
         // Make title more readable
         if (/^\d+s$/.test(title)) {
            title = `Image ${i + 1} (${title})`;
         }

         const startIndex = currentMatch.index + currentMatch.match.length;
         const endIndex = nextMatch ? nextMatch.index : text.length;
         const content = text.slice(startIndex, endIndex).trim();

         if (title && content) {
            segments.push({ title, content });
         }
      }

      return segments.length > 0
         ? segments
         : [{ title: type === 'image' ? 'All Keyframes' : 'All Scenes', content: text.trim() }];
   };

   const getBase64AndMime = (dataUrl: string) => {
      const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
         return { mimeType: 'image/png', data: dataUrl.split(',')[1] || '' };
      }
      return { mimeType: matches[1], data: matches[2] };
   };

   // ================================================
   // 🎬 VIDEO REFINEMENT FUNCTION (PHASE 2)
   // ================================================
   // Đọc lại keyframe prompts và tạo scene prompts liền mạch hơn
   const refineVideoScenes = async (masterPrompt: string, keyframes: string, existingScenes: string, jsonData?: any) => {
      setVideoRefining(true);

      try {
         const ai = new GoogleGenAI({ apiKey });

         // Extract beatSync info from jsonData if available
         let beatSyncInfo = "";
         if (jsonData?.beatSync) {
            beatSyncInfo = `
BEAT SYNC INFO:
BPM: ${jsonData.beatSync.bpm || 128}
Pattern: ${jsonData.beatSync.beatPattern || 'remix-drop-pattern'}
Music Mood: ${jsonData.beatSync.musicMood || 'EDM-remix-high-energy'}
Drop Timestamps: ${jsonData.beatSync.dropTimestamps?.join(', ') || '12.0s, 24.0s'}
`;
         } else {
            // Default remix pattern
            beatSyncInfo = `
BEAT SYNC INFO:
BPM: 128 (default remix)
Pattern: remix-drop-pattern
Music Mood: EDM-remix-high-energy
Drop Timestamps: 12.0s, 16.0s, 24.0s, 28.0s (typical remix structure)
`;
         }

         const refinementPrompt = `
PHASE 2: VIDEO REFINEMENT
=========================

Analyze the keyframe prompts below and create SEAMLESS, REFINED scene prompts for Veo 3.1.

**YOUR TASK:**
1. Read the MASTER PROMPT for character/outfit/environment details
2. Analyze each KEYFRAME (frozen pose) 
3. Create REFINED SCENES that animate between keyframes with perfect continuity
4. Ensure CHARACTER, OUTFIT, and ENVIRONMENT are 100% consistent
5. Sync all motions to the BEAT pattern

---

MASTER PROMPT:
${masterPrompt}

---

KEYFRAMES (Static Images - Frozen Poses):
${keyframes}

---

EXISTING SCENES (for reference - IMPROVE these):
${existingScenes}

---

${beatSyncInfo}

---

**OUTPUT FORMAT:**
Create refined scene prompts that are MORE DETAILED and MORE SEAMLESS than the existing ones.

For each scene, output:

REFINED SCENE X (XXs-XXs):
CHARACTER: [Brief identifier - SAME in all scenes]
OUTFIT: [Exact outfit description - IDENTICAL in all scenes]
START_POSE: [EXACT match to previous keyframe end pose]
MOTION: [Detailed continuous motion with beat markers]
  - Beat 1 (XX.0s): [specific action - e.g., "sharp hip snap to right"]
  - Beat 3 (XX.5s): [specific action - e.g., "hair begins flowing left"]
  - Beat 5 (XX.0s): [specific action - e.g., "fabric catches air peak"]
  - Beat 7 (XX.5s): [specific action - e.g., "weight shifts to front foot"]
END_POSE: [EXACT position for next scene start]
CAMERA: [Movement synced to music - e.g., "slow orbit then crash zoom on drop"]
ENVIRONMENT: [Location + AMBIENT MOTION - wind, light, background movement]
FABRIC_PHYSICS: [How outfit behaves - silk flows, hem rises, etc.]
TRANSITION_TO_NEXT: [How this flows to next scene]

---

**CRITICAL RULES:**
1. CHARACTER must be IDENTICAL in every scene description
2. OUTFIT details must be EXACTLY THE SAME - no color/pattern drift
3. END_POSE of Scene N MUST equal START_POSE of Scene N+1
4. Every scene MUST have AMBIENT MOTION in environment
5. BEAT MARKERS must align with BPM and drop timestamps
6. Use: "smoothly," "fluidly," "gradually" - NOT "suddenly," "cuts to"

Now create the REFINED SCENES:
`;

         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: refinementPrompt }] },
            config: {
               systemInstruction: VIDEO_REFINEMENT_INSTRUCTION,
               safetySettings: [
                  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
               ]
            }
         });

         const refinedText = response.text;

         if (refinedText) {
            console.log('✅ Video scenes refined successfully (Phase 2)');
            return refinedText;
         }

         return null;
      } catch (error) {
         console.error('❌ Video refinement failed:', error);
         return null;
      } finally {
         setVideoRefining(false);
      }
   };

   const runDirector = async () => {
      if (!outfitImage) {
         alert("Please upload outfit reference image. (Face reference is optional - will use default Douyin style face if not provided)");
         return;
      }

      setStep('director');
      setDirectorThinking(true);
      setDirectorOutput(null);

      try {
         const ai = new GoogleGenAI({ apiKey });

         let bodyDataString = "";
         if (bodyMode === 'preset') {
            bodyDataString = `Body Preset: ${bodyType}`;
         } else {
            bodyDataString = `Exact Measurements: Height ${measurements.height}cm, Bust ${measurements.bust}cm, Waist ${measurements.waist}cm, Hips ${measurements.hips}cm`;
         }

         // User Additional Description for ALL MODES
         const userAdditionalDescText = additionalDescription ? `\n\n📝 USER CUSTOM REQUIREMENTS / YÊU CẦU TÙY CHỈNH TỪ NGƯỜI DÙNG:
"""${additionalDescription}"""
⚠️ AI PHẢI đọc kỹ và tích hợp các yêu cầu trên vào video/ảnh (nếu hợp lý và không vi phạm rules).
- Ưu tiên thực hiện theo yêu cầu người dùng nếu khả thi
- Nếu yêu cầu mâu thuẫn với rules an toàn → bỏ qua và dùng phiên bản safe
- Nếu yêu cầu về layering/styling → áp dụng cho TẤT CẢ scenes/images` : '';

         // For TikTok Shop, use product details instead of personal measurements
         const isAutoDetect = productType === 'auto';
         const isComboMode = productType === 'combo';
         const shopModelInfo = appMode === 'tiktok_shop'
            ? `\n\nPRODUCT INFO FOR VIETNAMESE SCRIPT (USE THESE DETAILS):
- Product Type: ${isAutoDetect ? '🤖 AUTO-DETECT (AI phân tích từ ảnh sản phẩm)' : isComboMode ? '🎀 COMBO/MIX (Nhiều món kết hợp)' : productType.toUpperCase()}
- Video Style: ${videoStyle.toUpperCase()}
- Fabric/Material: ${fabricMaterial || (isAutoDetect || isComboMode ? '🤖 AUTO-DETECT từ ảnh' : 'Analyze from image')}
- Key Highlights: ${productHighlights || (isAutoDetect || isComboMode ? '🤖 AUTO-DETECT từ ảnh' : 'Analyze from image')}
- Available Sizes: ${availableSizes}

${isAutoDetect ? `🤖 AUTO-DETECTION MODE ACTIVATED (NÂNG CAO):
AI PHẢI phân tích ẢNH SẢN PHẨM KỸ LƯỠNG và xác định:

📦 1. LOẠI SẢN PHẨM (Product Category):
   - Phân loại chính xác: Đầm (maxi/midi/mini/bodycon/A-line/wrap/slip) / Áo (sơ mi/thun/crop/hai dây/corset) / Quần (dài/ống rộng/skinny/short) / Đặc biệt (áo dài/jumpsuit/bikini/đồ ngủ)
   - Ghi cả tiếng Việt và EN term
   
   👙 NẾU PHÁT HIỆN LÀ NỘI Y/LINGERIE/DELICATE WEAR:
   → TỰ ĐỘNG ÁP DỤNG FASHION-SAFE VOCABULARY (xem section riêng)
   → PHẢI dùng từ: "Corsetry-style bodice", "Fitted bodice", "Vintage glamour coordinates", "Balletcore set"
   → KHÔNG dùng: bra, panties, underwear, sexy, revealing, minimal coverage, accentuating, lingerie-inspired, intimate apparel
   → Mô tả như buổi chụp catalog thời trang chuyên nghiệp

🧵 2. CHẤT LIỆU VẢI (Fabric Analysis):
   - Độ bóng: Bóng láng (satin/silk) / Bóng mờ (polyester) / Mờ (cotton/linen)
   - Độ dày: Rất mỏng xuyên sáng (chiffon) / Mỏng rủ (silk) / Trung bình (cotton) / Dày (denim/velvet)
   - Texture: Trơn / Ren lỗ / Nhăn tự nhiên / Gân ribbed / Hoa văn nổi
   - Co giãn: Cao (ôm sát body) / Trung bình / Không co giãn
   
   👙 NẾU LÀ NỘI Y - CHẤT LIỆU ĐẶC BIỆT:
   - Ren: "Intricate Chantilly lace" / "Delicate eyelash lace" / "Guipure lace appliqué"
   - Satin: "Lustrous satin finish" / "High-sheen charmeuse"
   - Silk: "Mulberry silk draping" / "Liquid silk fabric"
   - Mesh: "Fine power mesh" / "Diaphanous tulle overlay"

📐 3. KÍCH CỠ & FIT:
   - Fit: Ôm sát (slim) / Ôm vừa (regular) / Rộng (relaxed) / Oversize
   - Chiều dài: Mini/Midi/Maxi (váy) | Cropped/Regular/Longline (áo)
   - Kiểu tay: Sleeveless/Short/3-4/Long/Puff/Bell

🎨 4. MÀU SẮC (Cụ thể):
   - KHÔNG dùng "đỏ" → Dùng "đỏ rượu vang/cherry/coral"
   - KHÔNG dùng "xanh" → Dùng "navy/cobalt/mint/emerald"
   - Ghi cả tone: Warm/Cool/Neutral

🔍 5. CHI TIẾT THIẾT KẾ:
   - Kiểu cổ: V-neck/Round/Square/Halter/Off-shoulder/Sweetheart
   - Chi tiết đặc biệt: Xẻ tà/Hở lưng/Cut-out/Bèo nhún/Nơ/Xếp ly

🔗 6. COMBO CHECK:
   - Có nhiều món đồ trong ảnh không?
   - Nếu có: Liệt kê item chính + item phụ + kiểu kết hợp

👙 7. NỘI Y AUTO-APPLY (TỰ ĐỘNG ÁP DỤNG NẾU DETECT NỘI Y):
   Khi phát hiện sản phẩm là: Bralette, Bra, Quần lót, Teddy, Bodysuit, Đồ ngủ, Bikini, Corset...
   
   ✅ TỰ ĐỘNG LÀM:
   - Dùng "Editorial fashion photograph for intimate apparel catalog"
   - Dùng "Elegant confident pose" thay vì "sexy pose"
   - Dùng "Professional studio lighting" / "Luxury bedroom setting"
   - Mô tả chất liệu chi tiết: lace, satin, silk, mesh
   - Script tiếng Việt: "Bralette ren mềm mại" thay vì "Áo ngực sexy"
   
   ❌ TUYỆT ĐỐI KHÔNG:
   - Dùng từ: sexy, hot, revealing, cleavage, busty, provocative
   - Mô tả cơ thể trực tiếp
   - Pose quá gợi cảm

📝 GHI KẾT QUẢ VÀO METADATA SECTION theo format chuẩn.` : ''}

${isComboMode ? `🎀 COMBO/MIX MODE ACTIVATED (CHI TIẾT):
Ảnh sản phẩm có NHIỀU MÓN ĐỒ kết hợp. AI PHẢI:

📦 1. NHẬN DIỆN TẤT CẢ CÁC MÓN:
   - Item chính (outer/main): [Loại + Màu + Chất liệu]
   - Item phụ (inner/accessory): [Loại + Màu + Chất liệu]

🧵 2. PHÂN TÍCH TỪNG MÓN RIÊNG:
   - Mô tả chi tiết từng item (không gộp chung)
   - Xác định chất liệu riêng cho mỗi item

🔗 3. XÁC ĐỊNH KIỂU KẾT HỢP:
   - Layering: Mặc lớp ngoài + lớp trong
   - See-through: Vải mỏng lộ item bên trong
   - Matching set: Bộ đồng bộ thiết kế
   - Mix & Match: Phối đồ khác style

📝 4. SCRIPT PHẢI NHẮC ĐẾN TẤT CẢ:
   - Ví dụ: "Váy ren đi kèm bralette, an tâm không lo lộ!"
   - Ví dụ: "Set này có áo crop và quần ống rộng, mua về là mặc liền!"

Các kiểu combo phổ biến:
- 👗 Váy/Đầm xuyên thấu + Inner (bralette/slip) bên trong
- 🧥 Áo khoác/Blazer + Áo trong (croptop/corset)
- 🌙 Đồ ngủ silk + Bộ nội y matching
- 👙 Bikini + Kimono/Cover-up phủ ngoài
- 👚 Áo sơ mi cài hở + Bralette bên trong
- 👖 Set quần + áo đồng bộ (co-ord set)` : ''}

⚠️ IMPORTANT: This is AI-generated video. DO NOT say "Mình cao X nặng Y" - instead describe the PRODUCT and how it looks on the MODEL's body type.`
            : '';

         // Enforce 32s for TikTok Shop Mode
         const isTikTokShop = appMode === 'tiktok_shop';
         const finalDuration = isTikTokShop ? 32 : parseInt(videoDuration);
         const scenes = finalDuration / 8;

         const faceData = faceImage ? getBase64AndMime(faceImage) : null;
         const outfitData = getBase64AndMime(outfitImage);

         // Prepare Blocklist - use location strings from vault
         const historyBlocklist = locationVault.length > 0
            ? locationVault.map(item => item.location).join(", ")
            : "None (Fresh Start)";

         // Prepare Location Region preference
         const selectedRegionData = LOCATION_REGIONS.find(r => r.value === locationRegion);
         const regionName = selectedRegionData?.label || 'Auto';
         const regionDescription = selectedRegionData?.desc || 'AI chọn tự do';

         // Get RANDOM suggested locations for the region (excluding used ones)
         const suggestedLocs = locationRegion === 'auto'
            ? getRandomLocationsForAuto(5)  // Random from all regions for Auto mode
            : getSuggestedLocations(locationRegion, 5);  // Random from selected region

         const suggestedLocationsText = suggestedLocs.length > 0
            ? `\n\n🎲 SUGGESTED LOCATIONS (Random selection - Pick ONE):\n${suggestedLocs.map((loc, i) => `${i + 1}. ${loc}`).join('\n')}\n\n⚠️ IMPORTANT: Choose RANDOMLY from above list. Do NOT always pick #1.`
            : '';

         const locationPreferenceText = locationRegion !== 'auto'
            ? `\n\nPREFERRED LOCATION REGION: ${regionName}\nRegion Description: ${regionDescription}${suggestedLocationsText}`
            : `\n\nLOCATION MODE: AI Auto (Random from all regions)${suggestedLocationsText}`;

         // Editorial Mode (18+) flag
         const editorialModeText = editorialMode && appMode === 'cinematic'
            ? `\n\n🔞 EDITORIAL_MODE: ON\nApply foundation-free silhouette vocabulary. Use visual descriptions like "seamless foundation-free silhouette," "uninterrupted natural fabric drape," "clean garment lines without undergarment interference."`
            : '';

         // Wallpaper Mode flag
         const wallpaperModeText = wallpaperMode && appMode === 'cinematic'
            ? `\n\n📱 WALLPAPER_MODE: ON\nCreate phone wallpaper-friendly composition:\n⚠️ CRITICAL: DO NOT draw any UI elements (clock, icons, notifications) in the image!\n⚠️ FRAMING: Model MUST occupy 90% of frame HEIGHT (same as Lookbook Mode)\n- Model full-body from head to toe, 90% frame height\n- Head near top edge (5-10% margin) - phone clock will overlay this area\n- Feet near bottom edge (5% margin) - phone dock will overlay this area\n- Use beautiful gradient backgrounds: sunset, twilight, bokeh city lights\n- Background around head/feet should be simple for UI overlay\n- Soft rim lighting, dreamy aesthetic\n- Colors: warm golden, soft pastels, or dramatic twilight tones\n- Output is PURE IMAGE only - no interface elements, no text overlays\n\n⚠️ BODY TYPE VOCABULARY STILL APPLIES:\n- If CURVY/PLUS body type: MUST include "Naturally heavy chest" + additional terms\n- Follow all body type mapping rules from director.txt\n- Wallpaper mode affects FRAMING only, NOT body descriptions`
            : '';

         // Lookbook Mode flag
         const lookbookModeText = lookbookMode && appMode === 'cinematic'
            ? `\n\n📸 LOOKBOOK_MODE: ON\n⚠️ CHỈ TẠO IMAGE PROMPTS - KHÔNG TẠO VIDEO/SCENES\n\n🔧 JSON OUTPUT FORMAT FOR LOOKBOOK (CONCRETE EXAMPLE):\n\`\`\`json\n{\n  "masterPrompt": {\n    "facePreservation": "Exact facial features...",\n    "subject": "Elegant Vietnamese model...",\n    "outfit": "Flowing silk ao dai...",\n    "environment": "Shot on location at...",\n    "lighting": "Golden hour...",\n    "camera": "Full body...",\n    "style": "Photorealistic"\n  },\n  "images": [\n    {\n      "id": 1,\n      "timestamp": "00s",\n      "imagePrompt": "Elegant Vietnamese model in flowing silk ao dai, standing gracefully with vạt panels draped naturally. Shot on location at ancient temple courtyard. Golden hour lighting, warm amber glow. Full body shot, 85mm f/1.4, 90% frame height. Photorealistic fashion photography"\n    },\n    {\n      "id": 2,\n      "timestamp": "08s",\n      "imagePrompt": "Same model in ao dai, seated on ornate wooden chair, panels spread elegantly. Environment unchanged. Soft window light from left. Medium shot capturing upper body and vạt details. Natural color grading"\n    }\n  ],\n  "metadata": {\n    "location": "Văn Miếu Quốc Tử Giám, Hanoi",\n    "aspectRatio": "9:16"\n  }\n}\n\`\`\`\n\n⚠️ CRITICAL: Each image object MUST have:\n- "imagePrompt" field (FULL prompt describing the entire image in ONE string)\n- OR "prompt" field (alternative field name)\n- DO NOT split into subject/action/environment - combine ALL into imagePrompt\n\n⛔ KHÔNG BAO GỒM:\n- "scenes" array (lãng phí tài nguyên)\n- "beatSync" object (không cần cho ảnh tĩnh)\n- "emotionalJourney" object (không cần cho ảnh tĩnh)\n- "referenceAngles" array (không cần cho lookbook)\n- "keyframes" array (dùng "images" thay thế)\n\n✅ CHỈ CẦN: masterPrompt + images + metadata${aspectRatio === '16:9' ? `\n\n📐 LOOKBOOK 16:9 OPTIMIZATION:\n- BỐ CỤC NGANG: Model chiếm 60-80% chiều CAO frame (không phải 90% như 9:16)\n- MODEL VỊ TRÍ: Đặt model ở 1/3 trái hoặc phải theo rule of thirds\n- BACKGROUND: Rõ nét hơn, có storytelling, environment quan trọng\n- LYING POSES: ƯU TIÊN - Model nằm ngang chiếm trọn chiều RỘNG frame\n- SQUAT/KNEELING: Phù hợp vì model thấp hơn, background visible\n- STANDING: Camera xa hơn (2-4m) để capture full body + bối cảnh\n- DEPTH OF FIELD: Sâu hơn (f/4-f/8), không blur background quá mạnh\n- USE CASE: Desktop wallpaper, YouTube thumbnail, Website banner, Print\n- YOGA POSES: Samakonasana (xoạc ngang 180°) RẤT PHÙ HỢP cho 16:9 vì chân mở rộng theo chiều ngang` : `\n\n📱 LOOKBOOK 9:16 OPTIMIZATION:\n- BỐ CỤC DỌC: Model chiếm 90% chiều CAO frame (head-to-toe visible)\n- STANDING POSES: ƯU TIÊN - Tận dụng chiều dọc\n- LYING POSES: Model nằm chéo hoặc dọc trong frame\n- USE CASE: Phone wallpaper, Instagram Story, TikTok thumbnail`}\n\n🚫 QUY TẮC BẮT BUỘC CHO ÁO DÀI (NẾU LÀ ÁO DÀI):\n- KHÔNG XẺ TÀ: Vạt áo LIỀN MẠCH từ eo xuống, KHÔNG có đường xẻ dọc trên vạt\n- KHÔNG XẺ VẠT: Vạt trước và vạt sau RIÊNG BIỆT, KHÔNG rách, KHÔNG xẻ\n- GIỮ NGUYÊN VẠT TRƯỚC: Phủ từ ngực đến đầu gối, có thể bay nhẹ\n- GIỮ NGUYÊN VẠT SAU: Phủ từ lưng đến đầu gối, có thể kéo sang bên\n- CHỈ CÓ XẺ HÔNG: Xẻ ở hai bên hông (từ eo xuống) để thấy quần lụa\n- EN: "ao dai with INTACT panels, NO slits on panels, side openings at hip only"\n\n🌸 NẾU OUTFIT LÀ ÁO DÀI: TẠO 52 IMAGE PROMPTS theo Áo Dài Special Sequence MỞ RỘNG:\n- Image 1-4: Standing + Vạt Áo (Flow, Butterfly, Walking, Back Walking)\n- Image 5-7: Seated poses (Chair, Back Glance, Side Profile)\n- Image 8-10: Deep Squat poses (3/4 Back, Full Back, Side)\n- Image 11-12: Dynamic poses (Wind, Spin)\n- Image 13-14: Elegant Squat poses\n- Image 15-17: Artistic + Lifestyle (Vạt Frame, Leaning, Table Lean)\n- Image 18-22: Hair Touch, Low Angle, Detail, Environment, Closing Hero\n- Image 23-27: Upper Body poses (Arms Up, Crossed Arms, Hand on Chest, Shoulder Glance, Neck)\n- Image 28: Squat 3/4 Back Vạt Không Che\n- Image 29: Kneeling 3/4 Back Ưỡn Hông Vạt Không Che\n- Image 30-39: Lying poses ${aspectRatio === '16:9' ? 'TỐI ƯU cho 16:9' : 'cho 16:9'} (Side, Dreamy, Mermaid, Head Support, Cross Legs, Knees Up, Reading, Vạt Spread)\n- Image 40-43: UPPER SILHOUETTE (Bodice Architecture, Corsetry Lean, Vintage Profile, Balletcore Arch)\n- Image 44-48: LOWER SILHOUETTE (Hip Architecture Back, Gothic Squat, Kneeling Sweep, S-Curve Profile, Floor Silhouette)\n- Image 49: HOURGLASS FINALE (Closing Power Pose)\n- Image 50-52: YOGA FLEXIBILITY (Samakonasana Side Split 180°${aspectRatio === '16:9' ? ' - RẤT PHÙ HỢP 16:9' : ''}, Supta Baddha Konasana Hip Opener, Upavistha Konasana Forward Fold - Lower Silhouette Focus)\n\n📷 NẾU KHÔNG PHẢI ÁO DÀI: TẠO 35 IMAGE PROMPTS MỞ RỘNG (SAFE VOCABULARY):\n- Image 1-6: Standing poses (front, side, back, 3/4, over-shoulder, full back)\n- Image 7-10: Dynamic poses (walk, spin, wind, runway)\n- Image 11-14: Seated poses (chair, floor, side, back)\n- Image 15-17: Squat poses (3/4 curves, back, low angle)\n- Image 18-22: Bodice & Silhouette Focus (décolletage architecture, S-line, hip architecture, balletcore lean, vintage profile)\n- Image 23-24: Fabric Detail (hair touch, texture)\n- Image 25-28: Lower Silhouette Focus (gothic squat, kneeling, back hip, floor curves)\n- Image 29-32: Upper Architecture Focus (arms up, lean forward, crossed arms, shoulder drop)\n- Image 33: Closing Hero (hip pop finale)\n- Image 34-35: YOGA FLEXIBILITY (Samakonasana Side Split 180°${aspectRatio === '16:9' ? ' - RẤT PHÙ HỢP 16:9' : ''}, Supta Baddha Konasana Hip Opener)\n\n🔐 SAFE VOCABULARY (BẮT BUỘC):\n- UPPER: "fitted bodice architecture", "elegant décolletage line", "corsetry-style construction", "refined neckline"\n- LOWER: "graceful lower silhouette", "sweeping hip line", "hip architecture", "elegant lower contour"\n- STYLE: "balletcore", "gothic romantic", "vintage glamour", "corsetry-style", "classic hourglass silhouette"`
            : '';

         // Seductive Mode flag (TikTok safe alluring style)
         // Note: Auto-disabled when sexyMode is ON (vocabulary conflict)
         const seductiveModeText = seductiveMode && appMode === 'cinematic' && !sexyMode
            ? `\n\n💋 SEDUCTIVE_MODE: ON (TIKTOK-SAFE VOCABULARY)\nTạo video/hình ảnh quyến rũ, thu hút nhưng AN TOÀN cho TikTok.\n\n⚠️ TIKTOK SAFE VOCABULARY:\n- ❌ KHÔNG dùng: sexy, seductive, sensual, erotic, hot, revealing, provocative\n- ✅ DÙNG: magnetic presence, captivating aura, effortless allure, mysterious mystique, intoxicating elegance, hypnotic charm, irresistible confidence\n\n😏 EXPRESSION & GAZE:\n- Smoldering gaze, dreamy half-lidded gaze, inviting confident look\n- Piercing eye contact, languid gaze, soft gaze through lashes\n- Slight knowing smile, confident smirk, mischievous grin\n\n💃 BODY LANGUAGE:\n- Slow deliberate movements, languid stretching, confident strut\n- Hip sway with purpose, shoulder drop revealing collarbone\n- Neck tilt, graceful back arch\n- Hair toss in slow motion, hand flowing through hair slowly\n\n🎭 POSES (TIKTOK SAFE):\n- Standing: Wall Lean, The Turn, Power Stance, Arms Up Stretch\n- Sitting: Throne Pose, Elegant Recline, Edge Sit\n- Movement: Runway Walk, Spin Around, Hair Play${lookbookMode ? '' : `\n\n🎬 CAMERA WORK (VIDEO ONLY):\n- Slow push-in on face, circling orbit shot, low angle power shot\n- Soft focus transition, lingering close-up, slow pan from toe to face\n- Over-shoulder mystery shot, silhouette rim lighting`}\n\n💡 LIGHTING:\n- Warm golden hour glow, dramatic chiaroscuro, soft candlelight ambiance\n- Neon glow reflection, backlit silhouette, rim light defining elegant silhouette`
            : '';

         // Sexy Mode flag (Private mode for Nano Banana Pro & Veo 3.1)
         // Adapts to: Wallpaper Mode (elegant sexy), Lookbook Mode (no scene flow)
         // ⚠️ SFW VOCABULARY - Optimized for Nano Banana Pro content filters
         // CHỈ DÙNG YOGA SANSKRIT cho POSES KHÓ hoặc DỄ BỊ FLAG
         const sexyModeText = sexyMode && appMode === 'cinematic'
            ? `\n\n🔥 SEXY_MODE: ON (SFW VOCABULARY - NANO BANANA PRO COMPATIBLE)\nChế độ riêng tư tạo nội dung gợi cảm - TỐI ƯU cho Nano Banana Pro và Veo 3.1.\n\n⛔ BLOCKLIST - TUYỆT ĐỐI KHÔNG DÙNG:\n🔴 HARD BLOCK: vagina, penis, nipples, nude, naked, topless, braless, sex, cum, bdsm, fetish, bondage, orgasm\n🟡 CONTEXT BLOCK: see-through, sheer, micro bikini, wet t-shirt, upskirt, spread legs, cleavage, bust, breast\n🟡 WORKAROUNDS BỊ BLOCK: nsfw, uncensored, r18, 18+, hentai, gravure, risqué\n\n✅ SFW ALTERNATIVES - DÙNG CÁC TỪ NÀY:\n- Cleavage → décolletage, neckline depth, V-neckline\n- Bust/Breast → upper body silhouette, bodice architecture, heart opening\n- Sexy → alluring, captivating, magnetic\n- Seductive → confident gaze, magnetic presence, self-assured\n- Sheer → lightweight fabric, flowing material\n- Wet look → glossy finish, reflective surface\n- Bedroom eyes → half-lidded gaze, confident gaze\n- Lingerie → lounge coordinates, loungewear set\n- Bikini → two-piece swimwear, swim set${wallpaperMode ? `\n\n📱 WALLPAPER + SEXY COMBINATION:\n- Tạo hình nền elegant nhưng TINH TẾ, phù hợp làm lock screen\n- Poses: elegant standing, confident lean, soft recline - KHÔNG provocative\n- Expression: half-lidded gaze, knowing smile - confident not intense\n- Background: dreamy gradient, bokeh lights - beautiful for wallpaper\n- Model 90% frame như Wallpaper Mode yêu cầu` : ''}\n\n⚠️ QUY TẮC ÁO DÀI:\n- Áo dài VẪN PHẢI tuân thủ: KHÔNG XẺ TÀ, VẠT LIỀN MẠCH\n- Gợi cảm qua: form-fitting silhouette, thin silk fabric, deep back scoop, wind-blown panels\n- KHÔNG: sheer fabric, high side slit trên vạt\n- EN: "ao dai INTACT panels, elegant via fitted silhouette and flowing fabric, NO panel slits"\n\n💃 BODY VOCABULARY (SFW):\n- Graceful silhouette, elegant figure, hourglass silhouette\n- Generous figure, elegant curves, slender waist\n- Smooth radiant skin, long elegant legs\n\n👗 OUTFIT VOCABULARY (SFW):\n- Form-fitting dress, bodycon, deep V-neckline, backless\n- High slit, lightweight fabric, lace overlay, strapless\n- Loungewear set, silk robe, two-piece swimwear\n- ⚠️ NGOẠI TRỪ ÁO DÀI: chỉ form-fitting, thin silk, NO slits on panels\n\n🧘 YOGA POSES CHO TƯ THẾ KHÓ/DỄ FLAG:\n| Pose | Yoga Sanskrit | Dùng Khi |\n|------|--------------|----------|\n| Xoạc ngang 180° | Samakonasana (Straight Angle) | Thay "180° splits" |\n| Xoạc cúi trước | Upavistha Konasana (Wide-Angle Forward Bend) | Thay "spread legs bend forward" |\n| Nằm mở hông | Supta Baddha Konasana (Reclined Bound Angle) | Thay "lying with open legs" |\n| Cong lưng sâu | Bhujangasana/Ustrasana (Cobra/Camel) | Thay "deep backbend" |\n\n🎭 ELEGANT POSES:${wallpaperMode ? `\n- Elegant standing with hip tilt, confident lean\n- Graceful back arch, hand on hip, over-shoulder glance\n- Hair toss, subtle fabric touch - tinh tế cho wallpaper` : `\n- Graceful back arch, hip tilt, leaning forward\n- Wall lean, confident arch, styled poses\n- Elegant recline, relaxed poses, dynamic movement\n- Hair styling, fabric draping, strap adjusting`}\n\n📸 CAMERA:\n- Low angle looking up, bird's eye view\n- Slow pan up body, circling orbit, push-in close\n\n💡 LIGHTING:\n- Warm amber key light, strong rim/backlight glow\n- Single spotlight, candle flicker, neon glow\n- Pattern shadows, dramatic chiaroscuro${lookbookMode ? '' : `\n\n🎬 SCENE FLOW (VIDEO ONLY):\n- Scene 1: Introduction - elegant silhouette emerging\n- Scene 2: Reveal - full body spotlight showcase\n- Scene 3: Highlight - peak captivating moment\n- Scene 4: Finale - confident elegant close, smile`}`
            : '';

         // Studio Mode flag - Professional themed backgrounds with random studio suggestions
         const studioSuggestions = studioMode ? getRandomStudios(studioCategory, 5) : [];
         const studioModeText = studioMode
            ? `\n\n🎬 STUDIO_MODE: ON (Category: ${studioCategory === 'auto' ? 'AI Auto' : STUDIO_CATEGORIES.find(c => c.value === studioCategory)?.label || studioCategory})
Use professional themed studio backgrounds instead of real-world locations.

📐 SELECTION LOGIC:
1. Analyze outfit/product from reference image
2. Match to category: aodai, professional, casual, evening, sportswear, sleepwear, accessories
3. ${studioSuggestions.length > 0 ? 'SELECT FROM SUGGESTED STUDIOS BELOW' : 'Select appropriate studio from database'}
4. Build environment using studio specs

🎯 SUGGESTED STUDIOS (RANDOM - TRÁNH TRÙNG LẶP):
${studioSuggestions.length > 0
               ? studioSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n')
               : '(Tất cả studios đã dùng - AI tự chọn từ database)'}

⚠️ CRITICAL RULES:
- PHẢI CHỌN 1 STUDIO từ danh sách trên (hoặc từ database nếu hết)
- Props MUST be minimal (1-3 max) and in BACKGROUND (out of focus)
- Lighting is SIMULATED (say "golden hour simulation" not "golden hour")
- End with "- STUDIO FIXED" tag
- NO realistic room names (living room/bedroom) - use "studio with [aesthetic]"
- Same studio throughout all keyframes (no changes)

📚 REFERENCE: See studio_mode_guide.txt for complete 103-studio database.`
            : '';

         // Aspect Ratio flag
         const aspectRatioText = aspectRatio === '16:9'
            ? `\n\n📐 ASPECT_RATIO: 16:9 (HORIZONTAL)\nOutput phải tối ưu cho khung hình ngang 16:9:\n- Model chiếm 50-70% chiều CAO frame (nhỏ hơn so với 9:16)\n- Background rõ nét hơn, có storytelling\n- Camera xa hơn (2-4m) để capture cả người và bối cảnh\n- Depth of field sâu hơn (f/4-f/8)\n- Có thể dùng rule of thirds: Model ở 1/3 trái hoặc phải\n- Environment quan trọng, không blur quá mạnh\n- Use case: Desktop wallpaper, YouTube thumbnail, Website banner, Print`
            : '';

         // Prepare Script Blocklist (only for TikTok Shop mode)
         const scriptBlocklist = appMode === 'tiktok_shop' && scriptVault.length > 0
            ? `\n\nPREVIOUSLY USED SCRIPTS (BLOCKLIST - DO NOT USE SIMILAR HOOKS):\n${scriptVault.slice(0, 15).map(s => `- "${s.hook}"`).join('\n')}`
            : '';

         // Keyframe count reminder based on duration
         const keyframeCountText = `\n\n⚠️ KEYFRAME COUNT REQUIREMENT:\n- Video ${finalDuration}s = ${Math.floor(finalDuration / 8) + 1} KEYFRAMES bắt buộc\n- Timestamps: ${Array.from({ length: Math.floor(finalDuration / 8) + 1 }, (_, i) => `${i * 8}s`).join(', ')}\n- PHẢI OUTPUT ĐỦ ${Math.floor(finalDuration / 8) + 1} KEYFRAMES, KHÔNG ĐƯỢC THIẾU!`;

         // Real-World Photography Mode (ALWAYS ON)
         const realWorldPhotoText = `\n\n📸 REAL-WORLD PHOTOGRAPHY MODE (BẮT BUỘC):
⚠️ OUTPUT PHẢI LÀ ẢNH/VIDEO CHỤP THỰC TẾ - KHÔNG PHẢI CGI/3D RENDER!

✅ BẮT BUỘC:
- Bối cảnh THẬT có thể tìm trên Google Maps
- Phong cách như photographer chuyên nghiệp chụp ON-LOCATION
- Ánh sáng tự nhiên với bóng đổ thật
- Texture thực của environment (sàn, tường, nội thất)
- Perspective như camera thật (DSLR/smartphone)

❌ TUYỆT ĐỐI KHÔNG:
- CGI / 3D rendered environments
- Fantasy / Surreal / Fictional locations
- Overly perfect studio look (trông fake)
- AI-generated unrealistic backgrounds
- Floating objects / Impossible physics

🎯 PROMPT KEYWORDS (THÊM VÀO MỌI PROMPT):
"Shot on location at [Địa điểm], professional fashion photography, authentic real-world environment, natural available light, DSLR camera aesthetic"

⚠️ OUTPUT FORMAT: STRICT JSON (cho Nano Banana Pro & Veo 3.1)
AI PHẢI output định dạng JSON để tối ưu workflow Image-to-Video.`;

         // Build parts array with CLEAR LABELS for images
         const faceReferenceText = faceImage
            ? `\n\n🔴 FACE REFERENCE: UPLOADED ✅
⚠️ CRITICAL: Face Reference image is attached FIRST (before outfit).
- Use EXACT facial features from Face Reference image
- OVERRIDE the Default Douyin Face - DO NOT USE DEFAULT
- Preserve: Face shape, eyes, nose, lips, skin tone, hair style/color
- Do NOT add Douyin makeup (wine-red eyeshadow, amber lenses, etc.)
- Do NOT change hair color/style from reference
- Only describe what you SEE in the Face Reference

✅ CORRECT: "Faithful character likeness from reference: [describe actual features seen]"
❌ WRONG: Using any Default Douyin Face description when face is uploaded`
            : `\n\n⚠️ FACE REFERENCE: NOT UPLOADED
→ Use DEFAULT DOUYIN/DOLL STYLE FACE (see instructions for full description)`;

         const parts = [
            { text: `Mode: ${appMode.toUpperCase()}\nGender: ${gender}\n${bodyDataString}${shopModelInfo}${userAdditionalDescText}\n\nTarget Duration: ${finalDuration}s (${scenes} scenes).\nAspect Ratio: ${aspectRatio}${keyframeCountText}${realWorldPhotoText}${locationPreferenceText}${editorialModeText}${wallpaperModeText}${lookbookModeText}${seductiveModeText}${sexyModeText}${studioModeText}${aspectRatioText}\n\nPREVIOUSLY USED LOCATIONS (COLLISION AVOIDANCE ACTIVATED):\n${historyBlocklist}${scriptBlocklist}\n\n🎯 OUTPUT FORMAT: JSON (Nano Banana Pro & Veo 3.1 optimized)\nCreative Brief:\n${brief}${faceReferenceText}` },
            // Face Reference image FIRST (with label)
            ...(faceImage ? [{ text: '\n\n📸 IMAGE 1 - FACE REFERENCE (Use this face):' }, { inlineData: { mimeType: faceData.mimeType, data: faceData.data } }] : []),
            // Outfit Reference image SECOND (with label)
            { text: faceImage ? '\n\n📸 IMAGE 2 - OUTFIT/PRODUCT REFERENCE (Use this product):' : '\n\n📸 OUTFIT/PRODUCT REFERENCE:' },
            { inlineData: { mimeType: outfitData.mimeType, data: outfitData.data } }
         ];

         // Select Instruction
         let systemInstruction = DIRECTOR_SYSTEM_INSTRUCTION;
         if (appMode === 'tiktok') systemInstruction = TIKTOK_SYSTEM_INSTRUCTION;
         if (appMode === 'tiktok_shop') systemInstruction = TIKTOK_SHOP_SYSTEM_INSTRUCTION;

         // Append Sportswear Rules for ALL modes (prevent yoga/gym poses)
         systemInstruction = systemInstruction + '\n\n' + SPORTSWEAR_RULES;

         // Append Studio Mode Guide if enabled
         if (studioMode) {
            systemInstruction = systemInstruction + '\n\n' + STUDIO_MODE_GUIDE;
         }

         // Append Trending Intelligence for TikTok modes
         if (appMode === 'tiktok' || appMode === 'tiktok_shop') {
            systemInstruction = systemInstruction + '\n\n' + TRENDING_INTELLIGENCE;
         }

         // Append Cinematic Fashion Scenes for non-lookbook cinematic videos
         if (appMode === 'cinematic' && !lookbookMode) {
            systemInstruction = systemInstruction + '\n\n' + CINEMATIC_FASHION_SCENES;
         }

         if (appMode === 'tiktok' || appMode === 'tiktok_shop') {
            systemInstruction = systemInstruction + '\n\n' + EMOTIONAL_ARC_GUIDE;
         }

         const response = await ai.models.generateContent({
            model: geminiModel,
            contents: { parts },
            config: {
               systemInstruction: systemInstruction,
               safetySettings: [
                  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
               ]
            }
         });

         const text = response.text;

         if (!text) {
            console.error("Director Response Missing Text. Full Response:", response);
            if (response.candidates && response.candidates.length > 0) {
               const reason = response.candidates[0].finishReason;
               if (reason === 'SAFETY') {
                  throw new Error("The Director could not generate the prompt due to Safety Filters. Please try a different image or description.");
               }
            }
            throw new Error("No text response from Director. The model might be overloaded or the input was blocked.");
         }

         // Extract Metadata (Specific Location) - Support both JSON and text format
         let extractedLocation = null;

         // Try JSON format first
         try {
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*"metadata"[\s\S]*\}/);
            if (jsonMatch) {
               const jsonText = jsonMatch[1] || jsonMatch[0];
               const jsonData = JSON.parse(jsonText);
               if (jsonData.metadata && jsonData.metadata.location) {
                  extractedLocation = jsonData.metadata.location;
               }
            }
         } catch (e) {
            // JSON parsing failed, try text format
         }

         // Fallback to text format
         if (!extractedLocation) {
            const metaMatch = text.match(/Specific Location:\s*(.+)/i);
            if (metaMatch && metaMatch[1]) {
               extractedLocation = metaMatch[1].trim();
            }
         }

         if (extractedLocation) {
            const alreadyExists = locationVault.some(item =>
               item.location.toLowerCase() === extractedLocation.toLowerCase()
            );
            if (!alreadyExists) {
               addToLocationVault(extractedLocation, locationRegion, productType);
            }
         }

         // Extract Studio from AI response (for Studio Mode) - save to vault
         if (studioMode) {
            let extractedStudio = null;

            // Try JSON format - look in masterPrompt.environment
            try {
               const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*"masterPrompt"[\s\S]*\}/);
               if (jsonMatch) {
                  const jsonText = jsonMatch[1] || jsonMatch[0];
                  const jsonData = JSON.parse(jsonText);
                  if (jsonData.masterPrompt && jsonData.masterPrompt.environment) {
                     extractedStudio = jsonData.masterPrompt.environment;
                  }
               }
            } catch (e) {
               // JSON parsing failed
            }

            // Fallback: look for "STUDIO FIXED" tag
            if (!extractedStudio) {
               const studioMatch = text.match(/([^.]+)\s*-\s*STUDIO FIXED/i);
               if (studioMatch && studioMatch[1]) {
                  extractedStudio = studioMatch[1].trim();
               }
            }

            if (extractedStudio) {
               const studioShort = extractedStudio.slice(0, 100);
               const studioExists = studioVault.some(s =>
                  s.studio.toLowerCase().slice(0, 30) === studioShort.toLowerCase().slice(0, 30)
               );
               if (!studioExists && studioShort.length > 10) {
                  addToStudioVault(studioShort, studioCategory, productType);
                  console.log('🎬 Studio saved to vault:', studioShort.slice(0, 50) + '...');
               }
            }
         }

         // Extract Scene 1 Script (Hook) for TikTok Shop - save to vault
         // Support both JSON and text format
         if (appMode === 'tiktok_shop') {
            let extractedHook = null;

            // Try JSON format
            try {
               const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*"scenes"[\s\S]*\}/);
               if (jsonMatch) {
                  const jsonText = jsonMatch[1] || jsonMatch[0];
                  const jsonData = JSON.parse(jsonText);
                  if (jsonData.scenes && jsonData.scenes[0] && jsonData.scenes[0].script) {
                     extractedHook = jsonData.scenes[0].script;
                  }
               }
            } catch (e) {
               // JSON parsing failed
            }

            // Fallback to text format
            if (!extractedHook) {
               const scene1Match = text.match(/SCENE 1[\s\S]*?SCRIPT:\s*["""]?([^"""]+)["""]?/i);
               if (scene1Match && scene1Match[1]) {
                  extractedHook = scene1Match[1].trim();
               }
            }

            if (extractedHook) {
               const hook = extractedHook.slice(0, 100);
               const hookExists = scriptVault.some(s =>
                  s.hook.toLowerCase().slice(0, 30) === hook.toLowerCase().slice(0, 30)
               );
               if (!hookExists && hook.length > 10) {
                  addToScriptVault(hook, productType);
               }
            }
         }

         const sections = parseDirectorOutput(text);

         // ================================================
         // 🎬 PHASE 2: AUTO VIDEO REFINEMENT
         // ================================================
         // Tự động gọi AI lần 2 để refine scenes liền mạch hơn
         // SKIP for Lookbook Mode (images only, no video)
         let refinedScenesText = null;

         if (sections.keyframes && sections.master && !lookbookMode) {
            console.log('🎬 Starting Phase 2: Video Refinement...');

            // Extract jsonData for beatSync info
            let jsonData = null;
            try {
               const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
               if (jsonMatch) {
                  jsonData = JSON.parse(jsonMatch[1]);
               }
            } catch (e) {
               // JSON parsing failed, proceed without it
            }

            refinedScenesText = await refineVideoScenes(
               sections.master,
               sections.keyframes,
               sections.scenes || '',
               jsonData || (sections as any).jsonData
            );

            if (refinedScenesText) {
               console.log('✅ Phase 2 completed: Refined scenes ready');
               sections.refinedScenes = refinedScenesText;
            }
         } else if (lookbookMode) {
            console.log('⏭️ Phase 2 skipped: Lookbook mode (images only, no video refinement needed)');
         }

         setDirectorOutput({
            fullText: text,
            sections: sections,
            jsonData: (sections as any).jsonData
         });

         setActiveTab('master');

      } catch (error: any) {
         console.error("Director Error:", error);

         let message = error.message || "An unexpected error occurred.";

         if (typeof message === 'string' && (message.includes('{') || message.includes('429') || message.includes('404'))) {
            if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED") || message.includes("quota")) {
               message = "API Quota Exceeded (429). You have reached the usage limit for the Gemini API. Please wait a moment or check your billing details in Google AI Studio.";
            } else if (message.includes("404") || message.includes("NOT_FOUND")) {
               message = "Model Not Found (404). The selected Gemini model is not available. Please try again later or contact support.";
            } else {
               try {
                  const jsonMatch = message.match(/\{.*\}/);
                  if (jsonMatch) {
                     const parsed = JSON.parse(jsonMatch[0]);
                     if (parsed.error && parsed.error.message) {
                        message = parsed.error.message;
                     }
                  }
               } catch (e) { }
            }
         }

         alert(`Director Error: ${message}`);
         setStep('input');
      } finally {
         setDirectorThinking(false);
      }
   };

   const reset = () => {
      setStep('input');
      setDirectorOutput(null);
   };

   // --- Render Steps ---

   return (
      <div className="min-h-screen bg-[#09090b] text-zinc-200 selection:bg-purple-500/30 selection:text-purple-200 p-4 md:p-8 flex items-center justify-center font-sans">
         <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Panel: Inputs & Controls */}
            <div className="lg:col-span-5 flex flex-col gap-6">
               <header className="mb-2">
                  <div className="flex items-center gap-2 mb-2">
                     <Sparkles className="w-5 h-5 text-purple-400" />
                     <span className="text-xs font-medium tracking-[0.2em] text-purple-400 uppercase">AI Visual Director</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                     Cinematic <br />Fashion Studio
                  </h1>
               </header>

               <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 border border-zinc-800 bg-zinc-900/40">

                  {/* API Key Input */}
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-2">
                        🔑 Gemini API Key
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                           className="text-purple-400 hover:text-purple-300 underline">
                           (Lấy key)
                        </a>
                     </label>
                     <div className="relative">
                        <input
                           type={showApiKey ? "text" : "password"}
                           value={apiKey}
                           onChange={(e) => setApiKey(e.target.value)}
                           placeholder="AIzaSy..."
                           className="w-full px-3 py-2 pr-20 text-xs bg-zinc-900/70 border border-zinc-700 rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                        />
                        <button
                           type="button"
                           onClick={() => setShowApiKey(!showApiKey)}
                           className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded bg-zinc-800 border border-zinc-700"
                        >
                           {showApiKey ? 'Ẩn' : 'Hiện'}
                        </button>
                     </div>
                     {!apiKey && (
                        <p className="text-[10px] text-red-400">⚠️ Cần API Key để sử dụng</p>
                     )}
                  </div>

                  {/* Gemini Model Selector */}
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-2">
                        🤖 Gemini Model
                     </label>
                     <div className="grid grid-cols-2 gap-2">
                        <button
                           onClick={() => setGeminiModel('gemini-2.5-flash')}
                           className={`py-2.5 px-3 rounded-lg text-[10px] font-medium border transition-all text-left
                              ${geminiModel === 'gemini-2.5-flash'
                                 ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                                 : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                        >
                           <div className="font-bold">2.5 Flash</div>
                           <div className="text-[8px] text-zinc-500 mt-0.5">Stable • Fast</div>
                        </button>
                        <button
                           onClick={() => setGeminiModel('gemini-3-flash-preview')}
                           className={`py-2.5 px-3 rounded-lg text-[10px] font-medium border transition-all text-left
                              ${geminiModel === 'gemini-3-flash-preview'
                                 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                                 : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                        >
                           <div className="font-bold">3.0 Preview</div>
                           <div className="text-[8px] text-zinc-500 mt-0.5">Experimental</div>
                        </button>
                     </div>
                     <p className="text-[9px] text-zinc-500">
                        {geminiModel === 'gemini-2.5-flash'
                           ? '✅ Mô hình ổn định, đã kiểm chứng'
                           : '🧪 Mô hình mới nhất, có thể có thay đổi'}
                     </p>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-3 gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                     <button
                        onClick={() => setAppMode('cinematic')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                  ${appMode === 'cinematic'
                              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                     >
                        <Film className="w-3.5 h-3.5" /> Cinematic
                     </button>
                     <button
                        onClick={() => setAppMode('tiktok')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                  ${appMode === 'tiktok'
                              ? 'bg-gradient-to-r from-pink-500/20 to-cyan-500/20 text-white shadow-sm border border-white/10'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                     >
                        <Music className="w-3.5 h-3.5" /> Viral Dance
                     </button>
                     <button
                        onClick={() => setAppMode('tiktok_shop')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                  ${appMode === 'tiktok_shop'
                              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-white shadow-sm border border-white/10'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                     >
                        <ShoppingBag className="w-3.5 h-3.5" /> Shop Sales
                     </button>
                  </div>

                  {/* Reference Images */}
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { label: "Face Reference", state: faceImage, setter: setFaceImage, ref: fileInputFaceRef, icon: Upload },
                        { label: "Outfit Reference", state: outfitImage, setter: setOutfitImage, ref: fileInputOutfitRef, icon: ImageIcon }
                     ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                           <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">{item.label}</label>
                           <div
                              onClick={() => item.ref.current?.click()}
                              className={`aspect-[3/4] rounded-xl border border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden relative group
                      ${item.state ? 'border-purple-500/50 bg-purple-900/10' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'}`}
                           >
                              {item.state ? (
                                 <img src={item.state} alt="Ref" className="w-full h-full object-cover" />
                              ) : (
                                 <div className="text-center p-4">
                                    <item.icon className="w-5 h-5 mx-auto mb-2 text-zinc-500 group-hover:text-zinc-300" />
                                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Upload</span>
                                 </div>
                              )}
                              {item.state && <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-xs font-medium">Change</span></div>}
                           </div>
                           <input type="file" ref={item.ref} onChange={(e) => handleFileUpload(e, item.setter)} className="hidden" accept="image/*" />
                        </div>
                     ))}
                  </div>

                  {/* Configuration Groups */}
                  <div className="space-y-5">

                     {/* 1. Body & Subject */}
                     <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                           <span className="font-semibold text-zinc-400 flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" /> Subject & Body</span>
                           <div className="flex bg-zinc-900 rounded p-0.5 border border-zinc-800">
                              {['preset', 'custom'].map(m => (
                                 <button key={m} onClick={() => setBodyMode(m as any)}
                                    className={`px-2 py-0.5 text-[10px] uppercase font-medium rounded transition-colors ${bodyMode === m ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>
                                    {m}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Template Buttons */}
                        <div className="grid grid-cols-4 gap-2">
                           {BODY_TEMPLATES.map((t, i) => (
                              <button key={i} onClick={() => applyTemplate(t)}
                                 className="px-2 py-1.5 rounded bg-zinc-900/40 border border-zinc-800 hover:bg-purple-900/20 hover:border-purple-500/30 text-[9px] text-zinc-400 hover:text-purple-300 transition-all truncate"
                                 title={t.label}
                              >
                                 {t.label}
                              </button>
                           ))}
                        </div>

                        <div className="space-y-3">
                           <select value={gender} onChange={(e) => setGender(e.target.value)}
                              className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500">
                              <option>Female</option> <option>Male</option>
                           </select>

                           {bodyMode === 'preset' ? (
                              <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}
                                 className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500">
                                 <option>Slim (Model)</option> <option>Athletic</option> <option>Balanced</option> <option>Curvy</option>
                              </select>
                           ) : (
                              <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                                 <div className="space-y-1">
                                    <label className="text-[9px] uppercase text-zinc-600 font-bold ml-1">Height (cm)</label>
                                    <input type="number" placeholder="165" className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
                                       value={measurements.height} onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })} />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[9px] uppercase text-zinc-600 font-bold ml-1">Weight (kg)</label>
                                    <input type="number" placeholder="55" className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
                                       value={measurements.weight} onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })} />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[9px] uppercase text-zinc-600 font-bold ml-1">Waist (cm)</label>
                                    <input type="number" placeholder="64" className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
                                       value={measurements.waist} onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })} />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[9px] uppercase text-zinc-600 font-bold ml-1">Size</label>
                                    <select value={measurements.size} onChange={(e) => setMeasurements({ ...measurements, size: e.target.value })}
                                       className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500">
                                       <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option><option>3XL</option><option>4XL</option>
                                    </select>
                                 </div>
                              </div>
                           )}

                           {/* Product Type Selector - For ALL MODES (Compact for Cinematic/TikTok) */}
                           <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                              <div className="flex items-center justify-between mb-2">
                                 <label className={`text-[9px] uppercase font-bold ml-1 ${appMode === 'tiktok_shop' ? 'text-orange-400' : 'text-purple-400'}`}>
                                    {appMode === 'tiktok_shop' ? 'Loại sản phẩm' : '👙 Loại outfit (Tùy chọn)'}
                                 </label>
                                 {productType === 'auto' && (
                                    <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                       🤖 AI tự nhận diện
                                    </span>
                                 )}
                                 {productType === 'combo' && (
                                    <span className="text-[8px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                       🎀 Nhiều món kết hợp
                                    </span>
                                 )}
                                 {productType === 'lingerie' && (
                                    <span className="text-[8px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                       👙 Fashion-safe mode
                                    </span>
                                 )}
                              </div>

                              {/* Compact selector for Cinematic/TikTok - Quick options */}
                              {appMode !== 'tiktok_shop' && (
                                 <div className="grid grid-cols-5 gap-1">
                                    {[
                                       { value: 'auto', emoji: '🤖', label: 'Auto' },
                                       { value: 'aodai', emoji: '🌸', label: 'Áo Dài' },
                                       { value: 'lingerie', emoji: '👙', label: 'Nội y' },
                                       { value: 'bikini', emoji: '👙', label: 'Bikini' },
                                       { value: 'sleepwear', emoji: '🌙', label: 'Đồ ngủ' }
                                    ].map((pt) => (
                                       <button key={pt.value} onClick={() => setProductType(pt.value)}
                                          className={`py-1.5 px-1 rounded text-[8px] font-medium border transition-all flex flex-col items-center justify-center gap-0.5
                                    ${productType === pt.value
                                                ? pt.value === 'auto'
                                                   ? 'bg-green-500/20 border-green-500 text-green-200'
                                                   : pt.value === 'aodai'
                                                      ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                                                      : pt.value === 'lingerie' || pt.value === 'bikini'
                                                         ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                                                         : 'bg-purple-500/20 border-purple-500 text-purple-200'
                                                : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
                                          <span className="text-sm">{pt.emoji}</span>
                                          <span className="truncate w-full text-center">{pt.label}</span>
                                       </button>
                                    ))}
                                 </div>
                              )}

                              {/* Full selector for TikTok Shop - Grouped */}
                              {appMode === 'tiktok_shop' && (
                                 <div className="max-h-[280px] overflow-y-auto pr-1 scrollbar-thin space-y-3">
                                    {PRODUCT_TYPE_GROUPS.map((group) => (
                                       <div key={group.group}>
                                          <div className="text-[9px] font-bold text-zinc-400 mb-1.5 sticky top-0 bg-zinc-950/90 py-1 backdrop-blur-sm">
                                             {group.label}
                                          </div>
                                          <div className="grid grid-cols-4 gap-1">
                                             {group.items.map((pt) => (
                                                <button key={pt.value} onClick={() => setProductType(pt.value)}
                                                   title={pt.desc || pt.label}
                                                   className={`py-1.5 px-1 rounded text-[8px] font-medium border transition-all flex flex-col items-center justify-center gap-0.5
                                                      ${productType === pt.value
                                                         ? pt.value === 'auto'
                                                            ? 'bg-green-500/20 border-green-500 text-green-200'
                                                            : pt.value === 'combo'
                                                               ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                                                               : pt.value === 'lingerie' || pt.value === 'bikini'
                                                                  ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                                                                  : group.group === 'beauty'
                                                                     ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-200'
                                                                     : group.group === 'smart_home'
                                                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                                                                        : 'bg-orange-500/20 border-orange-500 text-orange-200'
                                                         : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
                                                   <span className="text-sm">{pt.emoji}</span>
                                                   <span className="truncate w-full text-center">{pt.label}</span>
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              {/* Helper text for all modes */}
                              {productType === 'auto' && (
                                 <p className="text-[9px] text-green-400/70 mt-2 ml-1">
                                    ✨ AI sẽ phân tích ảnh sản phẩm để xác định loại, chất liệu và đặc điểm tự động
                                 </p>
                              )}
                              {productType === 'combo' && (
                                 <p className="text-[9px] text-pink-400/70 mt-2 ml-1">
                                    🎀 AI sẽ nhận diện TẤT CẢ các món đồ trong ảnh (VD: Váy + Nội y, Áo khoác + Croptop)
                                 </p>
                              )}
                              {(productType === 'lingerie' || productType === 'bikini' || productType === 'sleepwear') && (
                                 <p className="text-[9px] text-rose-400/70 mt-2 ml-1">
                                    👙 AI sẽ dùng từ ngữ fashion-safe để vượt filter (Editorial/Catalog style)
                                 </p>
                              )}
                              {productType === 'aodai' && appMode === 'tiktok_shop' && (
                                 <p className="text-[9px] text-pink-400/70 mt-2 ml-1">
                                    🌸 Đã tự động chọn phong cách Áo Dài Truyền Thống - có thể đổi sang Biến Hình/Catwalk/Cách Tân bên dưới
                                 </p>
                              )}
                              {productType === 'aodai' && appMode !== 'tiktok_shop' && (
                                 <p className="text-[9px] text-pink-400/70 mt-2 ml-1">
                                    🌸 Đã tự động chọn bối cảnh Áo Dài (đầm sen, phố cổ, di tích). AI sẽ tạo 52 poses + quy tắc vạt áo liền mạch.
                                 </p>
                              )}
                           </div>

                           {/* Product Details Input - Only for TikTok Shop */}
                           {appMode === 'tiktok_shop' && (
                              <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                                 <label className="text-[9px] uppercase text-cyan-400 font-bold ml-1 mb-2 block">📝 Chi tiết sản phẩm (để script chính xác)</label>
                                 <div className="space-y-2">
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-500 ml-1">Chất liệu vải</label>
                                       <input
                                          type="text"
                                          placeholder="VD: Vải thun lạnh, Lụa cao cấp, Cotton 100%..."
                                          className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                                          value={fabricMaterial}
                                          onChange={(e) => setFabricMaterial(e.target.value)}
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-500 ml-1">Điểm nổi bật</label>
                                       <input
                                          type="text"
                                          placeholder="VD: Che bắp tay, Tôn eo, Co giãn 4 chiều..."
                                          className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                                          value={productHighlights}
                                          onChange={(e) => setProductHighlights(e.target.value)}
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[9px] text-zinc-500 ml-1">Size có sẵn</label>
                                       <input
                                          type="text"
                                          placeholder="VD: S-XXL, Freesize, S đến 4XL..."
                                          className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                                          value={availableSizes}
                                          onChange={(e) => setAvailableSizes(e.target.value)}
                                       />
                                    </div>
                                 </div>
                              </div>
                           )}

                           {/* Additional Description - For ALL MODES */}
                           <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                              <div className="space-y-1">
                                 <label className={`text-[9px] ml-1 flex items-center gap-1 ${appMode === 'tiktok_shop' ? 'text-amber-400' :
                                    appMode === 'tiktok' ? 'text-cyan-400' : 'text-purple-400'
                                    }`}>
                                    <span>✏️</span>
                                    {appMode === 'tiktok_shop' ? 'Mô tả bổ sung / Yêu cầu riêng' :
                                       appMode === 'tiktok' ? 'Ghi chú thêm cho video' : 'Custom requirements / Notes'}
                                 </label>
                                 <textarea
                                    placeholder={
                                       appMode === 'tiktok_shop'
                                          ? "Nhập thêm mô tả, yêu cầu đặc biệt cho video...\nVD: Muốn focus vào phần eo, tone màu ấm, model cười nhiều, không xoay quá nhanh, thêm slow motion ở scene 2..."
                                          : appMode === 'tiktok'
                                             ? "Ghi chú cho video TikTok...\nVD: Style năng động, có nhiều chuyển cảnh, nhạc upbeat, màu sắc tươi sáng..."
                                             : "Custom notes for cinematic video...\nE.g.: Slow dolly movement, warm golden hour tone, elegant pacing, focus on silhouette..."
                                    }
                                    className={`w-full bg-zinc-900/80 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-zinc-300 focus:outline-none placeholder:text-zinc-600 min-h-[70px] resize-y ${appMode === 'tiktok_shop' ? 'focus:border-amber-500' :
                                       appMode === 'tiktok' ? 'focus:border-cyan-500' : 'focus:border-purple-500'
                                       }`}
                                    value={additionalDescription}
                                    onChange={(e) => setAdditionalDescription(e.target.value)}
                                    rows={3}
                                 />
                                 <p className="text-[8px] text-zinc-600 ml-1">
                                    💡 {appMode === 'tiktok_shop'
                                       ? 'AI sẽ tích hợp mô tả này vào video. Càng chi tiết càng tốt!'
                                       : appMode === 'tiktok'
                                          ? 'Thêm ghi chú để video đúng ý bạn hơn!'
                                          : 'Add notes to customize your cinematic video!'}
                                 </p>
                              </div>
                           </div>

                           {/* Video Style Selector - Only for TikTok Shop */}
                           {appMode === 'tiktok_shop' && (
                              <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                                 <label className="text-[9px] uppercase text-pink-400 font-bold ml-1 mb-2 block">Phong cách quay</label>
                                 <div className="space-y-1.5">
                                    {VIDEO_STYLES.map((vs) => (
                                       <button key={vs.value} onClick={() => setVideoStyle(vs.value as any)}
                                          className={`w-full py-2 px-3 rounded text-left border transition-all flex items-center gap-2
                                    ${videoStyle === vs.value
                                                ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                                                : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
                                          <span className="text-base">{vs.emoji}</span>
                                          <div className="flex-1">
                                             <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold">{vs.label}</span>
                                                {vs.hot && <span className="text-[8px] bg-red-500 text-white px-1 rounded">HOT</span>}
                                             </div>
                                             <span className="text-[9px] opacity-70">{vs.desc}</span>
                                          </div>
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Location Region Selector */}
                           <div className="mt-3 pt-3 border-t border-zinc-800/50 animate-in fade-in">
                              <div className="flex items-center justify-between mb-2">
                                 <label className="text-[9px] uppercase text-emerald-400 font-bold ml-1 flex items-center gap-1">
                                    📍 Bối cảnh / Location
                                 </label>
                                 {locationVault.length > 0 && (
                                    <span className="text-[9px] text-zinc-500">{locationVault.length} đã dùng</span>
                                 )}
                              </div>

                              {/* Region Grid */}
                              <div className="grid grid-cols-2 gap-1.5 mb-2">
                                 {LOCATION_REGIONS.slice(0, 6).map((region) => (
                                    <button
                                       key={region.value}
                                       onClick={() => setLocationRegion(region.value)}
                                       className={`py-1.5 px-2 rounded text-left border transition-all flex items-center gap-1.5
                                    ${locationRegion === region.value
                                             ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                                             : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                                    >
                                       <span className="text-sm">{region.emoji}</span>
                                       <span className="text-[9px] font-medium truncate">{region.label}</span>
                                    </button>
                                 ))}
                              </div>

                              {/* More Regions Dropdown */}
                              <details className="group">
                                 <summary className="text-[9px] text-zinc-500 cursor-pointer hover:text-zinc-300 flex items-center gap-1">
                                    <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                                    Thêm bối cảnh khác
                                 </summary>
                                 <div className="grid grid-cols-2 gap-1.5 mt-2 animate-in fade-in slide-in-from-top-2">
                                    {LOCATION_REGIONS.slice(6).map((region) => (
                                       <button
                                          key={region.value}
                                          onClick={() => setLocationRegion(region.value)}
                                          className={`py-1.5 px-2 rounded text-left border transition-all flex items-center gap-1.5
                                       ${locationRegion === region.value
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                                                : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                                       >
                                          <span className="text-sm">{region.emoji}</span>
                                          <span className="text-[9px] font-medium truncate">{region.label}</span>
                                       </button>
                                    ))}
                                 </div>
                              </details>

                              {/* Selected Region Info */}
                              {locationRegion !== 'auto' && (
                                 <div className="mt-2 p-2 bg-emerald-900/10 border border-emerald-500/20 rounded text-[9px] text-emerald-300/80">
                                    <span className="font-bold">{LOCATION_REGIONS.find(r => r.value === locationRegion)?.label}:</span>{' '}
                                    {LOCATION_REGIONS.find(r => r.value === locationRegion)?.desc}
                                    {getSuggestedLocations(locationRegion, 10).length > 0 && (
                                       <p className="mt-1 text-emerald-400/60">
                                          🎲 {getSuggestedLocations(locationRegion, 10).length} bối cảnh ngẫu nhiên sẵn sàng
                                       </p>
                                    )}
                                 </div>
                              )}

                              {/* Auto Mode Info */}
                              {locationRegion === 'auto' && (
                                 <div className="mt-2 p-2 bg-blue-900/10 border border-blue-500/20 rounded text-[9px] text-blue-300/80">
                                    <span className="font-bold">🎲 AI Tự Chọn Ngẫu Nhiên:</span>{' '}
                                    AI sẽ random từ tất cả các vùng dựa trên loại sản phẩm
                                    <p className="mt-1 text-blue-400/60">
                                       ✓ {getRandomLocationsForAuto(20).length} bối cảnh khả dụng từ tất cả vùng
                                    </p>
                                 </div>
                              )}

                              {/* Editorial Mode Toggle (18+) - Cinematic only */}
                              {appMode === 'cinematic' && (
                                 <div className="mt-3 pt-3 border-t border-zinc-800/30">
                                    <button
                                       onClick={() => setEditorialMode(!editorialMode)}
                                       className={`w-full py-2 px-3 rounded-lg border transition-all flex items-center justify-between
                                    ${editorialMode
                                             ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                                             : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🔞</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Editorial Mode</span>
                                             <span className="text-[8px] opacity-70">Foundation-free silhouette</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${editorialMode ? 'bg-rose-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${editorialMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {editorialMode && (
                                       <p className="mt-1.5 text-[8px] text-rose-300/60 px-1">
                                          ⚠️ Mô tả trang phục với silhouette tự nhiên, không có lớp foundation bên trong
                                       </p>
                                    )}

                                    {/* Wallpaper Mode Toggle */}
                                    <button
                                       onClick={() => setWallpaperMode(!wallpaperMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-lg border transition-all flex items-center justify-between
                                    ${wallpaperMode
                                             ? 'bg-violet-500/20 border-violet-500/50 text-violet-200'
                                             : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🖼️</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Wallpaper Mode</span>
                                             <span className="text-[8px] opacity-70">Hình nền điện thoại</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${wallpaperMode ? 'bg-violet-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${wallpaperMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {wallpaperMode && (
                                       <p className="mt-1.5 text-[8px] text-violet-300/60 px-1">
                                          📱 Background đẹp cho lock screen - chừa chỗ cho đồng hồ & icons
                                       </p>
                                    )}

                                    {/* Lookbook Mode Toggle */}
                                    <button
                                       onClick={() => setLookbookMode(!lookbookMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-lg border transition-all flex items-center justify-between
                                    ${lookbookMode
                                             ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                             : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">📸</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Lookbook Mode</span>
                                             <span className="text-[8px] opacity-70">20 ảnh, không video</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${lookbookMode ? 'bg-amber-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${lookbookMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {lookbookMode && (
                                       <p className="mt-1.5 text-[8px] text-amber-300/60 px-1">
                                          📷 Tạo 33 ảnh lookbook: standing, dynamic, seated, squat, bodice/hip focus (safe vocabulary)
                                       </p>
                                    )}

                                    {/* Seductive Mode Toggle */}
                                    <button
                                       onClick={() => setSeductiveMode(!seductiveMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-lg border transition-all flex items-center justify-between
                                    ${seductiveMode
                                             ? 'bg-pink-500/20 border-pink-500/50 text-pink-200'
                                             : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">💋</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Seductive Mode</span>
                                             <span className="text-[8px] opacity-70">Quyến rũ TikTok-safe</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${seductiveMode ? 'bg-pink-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${seductiveMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {seductiveMode && (
                                       <p className="mt-1.5 text-[8px] text-pink-300/60 px-1">
                                          💃 Video quyến rũ: smoldering gaze, magnetic presence, slow movements
                                       </p>
                                    )}

                                    {/* Sexy Mode Toggle - Private */}
                                    <button
                                       onClick={() => setSexyMode(!sexyMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-lg border transition-all flex items-center justify-between
                                    ${sexyMode
                                             ? 'bg-red-500/20 border-red-500/50 text-red-200'
                                             : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🔥</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Sexy Mode</span>
                                             <span className="text-[8px] opacity-70">Nano Banana Pro & Veo 3.1</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${sexyMode ? 'bg-red-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${sexyMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {sexyMode && (
                                       <p className="mt-1.5 text-[8px] text-red-300/60 px-1">
                                          🔞 Chế độ riêng tư: nội dung sexy cho AI video tools
                                       </p>
                                    )}

                                    {/* Studio Mode Toggle - Professional TikTok Affiliate backgrounds */}
                                    <button
                                       onClick={() => setStudioMode(!studioMode)}
                                       className={`w-full mt-2 py-2 px-3 rounded-lg border transition-all flex items-center justify-between
                                    ${studioMode
                                             ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                                             : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="text-base">🎬</span>
                                          <div className="text-left">
                                             <span className="text-[10px] font-medium block">Studio Mode</span>
                                             <span className="text-[8px] opacity-70">Professional themed backgrounds</span>
                                          </div>
                                       </div>
                                       <div className={`w-8 h-4 rounded-full transition-all relative ${studioMode ? 'bg-indigo-500' : 'bg-zinc-700'}`}>
                                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${studioMode ? 'left-4' : 'left-0.5'}`} />
                                       </div>
                                    </button>
                                    {studioMode && (
                                       <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                                          {/* Studio Category Selector */}
                                          <div className="p-2 bg-indigo-900/10 border border-indigo-500/20 rounded">
                                             <div className="flex items-center justify-between mb-2">
                                                <span className="text-[9px] text-indigo-300 font-medium">🎬 Chọn loại Studio</span>
                                                {studioVault.length > 0 && (
                                                   <button
                                                      onClick={clearStudioVault}
                                                      className="text-[8px] text-red-400 hover:text-red-300 flex items-center gap-1"
                                                   >
                                                      <Trash2 className="w-2.5 h-2.5" /> Xóa vault
                                                   </button>
                                                )}
                                             </div>
                                             <div className="grid grid-cols-2 gap-1">
                                                {STUDIO_CATEGORIES.map((cat) => (
                                                   <button
                                                      key={cat.value}
                                                      onClick={() => setStudioCategory(cat.value)}
                                                      className={`py-1 px-2 rounded text-left border transition-all flex items-center gap-1
                                                         ${studioCategory === cat.value
                                                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                                                            : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                                                   >
                                                      <span className="text-xs">{cat.emoji}</span>
                                                      <span className="text-[8px] font-medium truncate">{cat.label.replace(' Studios', '').replace(' Tết & Hội', '')}</span>
                                                   </button>
                                                ))}
                                             </div>
                                             {/* Selected Category Info */}
                                             <div className="mt-2 text-[8px] text-indigo-300/70">
                                                {studioCategory === 'auto' ? (
                                                   <span>🎲 AI tự chọn từ {STUDIO_CATEGORIES.reduce((acc, c) => acc + (c.studios?.length || 0), 0)} studios</span>
                                                ) : (
                                                   <span>
                                                      {STUDIO_CATEGORIES.find(c => c.value === studioCategory)?.studios?.length || 0} studios -
                                                      {getRandomStudios(studioCategory, 10).length} khả dụng
                                                   </span>
                                                )}
                                             </div>
                                          </div>
                                          {/* Studio Vault History */}
                                          {studioVault.length > 0 && (
                                             <div className="p-2 bg-zinc-800/30 border border-zinc-700/30 rounded">
                                                <div className="flex items-center justify-between mb-1">
                                                   <span className="text-[8px] text-zinc-400 flex items-center gap-1">
                                                      <History className="w-2.5 h-2.5" />
                                                      {studioVault.length} studio đã dùng
                                                   </span>
                                                </div>
                                                <div className="text-[7px] text-zinc-500 space-y-0.5 max-h-16 overflow-y-auto">
                                                   {studioVault.slice(0, 3).map((item, i) => (
                                                      <div key={item.id} className="truncate">
                                                         • {item.studio.split(' | ')[0]}
                                                      </div>
                                                   ))}
                                                   {studioVault.length > 3 && (
                                                      <div className="text-zinc-600">...và {studioVault.length - 3} khác</div>
                                                   )}
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    )}

                                    {/* Aspect Ratio Selector */}
                                    <div className="mt-3 pt-2 border-t border-zinc-800/50">
                                       <div className="text-[9px] text-zinc-500 mb-2 flex items-center gap-1">
                                          📐 Tỷ lệ khung hình
                                       </div>
                                       <div className="grid grid-cols-2 gap-2">
                                          <button
                                             onClick={() => setAspectRatio('9:16')}
                                             className={`py-2 px-3 rounded-lg border transition-all flex flex-col items-center gap-1
                                          ${aspectRatio === '9:16'
                                                   ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                                                   : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                          >
                                             <div className="w-4 h-6 border-2 rounded-sm ${aspectRatio === '9:16' ? 'border-blue-400' : 'border-zinc-500'}" />
                                             <span className="text-[9px] font-medium">9:16 Dọc</span>
                                             <span className="text-[7px] opacity-60">TikTok, Reels</span>
                                          </button>
                                          <button
                                             onClick={() => setAspectRatio('16:9')}
                                             className={`py-2 px-3 rounded-lg border transition-all flex flex-col items-center gap-1
                                          ${aspectRatio === '16:9'
                                                   ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                                                   : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600'}`}
                                          >
                                             <div className="w-6 h-4 border-2 rounded-sm ${aspectRatio === '16:9' ? 'border-emerald-400' : 'border-zinc-500'}" />
                                             <span className="text-[9px] font-medium">16:9 Ngang</span>
                                             <span className="text-[7px] opacity-60">Desktop, YouTube</span>
                                          </button>
                                       </div>
                                       {aspectRatio === '16:9' && (
                                          <p className="mt-1.5 text-[8px] text-emerald-300/60 px-1">
                                             🖥️ Khung hình ngang - model nhỏ hơn, background rõ hơn, cinematic
                                          </p>
                                       )}
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* 2. Cinematography (Auto) & Location Vault */}
                     <div className="space-y-3 pt-3 border-t border-zinc-800/50">
                        <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center text-xs font-semibold text-zinc-400 gap-1.5">
                              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> Auto-Director
                           </div>
                           <span className="text-[9px] uppercase tracking-wider text-purple-400/80 font-medium">AI Active</span>
                        </div>
                        <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                           <p className="text-[10px] text-purple-200/70 leading-relaxed">
                              {appMode === 'tiktok' && "The AI Director will choreograph viral dance moves and simulate a TikTok-style camera."}
                              {appMode === 'tiktok_shop' && "Real-life production script: 32s video with motion prompts, Vietnamese sales script, and production notes for your team."}
                              {appMode === 'cinematic' && "The AI Director will automatically select the optimal Camera Angle, Lens, Lighting, and Environment."}
                           </p>

                           {/* Location History Panel */}
                           {locationVault.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-purple-500/10">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] text-zinc-500 flex items-center gap-1">
                                       <History className="w-3 h-3" /> Lịch sử bối cảnh
                                    </span>
                                    <button
                                       onClick={clearLocationVault}
                                       className="text-[8px] text-red-400/70 hover:text-red-300 flex items-center gap-0.5"
                                    >
                                       <Trash2 className="w-2.5 h-2.5" /> Xóa tất cả
                                    </button>
                                 </div>
                                 <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {locationVault.slice(0, 5).map((item) => (
                                       <div key={item.id} className="flex items-center gap-2 text-[9px] p-1.5 bg-zinc-900/50 rounded group">
                                          <span className="text-zinc-600">
                                             {LOCATION_REGIONS.find(r => r.value === item.region)?.emoji || '📍'}
                                          </span>
                                          <span className="flex-1 text-zinc-400 truncate" title={item.location}>
                                             {item.location.slice(0, 40)}...
                                          </span>
                                          <button
                                             onClick={() => removeFromVault(item.id)}
                                             className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-opacity"
                                          >
                                             <X className="w-3 h-3" />
                                          </button>
                                       </div>
                                    ))}
                                    {locationVault.length > 5 && (
                                       <p className="text-[8px] text-zinc-600 text-center">+{locationVault.length - 5} khác</p>
                                    )}
                                 </div>
                              </div>
                           )}

                           {/* Script History Panel - TikTok Shop only */}
                           {appMode === 'tiktok_shop' && scriptVault.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-orange-500/10">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] text-zinc-500 flex items-center gap-1">
                                       <FileText className="w-3 h-3" /> Script đã dùng ({scriptVault.length})
                                    </span>
                                    <button
                                       onClick={clearScriptVault}
                                       className="text-[8px] text-red-400/70 hover:text-red-300 flex items-center gap-0.5"
                                    >
                                       <Trash2 className="w-2.5 h-2.5" /> Xóa
                                    </button>
                                 </div>
                                 <div className="space-y-1 max-h-20 overflow-y-auto">
                                    {scriptVault.slice(0, 4).map((item) => (
                                       <div key={item.id} className="text-[9px] p-1.5 bg-zinc-900/50 rounded text-zinc-500 truncate" title={item.hook}>
                                          "{item.hook.slice(0, 50)}..."
                                       </div>
                                    ))}
                                    {scriptVault.length > 4 && (
                                       <p className="text-[8px] text-zinc-600 text-center">+{scriptVault.length - 4} khác</p>
                                    )}
                                 </div>
                                 <p className="text-[8px] text-orange-400/60 mt-1.5">AI sẽ tránh các hook tương tự</p>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* 3. Duration */}
                     <div className="space-y-3 pt-3 border-t border-zinc-800/50">
                        <div className="flex items-center justify-between text-xs">
                           <span className="font-semibold text-zinc-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Timeline</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                           {['8', '16', '24', '32'].map((dur) => (
                              <button key={dur} onClick={() => setVideoDuration(dur)}
                                 disabled={appMode === 'tiktok_shop' && dur !== '32'}
                                 className={`py-1.5 rounded text-[10px] font-medium border transition-all 
                              ${(appMode === 'tiktok_shop' && dur === '32') || (appMode !== 'tiktok_shop' && videoDuration === dur)
                                       ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                                       : appMode === 'tiktok_shop' ? 'opacity-30 cursor-not-allowed bg-zinc-900 border-zinc-800' : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
                                 {dur}s
                              </button>
                           ))}
                        </div>
                        {appMode === 'tiktok_shop' && <p className="text-[9px] text-orange-400 text-right">Fixed 32s for Sales format</p>}
                     </div>
                  </div>

                  {/* Brief Input */}
                  <div className="relative">
                     <textarea
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        className="w-full h-20 bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 resize-none"
                        placeholder={appMode === 'tiktok' ? "Describe the vibe (e.g., K-pop, Hip-hop, Cute) or specific song beat..." : "Additional creative details..."}
                     />
                     <button
                        onClick={runDirector}
                        disabled={!outfitImage || directorThinking}
                        className={`absolute bottom-2 right-2 p-2 rounded-lg transition-all
                     ${outfitImage && !directorThinking ? 'bg-purple-600 text-white shadow-lg hover:scale-105' : 'bg-zinc-800 text-zinc-600'}`}
                     >
                        {directorThinking ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                     </button>
                  </div>

               </div>
            </div>

            {/* Right Panel: Results */}
            <div className="lg:col-span-7 flex flex-col h-full min-h-[600px]">
               <div className="glass-panel rounded-2xl h-full flex flex-col relative overflow-hidden border border-zinc-800 bg-black/20">

                  {/* 1. Director View */}
                  {step === 'director' && (
                     <div className="absolute inset-0 z-10 flex flex-col bg-[#09090b]">

                        {directorThinking || videoRefining ? (
                           <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                              <div className="relative">
                                 <div className="w-16 h-16 border-4 border-zinc-800 rounded-full"></div>
                                 <div className={`w-16 h-16 border-4 ${videoRefining ? 'border-pink-500' : 'border-purple-500'} border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
                              </div>
                              <div className="text-center">
                                 {videoRefining ? (
                                    <>
                                       <h3 className="text-lg font-display text-white flex items-center justify-center gap-2">
                                          <Sparkles className="w-5 h-5 text-pink-400" />
                                          Phase 2: Refining Video Scenes
                                       </h3>
                                       <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">
                                          AI đang tối ưu scene prompts liền mạch hơn
                                       </p>
                                       <div className="mt-4 text-[10px] text-pink-400 space-y-1">
                                          <p>✓ Checking character consistency</p>
                                          <p>✓ Verifying outfit preservation</p>
                                          <p>✓ Ensuring seamless transitions</p>
                                          <p className="animate-pulse">⟳ Syncing to beat pattern...</p>
                                       </div>
                                    </>
                                 ) : (
                                    <>
                                       <h3 className="text-lg font-display text-white">
                                          {appMode === 'tiktok' && "Phase 1: Choreographing Dance"}
                                          {appMode === 'tiktok_shop' && "Phase 1: Analyzing Product & Strategy"}
                                          {appMode === 'cinematic' && "Phase 1: Director is Filming"}
                                       </h3>
                                       <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">
                                          {appMode === 'tiktok' && "Syncing Moves & Camera"}
                                          {appMode === 'tiktok_shop' && "Generating Real Production Script (Ra Đơn Thật)"}
                                          {appMode === 'cinematic' && "Scouting Locations & Lighting"}
                                       </p>
                                       <p className="text-[10px] text-purple-400 mt-3">
                                          Phase 2 (Video Refinement) will run automatically
                                       </p>
                                    </>
                                 )}
                                 {locationVault.length > 0 && !videoRefining && (
                                    <p className="text-[10px] text-purple-400 mt-2">
                                       Avoiding {locationVault.length} previous locations
                                    </p>
                                 )}
                              </div>
                           </div>
                        ) : (
                           <>
                              {/* Tab Header */}
                              <div className="flex items-center gap-2 p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur flex-wrap">
                                 <TabButton active={activeTab === 'master'} onClick={() => setActiveTab('master')} icon={Camera} label="Master Prompt" />
                                 <TabButton active={activeTab === 'keyframes'} onClick={() => setActiveTab('keyframes')} icon={Layers} label="Keyframes" />
                                 <TabButton active={activeTab === 'scenes'} onClick={() => setActiveTab('scenes')} icon={Clapperboard} label={appMode === 'tiktok_shop' ? "Scenes & Script" : "Video Scenes"} />
                                 {directorOutput?.sections.refinedScenes && (
                                    <TabButton active={activeTab === 'refined'} onClick={() => setActiveTab('refined')} icon={Sparkles} label="✨ Refined Scenes" />
                                 )}
                                 {appMode === 'tiktok_shop' && directorOutput?.sections.production && (
                                    <TabButton active={activeTab === 'production'} onClick={() => setActiveTab('production')} icon={FileText} label="Production Notes" />
                                 )}
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 overflow-y-auto p-6 relative">
                                 <div className="font-mono text-sm leading-relaxed text-zinc-300">
                                    {activeTab === 'master' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 relative">
                                          <div>
                                             <h4 className="text-purple-400 mb-2 text-xs font-bold uppercase tracking-widest">Common Master Prompt</h4>
                                             <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800/50 whitespace-pre-wrap relative group">
                                                {directorOutput?.sections.master}
                                                <CopyButton text={directorOutput?.sections.master || ''} />
                                             </div>
                                             <p className="mt-2 text-[10px] text-zinc-500">
                                                Use this prompt as the "Common Prompt" in your generation tool. It defines the character, outfit, and style for the entire video.
                                             </p>
                                          </div>
                                       </div>
                                    )}
                                    {activeTab === 'keyframes' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <h4 className="text-blue-400 mb-2 text-xs font-bold uppercase tracking-widest">Image Sequence</h4>
                                          {parseSegments(directorOutput?.sections.keyframes || '', 'image').map((segment, idx) => (
                                             <div key={idx} className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden relative group">
                                                <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800/50 flex justify-between items-center">
                                                   <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">{segment.title}</span>
                                                </div>
                                                <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300">
                                                   {segment.content}
                                                </div>
                                                <CopyButton text={segment.content} />
                                             </div>
                                          ))}
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             Copy individual prompts to generate keyframes (Start, Middle, End).
                                          </p>
                                       </div>
                                    )}
                                    {activeTab === 'scenes' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <h4 className="text-green-400 mb-2 text-xs font-bold uppercase tracking-widest">
                                             {appMode === 'tiktok_shop' ? 'Scene Prompts & Vietnamese Script' : 'Veo Video Prompts (Phase 1)'}
                                          </h4>
                                          {directorOutput?.sections.refinedScenes && (
                                             <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                                                <p className="text-xs text-purple-300">
                                                   💡 <strong>Tip:</strong> Check the <span className="text-pink-400 font-bold">✨ Refined Scenes</span> tab for improved video continuity!
                                                </p>
                                             </div>
                                          )}
                                          {parseSegments(directorOutput?.sections.scenes || '', 'scene').map((segment, idx) => (
                                             <div key={idx} className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden relative group">
                                                <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800/50 flex justify-between items-center">
                                                   <span className="text-[10px] font-bold text-green-300 uppercase tracking-wider">{segment.title}</span>
                                                </div>
                                                <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300">
                                                   {segment.content}
                                                </div>
                                                <CopyButton text={segment.content} />
                                             </div>
                                          ))}
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             {appMode === 'tiktok_shop'
                                                ? 'Each scene includes motion prompt and Vietnamese sales script. Use for real video shooting.'
                                                : 'Use these prompts for the "Image-to-Video" generation of each 8-second segment.'}
                                          </p>
                                       </div>
                                    )}
                                    {activeTab === 'refined' && directorOutput?.sections.refinedScenes && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <div className="flex items-center justify-between mb-4">
                                             <h4 className="text-pink-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                Refined Video Scenes (Phase 2)
                                             </h4>
                                             <span className="text-[10px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 px-2 py-1 rounded-full border border-pink-500/30">
                                                AI-Enhanced Continuity
                                             </span>
                                          </div>
                                          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                                             <p className="text-xs text-purple-200 leading-relaxed">
                                                <strong>✨ Phase 2 Refinement:</strong> These scene prompts have been analyzed by AI to ensure:
                                             </p>
                                             <ul className="text-[10px] text-purple-300 mt-2 space-y-1 ml-4">
                                                <li>✓ <strong>Character Consistency:</strong> Same face, body, outfit in all scenes</li>
                                                <li>✓ <strong>Seamless Transitions:</strong> END_POSE → START_POSE matches perfectly</li>
                                                <li>✓ <strong>Living Environment:</strong> Ambient motion (wind, light, background)</li>
                                                <li>✓ <strong>Beat-Sync:</strong> Poses aligned with remix drops and beats</li>
                                                <li>✓ <strong>Fabric Physics:</strong> Consistent outfit behavior during motion</li>
                                             </ul>
                                          </div>
                                          <div className="bg-zinc-900/50 rounded-lg border border-pink-800/30 overflow-hidden relative group">
                                             <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-4 py-3 border-b border-pink-800/30 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Full Refined Scene Prompts</span>
                                             </div>
                                             <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto">
                                                {directorOutput?.sections.refinedScenes}
                                             </div>
                                             <CopyButton text={directorOutput?.sections.refinedScenes || ''} />
                                          </div>
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             🎬 Use these REFINED prompts for Veo 3.1 to get smoother, more consistent video results with better beat sync.
                                          </p>
                                       </div>
                                    )}
                                    {activeTab === 'production' && appMode === 'tiktok_shop' && (
                                       <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                                          <h4 className="text-orange-400 mb-2 text-xs font-bold uppercase tracking-widest">Production Notes</h4>
                                          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden relative">
                                             <div className="bg-orange-900/20 px-4 py-2 border-b border-orange-800/30 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">Shooting Guide</span>
                                             </div>
                                             <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300 leading-relaxed">
                                                {directorOutput?.sections.production}
                                             </div>
                                             <CopyButton text={directorOutput?.sections.production || ''} />
                                          </div>
                                          {directorOutput?.sections.metadata && (
                                             <div className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden relative mt-4">
                                                <div className="bg-purple-900/20 px-4 py-2 border-b border-purple-800/30">
                                                   <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Metadata & Batch Info</span>
                                                </div>
                                                <div className="p-4 pr-12 whitespace-pre-wrap text-xs text-zinc-300">
                                                   {directorOutput?.sections.metadata}
                                                </div>
                                                <CopyButton text={directorOutput?.sections.metadata || ''} />
                                             </div>
                                          )}
                                          <p className="mt-2 text-[10px] text-zinc-500">
                                             Use these notes to guide your production team. Includes camera setup, framing, and retake flexibility for each scene.
                                          </p>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              {/* Footer Actions */}
                              <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-between items-center">
                                 <button onClick={reset} className="text-xs text-zinc-500 hover:text-white transition-colors">CLEAR OUTPUT</button>
                                 <button
                                    onClick={runDirector}
                                    className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-700 hover:text-white transition-all flex items-center gap-2"
                                 >
                                    <RotateCcw className="w-4 h-4" /> Regenerate Prompts
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  )}

                  {/* 3. Placeholder */}
                  {step === 'input' && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 space-y-4">
                        <Film className="w-12 h-12 opacity-20" />
                        <p className="text-xs uppercase tracking-widest opacity-50">Studio Idle</p>
                     </div>
                  )}

               </div>
            </div>
         </div>
      </div>
   );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);