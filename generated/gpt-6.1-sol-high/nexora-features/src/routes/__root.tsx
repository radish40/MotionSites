import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Nexora Features' },
      { name: 'description', content: 'Curiosity-led tools for truth-seeking minds. Ask with confidence. Powered by AI.' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }, { rel: 'icon', href: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%228%22 fill=%22%23252B4C%22/%3E%3Ctext x=%228%22 y=%2224%22 fill=%22white%22 font-size=%2223%22 font-family=%22Arial%22%3EN%3C/text%3E%3C/svg%3E' }],
  }),
  component: () => (
    <html lang="en">
      <head><HeadContent /></head>
      <body><Outlet /><Scripts /></body>
    </html>
  ),
})
