# Basic Auth Middleware for Express

<a href="https://nodei.co/npm/node-basicauth/"><img src="https://nodei.co/npm/node-basicauth.png?downloads=true"></a>

## Download
The source is available for download from GitHub. Alternatively, you can install using Node Package Manager (npm):

`npm install node-basicauth`

## Example
```coffeescript
app = express()
basicAuth = require 'node-basicauth'

// you can add as many usernames and passwords as you want
app.use(basicAuth({
	'username1' : 'password1'
	'username2' : 'password2'
}))
```

## Development
### Dependencies

This command needs to be ran first if CoffeeScript is not installed on your system

* run `sudo npm install -g coffee-script`

### Setup

Install all of the dependencies

* run `npm install`

The following command will watch and compile Coffeescript
* run `gulp`

