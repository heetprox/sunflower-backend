import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

interface EmailTemplate {
  welcome: (name: string, loginUrl: string) => { subject: string; html: string };
  passwordReset: (name: string, resetUrl: string) => { subject: string; html: string };
  notification: (title: string, message: string) => { subject: string; html: string };
}

class EmailService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env.AUTH_USER || 'noreply@songmatch.com';
    
    // Create transporter with Brevo SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
    }
  }

  // Send basic email
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  // Email templates
  private templates: EmailTemplate = {
    welcome: (name: string, loginUrl: string) => ({
      subject: 'Welcome to SongMatch! 🎵',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to SongMatch!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Connect through music</p>
          </div>
          
          <div style="padding: 40px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Welcome to SongMatch! We're excited to have you join our community of music lovers. 
              Get ready to discover new friends who share your musical taste.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Start Exploring 🎵
              </a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What you can do:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🎧 Connect with fellow music enthusiasts</li>
                <li>💬 Chat with people who share your taste</li>
                <li>🎵 Discover new music through friends</li>
                <li>👥 Build your music community</li>
              </ul>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              If you have any questions, feel free to reach out to us!
            </p>
          </div>
        </div>
      `
    }),

    passwordReset: (name: string, resetUrl: string) => ({
      subject: 'Reset Your SongMatch Password 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff6b6b; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
          </div>
          
          <div style="padding: 40px; background: #f8f9fa;">
            <h2 style="color: #333;">Hi ${name},</h2>
            
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </p>
          </div>
        </div>
      `
    }),

    notification: (title: string, message: string) => ({
      subject: `SongMatch: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4ecdc4; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 22px;">${title}</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <p style="color: #666; line-height: 1.6;">${message}</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}" style="background: #4ecdc4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">
                Open SongMatch
              </a>
            </div>
          </div>
        </div>
      `
    })
  };

  // Template-based email methods
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const loginUrl = `${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}/auth/login`;
    const template = this.templates.welcome(name, loginUrl);
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html
    });
  }

  async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const template = this.templates.passwordReset(name, resetUrl);
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html
    });
  }

  async sendNotificationEmail(to: string, title: string, message: string): Promise<boolean> {
    const template = this.templates.notification(title, message);
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html
    });
  }

  // Test email function
  async sendTestEmail(to: string): Promise<boolean> {
    return await this.sendEmail({
      to,
      subject: 'SongMatch Test Email 🎵',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333;">Email Service Test</h2>
          <p style="color: #666;">If you're reading this, the email service is working correctly! 🎉</p>
          <p style="color: #999; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    });
  }
}

export const emailService = new EmailService();
export default emailService;