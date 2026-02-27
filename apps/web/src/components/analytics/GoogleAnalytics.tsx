'use client';
import Script from 'next/script';

export default function GoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId || process.env.NODE_ENV !== 'production') return null;
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
            </Script>
        </>
    );
}

// Analytics event helper
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
    }
};
