'use strict';

angular.module('acServerManager.services', ['ngResource']).
    factory('CarService', function($resource) {
        return {
            GetCars: function(callback) {
                var resource = $resource('/api/cars');
                var result = resource.query(function() {
                    callback(result);
                });
            },
			GetSkins: function(car, callback) {
                var resource = $resource('/api/cars/:car');
                var result = resource.get({car: car}, function() {
                    callback(result);
                });
            }
        };
    }).
	factory('TrackService', function($resource) {
        return {
            GetTracks: function(callback) {
                var resource = $resource('/api/tracks');
                var result = resource.query(function() {
                    callback(result);
                });
            },
			GetTrackDetails: function(track, config, callback) {
				if (config) {
					var resource = $resource('/api/tracks/:track/:config');
					var result = resource.get({track: track, config: config}, function() {
						callback(result);
					}, function() {
						callback(null);
					});
				} else {
					var resource = $resource('/api/tracks/:track');
					var result = resource.get({track: track}, function() {
						callback(result);
					}, function() {
						callback(null);
					});
				}
            }
        };
    }).
	factory('ServerService', function($resource) {
        return {
            GetServerDetails: function(callback) {
                var resource = $resource('/api/server');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			GetServerDetail: function(id, callback) {
                var resource = $resource('/api/server/:id');
                var result = resource.get({id: id}, function() {
                    callback(result);
                });
            },
			SaveServerDetails: function(data, callback) {
				var resource = $resource('/api/server');
				var result = resource.save(data, function () {
                    callback(result);
                });
			},
			GetServerStatus: function(callback) {
                var resource = $resource('/api/server/status');
                var result = resource.get(function() {
                    callback(result);
                });
            },
        };
    }).
	factory('BookService', function($resource) {
        return {
            GetBookingDetails: function(callback) {
                var resource = $resource('/api/book');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			SaveBookingDetails: function(data, callback) {
				var resource = $resource('/api/book');
				var result = resource.save(data, function () {
                    callback(result);
                });
			}
        };
    }).
	factory('PracticeService', function($resource) {
        return {
            GetPracticeDetails: function(callback) {
                var resource = $resource('/api/practice');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			SavePracticeDetails: function(data, callback) {
				var resource = $resource('/api/practice');
				var result = resource.save(data, function () {
                    callback(result);
                });
			}
        };
    }).
	factory('QualifyService', function($resource) {
        return {
            GetQualifyDetails: function(callback) {
                var resource = $resource('/api/qualify');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			SaveQualifyDetails: function(data, callback) {
				var resource = $resource('/api/qualify');
				var result = resource.save(data, function () {
                    callback(result);
                });
			}
        };
    }).
	factory('RaceService', function($resource) {
        return {
            GetRaceDetails: function(callback) {
                var resource = $resource('/api/race');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			SaveRaceDetails: function(data, callback) {
				var resource = $resource('/api/race');
				var result = resource.save(data, function () {
                    callback(result);
                });
			}
        };
    }).
	factory('DynamicTrackService', function($resource) {
        return {
            GetDynamicTrackDetails: function(callback) {
                var resource = $resource('/api/dynamictrack');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			SaveDynamicTrackDetails: function(data, callback) {
				var resource = $resource('/api/dynamictrack');
				var result = resource.save(data, function () {
                    callback(result);
                });
			}
        };
    }).
	factory('WeatherService', function($resource) {
        return {
            GetWeather: function(callback) {
                var resource = $resource('/api/weather');
                var result = resource.query(function() {
                    callback(result);
                });
            },
			SaveWeather: function(data, callback) {
				var resource = $resource('/api/weather');
				var result = resource.save(data, function () {
                    callback(result);
                });
			}
        };
    }).
	factory('ProcessService', function($resource) {
        return {
            ACServerStatus: function(callback) {
                var resource = $resource('/api/acserver/status');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			StartACServer: function (callback) {
                var resource = $resource('/api/acserver');
                var result = resource.save(function () {
                    callback(result);
                });
            },
			StopACServer: function (callback) {
                var resource = $resource('/api/acserver/stop');
                var result = resource.save(function () {
                    callback(result);
                });
            },
			STrackerServerStatus: function(callback) {
                var resource = $resource('/api/strackerserver/status');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			StartSTrackerServer: function (callback) {
                var resource = $resource('/api/strackerserver');
                var result = resource.save(function () {
                    callback(result);
                });
            },
			StopSTrackerServer: function (callback) {
                var resource = $resource('/api/strackerserver/stop');
                var result = resource.save(function () {
                    callback(result);
                });
            }
        };
    }).
	factory('EntryListService', function($resource) {
        return {
            GetEntryList: function(callback) {
                var resource = $resource('/api/entrylist');
                var result = resource.get(function() {
                    callback(result);
                });
            },
			SaveEntryList: function(data, callback) {
                var resource = $resource('/api/entrylist');
                var result = resource.save(data, function() {
                    callback(result);
                });
            }
        };
    }).
	factory('DriverService', function($resource) {
        return {
            GetDrivers: function(callback) {
                var resource = $resource('/api/drivers');
                var result = resource.query(function() {
                    callback(result);
                });
            },
			SaveDriver: function(data, callback) {
                var resource = $resource('/api/drivers');
                var result = resource.save(data, function() {
                    callback(result);
                });
            },
			DeleteDriver: function(guid, callback) {
                var resource = $resource('/api/drivers/:guid');
                var result = resource.delete({guid: guid}, function() {
                    callback(result);
                });
            }
        };
    }).
	factory('TyreService', function($resource) {
        return {
            GetTyres: function(cars, callback) {
                var resource = $resource('/api/tyres');
                var result = resource.get({cars: cars}, function() {
                    callback(result);
                });
            }
        };
    });