import Controller from '@ember/controller';
import { computed } from '@ember/object';
// import ImpressionDataMixin from 'fortnight/mixins/impression-data-mixin';

export default Controller.extend({

  visits: computed.reads('model.visits'),
  views: computed.reads('model.views'),
  shares: computed.reads('model.shares'),
  time: computed.reads('model.time'),

  accquisitionChart: computed('accquisitionDataset', function() {
    const data = this.get('accquisitionDataset');
    const options = {
      title: {
        text: false,
      },
      // yAxis: {
      //   title: {
      //     text: false,
      //   }
      // },
      // xAxis: {
      //   type: 'datetime',
      // }
      chart: {
        type: 'pie',
      }
    }
    return { data, options };
  }),

  sharesChart: computed('sharesDataset', function() {
    const data = this.get('sharesDataset');
    const options = {
      title: {
        text: false,
      },
      // yAxis: {
      //   title: {
      //     text: false,
      //   }
      // },
      // xAxis: {
      //   type: 'datetime',
      // }
      chart: {
        type: 'pie',
      }
    }
    return { data, options };
  }),

  interactionsChart: computed('interactionTimeSeries', function() {
    const data = this.get('interactionTimeSeries');
    const options = {
      title: {
        text: false,
      },
      yAxis: {
        title: {
          text: false,
        }
      },
      xAxis: {
        type: 'datetime',
      }
    }
    return { data, options };
  }),

  /**
   * Maps data to Highcharts format
   * expected dataset format [ { date: Date(), visits: 123, views: 1234, shares: 12 }, ... ]
   * @returns []
   */
  interactionTimeSeries: computed('model.interactionsData.[]', function() {
    const dataset = this.get('model.interactionsData') || [];
    return ['visits', 'views', 'shares'].map(k => {
      const type = 'line';
      const name = `Daily ${k}`;
      const data = dataset.map((d) => {
        return { x: d.date, y: d[k] };
      });
      return { type, name, data };
    });
  }),

  accquisitionDataset: computed('model.accquisitionData', function() {
    const dataset = this.get('model.accquisitionData');
    return [{
      type: 'pie',
      name: 'Page Views',
      data: Object.keys(dataset).map(name => ({ name, y: dataset[name] })),
    }];
  }),

  sharesDataset: computed('model.sharesData', function() {
    const dataset = this.get('model.sharesData');
    return [{
      type: 'pie',
      name: 'Shares',
      data: Object.keys(dataset).map(name => ({ name, y: dataset[name] })),
    }];
  }),

});
