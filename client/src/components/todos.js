import TodoItem from './todoitem';

const Todos = ({ todos, onRemove, onEdit }) => {
  if (!todos) return null;
  return todos.map((todo, index) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      taskNumber={index + 1}
      onRemove={onRemove}
      onEdit={onEdit}
    />
  ));
};

export default Todos;