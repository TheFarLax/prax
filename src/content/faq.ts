import { features, product, releases } from "@/lib/product";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "About Praxis" | "Using Xasri AI" | "Downloads & privacy";
}

const voice = features.find((feature) => feature.id === "voice");
const tabs = features.find((feature) => feature.id === "tab-context");
const workflows = features.find((feature) => feature.id === "workflows");
const privacy = features.find((feature) => feature.id === "privacy-controls");

export const faqs: FaqItem[] = [
  {
    id: "what-is-praxis",
    question: "What is Praxis?",
    answer:
      "Praxis is an AI-powered browser from Xasri. It brings everyday web browsing together with Xasri AI, an assistant designed to understand browsing context and help with supported browser tasks.",
    category: "About Praxis",
  },
  {
    id: "agentic-browser",
    question: "What makes a browser agentic?",
    answer:
      "An agentic browser connects an instruction to actions in the browser, beyond simply returning an answer. The available actions and any required confirmations depend on the browser build and the task.",
    category: "About Praxis",
  },
  {
    id: "xasri-ai",
    question: "How are Praxis and Xasri AI different?",
    answer:
      "Praxis is the browser. Xasri AI is the assistant inside it. Ask Xasri is the action for bringing your question or instruction to the assistant.",
    category: "Using Xasri AI",
  },
  {
    id: "supported-actions",
    question: "What can Xasri AI do?",
    answer:
      "Xasri AI is designed to help you understand browsing context and turn instructions into supported browser actions. Specific actions must be confirmed for your Praxis version; there is no promise that every website or task is supported.",
    category: "Using Xasri AI",
  },
  {
    id: "voice",
    question: "Can I use voice?",
    answer: voice
      ? `${voice.description} ${voice.limitations.join(" ")}`
      : "Voice support has not yet been confirmed for a release listed on this site. Availability and supported voice actions will be included with the relevant release details.",
    category: "Using Xasri AI",
  },
  {
    id: "tab-context",
    question: "How does tab context work?",
    answer: tabs
      ? `${tabs.description} ${tabs.limitations.join(" ")}`
      : "Tab context means using information from relevant pages in a conversation. Praxis's exact context-selection controls have not yet been documented here. Do not assume that every open tab or private tab is automatically included.",
    category: "Using Xasri AI",
  },
  {
    id: "downloads",
    question: "Which platforms are available?",
    answer: releases.length
      ? `Verified downloads are available for ${Array.from(new Set(releases.map((release) => release.platformLabel))).join(", ")}. Visit Download for current versions, system requirements, and installation details.`
      : "No verified Praxis download is currently listed on this site. Platform availability, version information, and installation instructions will appear together when a release is available.",
    category: "Downloads & privacy",
  },
  {
    id: "scheduled-checks",
    question: "Do scheduled checks need the browser to stay open?",
    answer: workflows
      ? `${workflows.description} ${workflows.limitations.join(" ")}`
      : "Scheduled checks and execution while the browser is closed have not been confirmed for a release on this site. Do not rely on closed-browser monitoring or background execution.",
    category: "Using Xasri AI",
  },
  {
    id: "privacy",
    question: "What choices do I have over context and browsing data?",
    answer: privacy
      ? `${privacy.description} ${privacy.limitations.join(" ")}`
      : `Review the controls and permissions in your installed version before including page content in an AI request. ${product.legal.privacy ? "The browser's privacy notice is available on the Privacy page." : "The browser's privacy notice and version-specific data controls are not yet published on this site."}`,
    category: "Downloads & privacy",
  },
];
