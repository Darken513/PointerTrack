const nodemailer = require('nodemailer');
const cron = require('node-cron');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const user_pointDB = require('../models/user_point.model')
const fs = require('fs');

// Define the CSV writer
const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    { id: 'user', title: 'user' },
    { id: 'action', title: 'Action' },
    { id: 'restaurant', title: 'Restaurant' },
    { id: 'time', title: 'Time' }
  ],
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    //user: 'PointerTracker33@gmail.com', //generate new mail new pass key // PointerTracker33@gmail.com/Pointer33;
    user: 'biztracker33@gmail.com', //generate new mail new pass key
    pass: 'oxvaptmwbhtroycf'
  }
});
function sendMail(frequency){
  let reportName = "";
  if(frequency.daily){
    reportName = "Rapport Journalier Pointage/Depointage"
  }
  else if (frequency.monthly){
    reportName = "Rapport Mensuel Pointage/Depointage"
  }
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-based, so add 1
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const mailOptions = {
    from: "PointerTracker",
    to: 'affesachraf70@gmail.com',
    subject: reportName,
    text: 'Please find the attached CSV file.',
    attachments: [
      {
        filename: 'Rapport_du_+'+formattedDate+'.csv',
        path: 'output.csv',
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

exports.start = async () => {
  cron.schedule('0 20 * * *', async () => {
    const data = await user_pointDB.getAllForToday();
    fs.writeFileSync('output.csv', '');
    // Write the data to the CSV file
    csvWriter.writeRecords(data)
      .then(() => {
        sendMail({daily:true})
      })
      .catch(error => console.error('Error writing CSV file:', error));
  }, {
    scheduled: true,
    timezone: 'Europe/Paris'
  });
  cron.schedule('0 0 1 * *', async () => {
    const today = new Date();
    const previousMonth = new Date(today);
    previousMonth.setMonth(today.getMonth() - 1);
    const previousMonthNumber = previousMonth.getMonth() + 1; // Months are zero-based, so add 1
    const previousYear = previousMonth.getFullYear();
    const data = await user_pointDB.getAllForMonthYear(previousMonthNumber, previousYear);
    fs.writeFileSync('output.csv', '');
    // Write the data to the CSV file
    csvWriter.writeRecords(data)
      .then(() => {
        sendMail({monthly:true})
      })
      .catch(error => console.error('Error writing CSV file:', error));
  }, {
    scheduled: true,
    timezone: 'Europe/Paris'
  });
}