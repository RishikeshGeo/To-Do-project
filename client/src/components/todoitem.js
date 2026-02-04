import React from "react";

const TodoItem = ({ todo, onRemove }) => {
    return (
        <div
            className="todoItem"
            role="button"
            tabIndex={0}
            onClick={() => onRemove?.(todo.id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onRemove?.(todo.id);
            }}
            title="Click to remove"
        >
            <h1>{todo.message}</h1>
            <p>{todo.id}</p>   
        </div>
    )
}

export default TodoItem