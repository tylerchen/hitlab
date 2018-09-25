import Vue from 'vue';
import ClientsideNavigator from '~/ide/components/preview/navigator.vue';
import mountComponent from 'spec/helpers/vue_mount_component_helper';

describe('IDE clientside preview navigator', () => {
  let vm;
  let Component;
  let manager;

  beforeAll(() => {
    Component = Vue.extend(ClientsideNavigator);
  });

  beforeEach(() => {
    manager = {
      bundlerURL: gl.TEST_HOST,
      iframe: { src: '' },
    };

    vm = mountComponent(Component, {
      manager,
    });
  });

  afterEach(() => {
    vm.$destroy();
  });

  it('renders readonly URL bar', () => {
    expect(vm.$el.querySelector('input[readonly]').value).toBe('/');
  });

  it('disables back button when navigationStack is empty', () => {
    expect(vm.$el.querySelector('.ide-navigator-btn')).toHaveAttr('disabled');
    expect(vm.$el.querySelector('.ide-navigator-btn').classList).toContain('disabled-content');
  });

  it('disables forward button when forwardNavigationStack is empty', () => {
    vm.forwardNavigationStack = [];

    expect(vm.$el.querySelectorAll('.ide-navigator-btn')[1]).toHaveAttr('disabled');
    expect(vm.$el.querySelectorAll('.ide-navigator-btn')[1].classList).toContain(
      'disabled-content',
    );
  });

  it('calls back method when clicking back button', done => {
    vm.navigationStack.push('/test');
    vm.navigationStack.push('/test2');
    spyOn(vm, 'back');

    vm.$nextTick(() => {
      vm.$el.querySelector('.ide-navigator-btn').click();

      expect(vm.back).toHaveBeenCalled();

      done();
    });
  });

  it('calls forward method when clicking forward button', done => {
    vm.forwardNavigationStack.push('/test');
    spyOn(vm, 'forward');

    vm.$nextTick(() => {
      vm.$el.querySelectorAll('.ide-navigator-btn')[1].click();

      expect(vm.forward).toHaveBeenCalled();

      done();
    });
  });

  describe('onUrlChange', () => {
    it('updates the path', () => {
      vm.onUrlChange({
        url: `${gl.TEST_HOST}/url`,
      });

      expect(vm.path).toBe('/url');
    });

    it('sets currentBrowsingIndex 0 if not already set', () => {
      vm.onUrlChange({
        url: `${gl.TEST_HOST}/url`,
      });

      expect(vm.currentBrowsingIndex).toBe(0);
    });

    it('increases currentBrowsingIndex if path doesnt match', () => {
      vm.onUrlChange({
        url: `${gl.TEST_HOST}/url`,
      });

      vm.onUrlChange({
        url: `${gl.TEST_HOST}/url2`,
      });

      expect(vm.currentBrowsingIndex).toBe(1);
    });

    it('does not increase currentBrowsingIndex if path matches', () => {
      vm.onUrlChange({
        url: `${gl.TEST_HOST}/url`,
      });

      vm.onUrlChange({
        url: `${gl.TEST_HOST}/url`,
      });

      expect(vm.currentBrowsingIndex).toBe(0);
    });

    it('pushes path into navigation stack', () => {
      vm.onUrlChange({
        url: `${gl.TEST_HOST}/url`,
      });

      expect(vm.navigationStack).toEqual(['/url']);
    });
  });

  describe('back', () => {
    beforeEach(() => {
      vm.path = '/test2';
      vm.currentBrowsingIndex = 1;
      vm.navigationStack.push('/test');
      vm.navigationStack.push('/test2');

      spyOn(vm, 'visitPath');

      vm.back();
    });

    it('visits the last entry in navigationStack', () => {
      expect(vm.visitPath).toHaveBeenCalledWith('/test');
    });

    it('adds last entry to forwardNavigationStack', () => {
      expect(vm.forwardNavigationStack).toEqual(['/test2']);
    });

    it('clears navigation stack if currentBrowsingIndex is 1', () => {
      expect(vm.navigationStack).toEqual([]);
    });

    it('sets currentBrowsingIndex to null is currentBrowsingIndex is 1', () => {
      expect(vm.currentBrowsingIndex).toBe(null);
    });
  });

  describe('forward', () => {
    it('calls visitPath with first entry in forwardNavigationStack', () => {
      spyOn(vm, 'visitPath');

      vm.forwardNavigationStack.push('/test');
      vm.forwardNavigationStack.push('/test2');

      vm.forward();

      expect(vm.visitPath).toHaveBeenCalledWith('/test');
    });
  });

  describe('refresh', () => {
    it('calls refresh with current path', () => {
      spyOn(vm, 'visitPath');

      vm.path = '/test';

      vm.refresh();

      expect(vm.visitPath).toHaveBeenCalledWith('/test');
    });
  });

  describe('visitPath', () => {
    it('updates iframe src with passed in path', () => {
      vm.visitPath('/testpath');

      expect(manager.iframe.src).toBe(`${gl.TEST_HOST}/testpath`);
    });
  });
});
