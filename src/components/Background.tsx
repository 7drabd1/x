import { ParticleCanvas } from './ParticleCanvas';

/**
 * Fixed backdrop, three layers, all far behind the content and ultra slow:
 * 1. a mesh of three large gradient light pools drifting on transform only (no blur filters, cheap on phones)
 * 2. a faint eight-point-star lattice
 * 3. drifting gold and emerald dust on a canvas
 */
export function Background() {
  return (
    <div className="bg-root" aria-hidden="true">
      <div className="mesh">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>
      <div className="lattice" />
      <ParticleCanvas />
      <div className="vignette" />
    </div>
  );
}
