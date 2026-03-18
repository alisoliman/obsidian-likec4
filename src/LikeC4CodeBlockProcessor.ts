import type { MarkdownPostProcessorContext } from "obsidian";
import type LikeC4Plugin from "./main";
import { LikeC4RenderChild } from "./LikeC4RenderChild";

interface CodeBlockOptions {
  viewId?: string;
  height?: number;
}

function parseOptions(firstLine: string): {
  options: CodeBlockOptions;
  remainingSource: string;
  hasOptions: boolean;
} {
  // Check if first line contains options like: view=index height=500
  const optionPattern = /^((?:\w+=\S+\s*)+)$/;
  const lines = firstLine.split("\n");
  const first = lines[0]?.trim() ?? "";

  if (first && optionPattern.test(first)) {
    const options: CodeBlockOptions = {};
    const parts = first.split(/\s+/);
    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key === "view" && value) {
        options.viewId = value;
      } else if (key === "height" && value) {
        const h = parseInt(value, 10);
        if (!isNaN(h) && h > 0) options.height = h;
      }
    }
    return {
      options,
      remainingSource: lines.slice(1).join("\n"),
      hasOptions: true,
    };
  }

  return { options: {}, remainingSource: firstLine, hasOptions: false };
}

export class LikeC4CodeBlockProcessor {
  private plugin: LikeC4Plugin;
  private activeChildren: Set<LikeC4RenderChild> = new Set();

  constructor(plugin: LikeC4Plugin) {
    this.plugin = plugin;
  }

  process(
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext,
  ): void {
    const { options, remainingSource, hasOptions } = parseOptions(source);

    const dslSource = hasOptions ? remainingSource : source;

    if (!dslSource.trim()) {
      this.renderError(el, "Empty LikeC4 code block. Add a model definition.");
      return;
    }

    const height = options.height ?? this.plugin.settings.diagramHeight;
    const viewId = options.viewId;

    const container = el.createDiv({ cls: "likec4-diagram-container" });
    container.setCssProps({ "--likec4-height": `${height}px` });

    const child = new LikeC4RenderChild(
      container,
      dslSource,
      viewId,
      this.plugin.settings,
    );
    this.activeChildren.add(child);
    child.onCleanup(() => this.activeChildren.delete(child));
    ctx.addChild(child);
  }

  private renderError(el: HTMLElement, message: string) {
    el.createDiv({ cls: "likec4-error", text: message });
  }

  dispose() {
    for (const child of this.activeChildren) {
      child.unload();
    }
    this.activeChildren.clear();
  }
}
