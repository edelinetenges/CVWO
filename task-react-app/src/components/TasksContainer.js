import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

class TasksContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [],
            inputValue: ''
        }
    }

    getTasks() {
        axios.get('/api/v1/tasks')
        .then(response => {
            this.setState({tasks: response.data})
        })
        .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getTasks()
    }

    createTask = (e) => {
        if (e.key === 'Enter') {
            axios.post('/api/v1/tasks', {todo: {title: e.target.value}})
            .then(response => {
                const tasks = update(this.state.tasks, {
                    $splice: [[0, 0, response.data]]
                })
                this.setState({
                    tasks: tasks,
                    inputValue: ''
                })
            })
            .catch(error => console.log(error))
        }
    }

    completeTask = (e, id) => {
        axios.put(`/api/v1/tasks/${id}`, {task: {done: e.target.checked}})
        .then(response => {
            const taskIndex = this.state.tasks.findIndex(x => x.id === response.data.id)
            const tasks = update(this.state.tasks, {
                [taskIndex]: {$set: response.data}
            })
            this.setState({
                tasks: tasks
            })
        })
        .catch(error => console.log(error))
    }

    render() {
        return (
            <div>
                <div className="inputContainer">
                    <input className="taskInput" type="text"
                    placeholder="Add task" maxLength="50" 
                    onKeyPress={this.createTask}
                    value={this.state.inputValue} onChange={this.handleChange} />
                </div>
                <div className="listWrapper">
                    <ul className="taskList">
                        {this.state.tasks.map((task) => {
                            return(
                                <li className="task" task={task} key={task.id}>
                                    <input className="taskCheckbox" type="checkbox" 
                                        checked={task.done}
                                        onChange={(e) => this.completeTask(e, task.id)}/>
                                    <label className="taskLabel">{task.title}</label>
                                    <span className="deleteTaskBtn">Delete</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default TasksContainer