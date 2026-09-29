# Contact and career submission backend

The user requested email delivery after the original frontend-only phase.
Both forms now use same-origin endpoints served by the Python backend.
The recipient is fixed to `contact@icarus-airship.com`.

See [backend setup and Daum Smart Work instructions](../backend/README.md)
for configuration, API fields, deployment requirements, and tests.

- ContactPage defaults to `/api/contact` and includes a required name field.
- CareerApplicationPage defaults to `/api/applications` and sends the resume
  and optional portfolio with the applicant details and consent.
- SMTP secrets live in the private root `.env`, excluded from Git and static output.
- SMTP must be configured before submissions can be accepted. Missing settings
  return an unavailable response and preserve the user's form.
- HTTP success alone is insufficient: the frontend requires JSON `ok: true`.
- Setting a component's `submitUrl` to an empty string explicitly enables
  a design preview. The normal generated site uses the live API routes.

`ICARUS_CONTACT_FORM_URL` may override the contact endpoint at build time,
but the endpoint must implement this backend's response and request contract.
Static GitHub Pages alone cannot run the backend.
