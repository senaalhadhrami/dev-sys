var express = require('express');
var router = express.Router();
var ProfileController = require('../controllers/ProfileController.js');
const checkAuth  = require('../middleware/check-auth');

/*
 * GET
 */
router.get('/',checkAuth, ProfileController.myprofile);

/*
 * GET
 */
router.get('/:id', checkAuth, ProfileController.show);

/*
 * POST
 */
router.post('/register',checkAuth, ProfileController.registerCourse);

/*
 * POST
 */
router.post('/drop',checkAuth, ProfileController.dropCourse);


/*
 * POST
 */
router.post('/exam/register',checkAuth, ProfileController.registerExam);

/*
 * POST
 */
router.post('/exam/drop',checkAuth, ProfileController.dropExam);

/*
 * PUT
 */
router.put('/:id',checkAuth,ProfileController.update);

/*
 * DELETE
 */
router.delete('/:id',checkAuth, ProfileController.remove);

module.exports = router;
