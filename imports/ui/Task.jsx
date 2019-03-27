import React, { Component } from 'react';
import { MongoTasks } from '../api/tasks.js';
 
// Task component - represents a single todo item
export default class Task extends Component {
toggleChecked() {
  MongoTasks.update(this.props.task._id, {
    $set: { checked: !this.props.task.checked}
  });

  console.log(this.props.task.checked);
}

  deleteTask() {
    MongoTasks.remove(this.props.task._id);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        ></input>

        <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
}