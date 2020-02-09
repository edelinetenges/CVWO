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
            axios.post('/api/v1/tasks', {task: {title: e.target.value}})
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

    handleChange = (e) => {
        this.setState({inputValue: e.target.value});
    }

    // ---- completed tasks go to diff section -----
        // completeTask = (e, id) => {
        //     // need to change the address below
        //     axios.post(`/api/v1/tasks/${id}`, {task: {title: e.target.value}})
        //     .then(response => {
        //         const taskIndex = this.state.tasks.findIndex(x => x.id === response.data.id)
        //         const tasks = update(this.state.tasks, {
        //             [taskIndex]: {$set: response.data}
        //         })
        //         this.setState({
        //             tasks: tasks
        //         })
        //     })
        //     .catch(error => console.log(error))
        // }

        // make a new class to store the completed tasks? like a section
        // import the class to TasksContainer

        // also a new class for categories
        // new model

    completeTask = (e, id) => {
        axios.put(`/api/v1/tasks/${id}`, {task: {completed: e.target.checked}})
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

    editTask = (e, id) => {
        if (e.key === 'Enter') {
            axios.put(`/api/v1/tasks/${id}`, {task: {title: e.target.value}})
            .then(response => {
                const taskIndex = this.state.tasks.findIndex(x => x.id === id)
                const tasks = update(this.state.tasks, {
                    [taskIndex]: {$set: response.data}
                })
                this.setState({
                    tasks: tasks,
                    inputValue: ''
                })
            })
            .catch(error => console.log(error))
        }    
    }

    deleteTask = (id) => {
        const sure = window.confirm('Task will be deleted. Proceed?')
        if (sure) {
            axios.delete(`/api/v1/tasks/${id}`)
            .then(response => {
                const taskIndex = this.state.tasks.findIndex(x => x.id === id)
                const tasks = update(this.state.tasks, {
                    $splice: [[taskIndex, 1]]
                })
                this.setState({
                    tasks: tasks
                })
            })
            .catch(error => console.log(error))
        }
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
                                        checked={task.completed}
                                        onChange={(e) => this.completeTask(e, task.id)}/>
                                    <label className="taskLabel">{task.title}</label>
                                    <input className="editTask" type="text"
                                    placeholder="Edit task" maxLength="50" 
                                    onKeyPress={(e) => this.editTask(e, task.id)}
                                    value={this.state.inputValue} onChange={this.handleChange} />
                                    {/* <span className="editTaskBtn"
                                        onClick={(e) => this.editTask(task.id)}>
                                        Edit
                                    </span> */}
                                    <span className="deleteTaskBtn"
                                        onClick={(e) => this.deleteTask(task.id)}>
                                        Delete
                                    </span>
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