import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { Segmented, Button, Space } from 'antd';

import DashLastWeek from "./components/dash-lastweek";
import DashToday from "./components/dash-today";

class CKLS_Dashboard extends Component {

  constructor() {
    super(...arguments);

    this.handleTabChange = this.handleTabChange.bind(this);

    //defaults
    this.state = {
      chosenTab: 'Today'
    };
  }

  handleTabChange(val) {
    this.setState({ chosenTab: val });
  }

  render() {
    let { chosenTab } = this.state;

    return (
      <div className="ckls-dash-analytics">
        <Segmented block options={['Today', 'Last 7 Days']} onChange={(val) => this.handleTabChange(val)} />

        <div id="dash-charts-block">
          {chosenTab === 'Today' ? <DashToday /> : <DashLastWeek />}
          <Space direction="vertical" />
          <Button type="dashed" href="/wp-admin/?page=cookieless-analytics" block>
            View Detailed Analytics
          </Button>
        </div>

      </div>
    )
  }
}
export default CKLS_Dashboard