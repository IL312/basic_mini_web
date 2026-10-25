const router = require('express').Router();

const clientController = require('../controllers/clientController');

router.get('/', clientController.getClients);
router.get('/all', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;