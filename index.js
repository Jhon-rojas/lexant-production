process.env.NODE_ENV = 'production';

const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const io = require('@pm2/io')
const compression = require('compression');
const nodemailer = require('nodemailer');
const helmet = require("helmet");
const cache = require('express-redis-cache')();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(limiter);

app.use(compression()); //Compress all routes

app.use(express.static(process.cwd()+"/dist/lexant/", { maxAge: '1y' }));

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.disable('x-powered-by');

// app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000/').set('protocol', 'https'))
app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000/').set('protocol', 'https'));
// // add the routes that you want
app.use('/toto', () => {
  throw new Error('ajdoijerr')
});

// always add the middleware as the last one
app.use(io.expressErrorHandler());

app.use(cache.route());


app.get('/uploads/1239-Redazionale_-__Coronavirus_e_assenza_dal_lavoro_-_aggiornamento_DPCM_11-3-2020.pdf', (req,res) => {
  res.redirect('https://www.lexant.it/assets/attachments/pubblicazioni/1239-Redazionale_-__Coronavirus_e_assenza_dal_lavoro_-_aggiornamento_DPCM_11-3-2020.pdf');
});


app.get('/deu/pagina/:id', (req,res) => {
  res.status(404)
  res.end()
});
app.get('/it/pagina/:id', (req,res) => {
  res.status(404)
  res.end()
});
app.get('/fr/pagina/:id', (req,res) => {
  res.status(404)
  res.end()
});
app.get('/en/pagina/:id', (req,res) => {
  res.status(404)
  res.end()
});

app.get('/uploads/:id', (req,res) => {
  res.status(404)
  res.end()
});

app.get('*', (req,res)  => {
  res.status(200).sendFile(process.cwd()+"/dist/lexant/")
});

//mailer

const transport = nodemailer.createTransport({
  host: "smtps.aruba.it",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "exceptions@synergykey.org", //generated by Mailtrap
    pass: "@3xc3pt10ns.sk#" //generated by Mailtrap
  },
  tls: { secureProtocol: "TLSv1_method" }
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


let name = ""
let lastname = ""
let email = ""
let message = ""


app.post('/api/email', upload.array(), function (req, res, next) {

  if ((req.body.name != "") || !(req.body.lastname != "") || !(req.body.email != "") || !(req.body.message != "") ){


    name = req.body.name
    lastname = req.body.lastname
    email = req.body.email
    message = req.body.message
    
    let mailOptions = {
      from: "noreply@lexant.com",
      to: 'jhon.rojas@synergykey.it,segreteria@lexant.it',
      //to: 'jhon.rojas@synergykey.it',
      subject: 'Lexant nuovo contatto dal sito',
      //text: message, 
      html: `
      <p> Email: ${email}</p>
      <p> Nome: ${name}</p>
      <p> Cognome: ${lastname}</p>
      <p> ---------------------Message--------------------- <br> ${message}</p><br>
      
      `
    };
    send(mailOptions, res)
    let mailOptions2 = {
      from: "noreply@lexant.com",
      to: email,
      subject: 'Lexant messaggio di conferma automatico',
      //text: message, 
      html: `
      Grazie per la vostra richiesta <br> 
      Privacy: <a href='https://www.lexant.it/it/privacy'>www.lexant.it/it/privacy</a>.<br>
      `
    };
    send(mailOptions2, res)
  }else{
    res.status(400).json({msg: "undefined"})
    res.end()
  }
})

function send(mailOptions, res){
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({msg: error})
    }
    
    return res.status(200).json(
      {
        name: name,
        lastname: lastname,
        email: email,
        message, message
      }
    )
  });
}

app.listen(3001, function () {
  console.log('run...')
})