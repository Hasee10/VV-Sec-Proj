const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.init();
  }

  async init() {
    try {
      // Configure transporter based on environment
      if (process.env.NODE_ENV === 'production') {
        // Production - use external SMTP service (SendGrid, Mailgun, etc.)
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          },
          pool: true,
          maxConnections: 5,
          maxMessages: 100
        });
      } else {
        // Development - use Ethereal Email for testing
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      }

      // Verify connection
      await this.transporter.verify();
      logger.info('Email service initialized successfully');

      // Load email templates
      await this.loadTemplates();

    } catch (error) {
      logger.error('Email service initialization failed:', error);
      throw error;
    }
  }

  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates/emails');
      const templateFiles = await fs.readdir(templatesDir);

      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = file.replace('.hbs', '');
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf-8');
          const compiledTemplate = handlebars.compile(templateContent);
          this.templates.set(templateName, compiledTemplate);
        }
      }

      logger.info(`Loaded ${this.templates.size} email templates`);
    } catch (error) {
      logger.error('Failed to load email templates:', error);
    }
  }

  async sendEmail({ to, subject, template, data, attachments = [] }) {
    try {
      // Validate inputs
      if (!to || !subject) {
        throw new Error('Recipient and subject are required');
      }

      let html = '';
      let text = '';

      if (template) {
        // Use template
        const compiledTemplate = this.templates.get(template);
        if (!compiledTemplate) {
          throw new Error(`Template "${template}" not found`);
        }

        html = compiledTemplate({
          ...data,
          baseUrl: process.env.FRONTEND_URL,
          companyName: 'VespaVerse',
          currentYear: new Date().getFullYear()
        });

        // Generate text version from HTML
        text = this.htmlToText(html);
      } else if (data && data.html) {
        html = data.html;
        text = data.text || this.htmlToText(html);
      } else {
        throw new Error('Either template or HTML content is required');
      }

      const mailOptions = {
        from: {
          name: process.env.SMTP_FROM_NAME || 'VespaVerse',
          address: process.env.SMTP_FROM_EMAIL || 'noreply@vespaverse.com'
        },
        to,
        subject,
        html,
        text,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Log success
      logger.info(`Email sent successfully to ${to}`, {
        messageId: result.messageId,
        template,
        subject
      });

      // In development, log preview URL
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(result)}`);
      }

      return {
        success: true,
        messageId: result.messageId,
        ...(process.env.NODE_ENV !== 'production' && {
          previewUrl: nodemailer.getTestMessageUrl(result)
        })
      };

    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendBulkEmail({ recipients, subject, template, data, batchSize = 50 }) {
    try {
      const results = [];
      const batches = this.chunkArray(recipients, batchSize);

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const batchPromises = batch.map(recipient => {
          const recipientData = typeof recipient === 'string' 
            ? { email: recipient } 
            : recipient;
          
          return this.sendEmail({
            to: recipientData.email,
            subject,
            template,
            data: { ...data, ...recipientData }
          }).catch(error => ({
            success: false,
            email: recipientData.email,
            error: error.message
          }));
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Add delay between batches to avoid rate limiting
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      logger.info(`Bulk email completed: ${successCount} sent, ${failureCount} failed`);

      return {
        totalSent: successCount,
        totalFailed: failureCount,
        results
      };

    } catch (error) {
      logger.error('Bulk email failed:', error);
      throw error;
    }
  }

  htmlToText(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Template shortcuts for common emails
  async sendWelcomeEmail(email, userData) {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to VespaVerse',
      template: 'welcome',
      data: userData
    });
  }

  async sendContactConfirmation(email, contactData) {
    return this.sendEmail({
      to: email,
      subject: 'Thank you for contacting VespaVerse',
      template: 'contact-confirmation',
      data: contactData
    });
  }

  async sendPasswordReset(email, userData) {
    return this.sendEmail({
      to: email,
      subject: 'Password Reset - VespaVerse',
      template: 'password-reset',
      data: userData
    });
  }

  async sendEmailVerification(email, userData) {
    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email - VespaVerse',
      template: 'email-verification',
      data: userData
    });
  }

  async sendNewsletterWelcome(email, userData) {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to VespaVerse Newsletter',
      template: 'newsletter-welcome',
      data: userData
    });
  }

  async sendProjectUpdate(email, projectData) {
    return this.sendEmail({
      to: email,
      subject: `Project Update: ${projectData.title}`,
      template: 'project-update',
      data: projectData
    });
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService.sendEmail.bind(emailService);
module.exports.EmailService = emailService;