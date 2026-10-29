import { ScrollViewStyleReset } from "expo-router/html";
export default function HTML({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5A4C41" />
        <meta
          name="description"
          content="Christ Family Church — discover faith, hope, and a home for your soul. A three-screen mobile design showcase."
        />
        <title>Christ Family Church · Church Community</title>
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
