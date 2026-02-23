import TodoItem from './todoitem';

const Todos = ({ todos, onRemove, onEdit }) => {
  if (!todos) return null;
  return todos.map((todo) => (
    <TodoItem key={todo.id} todo={todo} onRemove={onRemove} onEdit={onEdit} />
  ));
};

export default Todos;