var express = require('express');
var fs = require('fs');
var ini = require('ini');
var bodyParser = require('body-parser');
var childProcess = require('child_process');
var basicAuth = require('node-basicauth');
var settings = require('./settings');
 
var serverPath = settings.serverPath;
var sTrackerPath = settings.sTrackerPath;
var username = settings.username;
var password = settings.password;

var acServerStatus = 0;
var sTrackerServerStatus = 0;
var acServerPid;
var sTrackerServerPid;
var acServerLogName;

var currentSession;
var currentDrivers = [];

var config = ini.parse(fs.readFileSync(serverPath + 'cfg/server_cfg.ini', 'utf-8'))
var entryList = ini.parse(fs.readFileSync(serverPath + 'cfg/entry_list.ini', 'utf-8'))

function saveConfig() {
  fs.writeFileSync(serverPath + 'cfg/server_cfg.ini', ini.stringify(config));
}

function saveEntryList() {
  fs.writeFileSync(serverPath + 'cfg/entry_list.ini', ini.stringify(entryList));
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(srcpath + "/" + file).isDirectory();
  });
}

function getDateTimeString() {
	var d = new Date();
	return d.getFullYear() + ('0' + d.getMonth()).slice(-2) + ('0' + d.getDate()).slice(-2) + '_' + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2);
}

function writeLogFile(filename, message) {
	fs.appendFile(__dirname + '/' + filename, message + '\r\n', function(err) {
		if(err) {
			throw(err);
		}
	});
}

var app = express();
if (username !== '' && password !== '') {
	app.use(basicAuth(username, password));
}
app.use(bodyParser.json());
app.use(express.static(__dirname + '/frontend'));

//api
app.get('/api', function(req, res) {
  try {
	res.status(200);
	res.send(config);  
  }catch(e) {
	console.log('Error: GET/api - ' + e);
	res.status(500);
	res.send('Application error');
  }
});

