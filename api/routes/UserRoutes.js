var express = require('express');
var router = express.Router();  
var UserController = require('../controllers/UserController');
const checkAuth  = require('../middleware/check-auth');


/*
 * SIGNUP
 */
router.post('/signup', UserController.signup);
 
/*
 * LOGIN
 */
router.post('/login', UserController.login);

/*
 * GET
 */
router.get('/', checkAuth, UserController.list);


/*
 * PUT
 */
router.put('/approve/:id',checkAuth,  UserController.approve);


module.exports = router;
