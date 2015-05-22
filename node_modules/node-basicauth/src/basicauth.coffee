module.exports = (accounts) ->
    
    accounts = accounts ? {}

    return (req, res, next) ->
    
        auth = req.headers['authorization'] 
       
        if not auth
            res.statusCode = 401
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
            res.end()
        else
            # The Authorization was passed in so now we validate it
 
            tmp = auth.split(' ')
            buf = new Buffer(tmp[1], 'base64')
            userAuth = buf.toString()

            # userAuth = "username:password"

            creds = userAuth.split(':')
            username = creds[0]
            password = creds[1]
            found = false

            for i of accounts
                if username is i and password is accounts[i]
                    found = true

            if found
                res.statusCode = 200
                next()
            else
                res.statusCode = 401; # Force them to retry authentication
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
                res.end()
