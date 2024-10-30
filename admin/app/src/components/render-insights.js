import { Component } from "@wordpress/element";
import { __ } from '@wordpress/i18n';

import Chart from 'chart.js/auto';
import { getInsights } from "../helpers/insights";

///import { Chart, LineElement, CategoryScale, LinearScale, LineController, PointElement } from "chart.js";
class RenderInsights extends Component {

  constructor() {
    super(...arguments);

    this.state = {
      chart: ''
    }

    ///Chart.register(LineElement, LineController, CategoryScale, LinearScale, PointElement);
  }

  renderChart(startDate, endDate) {
    console.log("rendering chart");

    // const data = [
    //   { date: '11/12/2022', pageviews: 10 },
    //   { date: '12/12/2022', pageviews: 25 },
    //   { date: '13/12/2022', pageviews: 22 },
    //   { date: '14/12/2022', pageviews: 15 },
    //   { date: '15/12/2022', pageviews: 20 },
    //   { date: '16/12/2022', pageviews: 30 },
    //   { date: '17/12/2022', pageviews: 28 },
    // ];

    getInsights(startDate, endDate).then((data) => {

      let chartjs = new Chart(
        document.getElementById('ckls-insights'),
        {
          type: 'line',
          data: {
            labels: data.map(row => row.segment),
            datasets: [
              {
                label: 'Pageviews',
                data: data.map(row => row.pageviews)
              }
            ]
          }
        }
      );

      this.setState({
        chart: chartjs
      })

    })

  }

  componentDidMount() {
    let { dateStart, dateEnd } = this.props;

    this.renderChart(dateStart, dateEnd);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateStart !== this.props.dateStart) {
      const { chart } = this.state;
      chart.destroy();

      this.renderChart(this.props.dateStart, this.props.dateEnd);
    }
  }

  render() {
    return (
      <canvas id="ckls-insights"></canvas>
    )
  }

}

export default RenderInsights;