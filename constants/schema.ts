// JSON Output Schema for Nano Banana Pro & Veo 3.1
export const JSON_OUTPUT_SCHEMA = {
   type: "object",
   properties: {
      masterPrompt: {
         type: "object",
         description: "Nano Banana Pro master prompt for face/body/outfit consistency - NO POSE (pose is in keyframes only)",
         properties: {
            facePreservation: { type: "string", description: "CRITICAL: Face preservation instruction - must reference exact facial features from reference image" },
            subject: { type: "string", description: "Subject description with age, ethnicity, body type (NO face details here - use facePreservation)" },
            outfit: { type: "string", description: "Complete outfit with fabric materials (silk, denim, etc.)" },
            environment: { type: "string", description: "Real-world location (must be findable on Google Maps)" },
            lighting: { type: "string", description: "Lighting setup (cinematic, golden hour, Rembrandt, etc.)" },
            camera: { type: "string", description: "Camera angle and lens (medium shot, 85mm f/1.4, etc.)" },
            style: { type: "string", description: "Visual style (photorealistic fashion photography)" }
         }
      },
      keyframes: {
         type: "array",
         description: "Nano Banana Pro keyframe prompts (static images)",
         items: {
            type: "object",
            properties: {
               id: { type: "number" },
               timestamp: { type: "string", description: "Timestamp in video (00s, 08s, 16s...)" },
               subject: { type: "string", description: "Brief subject reference with 'exact facial features preserved from reference'" },
               action: { type: "string", description: "Current static pose/interaction (NOT motion)" },
               environment: { type: "string", description: "Specific location details" },
               lighting: { type: "string", description: "Lighting for this frame" },
               camera: { type: "string", description: "Camera angle (close-up, wide, low angle...)" },
               style: { type: "string", description: "Photorealistic style keywords" }
            }
         }
      },
      scenes: {
         type: "array",
         description: "Veo 3.1 scene prompts (motion between keyframes)",
         items: {
            type: "object",
            properties: {
               id: { type: "number" },
               timeRange: { type: "string", description: "Time range (00s-08s)" },
               shotType: { type: "string", description: "Shot type (tracking, drone, static...)" },
               subjectMotion: { type: "string", description: "What subject is doing (5-8 seconds)" },
               cameraMotion: { type: "string", description: "Camera movement (pan, tilt, zoom, tracking...)" },
               atmosphere: { type: "string", description: "Mood and ambient motion" },
               startPose: { type: "string", description: "Pose at start (matches previous keyframe)" },
               endPose: { type: "string", description: "Pose at end (matches next keyframe)" },
               beatMarkers: { type: "array", description: "Beat timestamps within scene for pose snaps", items: { type: "string" } },
               beatActions: { type: "array", description: "Actions synced to each beatMarker", items: { type: "string" } },
               script: { type: "string", description: "Vietnamese script for this scene" },
               voiceConfig: {
                  type: "object",
                  description: "Voice configuration for Veo 3.1 lip-sync",
                  properties: {
                     voice_profile: { type: "string", description: "Voice profile" },
                     vocal_tone: { type: "string", description: "Vocal tone" },
                     sync: { type: "string", description: "Lip-sync quality" }
                  }
               }
            }
         }
      },
      beatSync: {
         type: "object",
         description: "TikTok Auto-Cut Beat Synchronization - Optimized for REMIX music",
         properties: {
            bpm: { type: "number", description: "Beats per minute of the music (typically 120-160 for remix)" },
            beatPattern: { type: "string", description: "Beat pattern" },
            keyBeats: {
               type: "array",
               description: "Key beat timestamps for pose changes/cuts",
               items: {
                  type: "object",
                  properties: {
                     timestamp: { type: "string", description: "Beat timestamp" },
                     action: { type: "string", description: "Action type" },
                     intensity: { type: "string", description: "Intensity: 'soft', 'medium', 'hard', 'explosive'" }
                  }
               }
            },
            dropTimestamps: { type: "array", description: "Exact timestamps of bass drops", items: { type: "string" } },
            transitionStyle: { type: "string", description: "Cut transition style" },
            musicMood: { type: "string", description: "Music mood" }
         }
      },
      metadata: {
         type: "object",
         properties: {
            location: { type: "string", description: "Specific real-world location" },
            duration: { type: "number", description: "Total video duration in seconds" },
            aspectRatio: { type: "string", description: "9:16 or 16:9" },
            musicVibe: { type: "string", description: "Suggested music style with BPM range" },
            autoCutReady: { type: "boolean", description: "Whether poses are designed for TikTok auto-cut sync" }
         }
      }
   }
};
