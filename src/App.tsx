import { useState } from 'react';
import './App.css';
import { entities, Entity } from './data/entities';
import { calculateKardashev, wattsToJouleMin, calculateBitcoinStats, formatNumber } from './utils/transformer';

function App() {
  // Initial scale centered around human/biological scales (~100W = 2)
  const [scale, setScale] = useState<number>(2);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Helper to generate deterministic positions
  const getPosition = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    // Spread between 15% and 85% to keep away from edges
    const x = 15 + (Math.abs(hash) % 70); 
    const y = 10 + (Math.abs(hash >> 16) % 60); // Keep away from bottom controls
    return { left: `${x}%`, top: `${y}%` };
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom sensitivity
    const delta = e.deltaY * 0.005; 
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
    setScale(newScale);
  };

  // Range of the slider (Log10 Watts)
  // -13 (Bacteria) to 38 (Galaxy)
  const MIN_SCALE = -14;
  const MAX_SCALE = 40;

  return (
    <div className="explorer-container" onWheel={handleWheel}>
      <div className="app-header">
        <h1>Kardashev Scale Explorer</h1>
        <p className="subtitle">Base Unit: <strong>Joules per Second (Watts)</strong></p>
      </div>

      <div className="canvas">
        {entities.map((entity) => {
          const entityPowerLog = Math.log10(entity.powerWatts);
          const diff = scale - entityPowerLog;
          
          // Visual Scaling Logic:
          // diff = 0 => exact match (scale 1)
          // diff > 0 => user zoomed out (entity smaller)
          // diff < 0 => user zoomed in (entity larger)
          
          // Scale factor:
          // At diff=0, scale=1.
          // At diff=1 (1 order of magnitude zoomed out), scale should decrease.
          // Let's use a factor that keeps things visible for a range.
          const scaleFactor = Math.pow(10, -diff * 0.3);
          
          // Visibility/Opacity Logic:
          // Fade out if too small (diff is large positive)
          // Fade out if too big (diff is large negative)
          let opacity = 1;
          
          // If entity is 10^6 times smaller than current view (diff > 6), fade out
          if (diff > 6) opacity = Math.max(0, 1 - (diff - 6) / 2);
          
          // If entity is 10^4 times larger than current view (diff < -4), fade out
          if (diff < -4) opacity = Math.max(0, 1 - (-diff - 4) / 2); 

          if (opacity <= 0) return null;

          const style = {
            ...getPosition(entity.id),
            // Center the transform origin for accurate scaling
            transform: `translate(-50%, -50%) scale(${scaleFactor})`, 
            opacity,
            zIndex: Math.floor(100 - diff) // Closer to current scale = higher z-index? Or just size based.
          };
          
          return (
            <div 
              key={entity.id} 
              className="entity" 
              style={style}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEntity(entity);
              }}
            >
              <div className="entity-icon" role="img" aria-label={entity.name}>
                {entity.image}
              </div>
              {/* Only show label if large enough to be readable */}
              {scaleFactor > 0.2 && (
                <div className="entity-label" style={{ fontSize: `${Math.min(1.5, 0.5/scaleFactor)}rem` }}>
                  {entity.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedEntity && (
        <div className="info-panel" onClick={(e) => e.stopPropagation()}>
          <div className="info-header">
            <h2 className="info-title">{selectedEntity.name}</h2>
            <button className="close-btn" onClick={() => setSelectedEntity(null)}>×</button>
          </div>
          
          <div className="info-stats">
            <div className="stat-row">
              <span className="stat-label">Description</span>
              <div>{selectedEntity.description}</div>
            </div>

            <div className="stat-row">
              <span className="stat-label">Spatial Scale</span>
              <span className="stat-value" style={{color: '#fff'}}>{selectedEntity.spatialScale}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Energy Output (Power)</span>
              <span className="stat-value highlight">
                {formatNumber(selectedEntity.powerWatts)} W (J/s)
              </span>
              <span className="stat-value secondary">
                ≈ {formatNumber(wattsToJouleMin(selectedEntity.powerWatts))} J/min
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Kardashev Scale</span>
              <div>
                <span className="kardashev-badge">
                  Type {calculateKardashev(selectedEntity.powerWatts).toFixed(3)}
                </span>
              </div>
            </div>

            <div className="stat-row">
              <span className="stat-label">Bitcoin Mining Equivalent</span>
              <div className="bitcoin-stat">
                {calculateBitcoinStats(selectedEntity.powerWatts)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="controls" onClick={(e) => e.stopPropagation()}>
        <div className="scale-readout">
          View Scale: 10<sup>{scale.toFixed(1)}</sup> Joules/second
        </div>
        <div className="slider-container">
          <span className="slider-label">Micro</span>
          <input
            type="range"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step="0.01"
            value={scale}
            onChange={handleSliderChange}
            className="slider"
          />
          <span className="slider-label">Macro</span>
        </div>
        <div className="slider-hint">
          (Scroll to zoom • Click objects for details)
        </div>
      </div>
    </div>
  );
}

export default App;
