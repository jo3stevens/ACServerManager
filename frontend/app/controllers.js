'use strict';

angular.module('acServerManager')
	.controller('StatusCtrl', function($scope, $timeout, ProcessService) {
		$scope.alerts = [];
		
		(function getACServerStatus() {
			ProcessService.ACServerStatus(function(data){
				$scope.acServerStatus = data.status;
				$timeout(getACServerStatus, 2000);
			});
		})();
		
		(function getSTrackerServerStatus() {
			ProcessService.STrackerServerStatus(function(data){
				$scope.sTrackerServerStatus = data.status;
				$timeout(getSTrackerServerStatus, 2000);
			});
		})();
		
		$scope.startACServer = function() {
			ProcessService.StartACServer(function(result) {
				if (!(result[0] === 'O' && result[1] === 'K')) {
					createAlert('warning', 'Failed to start AC server', true)
				}
			})
		}
		
		$scope.stopACServer = function() {
			$scope.stopSTrackerServer();
			ProcessService.StopACServer(function(result) {
				if (!(result[0] === 'O' && result[1] === 'K')) {
					createAlert('warning', 'Failed to stop AC server', true)
				}
			})
		}
		
		$scope.startSTrackerServer = function() {
			ProcessService.StartSTrackerServer(function(result) {
				if (!(result[0] === 'O' && result[1] === 'K')) {
					createAlert('warning', 'Failed to start stracker', true)
				}
			})
		}
		
		$scope.stopSTrackerServer = function() {
			ProcessService.StopSTrackerServer(function(result) {
				if (!(result[0] === 'O' && result[1] === 'K')) {
					createAlert('warning', 'Failed to stop stracker', true)
				}
			})
		}
		
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		function createAlert(type, msg, autoClose) {
			var alert = { type: type, msg: msg};
			$scope.alerts.push(alert);
			if (autoClose) {
				$timeout(function(){
					$scope.alerts.splice($scope.alerts.indexOf(alert), 1);
				}, 3000);
			}
		}
	})
	.controller('ServerCtrl', function ($scope, $filter, $timeout, CarService, TrackService, ServerService, BookService, PracticeService, QualifyService, RaceService) {
		$scope.sessions = [];
		$scope.alerts = [];
		
		BookService.GetBookingDetails(function (data) {
			$scope.sessions.push({
				type: 'Booking',
				hideTime: false,
				hideLaps: true,
				hideWaitTime: true,
				hideRaceOverTime: true,
				enabled: data.NAME !== undefined,
				data: data
			});
			$scope.selectedSession = $scope.sessions[0];
		});
		
		PracticeService.GetPracticeDetails(function (data) {
			$scope.sessions.push({
				type: 'Practice',
				hideTime: false,
				hideLaps: true,
				hideWaitTime: false,
				hideRaceOverTime: true,
				enabled: data.NAME !== undefined,
				data: data
			});
		});
		
		QualifyService.GetQualifyDetails(function (data) {
			$scope.sessions.push({
				type: 'Qualify',
				hideTime: false,
				hideLaps: true,
				hideWaitTime: false,
				hideRaceOverTime: true,
				enabled: data.NAME !== undefined,
				data: data
			});
		});
		
		RaceService.GetRaceDetails(function (data) {
			$scope.sessions.push({
				type: 'Race',
				hideTime: true,
				hideLaps: false,
				hideWaitTime: false,
				hideRaceOverTime: false,
				enabled: data.NAME !== undefined,
				data: data
			});
		});
		
		CarService.GetCars(function (data) {
			$scope.cars = data;
		});
		
		TrackService.GetTracks(function (data) {
			$scope.tracks = data;
		});
		
		ServerService.GetServerDetails(function (data) {
			$scope.selectedCars = data.CARS.split(';');
			$scope.selectedTracks = data.TRACK; //TODO: Multi-track
			
			data.LOOP_MODE = data.LOOP_MODE == 1;
			data.PICKUP_MODE_ENABLED = data.PICKUP_MODE_ENABLED == 1;
			
			var time = getTime(data.SUN_ANGLE);
			$scope.hours = time.getHours();
			$scope.mins = time.getMinutes();
			
			$scope.server = data;
			
			$scope.trackChanged();
		});
		
		$scope.trackChanged = function() {
			var track = findInArray($scope.tracks, {name: $scope.selectedTracks})
			if (track !== null) {
				if (track.configs && track.configs.length) {
					$scope.configs = track.configs;
					$scope.server.CONFIG_TRACK = $scope.server.CONFIG_TRACK === '' ? $scope.configs[0] : $scope.server.CONFIG_TRACK;
					
					TrackService.GetTrackDetails(track.name, $scope.server.CONFIG_TRACK, function(data) {
						$scope.trackDetails = data;
					});
					
					$scope.trackImage = '/api/tracks/' + $scope.selectedTracks + '/' + $scope.server.CONFIG_TRACK + '/image';
				} else {
					$scope.configs = null;
					$scope.server.CONFIG_TRACK = '';
					
					TrackService.GetTrackDetails(track.name, null, function(data) {
						$scope.trackDetails = data;
					});
					
					$scope.trackImage = '/api/tracks/' + $scope.selectedTracks + '/image';
				}
			}
		};
			
		$scope.submit = function() {
			$scope.$broadcast('show-errors-check-validity');
			
			if ($scope.form.$invalid) { 
				createAlert('warning', 'There are errors on the form', true);
				return; 
			}
			
			var data = angular.copy($scope.server);
			
			data.LOOP_MODE = $scope.server.LOOP_MODE ? 1 : 0;
			data.PICKUP_MODE_ENABLED = $scope.server.PICKUP_MODE_ENABLED ? 1 : 0;
			data.CARS = $scope.selectedCars.join(';');
			data.TRACK = $scope.selectedTracks; //TODO: Multi-track
			data.SUN_ANGLE = getSunAngle($scope.hours, $scope.mins);
			
			var saved = true;
			
			ServerService.SaveServerDetails(data, function(result) {
				if (!(result[0] === 'O' && result[1] === 'K')) {
					saved = false;
				}
			});
			
			var booking = findInArray($scope.sessions, { type: 'Booking' });
			if (booking !== null) {
				if(!booking.enabled) {
					booking.data = {};
				}
				
				BookService.SaveBookingDetails(booking.data, function(result) {
					if (!(result[0] === 'O' && result[1] === 'K')) {
						saved = false;
					}
				});
			}
			
			var practice = findInArray($scope.sessions, { type: 'Practice' });
			if (practice !== null) {
				if(!practice.enabled) {
					practice.data = {};
				}
				
				PracticeService.SavePracticeDetails(practice.data, function(result) {
					if (!(result[0] === 'O' && result[1] === 'K')) {
						saved = false;
					}
				});
			}
			
			var qualify = findInArray($scope.sessions, { type: 'Qualify' });
			if (qualify !== null) {
				if(!qualify.enabled) {
					qualify.data = {};
				}
				
				QualifyService.SaveQualifyDetails(qualify.data, function(result) {
					if (!(result[0] === 'O' && result[1] === 'K')) {
						saved = false;
					}
				});
			}
			
			var race = findInArray($scope.sessions, { type: 'Race' });
			if (race !== null) {
				if(!race.enabled) {
					race.data = {};
				}
				
				RaceService.SaveRaceDetails(race.data, function(result) {
					if (!(result[0] === 'O' && result[1] === 'K')) {
						saved = false;
					}
				});
			}
			
			if (saved) {
				createAlert('success', 'Saved successfully', true);
			} else {
				createAlert('warning', 'Save failed', true);
			}
		}
		
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		  };
		
		function getTime(sunAngle) {
			var baseLine = new Date(2000, 1, 1, 13, 0, 0, 0);
			var offset = sunAngle / 16;
			var multiplier = offset * 60;
			baseLine.setMinutes(baseLine.getMinutes() + multiplier);
			return baseLine;
		}
		
		function getSunAngle(hours, mins) {
			var baseLine = new Date(2000, 1, 1, 13, 0, 0, 0);
			var time = new Date(2000, 1, 1, hours, mins, 0);
			var diff = time - baseLine;
			var minDiff = Math.round(diff / 60000);
			var multiplier = minDiff / 60;
			var sunAngle = multiplier * 16;
			return sunAngle;
		}
		
		function createAlert(type, msg, autoClose) {
			var alert = { type: type, msg: msg};
			$scope.alerts.push(alert);
			if (autoClose) {
				$timeout(function(){
					$scope.alerts.splice($scope.alerts.indexOf(alert), 1);
				}, 3000);
			}
		}
		
		function findInArray(arr, search) {
			var found = $filter('filter')(arr, search, true);
			if (found.length) {
				return found[0];
			}
			
			return null;
		}
	})
	.controller('RulesCtrl', function($scope, $timeout, ServerService, DynamicTrackService) {
		$scope.alerts = [];
		
		$scope.assistOptions = [
			{
				value: '0',
				name: 'Force Off'
			},
			{
				value: '1',
				name: 'Factory'
			},
			{
				value: '2',
				name: 'Force On'
			}
		];
		
		ServerService.GetServerDetails(function (data) {
			data.AUTOCLUTCH_ALLOWED = data.AUTOCLUTCH_ALLOWED == 1;
			data.STABILITY_ALLOWED = data.STABILITY_ALLOWED == 1;
			data.TYRE_BLANKETS_ALLOWED = data.TYRE_BLANKETS_ALLOWED == 1;
			
			$scope.server = data;
		});
		
		DynamicTrackService.GetDynamicTrackDetails(function (data) {
			$scope.dynamicTrackEnabled = data.LAP_GAIN !== undefined;
			$scope.dynamicTrack = data;
		});
		
		$scope.submit = function() {
			$scope.$broadcast('show-errors-check-validity');
			
			if ($scope.form.$invalid) { 
				createAlert('warning', 'There are errors on the form', true);
				return; 
			}
			
			var data = angular.copy($scope.server);
			
			data.AUTOCLUTCH_ALLOWED = $scope.server.AUTOCLUTCH_ALLOWED ? 1 : 0;
			data.STABILITY_ALLOWED = $scope.server.STABILITY_ALLOWED ? 1 : 0;
			data.TYRE_BLANKETS_ALLOWED = $scope.server.TYRE_BLANKETS_ALLOWED ? 1 : 0;
			
			var saved = true;
			
			ServerService.SaveServerDetails(data, function(result) {
				if (!(result[0] === 'O' && result[1] === 'K')) {
					saved = false;
				}
			});
			
			if(!$scope.dynamicTrackEnabled) {
				$scope.dynamicTrack = {};
			}
			
			DynamicTrackService.SaveDynamicTrackDetails($scope.dynamicTrack, function(result) {
				if (!(result[0] === 'O' && result[1] === 'K')) {
					saved = false;
				}
			});
			
			if (saved) {
				createAlert('success', 'Saved successfully', true);
			} else {
				reateAlert('success', 'Save failed', true);
			}
		}
		
		function createAlert(type, msg, autoClose) {
			var alert = { type: type, msg: msg};
			$scope.alerts.push(alert);
			if (autoClose) {
				$timeout(function(){
					$scope.alerts.splice($scope.alerts.indexOf(alert), 1);
				}, 3000);
			}
		}
	})
	.controller('AdvancedCtrl', function($scope, $timeout, ServerService) {	
		$scope.alerts = [];
		
		ServerService.GetServerDetails(function (data) {		
			$scope.server = data;
		});
		
		$scope.submit = function() {
			$scope.$broadcast('show-errors-check-validity');
			
			if ($scope.form.$invalid) { 
				createAlert('warning', 'There are errors on the form', true);
				return; 
			}
			
			ServerService.SaveServerDetails($scope.server, function(result) {
				if (result[0] === 'O' && result[1] === 'K') {
					createAlert('success', 'Saved successfully', true);
				} else {
					createAlert('warning', 'Save failed');
				}
			});
		}
		
		function createAlert(type, msg, autoClose) {
			var alert = { type: type, msg: msg};
			$scope.alerts.push(alert);
			if (autoClose) {
				$timeout(function(){
					$scope.alerts.splice($scope.alerts.indexOf(alert), 1);
				}, 3000);
			}
		}
	})
	.controller('EntryListCtrl', function($scope, $timeout, ServerService, CarService, EntryListService) {	
		$scope.alerts = [];
		$scope.entryList = [];
		$scope.newEntry = {
			DRIVERNAME: '',
			TEAM: '',
			MODEL: '',
			SKIN: '',
			GUID: '',
			SPECTATOR_MODE: ''
		};
		
		ServerService.GetServerDetail('cars', function (data) {		
			$scope.cars = data.value.split(';');
			$scope.newEntry.MODEL = $scope.cars[0];
			$scope.selectedCarChanged();
		});
		
		EntryListService.GetEntryList(function (data) {
			angular.forEach(data, function(value, key) {
				if (key.indexOf('CAR_') === 0) {
					value.SPECTATOR_MODE = value.SPECTATOR_MODE == 1;
					$scope.entryList.push(value);
				}
			});
		});
		
		$scope.selectedCarChanged = function() {
			CarService.GetSkins($scope.newEntry.MODEL, function(data) {
				$scope.skins = data.skins;
				$scope.newEntry.SKIN = $scope.skins[0];
			});
		}
		
		$scope.removeEntry = function(index) {
			$scope.entryList.splice(index, 1);
		}
		
		$scope.submit = function() {
			$scope.entryList.push($scope.newEntry);
			$scope.newEntry = {
				DRIVERNAME: '',
				TEAM: '',
				MODEL: $scope.cars[0],
				SKIN: '',
				GUID: '',
				SPECTATOR_MODE: ''
			};
			$scope.selectedCarChanged();
		}
		
		$scope.saveChanges = function() {
			var data = {};
			angular.forEach($scope.entryList, function(value) {
				value.SPECTATOR_MODE = value.SPECTATOR_MODE ? 1 : 0;
				data['CAR_' + $scope.entryList.indexOf(value)] = value;
			});
			
			EntryListService.SaveEntryList(data, function(result) {
				if (result[0] === 'O' && result[1] === 'K') {
					createAlert('success', 'Saved successfully`', true);
				} else {
					createAlert('warning', 'Save failed');
				}
			});
		}
		
		$scope.clear = function() {
			if (confirm('Are you sure?')) {
				$scope.entryList = [];
			}
		}
		
		function createAlert(type, msg, autoClose) {
			var alert = { type: type, msg: msg};
			$scope.alerts.push(alert);
			if (autoClose) {
				$timeout(function(){
					$scope.alerts.splice($scope.alerts.indexOf(alert), 1);
				}, 3000);
			}
		}
	});