import React from 'react';

// COMPLIANCE (Lab 3 - Task 1): Reusable component using props to display system metrics
export default function StatusCard({ title, value, icon: Icon, color }) {
  return (
    <div className="status-card-item" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      flex: '1 1 140px', // Flexbox: allows cards to grow and wrap
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ color: color, fontSize: '24px', display: 'flex' }}>
        <Icon />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600' }}>{title}</p>
        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{value}</h4>
      </div>
    </div>
  );
}