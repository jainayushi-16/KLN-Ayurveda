import React from 'react';

const Badge = ({ type, text }) => {
  const normalized = (type || text || '').toString().toLowerCase();
  
  let className = 'badge';
  if (['pending'].includes(normalized)) className += ' badge-pending';
  else if (['processing'].includes(normalized)) className += ' badge-processing';
  else if (['shipped'].includes(normalized)) className += ' badge-shipped';
  else if (['delivered', 'paid'].includes(normalized)) className += ' badge-delivered';
  else if (['cancelled', 'failed', 'refunded'].includes(normalized)) className += ' badge-cancelled';
  else if (['instock', 'in stock', 'true'].includes(normalized)) className += ' badge-instock';
  else if (['lowstock', 'low stock'].includes(normalized)) className += ' badge-lowstock';
  else if (['outstock', 'out of stock', 'false'].includes(normalized)) className += ' badge-outstock';
  else className += ' badge-processing';

  return <span className={className}>{text || type}</span>;
};

export default Badge;
