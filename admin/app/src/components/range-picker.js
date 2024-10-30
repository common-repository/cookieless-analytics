import { Component } from "@wordpress/element";
import { __ } from '@wordpress/i18n';

import { DatePicker } from "antd";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

class DateRangePicker extends Component {

  constructor() {
    super(...arguments);

    this.dateFormat = 'DD/MM/YYYY';
    this.pastweek = this.props.dateStart;
    this.now = this.props.dateEnd;

  }

  render() {
    return (
      <RangePicker format={this.dateFormat} defaultValue={[dayjs(this.pastweek, this.dateFormat), dayjs(this.now, this.dateFormat)]} onCalendarChange={this.props.changeDates} />
    )
  }

}

export default DateRangePicker;