import { Plugin } from "obsidian";
import { LikeC4CodeBlockProcessor } from "./LikeC4CodeBlockProcessor";
import { DEFAULT_SETTINGS, LikeC4SettingTab, type LikeC4PluginSettings } from "./settings";
import { modelCache } from "./cache";

export default class LikeC4Plugin extends Plugin {
  settings: LikeC4PluginSettings = DEFAULT_SETTINGS;
  private processor: LikeC4CodeBlockProcessor | null = null;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new LikeC4SettingTab(this.app, this));

    this.processor = new LikeC4CodeBlockProcessor(this);

    this.registerMarkdownCodeBlockProcessor(
      "likec4",
      (source, el, ctx) => this.processor!.process(source, el, ctx),
    );
  }

  onunload() {
    this.processor?.dispose();
    this.processor = null;
    modelCache.clear();
  }

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData(),
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
