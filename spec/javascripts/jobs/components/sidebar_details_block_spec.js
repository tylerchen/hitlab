import Vue from 'vue';
import sidebarDetailsBlock from '~/jobs/components/sidebar_details_block.vue';
import job from '../mock_data';
import mountComponent from '../../helpers/vue_mount_component_helper';

describe('Sidebar details block', () => {
  let SidebarComponent;
  let vm;

  function trimWhitespace(element) {
    return element.textContent.replace(/\s+/g, ' ').trim();
  }

  beforeEach(() => {
    SidebarComponent = Vue.extend(sidebarDetailsBlock);
  });

  afterEach(() => {
    vm.$destroy();
  });

  describe('when it is loading', () => {
    it('should render a loading spinner', () => {
      vm = mountComponent(SidebarComponent, {
        job: {},
        isLoading: true,
      });
      expect(vm.$el.querySelector('.fa-spinner')).toBeDefined();
    });
  });

  describe('when there is no retry path retry', () => {
    it('should not render a retry button', () => {
      vm = mountComponent(SidebarComponent, {
        job: {},
        isLoading: false,
      });

      expect(vm.$el.querySelector('.js-retry-job')).toBeNull();
    });
  });

  describe('without terminal path', () => {
    it('does not render terminal link', () => {
      vm = mountComponent(SidebarComponent, {
        job,
        isLoading: false,
      });

      expect(vm.$el.querySelector('.js-terminal-link')).toBeNull();
    });
  });

  describe('with terminal path', () => {
    it('renders terminal link', () => {
      vm = mountComponent(SidebarComponent, {
        job,
        isLoading: false,
        terminalPath: 'job/43123/terminal',
      });

      expect(vm.$el.querySelector('.js-terminal-link')).not.toBeNull();
    });
  });

  beforeEach(() => {
    vm = mountComponent(SidebarComponent, {
      job,
      isLoading: false,
    });
  });

  describe('actions', () => {
    it('should render link to new issue', () => {
      expect(vm.$el.querySelector('.js-new-issue').getAttribute('href')).toEqual(
        job.new_issue_path,
      );
      expect(vm.$el.querySelector('.js-new-issue').textContent.trim()).toEqual('New issue');
    });

    it('should render link to retry job', () => {
      expect(vm.$el.querySelector('.js-retry-job').getAttribute('href')).toEqual(job.retry_path);
    });

    it('should render link to cancel job', () => {
      expect(vm.$el.querySelector('.js-cancel-job').getAttribute('href')).toEqual(job.cancel_path);
    });
  });

  describe('information', () => {
    it('should render merge request link', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-mr'))).toEqual('Merge Request: !2');

      expect(vm.$el.querySelector('.js-job-mr a').getAttribute('href')).toEqual(
        job.merge_request.path,
      );
    });

    it('should render job duration', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-duration'))).toEqual(
        'Duration: 6 seconds',
      );
    });

    it('should render erased date', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-erased'))).toEqual('Erased: 3 weeks ago');
    });

    it('should render finished date', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-finished'))).toEqual(
        'Finished: 3 weeks ago',
      );
    });

    it('should render queued date', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-queued'))).toEqual('Queued: 9 seconds');
    });

    it('should render runner ID', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-runner'))).toEqual(
        'Runner: local ci runner (#1)',
      );
    });

    it('should render timeout information', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-timeout'))).toEqual(
        'Timeout: 1m 40s (from runner)',
      );
    });

    it('should render coverage', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-coverage'))).toEqual('Coverage: 20%');
    });

    it('should render tags', () => {
      expect(trimWhitespace(vm.$el.querySelector('.js-job-tags'))).toEqual('Tags: tag');
    });
  });
});
