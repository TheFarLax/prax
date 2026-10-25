"use client";

import { useEffect, useState } from "react";
import type { FaqItem } from "@/content/faq";
import { Icon } from "./icon";

export function FaqList({
  items,
  searchable = false,
}: {
  items: FaqItem[];
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All questions");
  useEffect(() => {
    const revealLinkedQuestion = () => {
      let id = window.location.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* An invalid URL fragment must not break the FAQ. */
      }
      const question = id ? document.getElementById(id) : null;
      if (question instanceof HTMLDetailsElement) question.open = true;
    };
    revealLinkedQuestion();
    window.addEventListener("hashchange", revealLinkedQuestion);
    return () => window.removeEventListener("hashchange", revealLinkedQuestion);
  }, []);
  const categories = [
    "All questions",
    "About Praxis",
    "Using Xasri AI",
    "Downloads & privacy",
  ];
  const filtered = items.filter(
    (item) =>
      (category === "All questions" || category === item.category) &&
      `${item.question} ${item.answer}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="faq-component">
      {searchable && (
        <div className="faq-tools">
          <label htmlFor="faq-search">Find an answer</label>
          <div className="faq-search">
            <Icon name="search" size={22} />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
          <div
            className="faq-filters"
            role="group"
            aria-label="Filter questions by topic"
          >
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="search-count" role="status">
            {filtered.length} {filtered.length === 1 ? "answer" : "answers"}
            {query ? ` for “${query.trim()}”` : ""}
          </p>
        </div>
      )}
      <div className="faq-list">
        {filtered.map((item) => (
          <details key={item.id} id={item.id} className="faq-item">
            <summary>
              {item.question}
              <span className="faq-indicator">
                <Icon name="plus" size={21} />
              </span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="faq-empty">
          <Icon name="search" size={28} />
          <h2>No matching questions.</h2>
          <p>Try a shorter search or choose another topic.</p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery("");
              setCategory("All questions");
            }}
          >
            See all questions
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
