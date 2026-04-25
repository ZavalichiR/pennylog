import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Modal } from '../../shared/components/Modal';
import { TagChip } from '../../shared/components/TagChip';

interface TagManagerProps {
  open: boolean;
  onClose: () => void;
}

export function TagManager({ open, onClose }: TagManagerProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: api.getTags,
    staleTime: Infinity,
  });

  const createMutation = useMutation({
    mutationFn: api.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setName('');
      setColor('#6366f1');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name: name.trim(), color });
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Manage Tags">
      <div className="modal-body">
        <form className="tag-manager-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            placeholder="Tag name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="tag-name-input"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            data-testid="tag-color-input"
          />
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={createMutation.isPending}
            data-testid="save-tag-btn"
          >
            Add
          </button>
        </form>

        {tags.length > 0 && (
          <div className="tag-manager-list">
            {tags.map((tag) => (
              <div key={tag.id} className="tag-manager-row" data-testid="tag-item">
                <TagChip name={tag.name} color={tag.color} />
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={() => deleteMutation.mutate(tag.id)}
                  disabled={deleteMutation.isPending}
                  data-testid="delete-tag-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {tags.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No tags yet. Create one above.</p>
        )}
      </div>
    </Modal>
  );
}
