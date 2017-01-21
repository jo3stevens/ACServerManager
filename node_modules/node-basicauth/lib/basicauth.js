module.exports = function(accounts) {
  accounts = accounts != null ? accounts : {};
  return function(req, res, next) {
    var auth, buf, creds, found, i, password, tmp, userAuth, username;
    auth = req.headers['authorization'];
    if (!auth) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
      return res.end();
    } else {
      tmp = auth.split(' ');
      buf = new Buffer(tmp[1], 'base64');
      userAuth = buf.toString();
      creds = userAuth.split(':');
      username = creds[0];
      password = creds[1];
      found = false;
      for (i in accounts) {
        if (username === i && password === accounts[i]) {
          found = true;
        }
      }
      if (found) {
        res.statusCode = 200;
        return next();
      } else {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        return res.end();
      }
    }
  };
};
