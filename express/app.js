/*
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
*/

// Server-side: app.js
const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');
var router = express.Router();
var session = require('express-session');
const history = require('connect-history-api-fallback');
//const { request } = require('express');
var connectionDB = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '00000000',
  database: 'cs350db',
});
/*
//connectionDB.connect();
router.get('/api/v1/get-clubs-related', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../kaist-club-frontend/kaist-club/frontend-vue/src/App.vue'));
});
*/
//module.exports = router;

const app = express();

//app.use(history());
//app.use('/api/v1/get-clubs-related',router);

// parse application/x-www-form-urlencoded
// { extended: true } : support nested object
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.use(session({
  userId: 'tpdus2155',
  secret: "asdfasffdas",
  resave: false,
  saveUninitialized: true
}));


/*
app.post('/api/v1/sign-in', (req, res) => {
  var post = req.body;
  connectionDB.query(`select userId, password from users where userId=? and hashedPW=?`, 
    [post.id,post.password], function(err,result){
        if(err) throw err;
        if(result[0]!==undefined){
            req.session.userId = result[0].id;                              
            req.session.save(function(){                           
                rsp.redirect('/');
            });
        }
    });
});
*/
app.get('/api/v1/get-clubs-related', (req, res) => {
  //var session = req.session;
  req.session.userId = 'ytrewq271828';
  var subRows;
  var joinRows;
  //let bodyList = [];
  if (connectionDB) {
    console.log(req.session.userId);
    //bodyList = new Array();
    connectionDB.query(`select *, 1 as rowtype from subscribes natural left join clubs where userId='${req.session.userId}' union select *, 2 as rowtype from joins natural left join clubs where userId='${req.session.userId}';`, (error, subRows) => {
      console.log(subRows);
      bodyList = new Array();
      if (error) throw error;
      //console.log(subRows.length);
      for (var i = 0; i < subRows.length; i++) {
        var isJoined = true;
        //console.log(connectionDB.query(`select exists(select * from joins where userId='${req.session.userId}');`));
        if(subRows[i]['rowtype'] == 1) {
          isJoined=false
        }
        bodyList.push({
          id: subRows[i]['clubId'],
          name: subRows[i]['clubName'],
          isJoined: isJoined
          });
      }
      //console.log(bodyList);
      res.send(bodyList);
    });
    /*
    var subJoinSelect=connectionDB.query(`select * from joins where userId='${req.session.userId}';`, (error, joinRows) => {
      bodyList = new Array();
      if (error) throw error;
      for (var i = 0; i < joinRows.length; i++) {
        bodyList.push({
          id: joinRows[i]['userId'],
          name: joinRows[i]['clubName'],
          isJoined: true,
        });
      }
      return bodyList;
    });
    */

  } else {
    throw new Error(`DB Connection Failed`);
  }
});

app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  // send the payload (the data contained in the body of request message) to the client as it is
  res.send({ username, password });
});

// GET method route
app.get('/api/v1', (req, res) => res.send('GET request to the /api/books'));

// POST method route
app.post('/api/v1', (req, res) => res.send('POST request to the /api/books'));


app.all('/', (req, res, next) => {
  console.log('[All]');
  next(); // Pass the control to next handler function
});

app.get('/getnext', (req, res, next) => {
  console.log('[GET 1] Pass the response to next handler by next()');
  next();
}, (req, res, next) => {
  console.log('[GET 2] Pass the response to next handler by next()');
  next();
}, (req, res) => res.send('Hello from GET /'));

app.post('/postnext', (req, res, next) => {
  console.log('[POST 1] Pass the response to next handler by next()');
  next();
}, (req, res, next) => {
  console.log('[POST 2] Pass the response to next handler by next()');
  next();
}, (req, res) => res.send('Hello from POST /'));


app.get('/example/a', (req, res) => res.send('Hello from A!'));

app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...');
  next();
}, (req, res) => res.send('Hello from B!'));

const cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

const cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

const cb2 = function (req, res) {
  res.send('Hello from C!');
}

app.get('/example/c', [cb0, cb1, cb2]);

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('the response will be sent by the next function ...');
  next();
}, (req, res) => res.send('Hello from D!'));


app.listen(3000, () => console.log('Example app listening on port 3000!'));