import React from "react";
import { createRoot, type Root } from "react-dom/client";
import type { LikeC4PluginSettings } from "./settings";
import { modelCache } from "./cache";

import { fromSource } from "@likec4/language-services/browser";
import { LikeC4ModelProvider, LikeC4View } from "@likec4/diagram";

const roots = new WeakMap<HTMLElement, Root>();

function getColorScheme(
  setting: LikeC4PluginSettings["colorScheme"],
): "light" | "dark" {
  if (setting === "light" || setting === "dark") return setting;
  if (typeof document !== "undefined") {
    return document.body.classList.contains("theme-dark") ? "dark" : "light";
  }
  return "dark";
}

export async function renderDiagram(
  container: HTMLElement,
  dslSource: string,
  viewId: string | undefined,
  settings: LikeC4PluginSettings,
): Promise<void> {
  modelCache.setMaxSize(settings.cacheSize);

  let layoutedModel;
  let diagrams;

  // Check cache first
  const cached = modelCache.get(dslSource);
  if (cached) {
    layoutedModel = cached.model;
    diagrams = cached.diagrams;
  } else {
    const likec4 = await fromSource(dslSource);
    layoutedModel = await likec4.layoutedModel();
    diagrams = await likec4.diagrams();
    modelCache.set(dslSource, layoutedModel, diagrams);
    await likec4.dispose();
  }

  if (diagrams.length === 0) {
    throw new Error(
      'No views found in the LikeC4 model. Define views using:\nviews {\n  view index {\n    include *\n  }\n}',
    );
  }

  let targetViewId = viewId;
  if (!targetViewId) {
    targetViewId = diagrams[0]!.id;
  } else {
    const exists = diagrams.some((d) => d.id === targetViewId);
    if (!exists) {
      const available = diagrams.map((d) => d.id).join(", ");
      throw new Error(
        `View "${targetViewId}" not found. Available views: ${available}`,
      );
    }
  }

  const colorScheme = getColorScheme(settings.colorScheme);

  // Clear the container
  container.empty();

  const root = createRoot(container);
  roots.set(container, root);

  root.render(
    React.createElement(
      LikeC4ModelProvider,
      { likec4model: layoutedModel },
      React.createElement(LikeC4View, {
        viewId: targetViewId as any,
        browser: settings.showBrowser,
        colorScheme,
        keepAspectRatio: false,
        pannable: false,
        zoomable: false,
        background: "transparent",
        fitView: true,
        controls: false,
        injectFontCss: true,
        style: { width: "100%", height: "100%" },
      }),
    ),
  );
}

export function unmountDiagram(container: HTMLElement): void {
  const root = roots.get(container);
  if (root) {
    root.unmount();
    roots.delete(container);
  }
}
