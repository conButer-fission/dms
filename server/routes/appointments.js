const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'firstName lastName')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const requestedDate = new Date(req.params.date);
    const startOfDay = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate()
    );
    const endOfDay = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate(),
      23, 59, 59, 999
    );

    const appointments = await Appointment.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .populate('patient', 'firstName lastName')
    .sort({ time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error in /date/:date route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming appointments (after today)
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const appointments = await Appointment.find({
      $or: [
        {
          date: { $gt: startOfToday }
        },
        {
          date: startOfToday,
          time: {
            $gte: now.getHours().toString().padStart(2, '0') + ':' + 
                  now.getMinutes().toString().padStart(2, '0')
          }
        }
      ]
    })
    .populate('patient', 'firstName lastName')
    .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  const appointment = new Appointment({
    ...req.body,
    date: new Date(req.body.date)
  });
  try {
    const newAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('patient', 'firstName lastName');
    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }
    
    Object.assign(appointment, req.body);
    const updatedAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patient', 'firstName lastName');
    res.json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const result = await Appointment.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 