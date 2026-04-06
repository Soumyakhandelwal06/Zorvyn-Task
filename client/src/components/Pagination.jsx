import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Basic pagination logic: show first, last, and current +/- 2
    if (
      i === 1 || 
      i === totalPages || 
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push('...');
    }
  }

  // Remove duplicate dots
  const uniquePages = pages.filter((item, index) => pages.indexOf(item) === index);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: '0.5rem', 
      marginTop: '2rem',
      padding: '1rem'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary"
        style={{ 
          padding: '0.5rem', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center',
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        <ChevronLeft size={18} />
      </button>

      {uniquePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span style={{ color: 'var(--text-secondary)' }}>...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={currentPage === page ? 'btn-primary' : 'btn-secondary'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                padding: 0,
                background: currentPage === page ? 'var(--primary-color)' : 'transparent',
                border: currentPage === page ? 'none' : '1px solid var(--glass-border)',
                color: currentPage === page ? '#fff' : 'var(--text-primary)'
              }}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary"
        style={{ 
          padding: '0.5rem', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center',
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
