# ACServerManager on Linux

## Install Node.js
[code]
cd /tmp
wget http://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x86.tar.gz
// To find what ever version go back to the  http://nodejs.org/dist/v0.12.7/ and select what you want
tar zxvf node-v0.12.7-linux-x86.tar.gz

sudo cp -r * /usr/local
cd ~

// To test
node -v // prints the version number
[code]

## Install ACServerManager
Download the ACServer and unpack into the dir you want. Refer to README.md

### Firewall
Assumes your machine is using UFW.

[code]
 sudo ufw allow 3000/tcp
[code]

3000 is the default port in ACServerManager settings.js


ACServerManager
================
Skipped running the linux equivalent of Copy acServerManager.bat
It appears all the track and car content is correct when uploading the package using the KS tools.

Do the configuration section in https://github.com/jo3stevens/ACServerManager#configuration
