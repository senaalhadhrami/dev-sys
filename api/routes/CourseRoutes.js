var express = require('express');
var router = express.Router();
var CourseController = require('../controllers/CourseController.js');
const checkAuth  = require('../middleware/check-auth');


/*
 * GET
 */
router.get('/mylist', checkAuth, CourseController.mylist);

/*
 * GET
 */
router.get('/adminlist', checkAuth, CourseController.adminlist);


/*
 * GET
 */
router.get('/', checkAuth, CourseController.list);

/*
 * GET
 */
router.get('/:id', checkAuth, CourseController.show);

/*
 * POST
 */
router.post('/search', checkAuth, CourseController.searchByTitle);

/*
 * POST
 */
router.post('/', checkAuth, CourseController.create);

/*
 * PUT
 */
router.put('/:id',checkAuth,  CourseController.update);

/*
 * PUT
 */
router.put('/approve/:id',checkAuth,  CourseController.approve);


/*
 * DELETE
 */
router.delete('/:id',checkAuth,  CourseController.remove);

module.exports = router;
