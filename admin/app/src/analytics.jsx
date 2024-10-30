import { Component } from "@wordpress/element";
import { __ } from '@wordpress/i18n';

import { Layout, Row, Col, Card, Statistic, Tooltip, Progress } from 'antd';
import { EyeOutlined, PieChartFilled, ThunderboltFilled, ClockCircleFilled, FundFilled, CrownFilled } from '@ant-design/icons';
import DateRangePicker from "./components/range-picker";
import RenderInsights from "./components/render-insights";
import dayjs from 'dayjs';
import { getTopPages } from "./helpers/pages";
import { getBounceRate, getFourStats } from "./helpers/stats";
import { getTopReferrers } from "./helpers/referrers";

const { Header, Content, Footer } = Layout;

class CKLS_Analytics extends Component {

  constructor() {
    super(...arguments);

    this.changeDates = this.changeDates.bind(this);
    this.dateFormat = "DD/MM/YYYY";


    //global page defaults
    this.state = {
      dateFrom: dayjs().subtract(7, 'days'),
      dateTo: dayjs(),
      topPagesLoading: true,
      topPages: [],
      referrersLoading: true,
      referrers: [],
      stat_pv: '',
      stat_avgtime: '',
      stat_uv: '',
      total_sessions: '',
      bounce_rate: '',
      desktop_percent: 100,
      mobile_percent: 0
    }
  }

  componentDidMount() {
    const { dateFrom, dateTo } = this.state;

    let unixStart = dateFrom.format('X');
    let unixEnd = dateTo.format('X');
    this.get_top_pages(unixStart, unixEnd);
    this.get_four_stats(unixStart, unixEnd);
    this.get_bounce_rate(unixStart, unixEnd);
    this.get_top_referrers(unixStart, unixEnd);
  }

  // componentDidUpdate() {
  //   const { dateFrom, dateTo } = this.state;
  //   this.get_top_pages(dateFrom.format('X'), dateTo.format('X'));
  // }

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

  async get_top_referrers(startDate, endDate) {

    getTopReferrers(startDate, endDate).then((res) => {
      if (res) {
        this.setState({
          referrers: res,
          referrersLoading: false
        });
      }
    });

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
          mobile_percent: Number(mobile_ratio).toFixed(2)
        })
      }
    });

  }

  async get_bounce_rate(startDate, endDate) {

    getBounceRate(startDate, endDate).then((res) => {
      if (res) {
        let bounce_rate = (res.single_sessions / res.total_sessions) * 100;
        bounce_rate = !bounce_rate ? 0 : Number(bounce_rate).toFixed(2);


        this.setState({
          total_sessions: res.total_sessions,
          bounce_rate: bounce_rate
        })
      }
    });

  }

  changeDates(newRange) {
    this.setState({
      dateFrom: newRange[0],
      dateTo: newRange[1]
    })

    let unixStart = newRange[0].format('X');
    let unixEnd = newRange[1].format('X');

    this.get_top_pages(unixStart, unixEnd);
    this.get_four_stats(unixStart, unixEnd);
    this.get_bounce_rate(unixStart, unixEnd);
    this.get_top_referrers(unixStart, unixEnd);
  }

  render() {
    let { dateFrom, dateTo, topPages, topPagesLoading, stat_avgtime, stat_pv, stat_uv, total_sessions, bounce_rate, desktop_percent, mobile_percent, referrers, referrersLoading } = this.state;

    return (
      <Layout className="layout">
        <Header>
          <Row>
            <Col span={4}>
              <div className="logo">
                <img src={cookieless_analytics.plugin_url+"admin/app/assets/dash-logo-white.png"} />
              </div>
            </Col>
            <Col span={20}>
              <DateRangePicker dateStart={dateFrom} dateEnd={dateTo} changeDates={this.changeDates} />

              {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={[
                {
                  key: 1,
                  label: 'Dashboard'
                },
                {
                  key: 2,
                  label: 'Settings'
                },
                {
                  key: 3,
                  label: <DateRangePicker dateStart={dateFrom} dateEnd={dateTo} changeDates={this.changeDates} />
                }
              ]} /> */}
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: '30px 50px' }}>
          <div className="site-layout-content">
            <Row gutter={[20, 20]}>
              <Col span={12} gutter={20}>
                <Card title="Insights" size="default">
                  <RenderInsights dateStart={dateFrom} dateEnd={dateTo} />
                </Card>
              </Col>
              <Col span={6} gutter={20}>
                <Row gutter={[10, 10]}>
                  <Col span={12}>
                    <Card>
                      <Statistic title="Pageviews" value={stat_pv} precision={0} prefix={<FundFilled />} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card>
                      <Statistic title="Unique Visitors" value={stat_uv} precision={0} prefix={<ThunderboltFilled />} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card>
                      <Statistic title="Sessions" value={total_sessions} precision={0} prefix={<CrownFilled />} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card>
                      <Statistic title="Avg.Time on Site" value={stat_avgtime} precision={0} prefix={<ClockCircleFilled />} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card>
                      <Statistic title="Bounce Rate" value={bounce_rate + "%"} precision={0} prefix={<PieChartFilled />} />
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col span={6} gutter={20}>
                <Card title="Desktop vs Mobile" bordered={false} size="small" className="ckls-dash-devices">
                  <Tooltip title={`${desktop_percent}% Desktop | ${mobile_percent}% Mobile`}>
                    <Progress percent={100} success={{ percent: desktop_percent }} showInfo={false} />
                    <div className="ckls-dash-devices">
                      <span>Desktop - {desktop_percent}%</span><span className="right">Mobile & Tablet - {mobile_percent}%</span>
                    </div>
                  </Tooltip>
                </Card>
              </Col>

              <Col span={12} gutter={20}>
                <Card title="Top Referrers" size="default" className="ckls-trending-pages" loading={referrersLoading}>
                  {
                    (referrers.length === 0) ?
                      'No referrers found for selected dates. Please try choosing different dates.' :
                      referrers.map((row, index) => (
                        <p>{index + 1}. <a href={row.referrer} rel="nofollow noopener" target="_blank">{row.referrer}</a> <span>{row.count}</span></p>
                      ))
                  }
                </Card>
              </Col>
              <Col span={12} gutter={20}>
                <Card title="Top Pages" size="default" className="ckls-trending-pages" loading={topPagesLoading}>
                  {
                    (topPages.length === 0) ?
                      'No pages found for selected dates. Please try choosing different dates.' :
                      topPages.map((page, index) => (
                        <p>{index + 1}. <a href={page.page_url} target="_blank">{page.page_url}</a> <span>{<EyeOutlined />}{page.count}</span></p>
                      ))
                  }
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'left' }}></Footer>
      </Layout>
    )
  }

}

export default CKLS_Analytics;