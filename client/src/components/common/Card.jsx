import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  bg = 'white',
  padding = 'p-6',
  onClick,
  ...props
}) => {
  const bgClass = bg === 'subtle' ? 'bg-[#F8F9FC]' : bg === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white';

  return (
    <motion.div
      whileHover={hoverable ? { y: -3, boxShadow: '0 12px 24px -6px rgba(79, 70, 229, 0.08)' } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      className={`rounded-[12px] border border-[#E5E7EB] ${bgClass} ${padding} shadow-soft ${
        hoverable ? 'cursor-pointer transition-shadow' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

Card.Header = ({ children, className = '', actions }) => (
  <div className={`flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4 ${className}`}>
    <div>{children}</div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-gray-900 tracking-tight font-heading ${className}`}>
    {children}
  </h3>
);

Card.Subtitle = ({ children, className = '' }) => (
  <p className={`text-xs font-normal text-gray-500 mt-0.5 ${className}`}>{children}</p>
);

Card.Body = ({ children, className = '' }) => <div className={`py-1 ${className}`}>{children}</div>;

Card.Footer = ({ children, className = '' }) => (
  <div className={`pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export default Card;
