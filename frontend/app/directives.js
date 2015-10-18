'use strict'

angular
	.module('acServerManager')
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
	})
	.directive('presets', ['PresetService', '$rootScope', function(PresetService, $rootScope) {
	  return {
		templateUrl: '/html/presets.html',
        restrict: 'A',
		replace: true,
		link: function(scope, element, attrs) {	
			PresetService.GetPresets(function (data) {
				scope.presets = data;
			});
			
			scope.presetSelected = function(preset) {
				scope.currentPreset = preset;
			};
			
			scope.loadPreset = function() {
				if (scope.currentPreset && scope.currentPreset !== '') {
					PresetService.LoadPreset(scope.currentPreset, function (result) {
						if (result[0] === 'O' && result[1] === 'K') {
							$rootScope.$broadcast('presetLoaded', true); 
						}
						else {
							$rootScope.$broadcast('presetLoaded', false);
						}
					});
				}
				return false;
			};
			
			scope.savePreset = function() {
				if (scope.currentPreset && scope.currentPreset !== '') {
					PresetService.SavePreset(scope.currentPreset, function (result) {
						if (result[0] === 'O' && result[1] === 'K') {
							PresetService.GetPresets(function (data) {
								scope.presets = data;
							});
							$rootScope.$broadcast('presetSaved', true);
						} else {
							$rootScope.$broadcast('presetSaved', false);
						}
					});
				}
				
				return false;
			};
		}
	  };
	}]);