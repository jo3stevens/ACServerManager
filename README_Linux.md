# ACServerManager
Web based server manager for Assetto Corsa directly manipulating the ini files on the server as an alternative to the windows app and having to copy files to your server.

Start and stop the server, and stracker directly from the application, meaning you can make changes to the server configuration and restart the server directly from your browser or mobile phone.

## ACServerManager on Linux
This is the installation guide for a Linux machine, to review the Windows installation guide go [here](https://github.com/Pringlez/ACServerManager/blob/master/README.md).

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

## Details
First you'll need to install Node.js on your machine. It's best to use an application 
like [NVM](https://github.com/creationix/nvm) to manage the installation of Node.js on Linux based machines.
After installing Node.js, install [PM2](https://github.com/Unitech/pm2) when using this
version of AC Server Manager, it's basically Node.js application management tool with tons of features
for production use. PM2 will make sure your web application stays online and, auto restarts if it crashes.

## Install NVM
To install NVM, follow the installation guide on its GitHub page [here](https://github.com/creationix/nvm). Please install NVM on the same account you run your Assetto Corsa Server.

## Install Node.js
Using NVM, run the following command to install the latest version:
```
nvm install node
```
If you would like to install a specific version using NVM then run something like this:
```
nvm install 6.9.4
```
## Install PM2
To install PM2, follow the installation guide on its GitHub page [here](https://github.com/Unitech/pm2). Please install PM2 on the same account you run your Assetto Corsa Server.

## Install ACServerManager
Create a directory called 'acmanager', cd into that directory and run this command to download the latest version:
```
wget https://github.com/Pringlez/ACServerManager/archive/master.zip
```
Unzip the file & clean up, by running:
```
unzip master.zip; mv ACServerManager-master/* .; rm -R ACServerManager-master; rm master.zip
```
You'll need to first configure your manager's settings before you can run the application.
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
If your machine has a firewall enabled (i.e) iptables, you'll need to open / allow the ACServerManager port defined in your settings.js file.

## Running ACServerManager
You first need to make sure you have the necessary Node.js dependencies, run:
```
npm install
```
To run ACServerManager using PM2 run the following command:
```
pm2 start server.js
```
To monitor applications running with PM2 run:
```
pm2 list
```
There many useful commands to manage applications using PM2, reference their GitHub page.

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
![Server Status](http://yeahyou.com/ACServerManager/server-status.jpg)

### Server Configuration
![Server Config](http://www.yeahyou.com/ACServerManager/server-config.jpg)

### Entry List
![Server Config](http://www.yeahyou.com/ACServerManager/entry-list.jpg)

### Rules
![Server Config](http://www.yeahyou.com/ACServerManager/rules.jpg)

### Advanced
![Server Config](http://www.yeahyou.com/ACServerManager/advanced.jpg)
