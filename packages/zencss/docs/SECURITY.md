# Security policy

ZenCSS is in alpha. The latest alpha is the actively maintained release line; no long-term support or guaranteed remediation timetable is promised.

## Report a vulnerability

Use GitHub's private vulnerability reporting for https://github.com/suryanshp1/zencss if it is enabled. If private reporting is unavailable, open an issue requesting a private contact channel **without posting exploit details, credentials, or affected private source**. The maintainer can establish a private channel before disclosure.

Provide the package version, affected API, reproduction, expected isolation boundary, and potential impact. Never send npm tokens, passwords, or recovery codes.

## Trust boundaries

- The scanner extracts class candidates; it does not evaluate HTML, JavaScript, or template code.
- Arbitrary-value parsing rejects declaration delimiters, URLs, comments, and executable expressions. This is not a sanitizer for arbitrary HTML or all CSS grammars.
- CSS-first configuration is restricted to the documented directive grammar.
- Plugin objects are trusted local build configuration. They can supply CSS declarations and selectors directly; do not construct them from untrusted input.
- The compiler is a build tool, not an application sandbox. Apply normal isolation and resource limits if accepting untrusted source in a hosted service.
- The playground previews markup in a sandboxed iframe with a restrictive content security policy. Application consumers are responsible for their own HTML and runtime security.

Verify the distributed archive before publication. Keep package publishing credentials out of the repository. Account authentication and npm release approval belong to the maintainer.
