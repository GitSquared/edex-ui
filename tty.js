var tty = require('tty.js');

var tty = tty.createServer({
  shell: (process.platform == 'win32') ? 'cmd.exe' : 'bash',
  users: {
    foo: 'bar'
  },
  port: 8000
});

tty.get('/foo', function(req, res, next) {
  res.send('bar');
});

tty.listen();
