import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#0B0D10', color: '#FFFFFF', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="text-[color:var(--accent)] hover:text-[color:var(--accent-muted)] mb-6 inline-block">
            ← Back to DJ Elite
          </Link>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[color:var(--text-secondary)] text-lg">
            Last updated: March 9, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">1. Introduction</h2>
            <p className="mb-4 leading-relaxed">
              At DJ Elite ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website djelite.site and use our services.
            </p>
            <p className="mb-4 leading-relaxed">
              By using our Service, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-[color:var(--text-primary)]">Personal Information</h3>
            <p className="mb-4 leading-relaxed">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Register for an account on our platform</li>
              <li>Create a DJ profile or portfolio</li>
              <li>Subscribe to our services or newsletters</li>
              <li>Participate in community features or forums</li>
              <li>Contact us for support or inquiries</li>
              <li>Apply for gig opportunities through our platform</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              This information may include your name, email address, phone number, location, professional experience, music preferences, profile photos, and any other information you choose to provide.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-[color:var(--text-primary)]">Usage Information</h3>
            <p className="mb-4 leading-relaxed">
              We automatically collect certain information about your device and usage of our Service, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>IP address and general location information</li>
              <li>Browser type and version</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on our Service</li>
              <li>Referring website addresses</li>
              <li>Search terms used within our platform</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-[color:var(--text-primary)]">Cookies and Tracking Technologies</h3>
            <p className="mb-4 leading-relaxed">
              We use cookies, web beacons, and similar tracking technologies to enhance your experience on our Service. These technologies help us remember your preferences, understand how you use our Service, and improve our platform's functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">3. How We Use Your Information</h2>
            <p className="mb-4 leading-relaxed">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Providing, maintaining, and improving our Service</li>
              <li>Creating and managing your user account</li>
              <li>Facilitating connections between DJs and opportunities</li>
              <li>Sending you important updates about your account and our Service</li>
              <li>Providing customer support and responding to your inquiries</li>
              <li>Personalizing your experience and content recommendations</li>
              <li>Analyzing usage patterns to improve our platform</li>
              <li>Detecting and preventing fraud, abuse, and security issues</li>
              <li>Complying with legal obligations and enforcing our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">4. Information Sharing and Disclosure</h2>
            <p className="mb-4 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold mb-3 text-[color:var(--text-primary)]">Service Providers</h3>
            <p className="mb-4 leading-relaxed">
              We may share your information with trusted third-party service providers who assist us in operating our platform, such as:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Cloud hosting and data storage providers</li>
              <li>Email communication services</li>
              <li>Payment processing companies</li>
              <li>Analytics and performance monitoring tools</li>
              <li>Customer support platforms</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-[color:var(--text-primary)]">Legal Requirements</h3>
            <p className="mb-4 leading-relaxed">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities, such as a court order or government agency.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-[color:var(--text-primary)]">Business Transfers</h3>
            <p className="mb-4 leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">5. Data Security</h2>
            <p className="mb-4 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">6. Your Privacy Rights</h2>
            <p className="mb-4 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">7. Data Retention</h2>
            <p className="mb-4 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
            <p className="mb-4 leading-relaxed">
              Account information is typically retained for the duration of your account's existence and for a reasonable period thereafter to comply with legal obligations and resolve disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">8. International Data Transfers</h2>
            <p className="mb-4 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws than your jurisdiction. When we transfer your information internationally, we ensure appropriate safeguards are in place to protect your privacy rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">9. Children's Privacy</h2>
            <p className="mb-4 leading-relaxed">
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
            <p className="mb-4 leading-relaxed">
              If we discover that we have collected personal information from a child under 13, we will take steps to delete such information from our systems promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">10. Third-Party Links</h2>
            <p className="mb-4 leading-relaxed">
              Our Service may contain links to third-party websites, applications, or services that are not owned or controlled by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">11. Changes to This Privacy Policy</h2>
            <p className="mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="mb-4 leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">12. Contact Us</h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[color:var(--surface)] p-6 rounded-lg border border-[color:var(--border)]">
              <p className="mb-2"><strong>DJ Elite Privacy Team</strong></p>
              <p className="mb-2">Email: privacy@djelite.site</p>
              <p className="mb-2">Website: https://djelite.site</p>
              <p className="mb-2">Response Time: We aim to respond to all privacy inquiries within 30 days</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">13. California Privacy Rights</h2>
            <p className="mb-4 leading-relaxed">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, use, and share about you, and the right to delete your personal information.
            </p>
            <p className="mb-4 leading-relaxed">
              California residents may also request that we not sell their personal information. We do not sell personal information as defined by the CCPA.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};