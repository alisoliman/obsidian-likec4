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
    const loader = this.containerEl.createDiv({ cls: "likec4-loading" });
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.style.height = "100%";
    loader.style.color = "var(--text-muted)";
    loader.style.fontSize = "0.9em";
    loader.setText("Loading LikeC4 diagram…");
  }

  private showError(err: unknown) {
    this.containerEl.empty();
    const errorEl = this.containerEl.createDiv({ cls: "likec4-error" });
    errorEl.style.padding = "16px";
    errorEl.style.color = "var(--text-error)";
    errorEl.style.backgroundColor = "var(--background-modifier-error)";
    errorEl.style.borderRadius = "4px";
    errorEl.style.fontFamily = "var(--font-monospace)";
    errorEl.style.fontSize = "0.85em";
    errorEl.style.whiteSpace = "pre-wrap";

    const message =
      err instanceof Error ? err.message : "Unknown error rendering diagram";
    errorEl.setText(`LikeC4 Error: ${message}`);
  }
}
