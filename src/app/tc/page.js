import React from "react";
import styles from "./page.module.scss";

export default function TermsAndConditions() {
  return (
    <div className={styles.container}>
      <h1>Terms and Conditions</h1>
      <p>
        <strong>Last Updated: April 25, 2025</strong>
      </p>

      <p>
        Welcome to Wander, a social media platform where an AI generates
        questions for users to answer, creating posts that can be viewed by
        others. By using Wander, you agree to these Terms and Conditions
        (&quot;Terms&quot;). If you do not agree, please do not use the app.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Wander, you confirm that you are at least 13 years
        old (or 16 in the EU, per GDPR) and agree to be bound by these Terms and
        our Privacy Policy. If you are under 18, you must have parental consent
        to use the app.
      </p>

      <h2>2. User Conduct</h2>
      <p>
        You agree to use Wander responsibly and in compliance with all
        applicable laws. You must not:
      </p>
      <ul>
        <li>
          Post or share content that is unlawful, defamatory, harassing,
          hateful, sexually explicit, violent, or otherwise objectionable, as
          determined by Wander.
        </li>
        <li>
          Engage in bullying, harassment, or discrimination based on race,
          gender, religion, or other protected characteristics.
        </li>
        <li>Impersonate others or create false accounts.</li>
        <li>
          Share content that infringes on intellectual property, privacy, or
          other rights.
        </li>
        <li>
          Use the app to distribute spam, malware, or other harmful material.
        </li>
      </ul>

      <h2>3. User-Generated Content</h2>
      <ul>
        <li>
          <strong>Posts</strong>: Your responses to AI-generated questions
          become posts visible to other users. You retain ownership of your
          content but grant Wander a worldwide, non-exclusive, royalty-free
          license to display, store, and distribute your posts within the app.
        </li>
        <li>
          <strong>Deletion</strong>: You may delete your posts at any time via
          the app&apos;s interface. Deleted posts will be removed from public view
          and our databases, subject to legal retention requirements.
        </li>
        <li>
          <strong>Moderation</strong>: We reserve the right to review, remove,
          or restrict content that violates these Terms or Community Guidelines.
          We use automated tools and human moderators to monitor content.
        </li>
      </ul>

      <h2>4. Reporting and Blocking</h2>
      <ul>
        <li>
          <strong>Reporting</strong>: You can report objectionable content
          (e.g., hate speech, harassment) using the &quot;Report&quot; button on posts,
          comments, or profiles. Reports are reviewed within 48 hours, and you
          may be notified of the outcome.
        </li>
        <li>
          <strong>Blocking</strong>: You can block other users to prevent them
          from interacting with you or viewing your content. Blocked users will
          not be notified.
        </li>
      </ul>

      <h2>5. AI-Generated Questions</h2>
      <ul>
        <li>
          The AI generates questions to engage users. We strive to ensure
          questions are safe and appropriate but cannot guarantee they will
          always meet your preferences.
        </li>
        <li>
          You may skip questions or provide feedback to improve the AI&apos;s
          prompts.
        </li>
        <li>
          Your responses may be used to refine the AI&apos;s question-generation, but
          only with your consent (see Privacy Policy).
        </li>
      </ul>

      <h2>6. Account Termination</h2>
      <p>We may suspend or terminate your account if you:</p>
      <ul>
        <li>Repeatedly violate these Terms or Community Guidelines.</li>
        <li>Engage in illegal or harmful behavior.</li>
        <li>Attempt to bypass moderation or security measures.</li>
      </ul>
      <p>You may delete your account at any time via the app&apos;s settings.</p>

      <h2>7. Intellectual Property</h2>
      <p>
        Wander, including its AI, design, and content (excluding user posts), is
        owned by Wander. You may not copy, modify, or distribute our
        intellectual property without permission.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>Wander is provided &quot;as is.&quot; We are not liable for:</p>
      <ul>
        <li>User-generated content or interactions.</li>
        <li>Technical issues, data loss, or service interruptions.</li>
        <li>
          Any indirect, incidental, or consequential damages arising from your
          use of the app.
        </li>
      </ul>

      <h2>9. Changes to Terms</h2>
      <p>
        We may update these Terms at any time. We will notify you of significant
        changes via the app or email. Continued use after changes constitutes
        acceptance.
      </p>

      <h2>10. Contact Us</h2>
      <p>For questions or concerns, contact us at:</p>
      <ul>
        <li>Email: quinn@wander.one</li>
        <li>Website: www.wander.one</li>
      </ul>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of California, USA, without regard
        to conflict of law principles.
      </p>

      <hr />

      <p>
        By using Wander, you acknowledge that you have read, understood, and
        agree to these Terms and Conditions.
      </p>
    </div>
  );
}
