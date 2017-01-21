# ACServerManager on Linux
Installation guide on Linux, to review the Windows installation guide go [here](https://github.com/jo3stevens/ACServerManager),
or review the 'README_Windows.md' from the original master. 

## Details
First you'll need to install Node.js on your machine. It's best to use an application 
like [NVM](https://github.com/creationix/nvm) to manage the installation of Node.js on Linux based machines.
After installing Node.js, install [PM2](https://github.com/Unitech/pm2) when using this
version of AC Server Manager, it's basically Node.js application management tool with tons of features
for production use. PM2 will make sure your web application stays online and, auto restarts if it crashes.

## Install NVM
To install NVM, follow the installation guide on its GitHub page [here](https://github.com/creationix/nvm). You may need sudo / root access.

## Install Node.js
Using NVM run the following command to install the latest version:

```
nvm install node
```

If you would like to install a specific version using NVM then run something like this:

```
nvm install 6.9.4
```
## Install PM2
To install PM2, follow the installation guide on its GitHub page [here](https://github.com/Unitech/pm2). You may need sudo / root access.

## Install ACServerManager
Create a directory called 'acmanager', cd into that directory and run this command to download the latest version:
```
wget https://github.com/Pringlez/ACServerManager/archive/master.zip
```
Unzip the file, 
```
unzip master.zip; mv ACServerManager-master/* .; rm -R ACServerManager-master; rm master.zip
```
You'll need to first configure your manager's settings before you can run the application.
## ACServerManager Configuration
To configure your manager's settings, open the 'settings.js' file. You'll see a number of variables, point the 'serverPath'
to your Assetto Corsa Server directory. You can configure your username, password & port settings for ACServerManager, also 
if you use sTracker, point the 'sTrackerPath' variable to your installation.

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
Using ACServerManager is quite intuitive, to start your Assetto Corsa Server just click the 'Start' button. Note, the server
may fail to start in some cases if the Assetto Corsa Server cannot connect to the master server. Make sure you portforward / open
the necessary ports for the server to function correctly.

Navigate through the top menus to configure your AC server.

Happy Racing!
