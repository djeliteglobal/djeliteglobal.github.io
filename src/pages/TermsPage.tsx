import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export const TermsPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="text-[color:var(--accent)] hover:text-[color:var(--accent-muted)] mb-6 inline-block">
            ← Back to DJ Elite
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-[color:var(--text-secondary)] text-lg">
            Last updated: March 9, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">1. Acceptance of Terms</h2>
            <p className="mb-4 leading-relaxed">
              Welcome to DJ Elite ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website located at djelite.site and our related services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="mb-4 leading-relaxed">
              If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">2. Description of Service</h2>
            <p className="mb-4 leading-relaxed">
              DJ Elite is a comprehensive platform designed for aspiring and professional DJs. Our Service includes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Educational courses and training materials for DJ skills development</li>
              <li>Networking opportunities with other DJs and industry professionals</li>
              <li>Access to gig opportunities and career advancement resources</li>
              <li>Community features for collaboration and knowledge sharing</li>
              <li>Profile creation and portfolio showcase capabilities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">3. User Accounts</h2>
            <p className="mb-4 leading-relaxed">
              To access certain features of our Service, you must register for an account. When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              You are responsible for safeguarding the password and for all activities that occur under your account. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">4. User Content and Conduct</h2>
            <p className="mb-4 leading-relaxed">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content you post and agree not to post Content that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violates any applicable law or regulation</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains hate speech, harassment, or discriminatory content</li>
              <li>Includes spam, unauthorized advertising, or promotional materials</li>
              <li>Contains malicious code, viruses, or harmful software</li>
              <li>Impersonates another person or entity</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              We reserve the right to remove any Content that violates these Terms or is otherwise objectionable, without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">5. Intellectual Property Rights</h2>
            <p className="mb-4 leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of DJ Elite and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.
            </p>
            <p className="mb-4 leading-relaxed">
              You retain ownership of Content you create and post on our Service. However, by posting Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such Content in connection with operating and providing the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">6. Privacy Policy</h2>
            <p className="mb-4 leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">7. Payments and Subscriptions</h2>
            <p className="mb-4 leading-relaxed">
              Some aspects of our Service may be provided for a fee or other charge. If you elect to use paid aspects of the Service, you agree to the pricing and payment terms presented to you for that Service.
            </p>
            <p className="mb-4 leading-relaxed">
              All fees are non-refundable unless otherwise stated. We reserve the right to change our pricing at any time, with reasonable notice to existing subscribers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">8. Termination</h2>
            <p className="mb-4 leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
            <p className="mb-4 leading-relaxed">
              You may also terminate your account at any time by contacting us or using the account deletion features within the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">9. Disclaimer of Warranties</h2>
            <p className="mb-4 leading-relaxed">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. DJ Elite makes no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included therein.
            </p>
            <p className="mb-4 leading-relaxed">
              We do not warrant that the Service will be uninterrupted or error-free, and we will not be liable for any interruptions or errors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">10. Limitation of Liability</h2>
            <p className="mb-4 leading-relaxed">
              In no event shall DJ Elite, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">11. Governing Law</h2>
            <p className="mb-4 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which DJ Elite operates, without regard to conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">12. Changes to Terms</h2>
            <p className="mb-4 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p className="mb-4 leading-relaxed">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--accent)]">13. Contact Information</h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-[color:var(--surface)] p-6 rounded-lg border border-[color:var(--border)]">
              <p className="mb-2"><strong>DJ Elite</strong></p>
              <p className="mb-2">Email: legal@djelite.site</p>
              <p className="mb-2">Website: https://djelite.site</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
