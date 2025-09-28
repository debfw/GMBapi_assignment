import { useMemo, useCallback, memo } from "react";

/**
 * Memoize expensive calculations with dependency tracking
 */
export const useExpensiveCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(calculation, dependencies);
};

/**
 * Memoize callback functions to prevent child re-renders
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  return useCallback(callback, []);
};

/**
 * Memoize callback functions with dependencies
 */
export const useStableCallbackWithDeps = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  return useCallback(callback, dependencies);
};

/**
 * Memoize objects to prevent reference changes
 */
export const useStableObject = <T extends Record<string, any>>(
  object: T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => object, dependencies);
};

/**
 * Memoize arrays to prevent reference changes
 */
export const useStableArray = <T>(
  array: T[],
  dependencies: React.DependencyList
): T[] => {
  return useMemo(() => array, dependencies);
};

/**
 * Higher-order component for memoizing components with custom comparison
 */
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, areEqual);
};

/**
 * Memoize filtered data to prevent unnecessary recalculations
 */
export const useFilteredData = <T>(
  data: T[],
  filterFn: (item: T) => boolean,
  dependencies: React.DependencyList
): T[] => {
  return useMemo(
    () => data.filter(filterFn),
    [data, filterFn, ...dependencies]
  );
};

/**
 * Memoize sorted data to prevent unnecessary recalculations
 */
export const useSortedData = <T>(
  data: T[],
  sortFn: (a: T, b: T) => number,
  dependencies: React.DependencyList
): T[] => {
  return useMemo(() => [...data].sort(sortFn), [data, sortFn, ...dependencies]);
};

/**
 * Memoize paginated data to prevent unnecessary recalculations
 */
export const usePaginatedData = <T>(
  data: T[],
  page: number,
  pageSize: number,
  dependencies: React.DependencyList
): { paginatedData: T[]; totalPages: number } => {
  return useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);

    return { paginatedData, totalPages };
  }, [data, page, pageSize, ...dependencies]);
};

/**
 * Memoize search results to prevent unnecessary recalculations
 */
export const useSearchResults = <T>(
  data: T[],
  searchTerm: string,
  searchFn: (item: T, term: string) => boolean,
  dependencies: React.DependencyList
): T[] => {
  return useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter((item) => searchFn(item, searchTerm));
  }, [data, searchTerm, searchFn, ...dependencies]);
};

/**
 * Memoize component props to prevent unnecessary re-renders
 */
export const useStableProps = <T extends Record<string, any>>(
  props: T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => props, dependencies);
};
