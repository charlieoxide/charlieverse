import nodemailer from 'nodemailer';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  data?: Record<string, any>;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    // Check for email configuration
    const emailConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    // Fallback to Gmail configuration if available
    if (!emailConfig.host && process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      emailConfig.host = 'smtp.gmail.com';
      emailConfig.port = 587;
      emailConfig.secure = false;
      emailConfig.auth.user = process.env.GMAIL_USER;
      emailConfig.auth.pass = process.env.GMAIL_PASS;
    }

    if (emailConfig.host && emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransporter(emailConfig);
      this.isConfigured = true;
      console.log('Email service configured successfully');
    } else {
      console.log('Email service not configured - missing SMTP credentials');
    }
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('Email service not configured, skipping email send');
      return false;
    }

    try {
      const { html, text } = emailData.template 
        ? this.renderTemplate(emailData.template, emailData.data || {})
        : { html: emailData.html, text: emailData.text };

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: emailData.to,
        subject: emailData.subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${emailData.to}:`, result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private renderTemplate(templateName: string, data: Record<string, any>): EmailTemplate {
    const templates = {
      welcome: {
        subject: 'Welcome to Charlieverse!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Charlieverse, ${data.firstName}!</h1>
            <p>Thank you for joining our platform. We're excited to help you with your tech projects.</p>
            <p>Your account details:</p>
            <ul>
              <li><strong>Email:</strong> ${data.email}</li>
              <li><strong>Role:</strong> ${data.role}</li>
            </ul>
            <p>Get started by logging into your dashboard and exploring our services.</p>
            <p>Best regards,<br>The Charlieverse Team</p>
          </div>
        `,
        text: `Welcome to Charlieverse, ${data.firstName}! Thank you for joining our platform. Your email: ${data.email}, Role: ${data.role}`
      },
      projectStatusUpdate: {
        subject: `Project Update: ${data.projectTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Project Status Update</h1>
            <p>Hello ${data.firstName},</p>
            <p>Your project <strong>${data.projectTitle}</strong> has been updated.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>New Status:</strong> ${data.newStatus}</p>
              <p><strong>Update Message:</strong> ${data.message}</p>
            </div>
            <p>You can view more details in your dashboard.</p>
            <p>Best regards,<br>The Charlieverse Team</p>
          </div>
        `,
        text: `Project Update: ${data.projectTitle}. New Status: ${data.newStatus}. Message: ${data.message}`
      },
      newProjectNotification: {
        subject: 'New Project Request Received',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">New Project Request</h1>
            <p>A new project request has been submitted:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Title:</strong> ${data.projectTitle}</p>
              <p><strong>Client:</strong> ${data.clientName} (${data.clientEmail})</p>
              <p><strong>Type:</strong> ${data.projectType}</p>
              <p><strong>Budget:</strong> ${data.budget}</p>
            </div>
            <p>Please review and respond to the client promptly.</p>
            <p>Best regards,<br>The Charlieverse System</p>
          </div>
        `,
        text: `New project request: ${data.projectTitle} from ${data.clientName} (${data.clientEmail})`
      },
      passwordReset: {
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Password Reset Request</h1>
            <p>Hello ${data.firstName},</p>
            <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
            <p>To reset your password, click the link below:</p>
            <a href="${data.resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>The Charlieverse Team</p>
          </div>
        `,
        text: `Password reset request. Reset link: ${data.resetLink}`
      }
    };

    return templates[templateName as keyof typeof templates] || {
      subject: 'Notification',
      html: '<p>You have a new notification.</p>',
      text: 'You have a new notification.'
    };
  }

  // Convenience methods
  async sendWelcomeEmail(user: any): Promise<boolean> {
    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Charlieverse!',
      template: 'welcome',
      data: {
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    });
  }

  async sendProjectStatusUpdate(user: any, project: any, newStatus: string, message: string): Promise<boolean> {
    return this.sendEmail({
      to: user.email,
      subject: `Project Update: ${project.title}`,
      template: 'projectStatusUpdate',
      data: {
        firstName: user.firstName,
        projectTitle: project.title,
        newStatus,
        message
      }
    });
  }

  async sendNewProjectNotification(adminEmail: string, project: any, client: any): Promise<boolean> {
    return this.sendEmail({
      to: adminEmail,
      subject: 'New Project Request Received',
      template: 'newProjectNotification',
      data: {
        projectTitle: project.title,
        clientName: `${client.firstName} ${client.lastName}`,
        clientEmail: client.email,
        projectType: project.type,
        budget: project.budget
      }
    });
  }

  isEmailServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

export default new EmailService();