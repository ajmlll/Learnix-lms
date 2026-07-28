import React from 'react';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      type = 'text',
      className = '',
      inputClassName = '',
      id,
      isDisabled = false,
      isRequired = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full font-sans ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-gray-700 mb-1.5 font-heading cursor-pointer"
          >
            {label}{' '}
            {isRequired && (
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            )}
            {isRequired && <span className="sr-only">(required)</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center">
              <LeftIcon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={isDisabled}
            aria-required={isRequired}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
            }
            className={`w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded-[8px] border transition-colors duration-150 outline-none ${
              LeftIcon ? 'pl-9' : 'pl-3.5'
            } ${RightIcon ? 'pr-9' : 'pr-3.5'} py-2 ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1'
                : 'border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1'
            } disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${inputClassName}`}
            {...props}
          />

          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              disabled={isDisabled}
              aria-label={onRightIconClick ? 'Toggle field' : undefined}
              className={`absolute right-3 text-gray-400 hover:text-gray-600 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-indigo-400 rounded ${
                onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
              }`}
            >
              <RightIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-red-500 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-gray-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
