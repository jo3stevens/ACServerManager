'use strict';

angular
	.module('acServerManager', ['acServerManager.services', 'ui.bootstrap', 'ui.bootstrap.showErrors', 'ngRoute'])
	.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix = "!";

        $routeProvider.when('/', { templateUrl: '/html/status.html', controller: 'StatusCtrl' });
		$routeProvider.when('/server', { templateUrl: '/html/server.html', controller: 'ServerCtrl' });
		$routeProvider.when('/entrylist', { templateUrl: '/html/entrylist.html', controller: 'EntryListCtrl' });
		$routeProvider.when('/rules', { templateUrl: '/html/rules.html', controller: 'RulesCtrl' });
		$routeProvider.when('/advanced', { templateUrl: '/html/advanced.html', controller: 'AdvancedCtrl' });
        $routeProvider.otherwise({ redirectTo: '/' });
    }])
	
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