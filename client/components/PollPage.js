// Page that will display an individual poll for viewing and voting on

import React, { Component } from 'react';
import axios from 'axios';
import Chart from 'chart.js';

class PollPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollData: {}
    };
  }

  componentDidMount() {
    const url = `/polls/${this.props.match.params.pollid}`;
    axios(url)
      .then((response) => {
        this.setState({ pollData: response.data });
        console.log(response.data);
      
        const options = response.data.options;

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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { 
      options,
      title,
      voters
     } = this.state.pollData;
    console.log(title);
    return (
      <div>
         {/* <h1>{this.state.pollData}</h1> */}
        <h2>{title}</h2>
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
