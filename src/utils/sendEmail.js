const nodemailer = require('nodemailer')
const fs = require('fs')

const adminAccount = {
  user: 'testfordevelopapp@gmail.com',
  pass: 'mytestisgood'
}

async function sendEmail({ email, title, content, pdfName }) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { ...adminAccount }
  })

  if (pdfName) {
    return await transporter.sendMail({
      from: adminAccount.user,
      to: email,
      subject: title,
      text: content,
      attachments: [
        {
          filename: pdfName,
          contentType: 'application/pdf',
          content: fs.createReadStream(`src/utils/${pdfName}`)
        }
      ]
    })
      .then(info => info.messageId)
      .catch(error => ({
        error: error.name,
        message: error.message
      }))
  } else {
    return await transporter.sendMail({
      from: adminAccount.user,
      to: email,
      subject: title,
      text: content
    })
      .then(info => info.messageId)
      .catch(error => ({
        error: error.name,
        message: error.message
      }))
  }

}

module.exports = sendEmail
