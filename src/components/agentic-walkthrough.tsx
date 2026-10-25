"use client";

import { useRef, useState } from "react";
import { Icon, type IconName } from "./icon";

const steps: {
  label: string;
  title: string;
  body: string;
  short: string;
  icon: IconName;
}[] = [
  {
    label: "Give an instruction",
    title: "Start with what you need.",
    body: "An agentic task begins with a clear instruction. The request sets the direction for what comes next.",
    short: "Your instruction",
    icon: "sparkle",
  },
  {
    label: "Understand the context",
    title: "Put the question in context.",
    body: "Relevant page information gives an assistant the context for interpreting a request. Context controls depend on the build.",
    short: "Relevant context",
    icon: "stack",
  },
  {
    label: "Take supported steps",
    title: "Connect a request to action.",
    body: "The browser uses the actions available in that build. A request can only go as far as its supported tools allow.",
    short: "Supported actions",
    icon: "cursor",
  },
  {
    label: "Review when required",
    title: "Make room for a decision.",
    body: "A task may require confirmation before a sensitive step. The actual review flow must be checked in the current product.",
    short: "A moment to review",
    icon: "shield",
  },
  {
    label: "Understand the result",
    title: "Know where the task stands.",
    body: "A useful result makes completed steps and any remaining work understandable. This diagram explains the concept, not a completed Praxis task.",
    short: "A clear outcome",
    icon: "checkCircle",
  },
];

export function AgenticWalkthrough({ light = false }: { light?: boolean }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let target = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      target = (index + 1) % steps.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      target = (index - 1 + steps.length) % steps.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = steps.length - 1;
    else return;
    event.preventDefault();
    setActive(target);
    tabs.current[target]?.focus();
  }

  return (
    <div className={`walkthrough ${light ? "walkthrough-light" : ""}`}>
      <div
        className="walkthrough-steps"
        role="tablist"
        aria-label="How agentic browsing works"
        aria-orientation="vertical"
      >
        {steps.map((step, index) => (
          <button
            ref={(node) => {
              tabs.current[index] = node;
            }}
            key={step.label}
            id={`step-tab-${index}`}
            aria-controls="step-panel"
            type="button"
            role="tab"
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            className={`walkthrough-step ${active === index ? "active" : ""}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            <span className="step-number">{index + 1}</span>
            <span>{step.label}</span>
            <Icon name="arrowUpRight" size={17} />
          </button>
        ))}
      </div>
      <div
        className="walkthrough-visual"
        role="tabpanel"
        id="step-panel"
        aria-labelledby={`step-tab-${active}`}
        tabIndex={0}
      >
        <div className="walkthrough-diagram" aria-hidden="true">
          <div className="diagram-line" />
          <span className="diagram-side">
            <Icon
              name={active === 0 ? "browser" : steps[active - 1].icon}
              size={22}
            />
          </span>
          <span className="diagram-main" key={`icon-${active}`}>
            <Icon name={steps[active].icon} size={54} />
          </span>
          <span className="diagram-side">
            <Icon
              name={
                active === steps.length - 1 ? "browser" : steps[active + 1].icon
              }
              size={22}
            />
          </span>
        </div>
        <div className="walkthrough-result" key={active}>
          <span className="diagram-label">{steps[active].short}</span>
          <h3>{steps[active].title}</h3>
          <p>{steps[active].body}</p>
        </div>
        <p className="concept-caption">
          Concept illustration. Not product footage.
        </p>
      </div>
    </div>
  );
}
