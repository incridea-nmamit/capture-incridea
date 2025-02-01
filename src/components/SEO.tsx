import Head from 'next/head'

function SEO() {
    const title = '	Capture Incridea';
    const description = 'Get your event photos and story-worthy moments. Experience them the same day!';
    const baseUrl =process.env.BASE_URL
    console.log("base url : ",baseUrl)

    return (
        <Head>

            {/* <!-- Global Metadata --> */}
            {/* <meta charset="utf-8" /> */}
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <link rel="icon" type="image/webp" href={new URL("/images/Logo/i.webp",baseUrl).href} />

            {/* <!-- Font preloads --> */}
            {/*<link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin />
            <link rel="preload" href="/fonts/atkinson-bold.woff" as="font" type="font/woff" crossorigin />*/}

            {/* <!-- Canonical URL --> */}
            {/* <link rel="canonical" href={canonicalURL} /> */}

            {/* <!-- Primary Meta Tags --> */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />

            {/* <!-- Open Graph  --> */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:url" content={baseUrl} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={new URL("/images/Logo/i.webp", baseUrl).href} />
            <meta property="og:logo" content={new URL("/images/Logo/i.webp", baseUrl).href} />

            {/* <!-- Twitter --> */}
            <meta name="twitter:card" content={description} />
            <meta property="twitter:domain" content={baseUrl} />
            <meta property="twitter:url" content={baseUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={new URL("/images/Logo/i.webp", baseUrl).href} />
        </Head>
    )
}

export default SEO;