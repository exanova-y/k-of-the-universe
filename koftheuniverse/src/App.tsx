import React, { useState, useRef, useEffect, useMemo } from 'react'; // useRef for when you want to store a mutable value that survives across renders but does not affect the UI rendering cycle.
import './App.css';
import { entities, type Entity } from './data/entities';
import { calculateKardashev, calculateBitcoinStats, formatNumber } from './utils/transformer';

import collageImg from './assets/collage.png';

function App() {
  // Draggable Panel State
  const [positions, setPositions] = useState({
    'info-panel': { x: window.innerWidth - 380, y: 80 },
    'collage': { x: window.innerWidth / 2, y: window.innerHeight / 2 } // Initial center logic is handled by CSS usually, but for dragging we need absolute
  });
  
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Collage Popup State
  const [showCollage, setShowCollage] = useState(false);

  // Initial scale centered around human/biological scales (~100W = 2)
  const [scale, setScale] = useState<number>(6.3);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const lastWheelTime = useRef(0);
  const fps = 60;

  // Debug: Log showCollage changes
  useEffect(() => {
    console.log('showCollage changed to:', showCollage);
  }, [showCollage]);

  // Helpers
  // Takes entity.id and hashes them into deterministic positions
  const getPosition = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    // Spread between 15% and 85% to keep away from edges
    const x = 15 + (Math.abs(hash) % 70); 
    const y = 30 + (Math.abs(hash >> 16) % 60); // Keep away from bottom controls
    return { left: `${x}%`, top: `${y}%` };
  };

  const handleDragStart = (e: React.MouseEvent, id: string, currentPos: { x: number, y: number }) => {
    // Only start drag if clicking the header or the panel itself, not buttons (simple check)
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    e.preventDefault(); // Prevent native image dragging and text selection

    setActiveDrag(id);
    dragOffset.current = {
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y
    };
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!activeDrag) return;
    
    e.preventDefault();
    
    setPositions(prev => ({
      ...prev,
      [activeDrag]: {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y
      }
    }));
  };

  const handleDragEnd = () => {
    setActiveDrag(null);
  };



  // Expects an event and sets scale to target value
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  
  const handleWheel = (e: React.WheelEvent) => {
    // Zoom sensitivity
    console.log(e.deltaY);
    const now = Date.now();
    if (now - lastWheelTime.current < 1000 / fps) return; // limit rendering to every 16 ms at least ~= 60 fps.
    lastWheelTime.current = now;
    const computedDeltaY = e.deltaY * 0.01; 
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + computedDeltaY));
    setScale(newScale);
  };

  // Range of the slider (Log10 Watts)
  // -13 (Bacteria) to 38 (Galaxy)
  const MIN_SCALE = -18;
  const MAX_SCALE = 40;

  // Helper function to check if string is an image path
  const isImage = (src?: string) => src?.includes('/') || src?.includes('.');

  // Generate 600 stars with random positions and sizes
  const stars = useMemo(() => {
    return Array.from({ length: 600 }, (_, i) => ({
      id: `star-${i}`,
      left: Math.random() * 100, // Percentage of viewport width
      top: Math.random() * 100, // Percentage of viewport height
      size: Math.random() * 2 + 0.5, // Size between 0.5px and 2.5px
      opacity: Math.random() * 0.8 + 0.2, // Opacity between 0.2 and 1.0
    }));
  }, []); // Empty dependency array - generate once on mount

  return (
    <div 
      className="explorer-container" 
      onWheel={handleWheel}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className="app-header">
        <h1>Kardashev Scale of the Universe</h1>
      </div>

    {/* zooming entities */}
      <div className="canvas">
        {/* Starfield background */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              position: 'absolute',
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
        {entities.map((entity) => {
          const entityPowerLog = Math.log10(entity.powerWatts);
          const diff = scale - entityPowerLog;
          
          // ... (existing logic) ...
          
          // Scale factor:
          const scaleFactor = Math.pow(10, -diff * 0.3);
          
          let opacity = 1;
          if (diff > 6) opacity = Math.max(0, 1 - (diff - 6) / 2);
          if (diff < -4) opacity = Math.max(0, 1 - (-diff - 4) / 2); 

          if (opacity <= 0) return null;

          const style = {
            ...getPosition(entity.id),
            transform: `translate(-50%, -50%) scale(${scaleFactor})`, 
            opacity,
            zIndex: Math.floor(100 - diff)
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
                {isImage(entity.image) ? (
                  <img src={entity.image} alt={entity.name} className="entity-image" />
                ) : (
                  entity.image
                )}
              </div>
              {/* Only show label if large enough to be readable */}
              {scaleFactor > 1 && (
                <div className="entity-label" style={{ fontSize: `${Math.min(1.5, 0.5/scaleFactor)}rem` }}>
                  {entity.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Panel */}
      {/* conditional rendering based on if selectedEntity is true */}
      {selectedEntity && (
        <div 
          className="info-panel" 
          style={{ left: positions['info-panel'].x, top: positions['info-panel'].y }}
          onMouseDown={(e) => handleDragStart(e, 'info-panel', positions['info-panel'])}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="info-header">
            <h2 className="info-title">{selectedEntity.name}</h2>
            <button className="close-btn" onClick={() => setSelectedEntity(null)}>×</button>
          </div>
          
          <div className="info-stats">

            <div className="stat-row">
              <span className="stat-label">Spatial scale</span>
              <span className="stat-value secondary">{selectedEntity.spatialScale}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Output</span>
              <span className="stat-value highlight">
                {formatNumber(selectedEntity.powerWatts)} W
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Kardashev</span>
              <div>
                <span className="kardashev-badge">
                  Type {calculateKardashev(selectedEntity.powerWatts).toFixed(3)}
                </span>
              </div>
            </div>

            <div className="stat-row">
              <span className="stat-label">Bitcoin Mining</span>
              <div className="bitcoin-stat">
                {calculateBitcoinStats(selectedEntity.powerWatts)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sliders */}
      <div className="controls" onClick={(e) => e.stopPropagation()}>
        <div className="scale-readout">
          10<sup>{scale.toFixed(1)}</sup> Joules/second (Watts)
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

          <div className="footer" onClick={() => setShowCollage(true)}>
            <p>?</p>
          </div>
          
        </div>
      </div>

      {/* Easter egg collage popup */}
      {/* conditional rendering based on if ShowCollage is true */}
      {showCollage && (
          <div 
            className="popup-content" 
            style={{ 
              position: 'absolute', /* Ensure it obeys left/top */
              left: positions['collage'].x, 
              top: positions['collage'].y,
            }}
            onMouseDown={(e) => handleDragStart(e, 'collage', positions['collage'])}
            onClick={(e) => {
              console.log('Container onClick fired, target:', e.target);
              e.stopPropagation();
            }}>
          
            <button 
              className="close-popup" 
              onMouseDown={(e) => {
                console.log('Close button onMouseDown fired');
                e.stopPropagation();
              }}
              onClick={(e) => {
                console.log('Close button onClick fired, current showCollage:', showCollage);
                e.stopPropagation();
                setShowCollage(false);
                console.log('setShowCollage(false) called');
              }}
            >
              ×
            </button>
            <img src={collageImg} alt="Kardashev Collage" className="popup-image" draggable={false} />
            <p className="stat-label">from Yoyo</p> 
          </div> /* text goes to bottom of image */
      )}

    </div>
  );
}

export default App;