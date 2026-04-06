import React, { useState, useEffect, useCallback } from 'react';

const PriceRangeSlider = ({ min, max, minVal, maxVal, onChange }) => {
  const [minPercent, setMinPercent] = useState(0);
  const [maxPercent, setMaxPercent] = useState(100);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    setMinPercent(getPercent(minVal));
  }, [minVal, getPercent]);

  useEffect(() => {
    setMaxPercent(getPercent(maxVal));
  }, [maxVal, getPercent]);

  return (
    <div className="range-slider-container">
      <div className="range-slider-track" />
      <div
        className="range-slider-progress"
        style={{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`,
        }}
      />
      
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          onChange(value, maxVal);
        }}
        className="range-slider-input"
        style={{ zIndex: minVal > max - 100 ? '5' : '3' }}
      />
      
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          onChange(minVal, value);
        }}
        className="range-slider-input"
      />

      {/* Floating Tooltips */}
      <div 
        className="range-tooltip" 
        style={{ left: `${minPercent}%` }}
      >
        ${minVal}
      </div>
      <div 
        className="range-tooltip" 
        style={{ left: `${maxPercent}%` }}
      >
        ${maxVal}
      </div>
    </div>
  );
};

export default PriceRangeSlider;
