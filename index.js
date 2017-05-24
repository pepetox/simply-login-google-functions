const Datastore = require('@google-cloud/datastore');
const jwt = require('jwt-simple');
const secret = "8emVuE72tN2JZ6C1ci0q";  //CHANGE FOR YOUR SECRET
const passwordHash = require('password-hash');
const datastore = Datastore({namespace: "easylogin"});
exports.signup = (req, res) => {
  //review the body is correct
  if(JSON.stringify(req.body)==="{}"||(!req.body.email)||(!req.body.password)){
    res.status(400).json({"error":"No correct data send, please send email and password as aplication/json type body"});
    return
  }
  //check if the user already exist
  const miObjectKey = datastore.key(['userAccount', req.body.email]);
  var password = req.body.password;
  if(typeof  password == 'number'){
    password = password.toString();
  }
  const hashedPassword = passwordHash.generate(password);
  var miObjectData = {
    'email': req.body.email,
    'pw': hashedPassword
  }
  const entity = {
    key: miObjectKey,
    data: miObjectData
  };
  datastore.insert(entity)
  .then(() => {
    //res.status(200).send('Success: '+ JSON.stringify(entity));
    res.status(200).send('Success');
    return
  })
  .catch((err) => {
    if(err.code===409){
      res.status(400).json({"error":"The email is already used"});
    }else{
      res.status(500).json({"ERROR": err});
    }
    return
  });
};
exports.login = (req, res) => {
  if(JSON.stringify(req.body)==="{}"||(!req.body.email)||(!req.body.password)){
    res.status(400).json({"error":"No correct data send, please send email and password as aplication/json type body"});
    return
  }
  //if password is a number parse so string
  var password = req.body.password;
  if(typeof  password == 'number'){
    password = password.toString();
  }
  //get the user account of database
  const miObjectKey = datastore.key(['userAccount', req.body.email]);
  datastore.get(miObjectKey)
  .then((misdatos) => {
    const hasedpassword = misdatos[0].pw;
    if(passwordHash.verify(password, hasedpassword)){
      var payload = { email: req.body.email };
      var token = jwt.encode(payload, secret);
      res.status(200).json({token: token});
    }else{
      res.status(404).json({"ERROR": "Invalid password"});
    }
  })
  .catch((err) => {
    console.error('ERROR:', err);
    res.status(500).json({"ERROR": err});
  });
};

//function to validate token and have the email of the user

var validateToken = (token) => {
  var decoded = jwt.decode(token, secret);
  return decoded;

}
//example of validate function
exports.auth = (req, res) => {
  if(JSON.stringify(req.body)==="{}"||(!req.body.token)){
    res.status(400).json({"error":"No correct data send, please send email and password as aplication/json type body"});
    return
  }
  res.status(200).json(validateToken(req.body.token));
}


