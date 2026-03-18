import type { LikeC4Model } from "@likec4/core/model";

interface CacheEntry {
  model: LikeC4Model<any>;
  diagrams: any[];
  source: string;
  accessedAt: number;
}

class ModelCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 20;

  setMaxSize(size: number) {
    this.maxSize = Math.max(1, size);
    this.evict();
  }

  get(source: string): CacheEntry | undefined {
    const key = this.keyFor(source);
    const entry = this.cache.get(key);
    if (entry && entry.source === source) {
      entry.accessedAt = Date.now();
      return entry;
    }
    return undefined;
  }

  set(source: string, model: LikeC4Model<any>, diagrams: any[]) {
    const key = this.keyFor(source);
    this.cache.set(key, { model, diagrams, source, accessedAt: Date.now() });
    this.evict();
  }

  private keyFor(source: string): string {
    // Use full source for short inputs, DJB2 hash for longer ones
    if (source.length < 512) return source;
    let h = 5381;
    for (let i = 0; i < source.length; i++) {
      h = ((h << 5) + h + source.charCodeAt(i)) | 0;
    }
    return `h:${h.toString(36)}:${source.length}`;
  }

  private evict() {
    while (this.cache.size > this.maxSize) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      for (const [key, entry] of this.cache) {
        if (entry.accessedAt < oldestTime) {
          oldestTime = entry.accessedAt;
          oldestKey = key;
        }
      }
      if (oldestKey) {
        this.cache.delete(oldestKey);
      } else {
        break; // Safety: nothing to evict
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const modelCache = new ModelCache();
