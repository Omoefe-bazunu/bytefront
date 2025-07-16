import { FaqAccordion } from "@/components/faq-accordion";
import { faqItems } from "@/lib/data";

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about our products, services, and policies.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <FaqAccordion items={faqItems} />
      </div>
    </div>
  );
}
