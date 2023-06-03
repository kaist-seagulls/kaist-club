// Server-side: app.js
const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql2');
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
      // console.log(subRows);
      bodyList = new Array();
      if (error) throw error;
      //console.log(subRows.length);
      for (var i = 0; i < subRows.length; i++) {
        var isJoined = true;
        //console.log(connectionDB.query(`select exists(select * from joins where userId='${req.session.userId}');`));
        if (subRows[i]['rowtype'] == 1) {
          isJoined = false
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


  } else {
    throw new Error(`DB Connection Failed`);
  }
});


app.listen(3000, () => console.log('Example app listening on port 3000!'));