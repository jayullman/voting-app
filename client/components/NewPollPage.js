import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class NewPollPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      options: [],
      formOptions: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.addOption = this.addOption.bind(this);
  }

  componentDidMount() {
    this.setState({
      formOptions: [
        <div key='0'>
          <label>Option:</label>
          <input type="text" onChange={this.handleTextInput} value={this.state.options[0]} name='0' required />
        </div >,
        <div key='1'>
          <label>Option:</label>
          <input type="text" onChange={this.handleTextInput} value={this.state.options[1]} name='1' required />
        </div >
      ]
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post('/createpoll', {
      title: this.state.title,
      options: this.state.options
    }).then((response) => {
      const pollId = response.data._id;
      this.context.router.history.push(`/pollpage/${pollId}`);
    });
  }

  handleTextInput(e) {
    console.log(e.target.value);
    if (e.target.name === 'title') {
      this.setState({ title: e.target.value });
    } else {
      const newArr = this.state.options;
      newArr[parseInt(e.target.name, 10)] = e.target.value;
      this.setState({ options: newArr });
    }
    console.log(this.state);
  }

  // adds new option to the form
  addOption(e) {
    e.preventDefault();
    const newArray = [...this.state.formOptions];
    const i = newArray.length;
    newArray.push(
      <div key={i.toString()}>
        <label>Option:</label>
        <input type="text" onChange={this.handleTextInput} value={this.state.options[i]} name={i.toString()} />
      </div>
    );
    this.setState({ formOptions: newArray });
  }

  render() {
    return (
      <div>
        <h1>
          Create a new poll
        </h1>
        <form className='new-poll-form' onSubmit={this.handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" onChange={this.handleTextInput} name="title" value={this.state.title} required />
          </div>
          {this.state.formOptions}
          <div>
            <button className='button add-option' onClick={this.addOption}>Add Option</button>
            <input className='button' type='Submit' defaultValue='Submit Poll' />
          </div>
        </form>
      </div>
    );
  }
}

NewPollPage.contextTypes = {
  router: PropTypes.object
};

export default NewPollPage;
