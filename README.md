# ACServerManager
Web based server manager for Assetto Corsa directly manipulating the ini files on the server as an alternative to the windows app and having to copy files to your server.

Start and stop the server, and stracker directly from the application, meaning you can make changes to the server configuration and restart the server directly from your browser or mobile phone.

## ACServerManager on Windows
This is the installation guide for a Windows machine, to review the Linux installation guide go [here](https://github.com/Pringlez/ACServerManager/blob/master/README_Linux.md).

## Updates
27/01/2017:
* Update to UI layout
* Added restart feature for AC & sTracker server

17/10/2015:
* Bug fix when switching between two tracks with multiple track configs
* Added Max Ballast and UDP Plugin fields to Advanced page
* Added new setting for contentPath allowing server and content folders to be seperated (this happens when using a manager package from the kunos tool). If this setting it left empty it will assume the content folder is inside the server folder

22/08/2015:
* Finished adding all the new settings from 1.2 including tyres and weather

## Prep
NOTE: If you've been using the new windows server manager that came with 1.2 then you may not need this step as when you package the server files it does the same thing.

The application needs some additional files added to the server/content/tracks and server/content/cars folders to be able to choose track configurations and car skins.

Copy acServerManager.bat to your root aessettocorsa folder and run it to copy the required folders into server/content/*. You'll then need to copy the content folder to your server.

For tracks it will copy the ui folder which will contain sub folders when there are multiple track configurations. It will also copy the contents of these directories which contains additional track information which is displayed when choosing a track.

For cars it will copy the skins/* folder structure but not the files; this is just to be able to choose the skin when setting up the entry list.

## Install Node.js
To install Node.js, follow the installation guide on its home page [here](https://nodejs.org).

## Install ACServerManager
Create a directory called 'acmanager', go into that directory and click [here](https://github.com/Pringlez/ACServerManager/archive/master.zip) to download the latest version. Extract 
the contents of the zip file into the directory.

## ACServerManager Configuration
To configure your manager's settings, open the 'settings.js' file. You'll see a number of variables, point the 'serverPath'
to your Assetto Corsa Server directory. You can configure your username, password & port settings for ACServerManager, also 
if you use sTracker, point the 'sTrackerPath' variable to your installation.

* serverPath: The path to your server folder containing acServer.exe
* sTrackerPath: The path to your stracker folder container stracker.exe (If you don't run stracker just leave this as an empty string ('') to disable it
* username/password: Set these values if you want basic authentication on the application
* port: The port that the application will listen on (Be sure to open up this port on firewalls)

Note: I've currently set the Assetto Corsa Server installation to one directory up in 'server', change if necessary.

## Firewall
If your machine has a firewall enabled (i.e) windows firewall, you'll need to open / allow the ACServerManager port defined in your settings.js file.

## Running ACServerManager
You first need to make sure you have the necessary Node.js dependencies, run the following command in the command prompt in the same directory as the 'server.js' file:
```
npm install
```
To run ACServerManager, execute the 'start.bat' file. If you see no errors, ACServerManager should now be running.

## Using ACServerManager
* Browse to the application using your servers IP and the chosen port (or any DNS configured)
* Click the 'Start' button under Assetto Corsa Server section
* If using sTracker wait until the AC server has started and then click 'Start' in the sTracker Server section

The server should now be running. You'll be able to see any server output in the command window and it will be logged to a file in the 'ACServerManager/log' folder.

You can change any of settings and it will be applied directly to server_cfg.ini and entry_list.ini on the server. After making a change just stop and start the server from the Server Status page to apply the changes to Assetto Corsa Server.

Note, the server may fail to start in some cases if the Assetto Corsa Server cannot connect to the master server. Make sure you portforward / open
the necessary ports for the server to function correctly.

## Screenshots
### Server Status
![Server Status](http://deltahosting.dyndns.org:8080/acmanager/screen-cap-1.JPG)

### Server Configuration
![Server Config](http://deltahosting.dyndns.org:8080/acmanager/screen-cap-2.JPG)

### Entry List
![Entry List](http://deltahosting.dyndns.org:8080/acmanager/screen-cap-3.JPG)

### Rules
![Rules](http://deltahosting.dyndns.org:8080/acmanager/screen-cap-4.JPG)

### Advanced
![Advanced](http://deltahosting.dyndns.org:8080/acmanager/screen-cap-5.JPG)