//api/server
app.get('/api/server', function(req, res) {
	try {
		res.status(200);
		res.send(config.SERVER);
	}catch(e) {
		console.log('Error: GET/api/server - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/server/status', function(req, res) {
	try {
		res.status(200);
		res.send({ session: currentSession, drivers: currentDrivers });
	}catch(e) {
		console.log('Error: GET/api/server/status - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/server/:id', function(req, res) {
	try {
		res.status(200);
		res.send({ value: config.SERVER[req.params.id.toUpperCase()] });
	}catch(e) {
		console.log('Error: GET/api/server/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/server', function(req, res) {
	try {
		for(var param in req.body) {
		  config.SERVER[param.toUpperCase()] = req.body[param];
		}

		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/server - ' + e);
		res.status(500);
		res.send('Application error');
	}  
});

app.post('/api/server/:id', function(req, res) {
	try {
		config.SERVER[req.params.id.toUpperCase()] = req.body.value;
		saveConfig();
		res.status(200);
		res.send('OK');
	}
	catch(e) {
		console.log('Error: POST/api/server/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/book
app.get('/api/book', function(req, res) {
	try {
		res.status(200);
		res.send(config.BOOK);
	}catch(e) {
		console.log('Error: GET/api/book - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/book/:id', function(req, res) {
	try {
		res.status(200);
		res.send(config.BOOK[req.params.id.toUpperCase()]);
	}catch(e) {
		console.log('Error: GET/api/book/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/book', function(req, res) {
	try {
		if (!Object.keys(req.body).length) {
			if (config.BOOK) {
				delete config.BOOK;
			}
		} else {
			if (config.BOOK === undefined) {
				config.BOOK = {};
			}
			for(var param in req.body) {
				config.BOOK[param.toUpperCase()] = req.body[param];
			}
		}
		
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/book/ - ' + e);
		res.status(500);
		res.send('Application error');
	}	
});

app.post('/api/book/:id', function(req, res) {
	try {
		config.BOOK[req.params.id.toUpperCase()] = req.body.value;
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/book/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/practice
app.get('/api/practice', function(req, res) {
	try {
		res.status(200);
		res.send(config.PRACTICE);	
	}catch(e) {
		console.log('Error: GET/api/practice - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/practice/:id', function(req, res) {
	try {
		res.status(200);
		res.send(config.PRACTICE[req.params.id.toUpperCase()]);
	}catch(e) {
		console.log('Error: GET/api/practice/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/practice', function(req, res) {
	try {
		if (!Object.keys(req.body).length) {
			if (config.PRACTICE) {
				delete config.PRACTICE;
			}
		} else {
			if (config.PRACTICE === undefined) {
				config.PRACTICE = {};
			}
			for(var param in req.body) {
				config.PRACTICE[param.toUpperCase()] = req.body[param];
			}
		}

		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/practice - ' + e);
		res.status(500);
		res.send('Application error');
	}

});

app.post('/api/practice/:id', function(req, res) {
	try {
		config.PRACTICE[req.params.id.toUpperCase()] = req.body.value;
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/practice/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/qualify
app.get('/api/qualify', function(req, res) {
	try {
		res.send(config.QUALIFY);
	}catch(e) {
		console.log('Error: GET/api/qualify - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/qualify/:id', function(req, res) {
	try {
		res.status(200);
		res.send(config.QUALIFY[req.params.id.toUpperCase()]);
	}catch(e) {
		console.log('Error: GET/api/qualify/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
  
});

app.post('/api/qualify', function(req, res) {
	try {
		if (!Object.keys(req.body).length) {
			if (config.QUALIFY) {
				delete config.QUALIFY;
			}
		} else {
			if (config.QUALIFY === undefined) {
				config.QUALIFY = {};
			}
			for(var param in req.body) {
				config.QUALIFY[param.toUpperCase()] = req.body[param];
			}
		}
		
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/qualify - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/qualify/:id', function(req, res) {
	try {
		config.QUALIFY[req.params.id.toUpperCase()] = req.body.value;
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/qualify/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/race
app.get('/api/race', function(req, res) {
	try {
		res.status(200);
		res.send(config.RACE);
	}catch(e) {
		console.log('Error: GET/api/race - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/race/:id', function(req, res) {
	try {
		res.send(config.RACE[req.params.id.toUpperCase()]);
	}catch(e)
	{
		console.log('Error: GET/api/race/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/race', function(req, res) {
	try {
		if (!Object.keys(req.body).length) {
			if (config.RACE) {
				delete config.RACE;
			}
		} else {
			if (config.RACE === undefined) {
				config.RACE = {};
			}
			for(var param in req.body) {
				config.RACE[param.toUpperCase()] = req.body[param];
			}
		}
		
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/race - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/race/:id', function(req, res) {
	try {
		config.RACE[req.params.id.toUpperCase()] = req.body.value;
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/race/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/dynamic_track
app.get('/api/dynamictrack', function(req, res) {
	try {
		res.status(200);
		res.send(config.DYNAMIC_TRACK);
	}catch(e) {
		console.log('Error: GET/api/dynamictrack - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/dynamictrack/:id', function(req, res) {
	try {
		res.status(200);
		res.send(config.DYNAMIC_TRACK[req.params.id.toUpperCase()]);
	}catch(e) {
		console.log('Error: GET/api/dynamictrack/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/dynamictrack', function(req, res) {
	try {
		if (!Object.keys(req.body).length) {
			if (config.DYNAMIC_TRACK) {
				delete config.DYNAMIC_TRACK;
			}
		} else {
			if (config.DYNAMIC_TRACK === undefined) {
				config.DYNAMIC_TRACK = {};
			}
			for(var param in req.body) {
				config.DYNAMIC_TRACK[param.toUpperCase()] = req.body[param];
			}
		}
		
		saveConfig();
		res.status(200);
		res.send('OK');		
	}catch(e) {
		console.log('Error: POST/api/dynamictrack - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/dynamictrack/:id', function(req, res) {
	try {
		config.DYNAMIC_TRACK[req.params.id.toUpperCase()] = req.body.value;
		saveConfig();
		res.status(200);
		res.send('OK');
	}catch(e) {
		console.log('Error: POST/api/dynamictrack/:id - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/tracks
app.get('/api/tracks', function(req, res) {
	try {
		var trackNames = fs.readdirSync(serverPath + "content/tracks");
		var tracks = [];

		for(var trackName in trackNames) {
		  var track = {
			  name: trackNames[trackName]
		  };
		  
		  try {
			var configs = getDirectories(serverPath + "content/tracks/" + trackNames[trackName] + "/ui");
			track.configs = configs;
		  }
		  catch(e) {
			  //console.log(e);
		  }
		  
		  tracks.push(track);
		}
		
		res.status(200);
		res.send(tracks);		
	}catch(e) {
		console.log('Error: GET/api/tracks - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/tracks/:track', function(req, res) {
	try {
		var trackDetails = fs.readFileSync(serverPath + 'content/tracks/' + req.params.track + '/ui/ui_track.json', 'utf-8');
		res.status(200);
		res.send(trackDetails);	
	}catch(e) {
		console.log('Error: GET/api/tracks/:track - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/tracks/:track/image', function(req, res) {
	try {
		res.status(200);;
		var image = fs.readFileSync(serverPath + 'content/tracks/' + req.params.track + '/ui/preview.png');
		res.contentType('image/jpeg');
		res.send(image);	
	}catch(e) {
		console.log('Error: GET/api/tracks/:track/image - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/tracks/:track/:config', function(req, res) {
	try {
		var trackDetails = fs.readFileSync(serverPath + 'content/tracks/' + req.params.track + '/ui/' +  req.params.config + '/ui_track.json', 'utf-8');
		res.status(200);
		res.send(trackDetails);	
	}catch(e) {
		console.log('Error: GET/api/tracks/:track/:config - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.get('/api/tracks/:track/:config/image', function(req, res) {
	try {
		res.status(200);;
		var image = fs.readFileSync(serverPath + 'content/tracks/' + req.params.track + '/ui/' + req.params.config + '/preview.png');
		res.contentType('image/jpeg');
		res.send(image);	
	}catch(e) {
		console.log('Error: GET/api/tracks/:track/:config/image - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/cars
app.get('/api/cars', function(req, res) {
	try {
		var cars = fs.readdirSync(serverPath + "content/cars");
		res.status(200);
		res.send(cars);		
	}catch(e) {
		console.log('Error: GET/api/cars - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/cars/car
app.get('/api/cars/:car', function(req, res) {
	try {
		var skins = {}
		try{
			var skins = fs.readdirSync(serverPath + "content/cars/" + req.params.car + "/skins");
		}
		catch(e) {
			console.log("Car not found: " + req.params.car);
		}
	  
		res.status(200);
		res.send({skins: skins});		
	}catch(e) {
		console.log('Error: GET/api/cars/:car - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//api/entrylist
app.get('/api/entrylist', function(req, res) {
	try {
		res.status(200);
		res.send(entryList);
	}catch(e) {
		console.log('Error: GET/api/entrylist - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/entrylist', function(req, res) {
	try {
		var newEntryList = {};
		for(var param in req.body) {
			newEntryList[param.toUpperCase()] = req.body[param];
		}
		entryList = newEntryList;
		saveEntryList();
	}
	catch(e) {
		console.log("Failed to save entry list");
		res.send(500);
		res.send("Failed to save entry list")
	}

	res.status(200);
	res.send('OK');
});

//api/acserver
app.get('/api/acserver/status', function(req, res) {
	try {
		res.status(200);
		res.send({status: acServerStatus});
	}catch(e) {
		console.log('Error: GET/api/acserver/status - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/acserver', function(req, res) {
	try {
		var acServer = childProcess.spawn('acServer.exe', { cwd: serverPath });
		acServerPid = acServer.pid;
		acServerLogName = getDateTimeString() + '.txt';
		
		acServer.stdout.on('data', function(data) {
			if (acServerStatus === 0) {
				acServerStatus = -1;
			}
			
			var dataString = String(data);
			
			if (dataString.indexOf('OK') !== -1) {
				acServerStatus = 1;
			}
			
			if (dataString.indexOf('PAGE: /ENTRY') === -1) {
				//Log to console and file
				console.log(dataString);
				writeLogFile('server_' + acServerLogName, getDateTimeString() + ': ' + data);
				
				//Set current session
				if (dataString.indexOf('session name') !== -1) {
					currentSession = dataString.substr(dataString.indexOf('session name :') + 14, dataString.indexOf('\n')).trim();
				}
							
				//New driver
				if (dataString.indexOf('Sending first leaderboard to car') === 0) { //eg. Sending first leaderboard to car: ferrari_laferrari (0) [Joe Stevens []]
					var car = dataString.substr(dataString.indexOf(':') + 1); //Remove leading text
					car = car.substr(0, car.indexOf('(')).trim(); //Remove other text
					var driver = dataString.substr(dataString.indexOf('[') + 1); //Get driver name removing leading text
					driver = driver.substr(0, driver.indexOf('[')).trim(); //Remove other text
					
					currentDrivers.push({ name: driver, car: car, timeJoined: new Date().toLocaleString('en-GB') });
				}
				
				//Driver left server
				if (dataString.indexOf('driver disconnected') !== -1) { //eg. Clean exit, driver disconnected:  Joe Stevens []
					var driverName = dataString.substr(dataString.indexOf(':') + 1);
					driverName = driverName.substr(0, driverName.indexOf('[]')).trim();
					
					var driver = currentDrivers.filter(function(item) {
						return item.name === driverName;
					});
					
					if (driver) {
						currentDrivers.splice(currentDrivers.indexOf(driver), 1);
					}
				}
			}
			
		});
		acServer.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
			writeLogFile('error_' + acServerLogName, getDateTimeString() + ': ' + data);
		});
		acServer.on('close', function(code) {
			console.log('closing code: ' + code);
		});
		acServer.on('exit', function(code) {
			console.log('exit code: ' + code);
			acServerStatus = 0;
		});
		
		res.status(200);
		res.send("OK");		
	}catch(e) {
		console.log('Error: POST/api/acserver - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/acserver/stop', function(req, res) {
	try {
		if (acServerPid) {
			childProcess.spawn("taskkill", ["/pid", acServerPid, '/f', '/t']);
			acServerPid = undefined;
			acServerLogName = undefined;
		}
		
		res.status(200);
		res.send("OK");		
	}catch(e) {
		console.log('Error: POST/api/acserver/stop - ' + e);
		res.status(500);
		res.send('Application error');		
	}
});

//api/strackerserver
app.get('/api/strackerserver/status', function(req, res) {
	try {
		res.status(200);
		res.send({status: sTrackerPath === '' ? -2 : sTrackerServerStatus});
	}catch(e) {
		console.log('Error: GET/api/strackerserver/status - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/strackerserver', function(req, res) {
	try {
		var sTracker = childProcess.spawn('stracker.exe', ['--stracker_ini', 'stracker.ini'], { cwd: sTrackerPath });
		sTrackerServerPid = sTracker.pid;
		
		sTracker.stdout.on('data', function(data) {
			if (sTrackerServerStatus == 0) {
				sTrackerServerStatus = -1;
			}
			
			if (String(data).indexOf('stracker.py') !== -1) {
				sTrackerServerStatus = 1;
			}
			
			console.log(data);
		});
		sTracker.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
		});
		sTracker.on('close', function(code) {
			console.log('closing code: ' + code);
		});
		sTracker.on('exit', function(code) {
			console.log('exit code: ' + code);
			sTrackerServerStatus = 0;
		});
		
		res.status(200);
		res.send("OK");		
	}catch(e) {
		console.log('Error: POST/api/strackerserver - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

app.post('/api/strackerserver/stop', function(req, res) {
	try {
		if (sTrackerServerPid) {
			childProcess.spawn("taskkill", ["/pid", sTrackerServerPid, '/f', '/t']);
			sTrackerServerPid = undefined;
		}
		
		res.status(200);
		res.send("OK");		
	}catch(e) {
		console.log('Error: POST/api/strackerserver/stop - ' + e);
		res.status(500);
		res.send('Application error');
	}
});

//frontend
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/frontend/index.html');
});

app.listen(settings.port);