import Service from '@ember/service';
import Ember from 'ember';

const { computed, inject: { service }, RSVP, get, isEmpty } = Ember;
const { Promise } = RSVP;

export default Service.extend({
  store: service(),
  session: service(),
  loading: service(),

  /**
   * The Ember data user model.
   *
   * @type {DS.Model}
   */
  model: {},

  /**
   * Organizations that this user is a user of.
   *
   * @type {DS.Model[]}
   */
  tenants: computed.reads('model.tenants'),

  /**
   * The user id. Will be `null` if the there is not authenticated user.
   *
   * @type {?string}
   */
  uid: computed.reads('auth.uid'),

  /**
   * The active user tenant id.
   *
   * @type {?string}
   */
  tid: computed.reads('tenant.id'),

  /**
   * The Firebase Auth object, or `null` if not authenticated.
   *
   * @type {?object}
   */
  auth: computed('isAuthenticated', 'session.currentUser.@each', function() {
    if (!this.get('isAuthenticated')) {
      return;
    }
    return this.get('session.currentUser');
  }),

  /**
   * Determines if the user has any organizations.
   * @type {boolean}
   */
  hasTenants: computed.bool('tenants.length'),

  /**
   * Determines if the user is authenticated, based on the session.
   * Does not check whether a user model is present, or if the session is verified.
   *
   * @type {boolean}
   */
  isAuthenticated: computed.reads('session.isAuthenticated'),

  /**
   * Determines the user's active organization.
   *
   * @type {DS.Model}
   */
  tenant: computed('tenants.firstObject', 'model.activeTenantId', function() {
    const defaultTenant = this.get('tenants.firstObject');
    const activeTenantId = this.get('model.activeTenantId');
    if (!activeTenantId) {
      return defaultTenant;
    }
    const activeTenant = this.get('tenants').findBy('id', activeTenantId);
    return (activeTenant) ? activeTenant : defaultTenant;
  }),

  load() {
    return new Promise((resolve, reject) => {
      let userId = this.get('session.data.authenticated.id');
      if (!isEmpty(userId)) {
        this.get('store').find('core-user', userId).then((user) => {
          this.set('model', user);
          resolve();
        }, reject);
      } else {
        resolve();
      }
    });
  },

  logout() {
    const loading = this.get('loading');
    loading.show();
    return this.get('session').invalidate()
      .finally(loading.hide())
    ;
  },

  setActiveTenant(tenantId) {
    this.set('model.activeTenantId', tenantId);
    return this.get('model').save();
  }
});
