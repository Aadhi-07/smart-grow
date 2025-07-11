
'use client';

import type { TerraceLayout } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Eraser, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

type TerracePlannerProps = {
  layout: TerraceLayout;
  onChange: (newLayout: TerraceLayout) => void;
};

type Tool = 'draw' | 'erase';

export function TerracePlanner({ layout, onChange }: TerracePlannerProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('draw');
  const gridRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    updateCellFromEvent(e);
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    updateCellFromEvent(e);
  };

  const handleInteractionEnd = () => {
    setIsDrawing(false);
  };

  const updateCellFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const event = 'touches' in e ? e.touches[0] : e;
    const element = document.elementFromPoint(event.clientX, event.clientY);
    if (element && element.hasAttribute('data-grid-cell')) {
      const row = parseInt(element.getAttribute('data-row')!, 10);
      const col = parseInt(element.getAttribute('data-col')!, 10);
      updateCell(row, col);
    }
  };

  const updateCell = (row: number, col: number) => {
    const newValue = tool === 'draw';
    if (layout.grid[row][col] !== newValue) {
      const newGrid = layout.grid.map(r => [...r]);
      newGrid[row][col] = newValue;
      onChange({ ...layout, grid: newGrid });
    }
  };

  const clearGrid = () => {
    const newGrid = Array.from({ length: layout.rows }, () => Array(layout.cols).fill(false));
    onChange({ ...layout, grid: newGrid });
  };
  
  const handleDimensionChange = (dim: 'rows' | 'cols', value: number) => {
    const newRows = dim === 'rows' ? value : layout.rows;
    const newCols = dim === 'cols' ? value : layout.cols;
    const newGrid = Array.from({ length: newRows }, (v, r) =>
      Array.from({ length: newCols }, (v, c) => {
        return r < layout.rows && c < layout.cols ? layout.grid[r][c] : false;
      })
    );
    onChange({ rows: newRows, cols: newCols, grid: newGrid });
  }

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="rows-slider">Height ({layout.rows} ft)</Label>
                <Slider
                    id="rows-slider"
                    min={5}
                    max={25}
                    step={1}
                    value={[layout.rows]}
                    onValueChange={(val) => handleDimensionChange('rows', val[0])}
                />
            </div>
            <div>
                <Label htmlFor="cols-slider">Width ({layout.cols} ft)</Label>
                <Slider
                    id="cols-slider"
                    min={5}
                    max={25}
                    step={1}
                    value={[layout.cols]}
                    onValueChange={(val) => handleDimensionChange('cols', val[0])}
                />
            </div>
        </div>
      <div className="flex justify-between items-center gap-2">
        <p className="text-sm text-muted-foreground">Click or drag to design.</p>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={tool === 'draw' ? 'secondary' : 'ghost'}
            onClick={() => setTool('draw')}
            title="Draw Tool"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={tool === 'erase' ? 'secondary' : 'ghost'}
            onClick={() => setTool('erase')}
            title="Erase Tool"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={clearGrid} title="Clear Grid">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={gridRef}
        className="terrace-grid gap-1 p-2 border rounded-lg touch-none bg-card overflow-hidden"
        style={{ '--rows': layout.rows, '--cols': layout.cols } as React.CSSProperties}
        onMouseDown={handleInteractionStart}
        onMouseMove={handleInteractionMove}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchMove={handleInteractionMove}
        onTouchEnd={handleInteractionEnd}
      >
        {layout.grid.map((row, r) =>
          row.map((isPlantable, c) => (
            <div
              key={`${r}-${c}`}
              className={cn(
                'w-full aspect-square rounded-sm cursor-pointer transition-colors',
                isPlantable ? 'bg-primary/50' : 'bg-muted/50 hover:bg-muted'
              )}
              data-grid-cell
              data-row={r}
              data-col={c}
            />
          ))
        )}
      </div>
    </div>
  );
}
