import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from '@/app/tc/style.module.scss'

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.date}>Last Updated: April 25, 2025</p>

          <p className={styles.p}>
            Wander (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), operated
            by ActEarn Inc., provides a platform for discovering and organizing
            real-life hangouts, events, and group interactions (the
            &quot;Service&quot;). This Privacy Policy explains how we collect,
            use, store, and share your information when you use Wander.
          </p>
          <p className={styles.p}>
            By using the Service, you agree to the collection and use of
            information in accordance with this Privacy Policy. If you do not
            agree, please do not use the app.
          </p>

          <hr className={styles.rule} />

          {/* Section 1: Information We Collect — merged from both */}
          <section className={styles.section}>
            <h2 className={styles.h2}>1. Information We Collect</h2>
            <p className={styles.p}>
              We collect information to provide, improve, and secure Wander.
              When you use the Service, we may collect the following types of
              information:
            </p>

            <p className={styles.p}>
              <strong>a. Information You Provide</strong>
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Account Information</strong>: Email address, username,
                and password when you create an account.
              </li>
              <li>
                <strong>Profile Information</strong>: Such as age, gender,
                interests, photos, bio, or other content you choose to provide.
              </li>
              <li>
                <strong>User-Generated Content</strong>: Responses to
                AI-generated questions, posts, comments, likes, and profile
                details.
              </li>
              <li>
                <strong>Reports and Feedback</strong>: Reports you submit about
                objectionable content (e.g., hate speech, harassment) and
                feedback on AI questions or app features.
              </li>
              <li>
                <strong>Communications</strong>: Information you share when
                contacting our support team.
              </li>
            </ul>

            <p className={styles.p}>
              <strong>b. Automatically Collected Information</strong>
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Location Data</strong>: With your permission, we collect
                your precise or approximate location (e.g., GPS, IP address, or
                Wi-Fi data) to generate contextually relevant AI questions.
              </li>
              <li>
                <strong>Device Information</strong>: Device type, operating
                system, IP address, and browser type.
              </li>
              <li>
                <strong>Usage Data</strong>: Interactions with the app, such as
                pages visited, features used, groups joined, events attended,
                and session duration.
              </li>
              <li>
                <strong>Analytics</strong>: Aggregated, anonymized data on app
                performance and user behavior, collected via tools like Firebase
                Analytics.
              </li>
            </ul>

            <p className={styles.p}>
              <strong>c. Information from Third Parties</strong>
            </p>
            <ul className={styles.list}>
              <li>
                If you sign in using Apple, Google, or another third-party
                service, we may receive limited information (e.g., email
                address, name) based on your authorization.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 2: How We Use Your Information — merged from both */}
          <section className={styles.section}>
            <h2 className={styles.h2}>2. How We Use Your Information</h2>
            <p className={styles.p}>We use your information to:</p>
            <ul className={styles.list}>
              <li>
                Provide and operate the Service, including delivering core
                features such as generating AI questions, displaying posts, and
                enabling comments or likes.
              </li>
              <li>
                Match you with relevant people, groups, and events.
              </li>
              <li>
                Enable group chats, event participation, and social interactions.
              </li>
              <li>
                Personalize your experience (e.g., tailoring AI questions to
                your interests or location, if you opt in).
              </li>
              <li>
                Moderate content to enforce our Terms and Conditions and
                Community Guidelines.
              </li>
              <li>Process reports and respond to support inquiries.</li>
              <li>
                Analyze usage patterns to improve product features and user
                experience.
              </li>
              <li>
                Communicate with you about updates, events, or important notices.
              </li>
              <li>
                Comply with legal obligations, such as responding to lawful
                requests from authorities.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 3: Location Data Usage — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>3. Location Data Usage</h2>
            <ul className={styles.list}>
              <li>
                <strong>Purpose</strong>: We use your location data to generate
                contextually relevant AI questions (e.g., &quot;What&apos;s your
                favorite local cafe?&quot; based on your city). Location data
                enhances the relevance of questions but is not required to use
                Wander.
              </li>
              <li>
                <strong>Consent</strong>: We collect location data only with
                your explicit permission, requested via iOS permission prompts.
                You can deny or revoke access at any time (see Section 6).
              </li>
              <li>
                <strong>Scope</strong>: Location data is used solely for
                question generation and personalization, not for advertising or
                third-party sharing unless specified.
              </li>
              <li>
                <strong>Anonymization</strong>: When used for analytics or AI
                training (with consent), location data is anonymized to prevent
                identification.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 4: AI Data Usage — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>4. AI Data Usage</h2>
            <ul className={styles.list}>
              <li>
                <strong>AI Training</strong>: Your responses to AI-generated
                questions and, if permitted, location data may be used to
                improve our AI&apos;s question-generation capabilities, but only
                if you explicitly opt in via the app&apos;s settings.
              </li>
              <li>
                <strong>Opt-Out</strong>: You can disable AI training at any
                time in the settings, and we will exclude your data (including
                location data) from future training.
              </li>
              <li>
                <strong>Anonymization</strong>: Data used for AI training is
                anonymized and aggregated to protect your identity.
              </li>
              <li>
                <strong>Transparency</strong>: We do not use your responses or
                location data for purposes beyond improving Wander&apos;s AI
                unless you consent.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 5: Information Sharing — merged from both */}
          <section className={styles.section}>
            <h2 className={styles.h2}>5. Information Sharing</h2>
            <p className={styles.p}>
              We may share your information in the following cases:
            </p>

            <p className={styles.p}>
              <strong>With Other Users</strong>
            </p>
            <ul className={styles.list}>
              <li>
                Your profile information and content may be visible to other
                users within the app.
              </li>
              <li>
                When you join a group or event, relevant information may be
                visible to the host and other participants.
              </li>
            </ul>

            <p className={styles.p}>
              <strong>With Event Hosts</strong>
            </p>
            <ul className={styles.list}>
              <li>
                If you join or interact with an event, certain information (such
                as your profile and participation) may be shared with the event
                host.
              </li>
            </ul>

            <p className={styles.p}>
              <strong>With Service Providers</strong>
            </p>
            <p className={styles.p}>
              We may share data with trusted third-party vendors (e.g., cloud
              storage, analytics, content moderation tools, payment processors
              such as Stripe) who process data, including location data, on our
              behalf under strict confidentiality agreements. These providers
              only access data necessary to perform their services.
            </p>

            <p className={styles.p}>
              <strong>Legal Requirements</strong>
            </p>
            <ul className={styles.list}>
              <li>
                With law enforcement or regulators if required by law or to
                protect user safety or public interest.
              </li>
            </ul>

            <p className={styles.p}>
              <strong>Business Transfers</strong>
            </p>
            <ul className={styles.list}>
              <li>
                In the event of a merger, acquisition, or asset sale, your data,
                including location data, may be transferred, but we will notify
                you beforehand and provide options where possible.
              </li>
            </ul>

            <p className={styles.p}>
              We do not sell your personal information, including location data,
              to third parties for marketing or other purposes.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 6: Third-Party Links — merged from both */}
          <section className={styles.section}>
            <h2 className={styles.h2}>6. Third-Party Links and Services</h2>
            <p className={styles.p}>
              The Service may contain links to third-party websites or services.
              We are not responsible for the privacy practices of those third
              parties. Review the privacy policies of third-party services before
              engaging with them.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 7: Cookies — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>7. Cookies</h2>
            <p className={styles.p}>
              We may use cookies and similar technologies to:
            </p>
            <ul className={styles.list}>
              <li>Keep you logged in</li>
              <li>Understand usage patterns</li>
              <li>Improve performance</li>
            </ul>
            <p className={styles.p}>
              You can control cookies through your browser settings.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 8: Data Retention — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>8. Data Retention</h2>
            <p className={styles.p}>
              We retain your information as long as necessary to:
            </p>
            <ul className={styles.list}>
              <li>Provide the Service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 9: Data Storage and Security — merged, current base */}
          <section className={styles.section}>
            <h2 className={styles.h2}>9. Data Storage and Security</h2>
            <ul className={styles.list}>
              <li>
                <strong>Storage</strong>: Your data, including location data, is
                stored on secure servers in the USA, protected with
                industry-standard encryption.
              </li>
              <li>
                <strong>Security Measures</strong>: We use firewalls, access
                controls, and regular security audits to prevent unauthorized
                access. We take reasonable measures to protect your information.
              </li>
              <li>
                <strong>Limitations</strong>: While we take reasonable steps to
                safeguard your data, no method of transmission or storage is
                completely secure, and we cannot guarantee absolute security.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 10: International Data Transfers — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>10. International Data Transfers</h2>
            <ul className={styles.list}>
              <li>
                Your data, including location data, may be transferred to and
                stored in the USA or other countries with different privacy laws
                than your jurisdiction.
              </li>
              <li>
                For EU users, we use Standard Contractual Clauses (SCCs) to
                ensure GDPR-compliant data transfers, protecting your rights
                under EU law.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 11: Children's Privacy — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>11. Children&apos;s Privacy</h2>
            <ul className={styles.list}>
              <li>
                Wander is not intended for children under 13 (or 16 in the EU,
                per GDPR). We do not knowingly collect data, including location
                data, from users under these age limits.
              </li>
              <li>
                If we discover data from an underage user, we will delete it
                promptly. Contact us at quinn@wander.one to report such cases.
              </li>
              <li>
                For users under 18, parental consent is required during signup,
                verified via email confirmation.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 12: Your Choices and Controls — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>12. Your Choices and Controls</h2>
            <p className={styles.p}>
              You have control over your data through the following options:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Location Data</strong>: Manage location access via iOS
                settings or Wander&apos;s privacy settings. You can deny, limit
                to approximate location, or revoke permission at any time, and
                Wander will stop collecting location data.
              </li>
              <li>
                <strong>Account Deletion</strong>: Delete your account via the
                app&apos;s settings to remove your posts, comments, location
                data, and personal data from our databases, subject to legal
                retention periods.
              </li>
              <li>
                <strong>Post Deletion</strong>: Delete individual posts at any
                time using the &quot;Delete&quot; button, with immediate removal
                from public view.
              </li>
              <li>
                <strong>AI Training Opt-Out</strong>: Disable the use of your
                responses and location data for AI training in the settings.
              </li>
              <li>
                <strong>Marketing Preferences</strong>: Opt out of promotional
                emails using the unsubscribe link or app settings.
              </li>
              <li>
                <strong>Tracking</strong>: Manage analytics tracking via the
                app&apos;s privacy settings.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 13: Your Privacy Rights — merged, current base */}
          <section className={styles.section}>
            <h2 className={styles.h2}>13. Your Privacy Rights</h2>
            <p className={styles.p}>
              Depending on your jurisdiction, you may have specific rights,
              including:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Access</strong>: The right to access your personal data.
              </li>
              <li>
                <strong>Correction or Deletion</strong>: The right to request
                correction or deletion of your data.
              </li>
              <li>
                <strong>Withdraw Consent</strong>: The right to withdraw consent
                at any time.
              </li>
              <li>
                <strong>CCPA (California Residents)</strong>: Right to know what
                data we collect (including location data), request deletion, and
                opt out of data sharing.
              </li>
              <li>
                <strong>GDPR (EU Residents)</strong>: Right to access, correct,
                delete, or restrict processing of your data, request
                portability, and object to certain uses.
              </li>
              <li>
                <strong>Other Jurisdictions</strong>: Similar rights may apply
                (e.g., under Canada&apos;s PIPEDA or Australia&apos;s Privacy
                Act).
              </li>
            </ul>
            <p className={styles.p}>
              To exercise these rights, email quinn@wander.one with your
              request. We will respond within 30 days (or sooner if required by
              law).
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 14: Changes to This Privacy Policy — merged from both */}
          <section className={styles.section}>
            <h2 className={styles.h2}>
              14. Changes to This Privacy Policy
            </h2>
            <p className={styles.p}>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. Changes will be
              effective when posted on this page. Significant updates will be
              communicated via in-app notifications or email to your registered
              address.
            </p>
            <p className={styles.p}>
              Your continued use of the Service after changes are posted
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 15: Contact Us — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>15. Contact Us</h2>
            <p className={styles.p}>
              For questions, concerns, or to exercise your privacy rights,
              contact:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Email</strong>: quinn@wander.one
              </li>
              <li>
                <strong>Website</strong>: www.wander.one
              </li>
            </ul>
            <p className={styles.p}>
              We aim to respond to inquiries within 24–48 hours.
            </p>
          </section>

          <hr className={styles.rule} />

          <p className={styles.p}>
            By using Wander, you acknowledge that you have read, understood, and
            agree to this Privacy Policy.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}
