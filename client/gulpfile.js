var gulp = require('gulp'),
  connect = require('gulp-connect'),
  proxy = require('http-proxy-middleware');
 
gulp.task('connectDev', function () {
  connect.server({
    name: 'Sample App',
    port: 8000,
    livereload: true,
    middleware: function(connect, opt) {
        return [
            proxy('/api', {
                target: 'http://localhost:3000',
                changeOrigin:true
            })
        ]
    }
  });
});
 
gulp.task('default', ['connectDev']);