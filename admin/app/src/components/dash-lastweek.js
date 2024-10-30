import { Component } from "@wordpress/element";
import { __ } from '@wordpress/i18n';

import { Row, Col, Card, Statistic, Tooltip, Progress } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { getFourStats } from "../helpers/stats";
import { getTopPages } from "../helpers/pages";

class DashLastWeek extends Component {

  constructor() {
    super(...arguments);

    this.state = {
      stat_pv: 0,
      stat_uv: 0,
      stat_avgtime: 0,
      desktop_percent: 100,
      mobile_percent: 0,
      topPages: [],
      topPagesLoading: true
    }
  }

  componentDidMount() {
    let start = dayjs().subtract(1, 'week').format('X');
    let time_now = dayjs().format('X');

    this.get_four_stats(start, time_now);
    this.get_top_pages(start, time_now);
  }

  async get_four_stats(startDate, endDate) {

    getFourStats(startDate, endDate).then((res) => {
      if (res) {
        res = res[0];

        let no_of_mobiles = res.mobiles;
        let no_of_desktops = res.pageviews - no_of_mobiles;

        if (!no_of_mobiles) no_of_desktops = 0;

        let desktop_ratio = (no_of_desktops / res.pageviews) * 100;
        let mobile_ratio = 100 - desktop_ratio;

        if (no_of_desktops === 0) {
          desktop_ratio = mobile_ratio = 0;
        }

        this.setState({
          stat_pv: res.pageviews,
          stat_uv: res.unique_visitors,
          stat_avgtime: Number(res.average_time).toFixed(2) + "s",
          desktop_percent: Number(desktop_ratio).toFixed(2),
          mobile_percent: Number(mobile_ratio).toFixed(2),
        })
      }
    });

  }

  async get_top_pages(startDate, endDate) {

    getTopPages(startDate, endDate).then((res) => {
      if (res) {
        this.setState({
          topPages: res,
          topPagesLoading: false
        });
      }
    });

  }

  render() {
    const { stat_pv, stat_uv, desktop_percent, mobile_percent, topPages, topPagesLoading } = this.state;

    return (
      <div id="dash-today">
        <Row gutter={[15, 15]} className="ckls-dash-stats">
          <Col span={12}>
            <Card>
              <Statistic title="Unique Visitors" value={stat_uv} precision={0} valueStyle={{ color: 'red' }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic title="Pageviews" value={stat_pv} precision={0} valueStyle={{ color: 'green' }} />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card title="Desktop vs Mobile" bordered={false} size="small" className="ckls-dash-devices">
              <Tooltip title={`${desktop_percent}% Desktop | ${mobile_percent}% Mobile`}>
                <Progress percent={100} success={{ percent: desktop_percent }} showInfo={false} />
                <div className="ckls-dash-devices">
                  <span>Desktop - {desktop_percent}%</span><span className="right">Mobile & Tablet - {mobile_percent}%</span>
                </div>
              </Tooltip>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card title="Trending" bordered={false} size="small" className="ckls-trending-pages" loading={topPagesLoading}>
              {
                (topPages.length === 0) ?
                  'No pages found for last 7 days. Please check back later.' :
                  topPages.map((page, index) => (
                    <p>{index + 1}. <a href={page.page_url} target="_blank">{page.page_url}</a> <span>{<EyeOutlined />}{page.count}</span></p>
                  ))
              }
            </Card>
          </Col>
        </Row>
      </div >
    );
  }

}

export default DashLastWeek;