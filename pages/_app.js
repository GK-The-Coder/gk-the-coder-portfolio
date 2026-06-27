import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/profile.svg" />
        <link rel="apple-touch-icon" href="/profile.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
