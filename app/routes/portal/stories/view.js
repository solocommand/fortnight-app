import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import { hash, resolve } from 'rsvp';

import query from 'fortnight/gql/queries/story/edit';

export default Route.extend(RouteQueryManager, {
  model({ story_id }) {
    const advertiser = this.modelFor('portal');
    const variables = { input: { id: story_id } };
    return hash({
      advertiser: resolve(advertiser),
      story: this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'story'),
    });
  },
});

