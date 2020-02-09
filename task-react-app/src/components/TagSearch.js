import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

class TagSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: props.task,
            tag: ''
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

    handleChange = (e) => {
        this.setState({tag: e.target.value});
    }

    findTag = (e) => {
        if (e.key === 'Enter') {
            
        }
    }

    listTasks() {
        const taggedTasks = this.state.tasks.filter(task => task.tag === this.state)
        return taggedTasks;
    }

    render() {
        return (
            <div>
                <div className="tagContainer">
                    <input className="tagName" type="text"
                    name="tag" value={this.state.tag}
                    placeholder="Search tag" maxLength="50" 
                    onKeyPress={(e) => this.findTag(e)} onChange={this.handleChange}/>
                </div>
                <ul>{this.state.listTasks}</ul>
            </div>
        )
    }
}

export default TagSearch