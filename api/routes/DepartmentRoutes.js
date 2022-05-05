var express = require('express');
var router = express.Router();
var DepartmentController = require('../controllers/DepartmentController.js');

/*
 * GET
 */
router.get('/', DepartmentController.list);

/*
 * GET
 */
router.get('/:id', DepartmentController.show);

/*
 * POST
 */
router.post('/', DepartmentController.create);

/*
 * PUT
 */
router.put('/:id', DepartmentController.update);

/*
 * DELETE
 */
router.delete('/:id', DepartmentController.remove);

module.exports = router;
