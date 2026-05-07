import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './style.module.scss'

export default function TermsAndConditions() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <article className={styles.article}>
          <h1 className={styles.title}>Terms of Use</h1>
          <p className={styles.date}>Last Updated: April 25, 2025</p>

          <p className={styles.p}>
            Please read these Terms of Use (&quot;Terms,&quot; &quot;Terms of
            Use&quot;) carefully before using the events service provided by
            Wander (the &quot;Service&quot;), operated by ActEarn Inc. Wander is
            a social media platform where an AI generates questions for users to
            answer, creating posts that can be viewed by others.
          </p>
          <p className={styles.p}>
            Your access to and use of the Service is conditioned on your
            acceptance of and compliance with these Terms. These Terms apply to
            all visitors, users and others who access or use the Service.
          </p>
          <p className={styles.p}>
            By accessing or using the Service you agree to be bound by these
            Terms. If you disagree with any part of the terms, you may not
            access the Service.
          </p>

          <hr className={styles.rule} />

          {/* Section 1: Acceptance of Terms — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>1. Acceptance of Terms</h2>
            <p className={styles.p}>
              By accessing or using Wander, you confirm that you are at least 13
              years old (or 16 in the EU, per GDPR) and agree to be bound by
              these Terms and our Privacy Policy. If you are under 18, you must
              have parental consent to use the app.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 2: Our Role in Events — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>2. Our Role in Events</h2>
            <p className={styles.p}>
              Events listed on Wander are organized by event hosts, not us. We
              are a third party service providing the technology for managing
              events, and are not responsible or liable:
            </p>
            <ul className={styles.list}>
              <li>for event cancellations by the host;</li>
              <li>for any content or activities related to the event;</li>
              <li>
                for the accuracy of the event information provided by the host,
                including the time and connection details.
              </li>
            </ul>
            <p className={styles.p}>
              If you have an issue or question regarding any of the above, you
              should contact the event host. Hosts have full control over their
              events, and it is their responsibility to inform you of any
              relevant terms or policies that apply to your use of the Service
              outside of these Terms, as well as to respond to and resolve any
              disputes that you may have regarding their events.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 3: User Conduct / Acceptable Use — merged */}
          <section className={styles.section}>
            <h2 className={styles.h2}>3. User Conduct</h2>
            <p className={styles.p}>
              You agree to use Wander responsibly and in compliance with all
              applicable laws. You must not:
            </p>
            <ul className={styles.list}>
              <li>
                Post or share content that is unlawful, defamatory, harassing,
                hateful, sexually explicit, violent, or otherwise objectionable,
                as determined by Wander.
              </li>
              <li>
                Engage in bullying, harassment, or discrimination based on race,
                gender, religion, or other protected characteristics.
              </li>
              <li>Impersonate others or create false accounts.</li>
              <li>
                Share content that infringes on intellectual property, privacy,
                or other rights.
              </li>
              <li>
                Use the app to distribute spam, malware, or other harmful
                material.
              </li>
              <li>
                Use the Service in any unlawful or fraudulent manner, or in a
                way that could damage or compromise our systems or security.
              </li>
              <li>
                Access the Service by any means other than our publicly
                supported interfaces.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 4: User-Generated Content / Content — merged */}
          <section className={styles.section}>
            <h2 className={styles.h2}>4. User-Generated Content</h2>
            <p className={styles.p}>
              Our Service allows you to post, link, store, share and otherwise
              make available certain information, text, graphics, videos, or
              other material (&quot;Content&quot;).
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Posts</strong>: Your responses to AI-generated questions
                become posts visible to other users. You retain ownership of
                your content but grant Wander a worldwide, non-exclusive,
                royalty-free license to display, store, and distribute your
                posts within the app. You further agree that unless we agree
                otherwise in writing, you grant us and applicable hosts an
                unrestricted, worldwide, irrevocable, non-exclusive and
                royalty-free right to use, adapt, modify, publish, translate,
                distribute and display any Content you post on the Service, in
                any form or media.
              </li>
              <li>
                <strong>Responsibility</strong>: You agree that you are solely
                responsible for any content you post on the Service.
              </li>
              <li>
                <strong>Deletion</strong>: You may delete your posts at any time
                via the app&apos;s interface. Deleted posts will be removed from
                public view and our databases, subject to legal retention
                requirements.
              </li>
              <li>
                <strong>Moderation</strong>: We reserve the right to review,
                remove, or restrict content that violates these Terms or
                Community Guidelines. We use automated tools and human moderators
                to monitor content.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 5: Reporting and Blocking — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>5. Reporting and Blocking</h2>
            <ul className={styles.list}>
              <li>
                <strong>Reporting</strong>: You can report objectionable content
                (e.g., hate speech, harassment) using the &quot;Report&quot;
                button on posts, comments, or profiles. Reports are reviewed
                within 48 hours, and you may be notified of the outcome.
              </li>
              <li>
                <strong>Blocking</strong>: You can block other users to prevent
                them from interacting with you or viewing your content. Blocked
                users will not be notified.
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 6: AI-Generated Questions — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>6. AI-Generated Questions</h2>
            <ul className={styles.list}>
              <li>
                The AI generates questions to engage users. We strive to ensure
                questions are safe and appropriate but cannot guarantee they will
                always meet your preferences.
              </li>
              <li>
                You may skip questions or provide feedback to improve the
                AI&apos;s prompts.
              </li>
              <li>
                Your responses may be used to refine the AI&apos;s
                question-generation, but only with your consent (see Privacy
                Policy).
              </li>
            </ul>
          </section>

          <hr className={styles.rule} />

          {/* Section 7: Links To Other Web Sites — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>7. Links To Other Web Sites</h2>
            <p className={styles.p}>
              Our Service may contain links to third-party web sites or services
              that are not owned or controlled by ActEarn Inc.
            </p>
            <p className={styles.p}>
              We have no control over, and assume no responsibility for, the
              content, privacy policies, or practices of any third party web
              sites or services. You further acknowledge and agree that we shall
              not be responsible or liable, directly or indirectly, for any
              damage or loss caused or alleged to be caused by or in connection
              with use of or reliance on any such content, goods or services
              available on or through any such web sites or services.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 8: Intellectual Property — merged */}
          <section className={styles.section}>
            <h2 className={styles.h2}>
              8. Copyright, Trademarks, and Intellectual Property
            </h2>
            <p className={styles.p}>
              All content and other materials available on our websites and
              presented as part of the Service, including, without limitation,
              trademarks, service marks, trade names, images, audio, text,
              software, and the &quot;look and feel&quot; of Wander and its
              associated webpages (collectively, &quot;Site Content&quot;) are
              protected by copyright, trademark, and other intellectual property
              laws. Wander, including its AI, design, and content (excluding
              user posts), is owned by Wander.
            </p>
            <p className={styles.p}>
              You may not reproduce, republish, distribute, display, perform,
              transmit, sell, or otherwise use any Site Content without our
              express written permission, except when such actions occur in
              connection with bona fide uses of the Service through our publicly
              supported interfaces.
            </p>
            <p className={styles.p}>
              In this regard, users are prohibited from downloading,
              republication, retransmission, reproduction, or other use of any
              image (and other similar content) as a stand-alone file.
              Furthermore, Site Content may not be used in any manner that is
              likely to cause confusion among consumers.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 9: Copyright Infringement — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>9. Copyright Infringement</h2>
            <p className={styles.p}>
              Wander respects the intellectual property rights of others. If you
              believe that any Site Content infringes upon your copyright,
              please contact us.
            </p>
            <p className={styles.p}>
              We will terminate the accounts of users who repeatedly infringe
              the copyrights of others.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 10: Submissions — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>10. Submissions</h2>
            <p className={styles.p}>
              We welcome feedback on our Service. However, you agree that any
              ideas, suggestions, drawings, graphics, innovations, concepts,
              recommendations, or similar materials (&quot;Submissions&quot;)
              you send us are not confidential.
            </p>
            <p className={styles.p}>
              You hereby assign such Submissions to us without compensation (or
              the expectation of compensation), and agree that we may disclose,
              reproduce, republish, modify, distribute, display, perform,
              transmit, sell, or otherwise use your Submissions for commercial
              or non-commercial purposes with no compensation to you.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 11: Disclaimer — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>11. Disclaimer</h2>
            <p className={styles.capsBlock}>
              YOU AGREE THAT USE OF THE SERVICE IS AT YOUR SOLE RISK. THE
              SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; BASIS.
            </p>
            <p className={styles.capsBlock}>
              WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING, WITHOUT LIMITATION, ANY WARRANTY OF
              MERCHANTABILITY, TITLE, QUIET ENJOYMENT, FITNESS FOR A PARTICULAR
              PURPOSE AND NON-INFRINGEMENT.
            </p>
            <p className={styles.capsBlock}>
              WE MAKE NO WARRANTY THAT THE SERVICE WILL MEET YOUR REQUIREMENTS,
              BE ACCURATE, COMPLETE, CURRENT OR TIMELY, UNINTERRUPTED, SECURE,
              OR ERROR FREE.
            </p>
            <p className={styles.capsBlock}>
              YOU ARE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR DEVICE OR DATA
              THAT RESULTS FROM YOUR ACCESS OR USE OF THE SERVICE.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 12: Limitation of Liability — merged */}
          <section className={styles.section}>
            <h2 className={styles.h2}>12. Limitation of Liability</h2>
            <p className={styles.capsBlock}>
              NEITHER WE NOR OUR AFFILIATES SHALL BE LIABLE FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES RESULTING
              FROM THE USE OR INABILITY TO USE THE SERVICE.
            </p>
            <p className={styles.capsBlock}>
              IN ANY EVENT, OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU
              PAID TO USE THE SERVICE.
            </p>
            <p className={styles.p}>
              We are not liable for user-generated content or interactions,
              technical issues, data loss, or service interruptions.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 13: Indemnification — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>13. Indemnification</h2>
            <p className={styles.p}>
              You agree to indemnify and hold harmless ActEarn Inc. and its
              affiliates from any claims, damages, or expenses arising from your
              use of the Service or violation of these Terms.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 14: Termination — merged */}
          <section className={styles.section}>
            <h2 className={styles.h2}>14. Account Termination</h2>
            <p className={styles.p}>
              We may terminate or suspend access to our Service immediately,
              without prior notice, for any reason whatsoever, including if you:
            </p>
            <ul className={styles.list}>
              <li>Repeatedly violate these Terms or Community Guidelines.</li>
              <li>Engage in illegal or harmful behavior.</li>
              <li>Attempt to bypass moderation or security measures.</li>
            </ul>
            <p className={styles.p}>
              You may delete your account at any time via the app&apos;s
              settings.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 15: Changes to Terms — current only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>15. Changes to Terms</h2>
            <p className={styles.p}>
              We may update these Terms at any time. We will notify you of
              significant changes via the app or email. Continued use after
              changes constitutes acceptance.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 16: Governing Law — merged */}
          <section className={styles.section}>
            <h2 className={styles.h2}>16. Governing Law</h2>
            <p className={styles.p}>
              These Terms shall be governed by and construed in accordance with
              the laws of California, USA, without regard to conflict of law
              provisions.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 17: General Provisions — reference only */}
          <section className={styles.section}>
            <h2 className={styles.h2}>17. General Provisions</h2>
            <p className={styles.p}>
              If any provision of these Terms is found to be invalid or
              unenforceable, the remaining provisions shall remain in full force
              and effect.
            </p>
            <p className={styles.p}>
              We reserve the right to update or modify these Terms at any time.
            </p>
          </section>

          <hr className={styles.rule} />

          {/* Section 18: Contact Us — merged */}
          <section className={styles.section}>
            <h2 className={styles.h2}>18. Contact Us</h2>
            <p className={styles.p}>For questions or concerns, contact us at:</p>
            <ul className={styles.list}>
              <li><strong>Email</strong>: quinn@wander.one</li>
              <li><strong>Website</strong>: www.wander.one</li>
            </ul>
            <p className={styles.p}>
              ActEarn Inc.
              <br />
              2275 Upper Middle Road East Suite 101
              <br />
              Oakville
            </p>
          </section>

          <hr className={styles.rule} />

          <p className={styles.p}>
            By using Wander, you acknowledge that you have read, understood, and
            agree to these Terms and Conditions.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}
