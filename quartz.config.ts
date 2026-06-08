import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "三指灵巧手 · 毕设知识库",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "robosheep46.github.io/orcahand-thesis",
    ignorePatterns: ["private", "templates", ".obsidian", ".claude", ".claudian", "_capture_skill"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "JetBrains Mono",
      },
      colors: {
        // 亮色模式 = Solarized Light（暖纸质）
        lightMode: {
          light: "#fdf6e3",
          lightgray: "#eee8d5",
          gray: "#93a1a1",
          darkgray: "#586e75",
          dark: "#073642",
          secondary: "#268bd2",
          tertiary: "#2aa198",
          highlight: "rgba(38, 139, 210, 0.10)",
          textHighlight: "#b5890066",
        },
        // 暗色模式 = Tokyo Night（冷夜空）
        darkMode: {
          light: "#1a1b26",
          lightgray: "#2f3549",
          gray: "#565f89",
          darkgray: "#a9b1d6",
          dark: "#c0caf5",
          secondary: "#7aa2f7",
          tertiary: "#7dcfff",
          highlight: "rgba(122, 162, 247, 0.12)",
          textHighlight: "#e0af6855",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "solarized-light",
          dark: "tokyo-night",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
