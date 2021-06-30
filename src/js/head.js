Z({
  id: "head",
  render: function() {
    document.getElementById(this.id).outerHTML = `
      <meta charset="utf-8" >
      <meta name="viewport" content="width=device-width, initial-scale=1" >
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" >
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" >
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" >
      <link rel="manifest" href="/site.webmanifest" >
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1d92d6" >
      <meta name="apple-mobile-web-app-title" content="Zed.js" >
      <meta name="application-name" content="Zed.js" >
      <meta name="msapplication-TileColor" content="#1d92d6" >
      <meta name="theme-color" content="#ffffff" >
      <meta
        name="google-site-verification"
        content="JiN9sTM6v_GuVjlwx5up078oFwAyh7A-q8r28slL93g"
      >
      <meta
        name="description"
        content="Zed.js is a templateless micro frontend framework. It handles the rendering, updating and state management of your html components in only 567 bytes"
      >
    `;
  }
});

Z.head.render();
