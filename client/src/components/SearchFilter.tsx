import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FilterOptions {
  status: string[];
  projectType: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'date' | 'title' | 'status';
  sortOrder: 'asc' | 'desc';
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSearchChange: (query: string) => void;
  totalItems: number;
  itemType: 'projects' | 'users';
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onFilterChange,
  onSearchChange,
  totalItems,
  itemType
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    projectType: [],
    dateRange: { start: '', end: '' },
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const statusOptions = itemType === 'projects' 
    ? ['pending', 'approved', 'in_progress', 'completed', 'rejected']
    : ['active', 'inactive'];

  const projectTypeOptions = [
    'web_development',
    'mobile_app',
    'e_commerce',
    'custom_software',
    'api_integration',
    'other'
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    handleFilterChange('status', newStatus);
  };

  const handleProjectTypeToggle = (type: string) => {
    const newTypes = filters.projectType.includes(type)
      ? filters.projectType.filter(t => t !== type)
      : [...filters.projectType, type];
    handleFilterChange('projectType', newTypes);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: [],
      projectType: [],
      dateRange: { start: '', end: '' },
      sortBy: 'date' as const,
      sortOrder: 'desc' as const
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    onFilterChange(clearedFilters);
    onSearchChange('');
  };

  const activeFilterCount = 
    filters.status.length + 
    filters.projectType.length + 
    (filters.dateRange.start ? 1 : 0) + 
    (filters.dateRange.end ? 1 : 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${itemType}...`}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full text-xs px-2 py-0.5 ml-1">
                {activeFilterCount}
              </span>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {totalItems} {itemType}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Sort Options */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="text-sm border border-input rounded px-2 py-1 bg-background text-foreground"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1"
            >
              {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Status:</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <Button
                  key={status}
                  variant={filters.status.includes(status) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusToggle(status)}
                  className="text-xs"
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Project Type Filter (for projects only) */}
          {itemType === 'projects' && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Project Type:</label>
              <div className="flex flex-wrap gap-2">
                {projectTypeOptions.map(type => (
                  <Button
                    key={type}
                    variant={filters.projectType.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleProjectTypeToggle(type)}
                    className="text-xs"
                  >
                    {type.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Date Range:</label>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="text-sm"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;