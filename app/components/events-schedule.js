import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';
import { storageFor } from 'ember-local-storage';
import { set, get } from '@ember/object';

export default class EventsScheduleComponent extends Component {
  @service store;

  @tracked date = 'all';

  @tracked isDateOther = false;
  @tracked isDateAll = false;

  @tracked showOnline = true;
  @tracked showLocal = true;
  @tracked showAnytime = true;

  @storageFor('schedule') storage;

  constructor() {
    super(...arguments);

    this.date = this.storage.get('date');
    this.isDateOther = this.date === 'other';
    this.isDateAll = this.date === 'all';
  }

  dates = [
    'all',
    '2021-03-01',
    '2021-03-02',
    '2021-03-03',
    '2021-03-04',
    '2021-03-05',
    'other',
    'anytime',
  ];

  get filteredEvents() {
    if (this.args.model) {
      return this.args.model.filter((item) => {
        if (item.eventType === 'anytime' && !this.showAnytime) {
          return false;
        }

        if (item.eventType === 'local' && !this.showLocal) {
          return false;
        }

        if (item.eventType === 'online' && !this.showOnline) {
          return false;
        }

        if (this.date === 'anytime') {
          return item.eventType === 'anytime';
        }

        if (this.date === 'other') {
          return !moment(item.eventTime).isBetween('2021-03-01', '2021-03-06');
        }

        if (this.date === 'all') {
          return (
            item.event_type !== 'anytime' &&
            moment(item.eventTime).isBetween('2021-03-01', '2021-03-06')
          );
        }

        return moment(this.date).isSame(item.eventTime, 'day');
      });
    }

    return [];
  }

  @action
  selectDate(selectedTab) {
    this.date = selectedTab;

    this.storage.set('date', this.date);
    this.storage.content.date = this.date;

    this.isDateOther = this.date === 'other';
    this.isDateAll = this.date === 'all';
  }
}
