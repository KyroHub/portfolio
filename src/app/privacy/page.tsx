import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";

export default function PrivacyPolicyPage() {
  return (
    <PageShell className="py-24" contentClassName="max-w-4xl mx-auto px-4">
      <PageHeader
        title="Privacy Policy"
        description="How we handle and protect your data."
        className="mb-12"
      />
      
      <SurfacePanel className="p-8 md:p-12 text-stone-800 dark:text-stone-200 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            When you sign in using Google Authentication, we collect only your basic profile information (such as your name, profile picture, and email address) explicitly granted by Google. This information is used strictly to create and manage your personal session on The Wannes Portfolio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Your email address is used to uniquely identify your account, secure your profile, and save your progress across our digital tools (such as dictionary settings or learning progress). We do not ever sell, rent, or share your personal information with third parties or external advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Your account data is managed and secured using Supabase, which implements industry-standard encryption, rate-limiting, and security protocols to protect your information and password hashes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Account Deletion</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            You may request to have your account and all associated data permanently deleted from our servers at any time by contacting us.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            If you have any questions or concerns about this Privacy Policy, please contact the developer directly.
          </p>
        </section>
      </SurfacePanel>
    </PageShell>
  );
}
