// Page that will display an individual poll for viewing and voting on

import React, { Component } from 'react';
import axios from 'axios';
import Chart from 'chart.js';

class PollPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollData: {},
      selectedValue: '',
      customOptionView: false,
      customOptionText: '',
      chartInstances: []
    };

    this.handleSelection = this.handleSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrievePollData = this.retrievePollData.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  // retrieves poll data, returns a promise
  retrievePollData() {
    const url = `/polls/${this.props.match.params.pollid}`;
    return axios(url);
  }

  handleTextChange(event) {
    this.setState({ customOptionText: event.target.value });
  }

  handleSelection(event) {
    // if user selects custom choice
    if (event.target.value === 'addedCustomOption') {
      this.setState({ customOptionView: true });
    }

    this.setState({ selectedValue: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    let voteUrl;
    if (this.state.customOptionText && this.state.customOptionView) {
      voteUrl = `/polls/newoption/${this.props.match.params.pollid}?option=${this.state.customOptionText}`;
    } else {
      voteUrl = `/polls/${this.props.match.params.pollid}?option=${this.state.selectedValue}`;  
    }

    if (!this.state.selectedValue) return;

    axios.put(voteUrl)
      .then((response) => {
        // if vote was successful, reload chart
        if (response.data === 'ok') {
          this.retrievePollData()
            .then((data) => {
              this.renderChart(data.data);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderChart(pollData) {
    // destroys all previous chart instances to fix rendering bug
    this.state.chartInstances.forEach((chart) => {
      chart.destroy();
    });

    const options = pollData.options;

    const optionNames = options.map(option => option.name);
    const votes = options.map(option => option.votes);
    const backgroundColors = options.map(() => 'rgba(255, 99, 132, 0.2)');
    const borderColors = options.map(() => 'rgba(255, 99, 132, 0.2)');

    const ctx = this.chart;
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: optionNames,
        datasets: [{
          label: '# of Votes',
          data: votes,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true
      }
    });
    
    // add chart instance to chartInstance array in state
    const chartInstances = this.state.chartInstances;
    chartInstances.push(myChart);
    this.setState({ chartInstances });
  }

  componentDidMount() {
    this.retrievePollData()
      .then((response) => {
        this.setState({ pollData: response.data });
        this.renderChart(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    console.log(this.props);
    if (Object.keys(this.state.pollData).length === 0) return null;
    const { title, options } = this.state.pollData;
    const optionSelections = options.map(option => <option key={option.name} value={option.name}>{option.name}</option>);

    // place an unselectable 'placeholder' option at the front of the optionSelections array
    optionSelections.unshift(<option key={0} value='' disabled>Select an option</option>);

    // if user is logged in, add option to vote on custom option
    if (this.props.loggedIn) {
      optionSelections.push(<option key='new' value='addedCustomOption'>Add custom option</option>);
    }
    return (
      <div>
         {/* <h1>{this.state.pollData}</h1> */}
        <h2>{title}</h2>

        <form onSubmit={this.handleSubmit}>
          <select onChange={this.handleSelection} value={this.state.selectedValue} name='vote'>
            {optionSelections}
          </select>
          {
            this.state.customOptionView
              ? <input type='text' onChange={this.handleTextChange} value={this.state.customOptionText} />
              : null
          }
          <input type='submit' value='Vote!'/>
        </form>
        <div className='poll-container'>
          <canvas 
            ref={(chart) => { this.chart = chart; }} 
            width='100' 
            height='100' 
          />
        </div>
      </div>
    );
  }
}

export default PollPage;
