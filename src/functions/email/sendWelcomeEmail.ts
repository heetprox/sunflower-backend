import type { Request, Response } from 'express';
import { emailService } from '../../services/emailService';
import { body, validationResult } from 'express-validator';

// Validation rules for welcome email
export const sendWelcomeEmailValidation = [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('name').notEmpty().withMessage('Name is required')
];

// Send welcome email
export const sendWelcomeEmail = async (req: Request, res: Response) => {
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

    const { to, name } = req.body;

    const success = await emailService.sendWelcomeEmail(to, name);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email'
      });
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};