import React, { useState } from 'react';
import './todoitem.css';

const TodoItem = ({ todo, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.message);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.message) {
      onEdit?.(todo.id, trimmed);
    }
    setIsEditing(false);
    setEditValue(todo.message);
  };

  const handleCancel = () => {
    setEditValue(todo.message);
    setIsEditing(false);
  };

  return (
    <>
      <div className="todoItem">
        <div className="todoItem-content">
          <h1>{todo.message}</h1>
          <p>{todo.id}</p>
        </div>
        <div className="todoItem-actions">
          <button
            type="button"
            className="todoItem-btn todoItem-btn-edit"
            onClick={(e) => { e.stopPropagation(); setEditValue(todo.message); setIsEditing(true); }}
            title="Edit"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            type="button"
            className="todoItem-btn todoItem-btn-delete"
            onClick={(e) => { e.stopPropagation(); onRemove?.(todo.id); }}
            title="Remove"
            aria-label="Remove task"
          >
            🗑️
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-overlay" role="dialog" aria-modal="true" aria-label="Edit task">
          <div className="edit-overlay-backdrop" onClick={handleCancel} />
          <div className="edit-overlay-box">
            <h3 className="edit-overlay-title">Edit task</h3>
            <input
              type="text"
              className="edit-overlay-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
            />
            <div className="edit-overlay-actions">
              <button type="button" className="edit-overlay-btn cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className="edit-overlay-btn save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoItem;
