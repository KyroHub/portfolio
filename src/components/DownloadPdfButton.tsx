"use client";

import { useState } from "react";
import { Download, Lock } from "lucide-react";
import { AuthGatedActionButton } from "@/components/AuthGatedActionButton";
import { useLanguage } from "@/components/LanguageProvider";
import { cx } from "@/lib/classes";
import { useOptionalAuthGate } from "@/lib/supabase/useOptionalAuthGate";
import type { jsPDF as JsPdfInstance } from "jspdf";

type PdfLifecycleCallback = () => Promise<void> | void;

type DownloadPdfButtonProps = {
  targetId: string;
  fileName: string;
  beforeCapture?: PdfLifecycleCallback;
  afterCapture?: PdfLifecycleCallback;
};

const PDF_BUTTON_COPY = {
  en: {
    download: "Download PDF",
    generating: "Generating...",
    loginPrompt: "Log in or sign up to download lessons as PDF",
    footerLeadIn:
      "Downloaded from The Wannes Portfolio (kyrilloswannes.com) on",
    errorPrefix: "PDF generation encountered an error:",
  },
  nl: {
    download: "PDF downloaden",
    generating: "PDF wordt gemaakt...",
    loginPrompt: "Log in of maak een account aan om lessen als pdf te downloaden",
    footerLeadIn:
      "Gedownload van The Wannes Portfolio (kyrilloswannes.com) op",
    errorPrefix: "Er is een fout opgetreden bij het maken van de pdf:",
  },
} as const;

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function DownloadPdfButton({
  targetId,
  fileName,
  beforeCapture,
  afterCapture,
}: DownloadPdfButtonProps) {
  const { language } = useLanguage();
  const authGate = useOptionalAuthGate();
  const [isGenerating, setIsGenerating] = useState(false);
  const copy = PDF_BUTTON_COPY[language];

  const handleDownload = async () => {
    if (!authGate.isAuthenticated) return;

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    setIsGenerating(true);
    
    try {
      if (beforeCapture) {
        await beforeCapture();
        await waitForNextPaint();
      }

      // Dynamically import modern PDF compilers
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");
      
      // Render native image via browser's SVG renderer instantly on the live node (no invisible clones)
      const dataUrl = await toPng(targetElement, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Construct A4 container (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = margin;

      const addProtectedMarginsAndFooter = (doc: JsPdfInstance) => {
        // Draw white rectangle to protect the top margin from image bleed
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pdfWidth, margin, "F");
        
        // Draw white rectangle to protect the bottom margin
        doc.rect(0, pageHeight - margin, pdfWidth, margin, "F");

        const now = new Date().toLocaleString(
          language === "nl" ? "nl-BE" : "en-US",
        );
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(
          `${copy.footerLeadIn} ${now}`,
          pdfWidth / 2,
          pageHeight - (margin / 2) + 2,
          { align: "center" }
        );
      };

      // Plot first page
      pdf.addImage(dataUrl, "PNG", margin, position, contentWidth, imgHeight);
      addProtectedMarginsAndFooter(pdf);
      heightLeft -= contentHeight;

      // Plot all subsequent cascading pages if the content is lengthy
      while (heightLeft > 0) {
        position = position - contentHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", margin, position, contentWidth, imgHeight);
        addProtectedMarginsAndFooter(pdf);
        heightLeft -= contentHeight;
      }

      pdf.save(fileName);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("PDF Generation failed", err);
      alert(`${copy.errorPrefix} ${errorMessage}`);
    } finally {
      if (afterCapture) {
        await afterCapture();
      }

      setIsGenerating(false);
    }
  };

  return (
    <AuthGatedActionButton
      className={cx("btn-secondary gap-2 px-4", isGenerating && "opacity-70")}
      disabled={isGenerating}
      isAuthenticated={authGate.isAuthenticated}
      isReady={authGate.isReady}
      lockedContent={
        <>
          <Lock className="h-4 w-4" />
          {copy.download}
        </>
      }
      lockedMessage={copy.loginPrompt}
      onClick={handleDownload}
    >
      <Download className={`h-4 w-4 ${isGenerating ? "animate-bounce" : ""}`} />
      {isGenerating ? copy.generating : copy.download}
    </AuthGatedActionButton>
  );
}
