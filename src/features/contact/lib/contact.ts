import type { TranslationKey } from "@/lib/i18n";

type ContactInquiryOption = {
  value: string;
  labelKey: TranslationKey;
  emailLabel: string;
};

export const contactInquiryOptions = [
  {
    value: "dictionary_feedback",
    labelKey: "contact.option.dictionary",
    emailLabel: "Dictionary Feedback",
  },
  {
    value: "grammar_question",
    labelKey: "contact.option.grammar",
    emailLabel: "Grammar / Linguistics Question",
  },
  {
    value: "research_collaboration",
    labelKey: "contact.option.research",
    emailLabel: "Research Collaboration",
  },
  {
    value: "publication_inquiry",
    labelKey: "contact.option.publication",
    emailLabel: "Publication / Book Inquiry",
  },
  {
    value: "general_message",
    labelKey: "contact.option.general",
    emailLabel: "General Message",
  },
] as const satisfies readonly ContactInquiryOption[];

export type ContactInquiryValue = (typeof contactInquiryOptions)[number]["value"];

const contactInquiryMap = new Map<string, string>(
  contactInquiryOptions.map((option) => [option.value, option.emailLabel])
);

export function isContactInquiryValue(value: string): value is ContactInquiryValue {
  return contactInquiryMap.has(value);
}

export function getContactInquiryLabel(value: ContactInquiryValue) {
  return contactInquiryMap.get(value) ?? "General Message";
}
