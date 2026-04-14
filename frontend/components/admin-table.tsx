'use client';

import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: TableColumn[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  isLoading?: boolean;
}

export default function AdminTable({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
}: AdminTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-muted border-b border-border">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left font-semibold text-foreground">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-muted/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-3 text-foreground">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => onEdit(item)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this item?')) {
                        onDelete(item);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
