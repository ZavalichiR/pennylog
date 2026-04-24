import type { CSSProperties } from 'react';

interface TagChipProps {
  name: string;
  color: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
  'data-testid'?: string;
}

export function TagChip({ name, color, onRemove, onClick, active, 'data-testid': testId }: TagChipProps) {
  const bg = color + '26'; // ~15% opacity
  const borderColor = active ? color : color + '80';

  const style: CSSProperties = {
    backgroundColor: bg,
    border: `1.5px solid ${borderColor}`,
    color: color,
    outline: active ? `2px solid ${color}` : undefined,
    outlineOffset: active ? '1px' : undefined,
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <span
      className="tag-chip"
      style={style}
      onClick={onClick}
      data-testid={testId}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          className="tag-chip-remove"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
