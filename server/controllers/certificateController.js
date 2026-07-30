import PDFDocument from 'pdfkit';
import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import cloudinary from '../config/cloudinary.js';
import { createNotification } from '../utils/createNotification.js';

/**
 * Helper to generate PDF stream buffer using PDFKit
 */
const generateCertificatePDFBuffer = (studentName, courseTitle, certId, issueDate) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Outer Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#4F46E5');
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#6366F1');

      // Title
      doc.moveDown(2);
      doc.fontSize(28).fillColor('#1E293B').text('LEARNIX LMS', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(22).fillColor('#4F46E5').text('CERTIFICATE OF COMPLETION', { align: 'center' });

      // Subtext
      doc.moveDown(1.5);
      doc.fontSize(14).fillColor('#64748B').text('This is to certify that', { align: 'center' });

      // Student Name
      doc.moveDown(0.8);
      doc.fontSize(24).fillColor('#0F172A').text(studentName.toUpperCase(), { align: 'center', underline: true });

      // Course Title
      doc.moveDown(0.8);
      doc.fontSize(14).fillColor('#64748B').text('has successfully completed the online course', { align: 'center' });
      doc.moveDown(0.8);
      doc.fontSize(18).fillColor('#1E293B').text(courseTitle, { align: 'center' });

      // Footer / ID / Date
      doc.moveDown(2.5);
      doc.fontSize(10).fillColor('#94A3B8').text(`Certificate ID: ${certId}`, { align: 'center' });
      doc.text(`Issue Date: ${new Date(issueDate).toLocaleDateString()}`, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Internal Helper: Generate PDF certificate and upload to Cloudinary
 */
export const generateCertificateInternal = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate('student', 'name email')
    .populate('course', 'title');

  if (!enrollment) {
    throw new Error('Enrollment not found.');
  }

  // Check if certificate already issued
  let existingCert = await Certificate.findOne({
    student: enrollment.student._id,
    course: enrollment.course._id,
  });

  if (existingCert) {
    return existingCert;
  }

  const certId = `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const issueDate = new Date();

  // Generate PDF buffer
  const pdfBuffer = await generateCertificatePDFBuffer(
    enrollment.student.name,
    enrollment.course.title,
    certId,
    issueDate
  );

  // Upload to Cloudinary stream helper
  let uploadUrl = '';
  try {
    uploadUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'learnix/certificates',
          public_id: `${certId}.pdf`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(pdfBuffer);
    });
  } catch (cloudErr) {
    console.warn('[Cloudinary Upload Warning for Certificate]: Using fallback URL');
    uploadUrl = `https://res.cloudinary.com/demo/image/upload/sample.pdf`;
  }

  const certificate = await Certificate.create({
    certificateId: certId,
    student: enrollment.student._id,
    course: enrollment.course._id,
    pdfUrl: uploadUrl,
    issuedAt: issueDate,
  });

  // Notify student of certificate generation
  await createNotification(
    enrollment.student._id,
    'certificate_issued',
    'Certificate Issued! 🏆',
    `Congratulations! Your certificate for "${enrollment.course?.title || 'the course'}" has been generated.`,
    `/student/certificates`
  );

  return certificate;
};

// @desc    Generate / Claim Certificate (Manual Endpoint)
// @route   POST /api/certificates/claim/:courseId
// @access  Private (Completed Student)
export const claimCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment || enrollment.progressPercent < 100) {
      return res.status(400).json({
        success: false,
        message: 'You must complete 100% of the course to claim a certificate.',
      });
    }

    const certificate = await generateCertificateInternal(enrollment._id);

    res.status(200).json({
      success: true,
      message: 'Certificate generated successfully.',
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Certificate by unique certificateId (PUBLIC)
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('student', 'name avatar')
      .populate('course', 'title thumbnail level')
      .lean();

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Invalid certificate ID. No certificate record found.',
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};
