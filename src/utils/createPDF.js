const PDFKit = require('pdfkit')
const fs = require('fs')

function createSchedule(participants) {
  const pdf = new PDFKit
  const PDF_NAME = 'Cronograma.pdf'
  pdf.pipe(fs.createWriteStream(`src/utils/${PDF_NAME}`))


  // estilização do pdf
  pdf.font('Times-Roman')
    .text(`Cronograma ${participants[0].eventName}`, { align: 'center' })
    .moveDown()

  pdf.font('Times-Roman')
    .text(
      'Nome',
      { align: 'left', width: 300 })
  
  pdf.font('Times-Roman')
    .moveUp()
    .text(
      'Hora',
      { align: 'center', width: 200 })
    .moveDown()

  participants.forEach(participant => {
    pdf.font('Times-Roman')
      .text(
        `${participant.participantName}`,
        { align: 'left', width: 300 })

    pdf.font('Times-Roman')
        .moveUp()
        .text(` ${participant.hour}`,
        { align: 'center', width: 200})
  })



  
  

  pdf.end()

  return PDF_NAME
}

module.exports = {
  createSchedule
}
