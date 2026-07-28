import React from 'react';

const variantMap = {
  primary: {
    bg: 'bg-indigo-50 text-[#4F46E5] border-indigo-100',
    dot: 'bg-[#4F46E5]',
  },
  amber: {
    bg: 'bg-amber-50 text-[#D97706] border-amber-100',
    dot: 'bg-[#F59E0B]',
  },
  success: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    dot: 'bg-emerald-500',
  },
  danger: {
    bg: 'bg-red-50 text-red-700 border-red-100',
    dot: 'bg-red-500',
  },
  neutral: {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
  },
  dark: {
    bg: 'bg-slate-900 text-slate-100 border-slate-700',
    dot: 'bg-emerald-400',
  },
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-[11px] font-medium gap-1 rounded-md',
  md: 'px-2.5 py-1 text-xs font-semibold gap-1.5 rounded-md',
};

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  hasDot = false,
  className = '',
  icon: Icon,
}) => {
  const currentVariant = variantMap[variant] || variantMap.primary;

  return (
    <span
      className={`inline-flex items-center border font-sans tracking-wide shrink-0 ${currentVariant.bg} ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    >
      {hasDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentVariant.dot}`} />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
