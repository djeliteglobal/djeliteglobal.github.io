import { Resend } from 'resend';
import { sanitizeForLog, sanitizeEmail, validateInput } from '../utils/sanitizer';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  if (!validateInput(email, 100) || !validateInput(firstName, 50)) {
    throw new Error('Invalid input parameters');
  }
  
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedName = sanitizeForLog(firstName);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'DJ Elite <noreply@djelite.site>',
      to: [email],
      subject: '🎁 Your FREE DJ Training Preview is Here!',
      html: `
        <h1>Welcome ${firstName}!</h1>
        <p>Thanks for joining the DJ Career Accelerator community!</p>
        
        <h2>🎯 Your Free Training Preview:</h2>
        <ul>
          <li>✅ How I went from busking to headlining festivals</li>
          <li>✅ The networking secrets that actually work</li>
          <li>✅ Club owner psychology revealed</li>
          <li>✅ 5 conversation starters that get you remembered</li>
        </ul>
        
        <a href="https://djelite.site/training-preview" style="background: #00F57A; color: black; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          🚀 WATCH FREE TRAINING NOW
        </a>
        
        <p>Talk soon,<br>DJ Elite Team</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Email failed: ${error.message}`);
    }

    console.log('Welcome email sent to:', sanitizeForLog(email));
    return data;
  } catch (error) {
    console.error('Welcome email error:', sanitizeForLog(error));
    throw error;
  }
};