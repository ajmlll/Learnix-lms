import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary:
    'bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm shadow-indigo-200 border border-transparent focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
  secondary:
    'bg-[#F8F9FC] text-gray-800 hover:bg-gray-200/80 border border-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
  outline:
    'bg-white text-[#4F46E5] border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2',
  amber:
    'bg-[#F59E0B] text-white hover:bg-amber-600 shadow-sm shadow-amber-200 border border-transparent focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-[8px] gap-2',
  lg: 'px-6 py-3 text-base font-semibold rounded-[8px] gap-2.5',
};

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      className = '',
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isBtnDisabled = isDisabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={!isBtnDisabled ? { scale: 1.018 } : {}}
        whileTap={!isBtnDisabled ? { scale: 0.982 } : {}}
        disabled={isBtnDisabled}
        onClick={onClick}
        className={`inline-flex items-center justify-center font-sans transition-colors duration-150 ease-in-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed outline-none select-none ${
          variantStyles[variant] || variantStyles.primary
        } ${sizeStyles[size] || sizeStyles.md} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : LeftIcon ? (
          <LeftIcon className="w-4 h-4 shrink-0" />
        ) : null}

        <span>{children}</span>

        {!isLoading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
