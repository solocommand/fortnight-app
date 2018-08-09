import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';

import query from 'fortnight/gql/queries/reports/story/summary';

export default Route.extend(RouteQueryManager, {

  model() {
    const { advertiser, story } = this.modelFor('portal.stories.view');
    const id = story.id;
    const advertiserId = advertiser.id;
    const variables = { input: { id } };
    this.controllerFor(this.get('routeName')).set('story', story);
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'reportStorySummary');
  }
})

