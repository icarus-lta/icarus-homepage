# Contact inquiry form

## Current state

The bilingual UI and submission handling are implemented. The user confirmed no delivery service exists and explicitly requested **design first**. Delivery setup is deferred; do not ask for a provider again while working on this design. The confirmed eventual recipient is `contact@icarus-airship.com`.

The current hosting documented in `README.md` is static GitHub Pages. It cannot deliver form submissions by itself. No service account, recipient verification or third-party submission was created during this change.

## Connection contract

`ContactPage` accepts `submitUrl`, a public endpoint. It POSTs `FormData` fields `email`, `subject`, `message`, and `language` with `Accept: application/json`. HTTP success shows the receipt screen; errors preserve the form. A 15-second timeout prevents indefinite pending state, and concurrent submissions are blocked.

When delivery work resumes, set `ICARUS_CONTACT_FORM_URL` when running `.design-sync/build-preview.mjs`. It may be an HTTPS endpoint or a same-origin path backed by an actual server. No configuration means no outgoing request; a valid submission displays a neutral design-preview notice and preserves the draft. Never put private API credentials in this value or browser code.

A service such as Formspree can receive these fields without adding a server to GitHub Pages. Its public endpoint looks like `https://formspree.io/f/FORM_ID`. Setup requires creating a form, verifying the recipient address and selecting it in the service's notification workflow. Honor the service's anti-spam/CAPTCHA configuration; do not silently disable it. A private mail provider API would instead require a server-side adapter with its own validation, fixed recipient, abuse protection and protected credentials.

Official references reviewed:
- https://formspree.io/blog/formspree-ajax/
- https://help.formspree.io/articles/building-your-form/email-reply-to-address
- https://help.formspree.io/articles/building-your-form/email-subject-line
- https://help.formspree.io/articles/form-and-project-settings/changing-a-form-email-address
- https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings

## Checks completed

- TypeScript/library build and static preview generation.
- EN/KO at 1440, 768, 390 and 320 pixels; desktop/mobile screenshots reviewed.
- Required field and email validation, first-invalid focus, maximum input lengths, draft preservation on language switching and failed/unconfigured submission.
- Locally intercepted HTTP requests verified form payloads, disabled pending state, error retention, success screen and reset. No test message went to an external recipient.

Real email receipt and service-specific anti-spam behavior must be checked after the user supplies the delivery connection.
