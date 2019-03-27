import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { MongoTasks } from '../api/tasks.js';
import Task from './Task.jsx';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false
    }
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  }

  handleSubmit(event) {
    // prevent default browser behavior
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    MongoTasks.insert({
      text,
      createdAt: new Date(),
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteTasksCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
              />
              Hide Completed Tasks
          </label>

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type a new task"
              />
          </form>
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

// Wraps the App component and fetches the tasks from mongo, then it feeds it to the component as a prop
export default withTracker(() => {
  return {
    tasks: MongoTasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteTasksCount: MongoTasks.find({ checked: { $ne: true }}).count()
  };
})(App);