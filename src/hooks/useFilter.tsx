// hooks/useFilter.ts
import { useState, useEffect } from 'react';

export interface FilterConfig<T> {
  data: T[];
  filterFunctions: {
    [key: string]: (items: T[], value: string) => T[];
  };
}

export function useFilter<T>(config: FilterConfig<T>) {
  const [filterType, setFilterType] = useState<string>("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<T[]>([]);

  // Apply filtering whenever dependencies change
  useEffect(() => {
    let filtered = config.data;

    if (filterType && filterValues[filterType]) {
      const filterFunction = config.filterFunctions[filterType];
      if (filterFunction) {
        filtered = filterFunction(config.data, filterValues[filterType]);
      }
    }

    setFilteredData(filtered);
  }, [config.data, filterType, filterValues]);

  const setFilterValue = (type: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilter = (type: string) => {
    setFilterValue(type, "");
  };

  const resetAllFilters = () => {
    setFilterType("");
    setFilterValues({});
  };

  return {
    filterType,
    setFilterType,
    filterValues,
    setFilterValue,
    clearFilter,
    resetAllFilters,
    filteredData
  };
}