import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import atob from 'atob';

export default Service.extend({
  session: service('session'),
  isStaff: computed('session', 'session.data.authenticated.token', function () {
    let token = this.get('session.data.authenticated.token'),
      tokenData = JSON.parse(atob(token.split('.')[1]));

    return tokenData['staff'];
  }),
});
