# Research Source Quality

Use this reference before collecting or evaluating sources for UX and product
research. The goal is to make evidence quality visible before synthesis begins.

## Serious Candidate Rule

A serious candidate is a source that could plausibly inform the final research
answer or be explicitly excluded from it. Do not track every throwaway search
result, but do account for sources that influenced inclusion, exclusion, or
confidence.

For normal chat-based research, source tracking can be a working table in the
response or notes. Do not require a persistent file unless the user asks for a
research bundle.

## Trust Tiers

### Strong

Official, primary, or original evidence.

Examples:

- Official product, policy, standards, or documentation pages.
- Original research from a credible research organization.
- Notable publication or trade publication with clear editorial authority.
- Direct product/account evidence showing the behavior being researched.

Allowed use:

- Key Evidence
- Supporting Context

### Medium

Credible secondary evidence or self-interested evidence that is still useful and
auditable.

Examples:

- Credible secondary reporting.
- Substantive consultancy or vendor analysis with visible reasoning.
- Company case studies or PR material that add direct facts but have a bias.

Allowed use:

- Key Evidence only when corroborated by stronger evidence.
- Supporting Context.
- Examples Only.

### Weak

Low-authority, thin, or poorly sourced material.

Examples:

- Thin SEO content.
- Vendor opinion with little original evidence.
- Stat roundups with unclear sourcing.
- Low-authority commentary.
- Affiliate or promotional content.

Allowed use:

- Supporting Context.
- Examples Only.
- Exclude.

Weak sources must never be Key Evidence.

## Allowed Use Labels

- `Key Evidence`: can support a main finding.
- `Supporting Context`: helps explain the landscape but should not carry the conclusion.
- `Examples Only`: useful as an example, not as proof.
- `Exclude`: considered but not used.

## Ranking Rubric

Prefer sources with:

- Strong relevance to the brief.
- Direct evidence over commentary.
- Clear authorship and editorial accountability.
- Current information when the topic is time-sensitive.
- Unique evidence rather than repeated claims.
- Retrievability so claims can be checked later.

## Clean URL List

When external sources are used, provide a clean URL list for optional NotebookLM
use:

- one URL per line
- no markdown
- no bullets
- no source titles
- no labels
- no blank lines between entries

NotebookLM is optional. The URL list is a convenience output, not a dependency.
