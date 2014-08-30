

var app = require('./app')
//load services
require('./services/socket');
require('./services/classroom');


//load directives
require('./directives/whiteboard');


// load controllers

require('./controllers/user-ctrls');
require('./controllers/whiteboard-ctrl');
require('./controllers/lesson-student-ctrl');
require('./controllers/lesson-ctrls');
require('./controllers/test-ctrl');
require('./controllers/index-ctrl');
require('./router');