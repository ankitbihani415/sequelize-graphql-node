var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  global.postgresCon.query("SELECT NOW()")
              .then((res) => console.log(res))
              .catch((error) => console.log(error))
              .finally(() => global.postgresCon.end())
  
  res.send('respond with a resource');
});

module.exports = router;
