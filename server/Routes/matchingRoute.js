// const express = require('express');
// const router = express.Router();
// const Donation = require('../Models/donation');
// const Receiver = require('../Models/receiver');

// router.post('/findMatches', async (req, res) => {
//   try {
//     const { organ, bloodGroup } = req.body;

//     const matchedDonors = await Donation.find({
//       organ: organ,
//       bloodGroup: bloodGroup
//     });

//     const matchedReceivers = await Receiver.find({
//       organ: organ,
//       bloodGroup: bloodGroup,
//       status: 'pending'
//     });

//     if (matchedDonors.length === 0 || matchedReceivers.length === 0) {
//       return res.status(404).json({ message: 'No matches found' });
//     }

//     res.status(200).json({
//       message: 'Matches found',
//       matchedDonors: matchedDonors,
//       matchedReceivers: matchedReceivers
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// module.exports = router;



















// const express = require('express');
// const router = express.Router();
// const Donation = require('../Models/donation');
// const Receiver = require('../Models/receiver');

// // Route to find matches
// router.post('/findMatches', async (req, res) => {
//   try {
//     const { organ, bloodGroup } = req.body;

//     const matchedDonors = await Donation.find({
//       organ,
//       bloodGroup,
//       // status: 'available',
//     });

//     const matchedReceivers = await Receiver.find({
//       organ,
//       bloodGroup,
//       // status: 'pending',
//     });

//     if (matchedDonors.length === 0 || matchedReceivers.length === 0) {
//       return res.status(404).json({ message: 'No matches found' });
//     }

//     res.status(200).json({
//       message: 'Matches found',
//       matchedDonors,
//       matchedReceivers,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Route to update donor status
// router.put('/donor/match/:id', async (req, res) => {
//   try {
//     const { receiverId } = req.body;
//     const donor = await Donation.findByIdAndUpdate(
//       req.params.id,
//       { status: 'matched', receiverId },
//       { new: true }
//     );
//     res.status(200).json(donor);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error updating donor', error: err.message });
//   }
// });

// // Route to update receiver status
// router.put('/receiver/match/:id', async (req, res) => {
//   try {
//     const { donorId } = req.body;
//     const receiver = await Receiver.findByIdAndUpdate(
//       req.params.id,
//       { status: 'matched', donorId },
//       { new: true }
//     );
//     res.status(200).json(receiver);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error updating receiver', error: err.message });
//   }
// });

// module.exports = router;


















const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const Donor = require('../Models/donation'); // Your Donor model
const Recipient = require('../Models/receiver'); // Your Recipient model

// Endpoint to send emails
router.post('/send-match-email', async (req, res) => {
  const { donorId, receiverId } = req.body;

  try {
    const donor = await Donor.findById(donorId);
    const receiver = await Recipient.findById(receiverId);

    if (!donor || !receiver) {
      return res.status(404).json({ message: 'Donor or Receiver not found' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const donorMailOptions = {
      from: process.env.EMAIL_USER,
      to: donor.email,
      subject: 'Matching Found!',
      html: `
        <p>A suitable recipient has been found for your donation.</p>
        <p><a href="${process.env.FRONTEND_URL}/response?donorId=${donorId}&receiverId=${receiverId}&response=accept">Accept</a></p>
        <p><a href="${process.env.FRONTEND_URL}/response?donorId=${donorId}&receiverId=${receiverId}&response=reject">Reject</a></p>
      `,
    };

    const receiverMailOptions = {
      from: process.env.EMAIL_USER,
      to: receiver.email,
      subject: 'Matching Found!',
      html: `
        <p>A suitable donor has been found for you.</p>
        <p><a href="${process.env.FRONTEND_URL}/response?donorId=${donorId}&receiverId=${receiverId}&response=accept">Accept</a></p>
        <p><a href="${process.env.FRONTEND_URL}/response?donorId=${donorId}&receiverId=${receiverId}&response=reject">Reject</a></p>
      `,
    };

    await transporter.sendMail(donorMailOptions);
    await transporter.sendMail(receiverMailOptions);

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Failed to send emails' });
  }
});

// Endpoint to handle responses
router.post('/api/donors/update-status', async (req, res) => {
  const { donorId, status } = req.body;

  try {
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    donor.status = status;
    await donor.save();

    res.status(200).json({ message: 'Donor status updated successfully', donor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update donor status', error });
  }
});

// Assuming you have a 'matches' model or a way to update donor/receiver status

router.post('/api/matches/approve', async (req, res) => {
  const { donorId, receiverId } = req.body;

  try {
    // Update the donor and receiver status to "Approved" in the database
    const donorUpdate = await Donor.findByIdAndUpdate(donorId, { status: 'Approved' }, { new: true });
    const receiverUpdate = await Recipient.findByIdAndUpdate(receiverId, { status: 'Approved' }, { new: true });

    if (donorUpdate && receiverUpdate) {
      return res.status(200).json({ message: 'Status updated to Approved' });
    } else {
      return res.status(400).json({ message: 'Failed to update status' });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;