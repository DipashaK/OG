// const express = require('express');
// const Driver = require('../Models/driver'); // Import the driver model
// const router = express.Router();


// router.post('/api/driver/add', (req, res) => {
//   const { name, pickupLocation, dropOffLocation } = req.body;

//   if (!name || !pickupLocation || !dropOffLocation) {
//     return res.status(400).send({ message: 'All fields are required' });
//   }

//   const newDriver = new Driver({
//     name,
//     pickupLocation,
//     dropOffLocation,
//   });

//   newDriver.save()
//     .then(driver => res.status(201).send(driver))
//     .catch(error => {
//       console.error(error);
//       res.status(500).send({ message: 'Internal Server Error' });
//     });
// });

// module.exports = router;






const express = require('express');
const Driver = require('../Models/driver'); // Import the driver model
const router = express.Router();
router.get("/drivers", async (req, res) => {
    try {
      const drivers = await Driver.find();
      res.json(drivers);
    } catch (err) {
      res.status(500).send("Error fetching drivers");
    }
  });
  
  // Add a new driver
  router.post("/drivers", async (req, res) => {
    const { name, pickupLocation, dropOffLocation } = req.body;
  
    try {
      const newDriver = new Driver({ name, pickupLocation, dropOffLocation });
      await newDriver.save();
      res.status(201).json(newDriver);
    } catch (err) {
      res.status(400).send("Error adding driver");
    }
  });
  
  // Edit an existing driver
  router.put("/drivers/:id", async (req, res) => {
    const { id } = req.params;
    const { name, pickupLocation, dropOffLocation } = req.body;
  
    try {
      const updatedDriver = await Driver.findByIdAndUpdate(id, { name, pickupLocation, dropOffLocation }, { new: true });
      res.json(updatedDriver);
    } catch (err) {
      res.status(400).send("Error updating driver");
    }
  });
  
  // Delete a driver
  router.delete("/drivers/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await Driver.findByIdAndDelete(id);
      res.status(204).send();
    } catch (err) {
      res.status(400).send("Error deleting driver");
    }
  });

  module.exports = router;