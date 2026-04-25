interface TagChipProps {
  name: string;
  color: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
}

export function TagChip({ name, color, onRemove, onClick, active }: TagChipProps) {
  const chipStyle = {
    backgroundColor: `${color}26`, // ~15% opacity hex
    color,
    borderColor: color,
    outline: active ? `2px solid ${color}` : undefined,
    outlineOffset: active ? '1px' : undefined,
  };

  const classes = [
    'tag-chip',
    onClick ? 'clickable' : '',
    active ? 'active' : '',
  ].filter(Boolean).join(' ');

  if (onClick) {
    return (
      <button type="button" className={classes} style={chipStyle} onClick={onClick}>
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
      </button>
    );
  }

  return (
    <span className={classes} style={chipStyle}>
      {name}
      {onRemove && (
        <button
          type="button"
          className="tag-chip-remove"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
