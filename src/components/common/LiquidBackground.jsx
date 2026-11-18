import React from 'react';

/**
 * Ambient Apple iOS 26 Liquid Glass background canvas.
 * Renders a soft multi-stop gradient backdrop with subtle, slow-drifting
 * luminous color blobs that refract through frosted glass surfaces above.
 */
export default function LiquidBackground() {
  return (
    <div className="liquid-canvas" aria-hidden="true" data-testid="liquid-glass-background">
      <div className="liquid-blob blob-1" />
      <div className="liquid-blob blob-2" />
      <div className="liquid-blob blob-3" />
      <div className="liquid-blob blob-4" />
    </div>
  );
}
