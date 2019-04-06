const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const multer = require('multer');
// const  storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/images/uploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
// });
// var upload = multer({storage: storage});

const upload = multer({ dest: './public/img/uploads/' });

var db, collection;

const url = 'mongodb+srv://rsoljour:sockman@sock-man-msuia.mongodb.net/Sockman?retryWrites=true';
const dbName = 'Sockman'

app.listen(5000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
  console.log("I'm on 5k")
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('sock-posts').find().toArray((err, result) => {
    console.log("the socks here",  result)
    if (err) return console.log(err)
    res.render('index.ejs', {
      sockPosts: result

    })
  })
})

app.post('/sockfeed', upload.single('sockPic'), (req, res) => {
  db.collection('sock-posts').save({image: req.file.filename, name: req.body.name, description: req.body.description}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database', req.file.filename, req.body.name, req.body.description)

    res.redirect('/')
  })
})
