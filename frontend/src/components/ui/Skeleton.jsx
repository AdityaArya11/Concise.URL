export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-lg p-6">
      <SkeletonLine className="h-3 w-24 mb-3" />
      <SkeletonLine className="h-7 w-16" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-3.5 px-4"><SkeletonLine className="h-4 w-40" /></td>
      <td className="py-3.5 px-4"><SkeletonLine className="h-4 w-20" /></td>
      <td className="py-3.5 px-4"><SkeletonLine className="h-4 w-16" /></td>
      <td className="py-3.5 px-4"><SkeletonLine className="h-4 w-20" /></td>
      <td className="py-3.5 px-4"><SkeletonLine className="h-4 w-16" /></td>
      <td className="py-3.5 px-4"><SkeletonLine className="h-4 w-8" /></td>
    </tr>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-lg p-6">
      <SkeletonLine className="h-3 w-32 mb-4" />
      <SkeletonLine className="h-48 w-full" />
    </div>
  );
}
