import { App, PluginSettingTab, Setting } from "obsidian";
import type LikeC4Plugin from "./main";

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

export class LikeC4SettingTab extends PluginSettingTab {
  plugin: LikeC4Plugin;

  constructor(app: App, plugin: LikeC4Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Diagram height")
      .setDesc("Default height in pixels for rendered diagrams.")
      .addText((text) =>
        text
          .setPlaceholder("400")
          .setValue(String(this.plugin.settings.diagramHeight))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.diagramHeight = num;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Color scheme")
      .setDesc("Diagram color scheme. Auto follows Obsidian's theme.")
      .addDropdown((dropdown) =>
        dropdown
          .addOptions({ auto: "Auto", light: "Light", dark: "Dark" })
          .setValue(this.plugin.settings.colorScheme)
          .onChange(async (value) => {
            this.plugin.settings.colorScheme = value as LikeC4PluginSettings["colorScheme"];
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Interactive browser")
      .setDesc("Click a diagram to open a full interactive browser overlay.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showBrowser)
          .onChange(async (value) => {
            this.plugin.settings.showBrowser = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Cache size")
      .setDesc("Maximum number of parsed models to cache in memory.")
      .addText((text) =>
        text
          .setPlaceholder("20")
          .setValue(String(this.plugin.settings.cacheSize))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.cacheSize = num;
              await this.plugin.saveSettings();
            }
          }),
      );
  }
}
