import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";

export default function TermsOfServicePage() {
  return (
    <PageShell className="py-24" contentClassName="max-w-4xl mx-auto px-4">
      <PageHeader
        title="Terms of Service"
        description="The rules and regulations for using our digital tools."
        className="mb-12"
      />
      
      <SurfacePanel className="p-8 md:p-12 text-stone-800 dark:text-stone-200 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Terms</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            By accessing The Wannes Portfolio and using the digital Coptic dictionary, you agree to be bound by these terms of service and all applicable laws and regulations, and you agree that you are responsible for compliance with any applicable local laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Permission is granted to temporarily view the materials (information, text, or software) on The Wannes Portfolio for personal, non-commercial transitory viewing and learning only. This is the grant of a license, not a transfer of title or intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            The materials on The Wannes Portfolio are provided on an 'as is' basis. The developer makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Limitations</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            In no event shall The Wannes Portfolio be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the site, even if notified orally or in writing of the possibility of such damage.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Revisions</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            The materials appearing on The Wannes Portfolio could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the website are strictly accurate, complete or current. We may make changes to the materials contained on the web site at any time without notice.
          </p>
        </section>
      </SurfacePanel>
    </PageShell>
  );
}
