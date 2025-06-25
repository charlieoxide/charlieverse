import React, { useState } from 'react';
import { CheckCircle, XCircle, Mail, Download, Trash2, Edit, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface BulkOperationsProps {
  selectedItems: number[];
  onSelectAll: (selected: boolean) => void;
  onSelectItem: (id: number, selected: boolean) => void;
  onBulkStatusUpdate: (status: string) => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onBulkEmail?: () => void;
  totalItems: number;
  itemType: 'projects' | 'users';
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedItems,
  onSelectAll,
  onSelectItem,
  onBulkStatusUpdate,
  onBulkDelete,
  onBulkExport,
  onBulkEmail,
  totalItems,
  itemType
}) => {
  const [showActions, setShowActions] = useState(false);
  
  const allSelected = selectedItems.length === totalItems && totalItems > 0;
  const someSelected = selectedItems.length > 0;

  const statusOptions = itemType === 'projects' 
    ? [
        { value: 'approved', label: 'Approve', icon: CheckCircle, color: 'text-green-600' },
        { value: 'rejected', label: 'Reject', icon: XCircle, color: 'text-red-600' },
        { value: 'in_progress', label: 'In Progress', icon: Edit, color: 'text-blue-600' },
        { value: 'completed', label: 'Complete', icon: CheckCircle, color: 'text-purple-600' }
      ]
    : [
        { value: 'active', label: 'Activate', icon: CheckCircle, color: 'text-green-600' },
        { value: 'inactive', label: 'Deactivate', icon: XCircle, color: 'text-red-600' }
      ];

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
    if (!checked) setShowActions(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Selection Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All
            </label>
          </div>
          
          {someSelected && (
            <div className="text-sm text-muted-foreground">
              {selectedItems.length} of {totalItems} selected
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {someSelected && (
          <div className="flex flex-wrap gap-2">
            {/* Status Update Actions */}
            {statusOptions.map(({ value, label, icon: Icon, color }) => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                onClick={() => onBulkStatusUpdate(value)}
                className={`flex items-center gap-1 ${color}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}

            {/* Export Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>

            {/* Email Action (for users) */}
            {onBulkEmail && itemType === 'users' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkEmail}
                className="flex items-center gap-1"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            )}

            {/* Delete Action */}
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Action Confirmation */}
      {someSelected && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <Users className="inline h-4 w-4 mr-1" />
              {selectedItems.length} {itemType} selected for bulk operations
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectAll(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperations;