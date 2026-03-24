"use client";

import type { ReactNode } from "react";
import type { GrammarInline } from "@/content/grammar/schema";
import { GrammarAbbreviation } from "@/features/grammar/components/GrammarAbbreviation";
import {
  getGrammarConceptAnchorId,
  getGrammarLessonAbbreviationAnchorId,
} from "@/features/grammar/lib/grammarPresentation";
import { getEntryPath } from "@/lib/locale";
import type { Language } from "@/types/i18n";

type GrammarInlineRendererProps = {
  nodes: readonly GrammarInline[];
  language: Language;
  lessonId?: string;
  renderFootnoteRef?: (ref: string, key: string) => ReactNode;
  enableAbbreviationLinks?: boolean;
};

function renderDictionaryEntryHref(
  dictionaryEntryId: string,
  language: Language,
) {
  return getEntryPath(encodeURIComponent(dictionaryEntryId), language);
}

function renderCopticNode(
  key: string,
  dictionaryEntryId: string | undefined,
  className: string,
  language: Language,
  content: ReactNode,
) {
  if (!dictionaryEntryId) {
    return (
      <span key={key} className={className}>
        {content}
      </span>
    );
  }

  return (
    <a
      key={key}
      href={renderDictionaryEntryHref(dictionaryEntryId, language)}
      target="_blank"
      rel="noreferrer noopener"
      data-dictionary-entry-id={dictionaryEntryId}
      className={`${className} no-underline`}
    >
      {content}
    </a>
  );
}

function getLessonAbbreviationHref(
  node: GrammarInline,
  lessonId: string | undefined,
  enableAbbreviationLinks: boolean,
) {
  if (!lessonId || !enableAbbreviationLinks) {
    return null;
  }

  if (
    node.type === "smallCaps" &&
    node.children.length === 1 &&
    node.children[0]?.type === "text"
  ) {
    const abbreviation = node.children[0].text.trim().toLowerCase();

    if (abbreviation === "m") {
      return `#${getGrammarLessonAbbreviationAnchorId(lessonId, "masculine")}`;
    }

    if (abbreviation === "f" || abbreviation === "v") {
      return `#${getGrammarLessonAbbreviationAnchorId(lessonId, "feminine")}`;
    }

    if (abbreviation === "s") {
      return `#${getGrammarLessonAbbreviationAnchorId(lessonId, "singular")}`;
    }

    if (abbreviation === "p") {
      return `#${getGrammarLessonAbbreviationAnchorId(lessonId, "plural")}`;
    }
  }

  if (node.type === "text") {
    const normalizedText = node.text.trim();

    if (/^\/.+\/$/.test(normalizedText)) {
      return `#${getGrammarLessonAbbreviationAnchorId(lessonId, "ipa")}`;
    }
  }

  return null;
}

function isNmSuperscriptNode(node: GrammarInline | undefined) {
  if (node?.type !== "superscript" || node.children.length !== 1) {
    return false;
  }

  const emphasisNode = node.children[0];

  if (emphasisNode?.type !== "em" || emphasisNode.children.length !== 1) {
    return false;
  }

  const abbreviationNode = emphasisNode.children[0];

  return (
    abbreviationNode?.type === "smallCaps" &&
    abbreviationNode.children.length === 1 &&
    abbreviationNode.children[0]?.type === "text" &&
    abbreviationNode.children[0].text.trim().toLowerCase() === "m"
  );
}

function getCompoundAbbreviationMatch(
  nodes: readonly GrammarInline[],
  index: number,
  lessonId: string | undefined,
  enableAbbreviationLinks: boolean,
) {
  if (!lessonId || !enableAbbreviationLinks) {
    return null;
  }

  const currentNode = nodes[index];
  const nextNode = nodes[index + 1];

  if (currentNode?.type === "text" && currentNode.text.trim() === "N" && isNmSuperscriptNode(nextNode)) {
    return {
      href: `#${getGrammarLessonAbbreviationAnchorId(lessonId, "nm")}`,
      length: 2,
    };
  }

  return null;
}

function renderInlineNode(
  node: GrammarInline,
  language: Language,
  lessonId: string | undefined,
  key: string,
  renderFootnoteRef?: (ref: string, key: string) => ReactNode,
  enableAbbreviationLinks = true,
): ReactNode {
  const abbreviationHref = getLessonAbbreviationHref(
    node,
    lessonId,
    enableAbbreviationLinks,
  );

  switch (node.type) {
    case "text":
      return abbreviationHref
        ? (
            <GrammarAbbreviation key={key} href={abbreviationHref}>
              {node.text}
            </GrammarAbbreviation>
          )
        : <span key={key}>{node.text}</span>;
    case "coptic":
      return renderCopticNode(
        key,
        node.dictionaryEntryId,
        "font-coptic text-emerald-600 dark:text-emerald-400",
        language,
        node.text,
      );
    case "copticSpan":
      return renderCopticNode(
        key,
        node.dictionaryEntryId,
        "font-coptic text-lg text-emerald-600 dark:text-emerald-400",
        language,
        <>
          <GrammarInlineRenderer
            nodes={node.children}
            language={language}
            lessonId={lessonId}
            renderFootnoteRef={renderFootnoteRef}
            enableAbbreviationLinks={enableAbbreviationLinks}
          />
        </>,
      );
    case "strong":
      return (
        <strong key={key}>
          <GrammarInlineRenderer
            nodes={node.children}
            language={language}
            lessonId={lessonId}
            renderFootnoteRef={renderFootnoteRef}
            enableAbbreviationLinks={enableAbbreviationLinks}
          />
        </strong>
      );
    case "em":
      return (
        <em key={key}>
          <GrammarInlineRenderer
            nodes={node.children}
            language={language}
            lessonId={lessonId}
            renderFootnoteRef={renderFootnoteRef}
            enableAbbreviationLinks={enableAbbreviationLinks}
          />
        </em>
      );
    case "smallCaps":
      return (
        abbreviationHref ? (
          <GrammarAbbreviation
            key={key}
            href={abbreviationHref}
            className="small-caps"
          >
            <GrammarInlineRenderer
              nodes={node.children}
              language={language}
              lessonId={lessonId}
              renderFootnoteRef={renderFootnoteRef}
              enableAbbreviationLinks={enableAbbreviationLinks}
            />
          </GrammarAbbreviation>
        ) : (
          <span key={key} className="small-caps">
            <GrammarInlineRenderer
              nodes={node.children}
              language={language}
              lessonId={lessonId}
              renderFootnoteRef={renderFootnoteRef}
              enableAbbreviationLinks={enableAbbreviationLinks}
            />
          </span>
        )
      );
    case "underline":
      return (
        <span
          key={key}
          className="underline decoration-2 underline-offset-4"
        >
          <GrammarInlineRenderer
            nodes={node.children}
            language={language}
            lessonId={lessonId}
            renderFootnoteRef={renderFootnoteRef}
            enableAbbreviationLinks={enableAbbreviationLinks}
          />
        </span>
      );
    case "superscript":
      return (
        <sup key={key}>
          <GrammarInlineRenderer
            nodes={node.children}
            language={language}
            lessonId={lessonId}
            renderFootnoteRef={renderFootnoteRef}
            enableAbbreviationLinks={enableAbbreviationLinks}
          />
        </sup>
      );
    case "lineBreak":
      return <br key={key} />;
    case "termRef":
      return <span key={key}>{node.fallback ?? node.ref}</span>;
    case "conceptRef":
      return (
        <a
          key={key}
          href={`#${getGrammarConceptAnchorId(node.ref)}`}
          data-concept-ref={node.ref}
          className="font-medium text-sky-700 decoration-sky-300 underline decoration-dashed underline-offset-4 transition-colors hover:text-sky-600 hover:decoration-sky-500 dark:text-sky-300 dark:decoration-sky-700 dark:hover:text-sky-200 dark:hover:decoration-sky-400"
        >
          {node.fallback ?? node.ref}
        </a>
      );
    case "footnoteRef":
      if (renderFootnoteRef) {
        return renderFootnoteRef(node.ref, key);
      }

      return (
        <sup key={key} className="text-xs font-semibold text-sky-700 dark:text-sky-300">
          [{node.ref}]
        </sup>
      );
    case "link":
      return (
        <a
          key={key}
          href={node.href}
          className="text-sky-700 underline underline-offset-4 transition-colors hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
        >
          <GrammarInlineRenderer
            nodes={node.children}
            language={language}
            lessonId={lessonId}
            renderFootnoteRef={renderFootnoteRef}
            enableAbbreviationLinks={false}
          />
        </a>
      );
    default: {
      const exhaustiveCheck: never = node;
      return exhaustiveCheck;
    }
  }
}

export function GrammarInlineRenderer({
  nodes,
  language,
  lessonId,
  renderFootnoteRef,
  enableAbbreviationLinks = true,
}: GrammarInlineRendererProps) {
  const renderedNodes: ReactNode[] = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const compoundAbbreviationMatch = getCompoundAbbreviationMatch(
      nodes,
      index,
      lessonId,
      enableAbbreviationLinks,
    );

    if (compoundAbbreviationMatch) {
      renderedNodes.push(
        <GrammarAbbreviation
          key={`compound-${index}`}
          href={compoundAbbreviationMatch.href}
        >
          <GrammarInlineRenderer
            nodes={nodes.slice(index, index + compoundAbbreviationMatch.length)}
            language={language}
            lessonId={lessonId}
            renderFootnoteRef={renderFootnoteRef}
            enableAbbreviationLinks={false}
          />
        </GrammarAbbreviation>,
      );
      index += compoundAbbreviationMatch.length - 1;
      continue;
    }

    const node = nodes[index];

    renderedNodes.push(
      renderInlineNode(
        node,
        language,
        lessonId,
        `${node.type}-${index}`,
        renderFootnoteRef,
        enableAbbreviationLinks,
      ),
    );
  }

  return (
    <>{renderedNodes}</>
  );
}
