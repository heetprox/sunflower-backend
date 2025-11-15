import type { Request, Response } from 'express';
import { emailService } from '../../services/emailService';
import { body, validationResult } from 'express-validator';

// Validation rules for test email
export const sendTestEmailValidation = [
  body('to').isEmail().withMessage('Valid email address is required')
];

// Send test email
export const sendTestEmail = async (req: Request, res: Response) => {
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

    const { to } = req.body;

    const success = await emailService.sendTestEmail(to);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Test email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email'
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};