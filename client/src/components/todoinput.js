import React, { useRef } from "react";
import './todoinput.css'

const Input = ({ onAdd }) => {

    const todoInput = useRef("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const value = todoInput.current?.value?.trim();
        if (!value) return;
        onAdd?.(value);
        if (todoInput.current) todoInput.current.value = "";

    } 

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" ref={todoInput} required className="input"/>
            <input type="submit" value="Add a task" className="submitBtn"/>
        </form>
    )
}

export default Input