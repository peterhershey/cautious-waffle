/* Template — Project at a glance.
   Compact metadata grid for case-study openers: team, timeline, role,
   scope, platforms, awards, UX team, collaborators, cross-functional
   partners. Each field is optional; blanks drop out so a stripped-down
   version still composes cleanly.

   Supports an optional `secondary` block for follow-on work (e.g.
   Visual Overlays) rendered as a smaller addendum below the main grid. */

import type { ReactNode } from "react";

export type SecondarySection = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  fields: { label: string; value: ReactNode }[];
};

export type ProjectAtAGlanceProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  team?: ReactNode;
  timeline?: ReactNode;
  role?: ReactNode;
  scope?: ReactNode;
  platforms?: ReactNode;
  awards?: ReactNode;
  coreTeam?: ReactNode;
  uxTeam?: ReactNode;
  uxCollaborators?: ReactNode;
  crossFunctional?: ReactNode;
  secondary?: SecondarySection;
};

type Field = { label: string; value: ReactNode };

function isFilled(value: ReactNode): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
}

export function ProjectAtAGlanceTemplate({
  eyebrow = "PROJECT AT A GLANCE",
  title,
  team,
  timeline,
  role,
  scope,
  platforms,
  awards,
  coreTeam,
  uxTeam,
  uxCollaborators,
  crossFunctional,
  secondary,
}: ProjectAtAGlanceProps) {
  const primaryFields: Field[] = [
    { label: "Team", value: team },
    { label: "Timeline", value: timeline },
    { label: "Platforms", value: platforms },
    { label: "Scope", value: scope },
  ].filter((f) => isFilled(f.value));

  const secondaryDetailFields: Field[] = [
    { label: "Role", value: role },
    { label: "Core team", value: coreTeam },
    { label: "UX Team", value: uxTeam },
    { label: "UX Collaborators", value: uxCollaborators },
    { label: "Cross-functional", value: crossFunctional },
    { label: "Awards", value: awards },
  ].filter((f) => isFilled(f.value));

  const secondaryFields = secondary?.fields.filter((f) => isFilled(f.value));

  return (
    <div className="wipu-tpl-glance">
      {(eyebrow || title) && (
        <div className="wipu-tpl-glance-head">
          {eyebrow && <div className="wipu-tpl-glance-eyebrow">{eyebrow}</div>}
          {title && <h2 className="wipu-tpl-glance-title">{title}</h2>}
        </div>
      )}
      {primaryFields.length > 0 && (
        <dl className="wipu-tpl-glance-grid wipu-tpl-glance-grid-primary">
          {primaryFields.map((f, i) => (
            <div key={i} className="wipu-tpl-glance-field" data-tier="primary">
              <dt className="wipu-tpl-glance-label">{f.label}</dt>
              <dd className="wipu-tpl-glance-value">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {secondaryDetailFields.length > 0 && (
        <dl className="wipu-tpl-glance-grid wipu-tpl-glance-grid-detail">
          {secondaryDetailFields.map((f, i) => (
            <div key={i} className="wipu-tpl-glance-field" data-tier="secondary">
              <dt className="wipu-tpl-glance-label">{f.label}</dt>
              <dd className="wipu-tpl-glance-value">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {secondaryFields && secondaryFields.length > 0 && (
        <div className="wipu-tpl-glance-secondary">
          {(secondary!.eyebrow || secondary!.title) && (
            <div className="wipu-tpl-glance-secondary-head">
              {secondary!.eyebrow && (
                <div className="wipu-tpl-glance-eyebrow">
                  {secondary!.eyebrow}
                </div>
              )}
              {secondary!.title && (
                <h3 className="wipu-tpl-glance-secondary-title">
                  {secondary!.title}
                </h3>
              )}
            </div>
          )}
          <dl className="wipu-tpl-glance-secondary-grid">
            {secondaryFields.map((f, i) => (
              <div key={i} className="wipu-tpl-glance-field">
                <dt className="wipu-tpl-glance-label">{f.label}</dt>
                <dd className="wipu-tpl-glance-value">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
