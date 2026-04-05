import React from 'react';

// Reusable animated skeleton blocks
export const SkeletonBox = ({ width = '100%', height = '20px', style = {} }) => {
  return (
    <div 
      className="skeleton-box" 
      style={{ width, height, ...style }} 
    />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <SkeletonBox width="250px" height="40px" style={{ marginBottom: '10px' }} />
          <SkeletonBox width="150px" height="20px" />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SkeletonBox width="120px" height="45px" style={{ borderRadius: '8px' }} />
          <SkeletonBox width="120px" height="45px" style={{ borderRadius: '8px' }} />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-panel" style={{ height: '120px' }}>
            <SkeletonBox width="120px" height="20px" style={{ marginBottom: '15px' }} />
            <SkeletonBox width="80%" height="40px" />
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ height: '350px' }}>
           <SkeletonBox width="200px" height="24px" style={{ marginBottom: '20px' }} />
           <SkeletonBox width="100%" height="250px" style={{ borderRadius: '50%' }} />
        </div>
        <div className="glass-panel" style={{ height: '350px' }}>
           <SkeletonBox width="200px" height="24px" style={{ marginBottom: '20px' }} />
           <SkeletonBox width="100%" height="250px" style={{ borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
};
