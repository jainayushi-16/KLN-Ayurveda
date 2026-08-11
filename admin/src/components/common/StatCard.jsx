import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = '#d4af37' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
