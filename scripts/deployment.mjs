// The site is hosted at an origin's root. Explicit URLs override Vercel's
// automatic domain; preview deployments always remain excluded from indexing.
export function deploymentSettings(env = process.env) {
  const noindex = Boolean(env.VERCEL_ENV && env.VERCEL_ENV !== 'production');
  const automatic = env.VERCEL_ENV === 'production'
    ? env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
    : env.VERCEL_URL;
  const candidate = env.PORTFOLIO_SITE_URL || (automatic ? `https://${automatic}` : '');
  if (!candidate) return {siteURL: '', noindex};
  let url;
  try { url = new URL(candidate); } catch { throw Error('Invalid portfolio site URL'); }
  if (url.protocol !== 'https:' || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw Error('Portfolio site URL must be an HTTPS origin without credentials, a subpath, query or fragment');
  }
  return {siteURL: url.origin + '/', noindex};
}

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function deploymentDocument(html, relative, {siteURL, noindex}) {
  let metadata = noindex ? '<meta name="robots" content="noindex, nofollow">' : '';
  if (siteURL) {
    const canonical = new URL(relative === 'index.html' ? '' : relative, siteURL).href;
    metadata += `<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">`;
    html = html.replace('content="public/social-preview.png"', `content="${escape(new URL('public/social-preview.png', siteURL).href)}"`);
    html = html.replace(/(<link rel="alternate"[^>]*href=")([^"]+)(")/g,
      (_, before, href, after) => before + escape(new URL(href === 'index.html' ? '' : href, siteURL).href) + after);
  }
  return html.replace('</head>', metadata + '</head>');
}
