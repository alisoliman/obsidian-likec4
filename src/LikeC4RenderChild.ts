import { MarkdownRenderChild } from "obsidian";
import type { LikeC4PluginSettings } from "./settings";
import { renderDiagram, unmountDiagram } from "./LikeC4ReactRenderer";

export class LikeC4RenderChild extends MarkdownRenderChild {
  private dslSource: string;
  private viewId: string | undefined;
  private settings: LikeC4PluginSettings;
  private cleanupCallbacks: Array<() => void> = [];
  private mounted = false;

  constructor(
    containerEl: HTMLElement,
    dslSource: string,
    viewId: string | undefined,
    settings: LikeC4PluginSettings,
  ) {
    super(containerEl);
    this.dslSource = dslSource;
    this.viewId = viewId;
    this.settings = settings;
  }

  async onload() {
    this.mounted = true;
    this.showLoading();

    try {
      await renderDiagram(
        this.containerEl,
        this.dslSource,
        this.viewId,
        this.settings,
      );
    } catch (err) {
      if (this.mounted) {
        this.showError(err);
      }
    }
  }

  onunload() {
    this.mounted = false;
    unmountDiagram(this.containerEl);
    for (const cb of this.cleanupCallbacks) {
      cb();
    }
    this.cleanupCallbacks = [];
  }

  onCleanup(cb: () => void) {
    this.cleanupCallbacks.push(cb);
  }

  private showLoading() {
    this.containerEl.createDiv({
      cls: "likec4-loading",
      text: "Loading LikeC4 diagram…",
    });
  }

  private showError(err: unknown) {
    this.containerEl.empty();
    const message =
      err instanceof Error ? err.message : "Unknown error rendering diagram";
    this.containerEl.createDiv({
      cls: "likec4-error",
      text: `LikeC4 Error: ${message}`,
    });
  }
}
