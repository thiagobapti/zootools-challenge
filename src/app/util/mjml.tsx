import mjml2html from "mjml-browser";

export function mjmlToHTML(mjml: string) {
  const { html } = mjml2html(mjml);

  return html;
}
