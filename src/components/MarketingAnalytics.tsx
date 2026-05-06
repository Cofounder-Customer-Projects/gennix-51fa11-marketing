import Script from "next/script";

const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

function normalizeGoogleTagManagerId(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  return /^GTM-[A-Z0-9_-]+$/iu.test(trimmed) ? trimmed : null;
}

function normalizeMetaPixelId(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  return /^[0-9]{5,32}$/u.test(trimmed) ? trimmed : null;
}

function buildGoogleTagManagerScript(containerId: string): string {
  return `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(containerId)});`;
}

function buildMetaPixelScript(pixelId: string): string {
  return `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(pixelId)});
fbq('track', 'PageView');`;
}

export function MarketingAnalytics() {
  const googleTagManagerId = normalizeGoogleTagManagerId(GOOGLE_TAG_MANAGER_ID);
  const metaPixelId = normalizeMetaPixelId(META_PIXEL_ID);

  if (!googleTagManagerId && !metaPixelId) {
    return null;
  }

  return (
    <>
      {googleTagManagerId ? (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {buildGoogleTagManagerScript(googleTagManagerId)}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(
                googleTagManagerId,
              )}`}
              height="0"
              width="0"
              title="Google Tag Manager"
              className="hidden invisible"
            />
          </noscript>
        </>
      ) : null}
      {metaPixelId ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {buildMetaPixelScript(metaPixelId)}
          </Script>
          <noscript>
            {/* eslint-disable @next/next/no-img-element -- Meta's noscript fallback must be a plain tracking pixel. */}
            {/* biome-ignore lint/performance/noImgElement: Meta's noscript fallback must be a plain tracking pixel. */}
            <img
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(
                metaPixelId,
              )}&ev=PageView&noscript=1`}
              height="1"
              width="1"
              alt=""
              className="hidden"
            />
            {/* eslint-enable @next/next/no-img-element */}
          </noscript>
        </>
      ) : null}
    </>
  );
}
