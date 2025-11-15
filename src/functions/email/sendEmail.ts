import type { Request, Response } from 'express';
import { emailService } from '../../services/emailService';
import { body, validationResult } from 'express-validator';

// Validation rules for sending email
export const sendEmailValidation = [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('type').optional().isIn(['text', 'html']).withMessage('Type must be text or html')
];

// Send custom email
export const sendEmail = async (req: Request, res: Response) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { to, subject, message, type = 'html' } = req.body;

    const emailOptions = {
      to,
      subject,
      [type]: message
    };

    const success = await emailService.sendEmail(emailOptions);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email'
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};