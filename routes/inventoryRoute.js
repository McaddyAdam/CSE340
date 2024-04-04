// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const { handleErrors, checkIsPrivileged, checkAuthorization } = require("../utilities")
const invValidate = require('../utilities/inventory-validation')
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));

// Route to build inventory by vehicle view
router.get("/detail/:invId", handleErrors(invController.buildByInvId));

// MANAGEMENT ROUTES ** NeEdS tO Be ChAnGeD **
// Route to build inventory index
router.get(
  "/", 
  checkAuthorization,
  handleErrors(invController.buildManagement)
)

// Route to build add classification view
router.get(
  "/addclass", 
  checkAuthorization,
  handleErrors(invController.buildAddclass)
)

// Process the new classification data
router.post(
  "/addclass",
  checkAuthorization,
  invValidate.checkClassData,
  handleErrors(invController.addClass)
)

// Route to build add vehicle view
router.get("/addvehicle", 
  checkAuthorization,
  handleErrors(invController.buildAddvehicle),
)

// Process the new vehicle data
router.post(
  "/addvehicle",
  checkAuthorization,
  invValidate.checkVehicleData,
  handleErrors(invController.addVehicle),
)

// Build inventory management table inventory view
router.get("/getInventory/:classification_id", handleErrors(invController.getInventoryJSON))

// Build edit vehicle information view
router.get(
  "/edit/:inv_id", 
  checkAuthorization,
  handleErrors(invController.buildVehicleEdit)
)

// Post route /update
router.post(
  "/update",
  checkAuthorization,
  invValidate.checkVehicleUpdateData,
  handleErrors(invController.updateVehicle)
)

// Build vehicle deletion confirmation view
router.get(
  "/delete/:inv_id", 
  checkAuthorization,
  handleErrors(invController.buildVehicleDeleteConfirm)
)

// Post route /delete
router.post(
  "/delete", 
  checkAuthorization,
  handleErrors(invController.deleteVehicle)
)

// Route to build broken page
router.get("/broken", handleErrors(invController.buildBrokenPage));

module.exports = router;// Needed Resources

// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));

// Route to build inventory by vehicle view
router.get("/detail/:invId", handleErrors(invController.buildByInvId));

// MANAGEMENT ROUTES ** NeEdS tO Be ChAnGeD **
// Route to build inventory index
router.get(
  "/", 
  checkAuthorization,
  handleErrors(invController.buildManagement)
)

// Route to build add classification view
router.get(
  "/addclass", 
  checkAuthorization,
  handleErrors(invController.buildAddclass)
)

// Process the new classification data
router.post(
  "/addclass",
  checkAuthorization,
  invValidate.checkClassData,
  handleErrors(invController.addClass)
)

// Route to build add vehicle view
router.get("/addvehicle", 
  checkAuthorization,
  handleErrors(invController.buildAddvehicle),
)

// Process the new vehicle data
router.post(
  "/addvehicle",
  checkAuthorization,
  invValidate.checkVehicleData,
  handleErrors(invController.addVehicle),
)

// Build inventory management table inventory view
router.get("/getInventory/:classification_id", handleErrors(invController.getInventoryJSON))

// Build edit vehicle information view
router.get(
  "/edit/:inv_id", 
  checkAuthorization,
  handleErrors(invController.buildVehicleEdit)
)

// Post route /update
router.post(
  "/update",
  checkAuthorization,
  invValidate.checkVehicleUpdateData,
  handleErrors(invController.updateVehicle)
)

// Build vehicle deletion confirmation view
router.get(
  "/delete/:inv_id", 
  checkAuthorization,
  handleErrors(invController.buildVehicleDeleteConfirm)
)

// Post route /delete
router.post(
  "/delete", 
  checkAuthorization,
  handleErrors(invController.deleteVehicle)
)

// Route to build broken page
router.get("/broken", handleErrors(invController.buildBrokenPage));

module.exports = router;