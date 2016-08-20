'use strict';

describe('Xmens E2E Tests:', function () {
  describe('Test Xmens page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/xmens');
      expect(element.all(by.repeater('xmen in xmens')).count()).toEqual(0);
    });
  });
});
