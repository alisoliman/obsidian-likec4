export interface LikeC4PluginSettings {
  diagramHeight: number;
  colorScheme: "light" | "dark" | "auto";
  showBrowser: boolean;
  cacheSize: number;
}

export const DEFAULT_SETTINGS: LikeC4PluginSettings = {
  diagramHeight: 400,
  colorScheme: "auto",
  showBrowser: true,
  cacheSize: 20,
};
