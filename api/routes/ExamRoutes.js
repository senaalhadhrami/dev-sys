var express = require('express');
var router = express.Router();
var ExamController = require('../controllers/ExamController.js');
const checkAuth  = require('../middleware/check-auth');

/*
 * GET
 */
router.get('/myexams', checkAuth, ExamController.myexams);

/*
 * GET
 */
router.get('/course/:id', checkAuth, ExamController.getCourseExams);

/*
 * GET
 */
router.get('/:id', checkAuth, ExamController.show);


/*
 * POST
 */
router.post('/',checkAuth, ExamController.create);

/*
 * PUT
 */
router.put('/:id',checkAuth, ExamController.update);

/*
 * DELETE
 */
router.delete('/:id',checkAuth, ExamController.remove);

module.exports = router;
