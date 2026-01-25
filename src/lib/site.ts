export const site = {
  name: "みやび",
  title: "Nomad Web Developer",
  description: "ノマドでWebサイト制作/開発をしています。",
  intro: [
  "こんにちは、みやびです。世界中を飛び回りながら働くノマドワーカーです。",
  "気づけばどっぷりハマってしまった、プログラミングとWebの世界。最初は興味本位だったのに、作れば作るほど面白くて、今でもずっと楽しいまま続いています。",
  "今はWebサイト制作やWeb開発を軸に、企画から実装まで一通りやっています。WordPressの構築やカスタマイズもよく触ります。",
  "生活はわりとシンプルで、毎朝ジムに行って、カフェで作業するのが日課です。注文はだいたいEspresso。場所が変わっても、このルーティンだけは変わりません。",
],
  ui: {
    showHeader: false, // ← ここ！ヘッダー（上のナビ）を消す
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects", enabled: false },
    { href: "/showcase", label: "Showcase" },
    { href: "/playroom", label: "Playroom" },
    { href: "/contact", label: "Contact" },
  ],
  home: {
    showFeaturedProjects: false,
  },
  links: [
    { label: "Playroom", url: "/playroom" },
    { label: "Contact", url: "/contact" },
    { label: "X", url: "https://x.com/miyabi_1998_" },
  ],
} as const;
