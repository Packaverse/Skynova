import { generateUUID } from '@/utils/uuid';

export interface MinecraftManifest {
  format_version: number;
  header: {
    description: string;
    name: string;
    uuid: string;
    version: number[];
    min_engine_version: number[];
  };
  modules: Array<{
    description: string;
    type: string;
    uuid: string;
    version: number[];
  }>;
}

/**
 * Generates a Minecraft Bedrock Edition manifest.json
 */
export const generateManifest = (imageName: string): MinecraftManifest => {
  return {
    format_version: 2,
    header: {
      description: "https://discord.gg/hXRBsvksRX",
      name: imageName,
      uuid: generateUUID(),
      version: [1, 0, 0],
      min_engine_version: [1, 16, 0]
    },
    modules: [
      {
        description: "Custom sky texture pack",
        type: "resources",
        uuid: generateUUID(),
        version: [1, 0, 0]
      }
    ]
  };
};
