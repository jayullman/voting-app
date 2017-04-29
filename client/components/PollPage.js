// Page that will display an individual poll for viewing and voting on
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Chart from 'chart.js';

const colorsArray = [
  // blue
  '#42d4f4',
  // green
  '#41f48e',
  // yellow
  '#d9f441',
  // orange
  '#f48b41',
  // lilac
  '#e426f9',
  // purple
  '#d941f4',
  // red
  '#f9273c',
  // aqua
  '#21efef'
];

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
    this.handleVote = this.handleVote.bind(this);
    this.retrievePollData = this.retrievePollData.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
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
    } else {
      this.setState({ customOptionView: false });
    }

    this.setState({ selectedValue: event.target.value });
  }

  deletePoll() {
    axios.delete(`/polls/${this.props.match.params.pollid}`)
      .then((response) => {
        if (response.status === 200) {
          this.context.router.history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleVote(event) {
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
        if (response.data.error) {
          alert(response.data.error);

        // if vote was successful, reload chart
        } else if (response.data === 'ok') {
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
    const selectColors = (item, index) => {
      const colorsArrayLength = colorsArray.length;

      return colorsArray[index % colorsArrayLength];
    };


    // destroys all previous chart instances to fix rendering bug
    this.state.chartInstances.forEach((chart) => {
      chart.destroy();
    });

    const options = pollData.options;

    const optionNames = options.map(option => option.name);
    const votes = options.map(option => option.votes);
    const backgroundColors = options.map(selectColors);
    const borderColors = backgroundColors;

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

        <form className='vote-form' onSubmit={this.handleVote}>
          <select onChange={this.handleSelection} value={this.state.selectedValue} name='vote'>
            {optionSelections}
          </select>
          {
            this.state.customOptionView
              ? <input type='text' onChange={this.handleTextChange} value={this.state.customOptionText} />
              : null
          }
          <input className='button' type='submit' value='Vote!'/>
        </form>
        <div className='chart-container'>
          <canvas 
            ref={(chart) => { this.chart = chart; }} 
            width='100' 
            height='100' 
          />
          { this.props.loggedIn && <button className='button delete-button' onClick={this.deletePoll}>Delete Poll</button> }
        </div>
      </div>
    );
  }
}

PollPage.contextTypes = {
  router: PropTypes.object
};

export default PollPage;
