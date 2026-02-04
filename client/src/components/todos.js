import TodoItem from './todoitem';


const Todos = ({ todos, onRemove }) => {
    if (!todos) return null;
    return todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onRemove={onRemove} />
    ))
};

export default Todos