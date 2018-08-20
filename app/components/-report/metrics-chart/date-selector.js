import Component from '@ember/component';
import InitValueMixin from 'fortnight/mixins/init-value';
import ActionMixin from 'fortnight/mixins/action';
import moment from 'moment';

export default Component.extend(ActionMixin, InitValueMixin, {
  center: null,
  format: 'MMM Do, YYYY',

  disabled: false,

  init() {
    this._super(...arguments);
    const endDate = this.get('range.end');
    this.initValue('center', endDate ? moment(endDate) : moment());
    this.setDropdownLabel();
  },

  setDropdownLabel() {
    const { start, end } = this.get('range');
    const format = this.get('format');
    if (!start || !end) return 'Select Date Range';
    const label = `${moment(start).format(format)} - ${moment(end).format(format)}`;
    this.set('dropdownLabel', label);
  },

  actions: {
    setRange(dropdown, value) {
      const range = value.moment;
      this.set('range', range);
      const { start, end } = range;
      if (start && end) {
        this.setDropdownLabel();
        dropdown.actions.close();
        this.sendEventAction('onchange', range);
      }
    }
  },
});
