import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

// Function to create a certificate
const createCertificate = async (name, courseTitle, date) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });

    const writeStream = createWriteStream(`${name}_certificate.pdf`);
    doc.pipe(writeStream);

    // Set a gradient background
    // Set a circular gradient background
    const radialGradient = doc.radialGradient(421, 297.5, 0, 421, 297.5, 400);
    radialGradient.stop(0, '#433878'); // Light blue at the center
    radialGradient.stop(1, '#7e60Bf'); // Slightly darker blue at the edges
    doc.rect(0, 0, 842, 595).fill(radialGradient);
    // const gradient = doc.linearGradient(0, 0, 0, 595);
    // gradient.stop(0, '#e1f5fe'); // Light blue color
    // gradient.stop(1, '#bbdefb'); // Slightly darker blue color
    // doc.rect(0, 0, 842, 595).fill(gradient);

    // Draw a decorative border
    doc.moveDown(1.2);
    doc.fillColor('#00695c'); // Dark teal color
    doc.rect(10, 10, 822, 575).stroke();

    // Draw a decorative shape (e.g., a circle) at the top
    // Draw a circular gradient for the small circle on the left
    const circleGradient = doc.radialGradient(100, 100, 0, 100, 100, 50);
    circleGradient.stop(0, '#00796b'); // Center color
    circleGradient.stop(1, '#004d40'); // Outer color
    doc.fillColor(circleGradient).ellipse(100, 100, 50, 50).fill(); // Circle
    // doc.fillColor('#00796b'); // Teal color
    // doc.ellipse(100, 100, 50, 50).fill(); // Smaller circle at (100, 100)
    // doc.fillColor('#00796b'); // Teal color
    // doc.ellipse(421, 100, 120, 120).fill(); // Circle

    // Title
    doc.fillColor('#e4B1f0') // White color
       .fontSize(36)
       .text('Certificate of Completion', {
           align: 'center',
           underline: true,
           font: 'Helvetica-Bold',
           y: 150 // Adjust position to be below the circle
       });

    // Space
    doc.moveDown(1.2);

    // Recipient Name
    doc.fillColor('#ffffff') // White color
       .fontSize(30)
       .text(name, {
           align: 'center',
           font: 'Helvetica-Bold'
       });

    // Space
    doc.moveDown(1.5);

    // Course Title
    doc.fillColor('#ffffff') // White color
       .fontSize(22)
       .text('Has completed the course:', {
           align: 'center',
           font: 'Helvetica'
       });

    doc.fillColor('#ffd740') // Gold color
       .fontSize(24)
       .text(courseTitle, {
           align: 'center',
           font: 'Helvetica-Bold'
       });

    // Additional Content
    doc.moveDown(1.5);
    doc.fillColor('#ffffff')
       .fontSize(18)
       .text('This certificate is awarded in recognition of your achievements', {
           align: 'center'
       });

    doc.moveDown(0.5);
    doc.text('and dedication to learning.', {
        align: 'center'
    });

    // Date
    doc.moveDown(1.5);
    doc.fillColor('#ffffff') // White color
       .fontSize(16)
       .text(`Date: ${date}`, {
           align: 'center'
       });

    // Add a signature line
    doc.moveDown(1.5);
    doc.fillColor('#e4B1f0')
       .text('_________________', {
           align: 'center'
       });
    doc.text('Instructor Signature', {
        align: 'center'
    });

    // Finalize the PDF and end the stream
    doc.end();

    writeStream.on('finish', () => {
        console.log(`Certificate created for ${name}.`);
    });
}

export default createCertificate

// // Example usage
// const name = 'John Doe';
// const courseTitle = 'Introduction to Node.js';
// const date = new Date().toLocaleDateString();

// createCertificate(name, courseTitle, date);
