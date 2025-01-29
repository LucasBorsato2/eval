import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly SERVICE_ID = environment.emailjs.serviceId;
  private readonly TEMPLATE_ID = environment.emailjs.templateId;
  private readonly PUBLIC_KEY = environment.emailjs.publicKey;

  constructor() {
    emailjs.init(this.PUBLIC_KEY);
  }

  async sendEmail(data: {
    name: string;
    email: string;
    category: string;
    message: string;
    attachment?: string;
  }): Promise<boolean> {
    try {
      const templateParams = {
        from_name: data.name,
        user_email: data.email,
        message: `
Catégorie: ${data.category}

Message: ${data.message}

${data.attachment ? `Pièce jointe: ${data.attachment}` : 'Pas de pièce jointe'}
        `,
        to_name: 'Admin',
        reply_to: data.email
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams
      );

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
