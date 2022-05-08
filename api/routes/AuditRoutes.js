var express = require('express');
var router = express.Router();
var AuditController = require('../controllers/AuditController.js');
const checkAuth  = require('../middleware/check-auth');

/*
 * GET
 */
router.get('/' , checkAuth, AuditController.list);

/*
 * GET
 */
router.get('/:id' , checkAuth, AuditController.show);

/*
 * POST
 */
router.post('/' , checkAuth, AuditController.create);

/*
 * PUT
 */
router.put('/:id' , checkAuth, AuditController.update);

/*
 * DELETE
 */
router.delete('/:id' , checkAuth, AuditController.remove);

module.exports = router;
