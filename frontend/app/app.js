'use strict';

angular
	.module('acServerManager', ['acServerManager.services', 'ui.bootstrap', 'ui.bootstrap.showErrors', 'toggle-switch'])
	
.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  };
});