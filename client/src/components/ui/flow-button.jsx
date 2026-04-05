import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

/**
 * FlowButton — animated CTA with sliding arrows and fill effect.
 * Uses React state for hover since Tailwind group-hover was being overridden.
 */
export function FlowButton({ text = "Get Started", onClick, className = "", dark = false }) {
  const [hovered, setHovered] = useState(false);

  const base = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    overflow: 'hidden',
    cursor: 'pointer',
    padding: '0.75rem 2rem',
    borderRadius: hovered ? '12px' : '100px',
    border: `1.5px solid ${hovered ? 'transparent' : dark ? 'rgba(255,255,255,0.4)' : 'rgba(51,51,51,0.4)'}`,
    background: 'transparent',
    color: hovered ? (dark ? '#111111' : '#ffffff') : (dark ? '#ffffff' : '#111111'),
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 600ms cubic-bezier(0.23,1,0.32,1)',
    userSelect: 'none',
    outline: 'none',
    whiteSpace: 'nowrap',
  };

  const fillCircle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: hovered ? '320px' : '4px',
    height: hovered ? '320px' : '4px',
    borderRadius: '50%',
    background: dark ? '#ffffff' : '#111111',
    opacity: hovered ? 1 : 0,
    transition: 'width 750ms cubic-bezier(0.19,1,0.22,1), height 750ms cubic-bezier(0.19,1,0.22,1), opacity 400ms ease',
    pointerEvents: 'none',
  };

  const arrowLeft = {
    position: 'absolute',
    left: '1rem',
    width: '1rem',
    height: '1rem',
    zIndex: 9,
    opacity: hovered ? 1 : 0,
    transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
    transition: 'all 700ms cubic-bezier(0.34,1.56,0.64,1)',
    stroke: 'currentColor',
    fill: 'none',
    flexShrink: 0,
  };

  const textStyle = {
    position: 'relative',
    zIndex: 1,
    transform: hovered ? 'translateX(12px)' : 'translateX(0)',
    transition: 'transform 700ms ease',
  };

  const arrowRight = {
    position: 'absolute',
    right: '1rem',
    width: '1rem',
    height: '1rem',
    zIndex: 9,
    opacity: hovered ? 0 : 1,
    transform: hovered ? 'translateX(8px)' : 'translateX(0)',
    transition: 'all 700ms cubic-bezier(0.34,1.56,0.64,1)',
    stroke: 'currentColor',
    fill: 'none',
    flexShrink: 0,
  };

  return (
    <button
      style={base}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
    >
      {/* Expanding fill */}
      <span style={fillCircle} />

      {/* Left arrow — hidden by default, slides in on hover */}
      <ArrowRight style={arrowLeft} />

      {/* Label */}
      <span style={textStyle}>{text}</span>

      {/* Right arrow — visible by default, slides out on hover */}
      <ArrowRight style={arrowRight} />
    </button>
  );
}
