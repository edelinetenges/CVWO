import React, { Component } from 'react';
import './App.css';
import TasksContainer from './components/TasksContainer'
import TagSearch from './components/TagSearch'

class App extends Component {
  render() {
    return (
      <div>
        <div className="header">
          <h1>Task Manager</h1>
        </div>
        <div className="tagSearch">
          <h3>Search for tag here!</h3>
          <TagSearch />
        </div>
        <div className="container">
          <TasksContainer />
        </div>
      </div>
    );
  }
}

export default App;
