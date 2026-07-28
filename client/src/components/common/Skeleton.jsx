import React from 'react';

/**
 * Skeleton — base shimmer block
 * Uses moving gradient shimmer instead of static pulse for a premium feel.
 */
export const Skeleton = ({
  className = '',
  width,
  height,
  circle = false,
  count = 1,
}) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, index) => (
        <div
          key={index}
          style={{
            width: width || undefined,
            height: height || undefined,
          }}
          aria-hidden="true"
          className={`skeleton-shimmer ${
            circle ? 'rounded-full' : 'rounded-[8px]'
          } ${className}`}
        />
      ))}
    </>
  );
};

/**
 * CardSkeleton — mimics a course card layout (thumbnail + title + meta)
 */
export const CardSkeleton = () => (
  <div
    aria-hidden="true"
    className="p-0 rounded-[12px] border border-gray-200 bg-white overflow-hidden shadow-soft"
  >
    <Skeleton className="h-44 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-2 w-full mt-2" />
    </div>
    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-28" />
    </div>
  </div>
);

/**
 * TableRowSkeleton — mimics a data table row (avatar + text + badge)
 */
export const TableRowSkeleton = ({ rows = 4 }) => (
  <div aria-hidden="true" className="space-y-0 w-full divide-y divide-gray-100">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-3">
          <Skeleton circle className="w-10 h-10 shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);

/**
 * PageSkeleton — mimics a standard Learnix page header + content grid
 */
export const PageSkeleton = ({ cards = 3, showHeader = true }) => (
  <div aria-hidden="true" aria-label="Loading…" className="space-y-6">
    {showHeader && (
      <div className="bg-white rounded-[12px] border border-gray-200 p-6 space-y-3 shadow-soft">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
    )}
    <div
      className={`grid gap-6 ${
        cards === 1
          ? 'grid-cols-1'
          : cards === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {Array.from({ length: cards }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * StatsSkeleton — mimics the stats card row
 */
export const StatsSkeleton = ({ count = 4 }) => (
  <div aria-hidden="true" className={`grid gap-4 grid-cols-2 lg:grid-cols-${count}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="p-6 rounded-[12px] border border-gray-200 bg-white shadow-soft space-y-3"
      >
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton circle className="w-5 h-5" />
        </div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
    ))}
  </div>
);

export default Skeleton;
