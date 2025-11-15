import type { Request, Response } from 'express';
import { emailService } from '../../services/emailService';
import { body, validationResult } from 'express-validator';

// Validation rules for notification email
export const sendNotificationEmailValidation = [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// Send notification email
export const sendNotificationEmail = async (req: Request, res: Response) => {
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

    const { to, title, message } = req.body;

    const success = await emailService.sendNotificationEmail(to, title, message);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Notification email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification email'
      });
    }
  } catch (error) {
    console.error('Error sending notification email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};