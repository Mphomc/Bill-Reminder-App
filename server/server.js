const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();


const app = express();

// allow frontend to talk to backend
app.use(cors());

// allow JSON data
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 👇 EMAIL SETUP (the "delivery guy")
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// receive bills
app.post('/bills', async (req, res) => {
  const { name, dueDate, email } = req.body;
  console.log("Incoming body:", req.body);
  
  await pool.query(
    'INSERT INTO bills (name, email, dueDate) VALUES ($1, $2, $3)',
    [name, email, dueDate]
  );

  res.json({ message: 'Bill received!' });
});

cron.schedule('0 10 * * *', async () => {
  console.log('Running bill check...');

  try {
    // 1. get all bills from database
    const result = await pool.query('SELECT * FROM public.bills');
    const bills = result.rows;

    // 2. get today's date (normalize to start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. calculate 2 days ahead
    const in2Days = new Date(today);
    in2Days.setDate(today.getDate() + 2);

    // 4. check each bill
    bills.forEach(bill => {
      const dueDate = new Date(bill.duedate);
      dueDate.setHours(0, 0, 0, 0);
      
      // only trigger if due date is exactly 2 days from today
      if (dueDate.getTime() === in2Days.getTime()) {
        console.log('Reminder (2 days before):', bill.name, bill.email);

        // EMAIL PART STARTS HERE
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: bill.email,
          subject: 'Bill Reminder',
          text: `Hey! Your bill "${bill.name}" is due in 2 days. Don't forget to pay it.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Email error:', error.message);
          } else {
            console.log('Email sent:', info.response);
          }
        });

      
      }
    });

  } catch (error) {
    console.log('Error in cron job:', error.message);
  }
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});