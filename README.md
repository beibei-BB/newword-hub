# 新词主站模板

静态 Astro 站点，工具组件的交互脚本单独加载。使用 Node.js 24（或 Astro 支持的 Node.js 22.23.4 及以上版本）和 npm：

```sh
npm ci
npm run dev
npm run build
npm run check
```

`npm run check` 检查已构建的 `dist`，修改后先重新 build。它检查每页 H1、title / description 长度与重复、站内资源和链接、图片 alt、必备页面、viewport，以及生成的网址和站名是否包含配置的商标黑名单。外部链接不在检查范围内。

## 新增工具

```sh
npm run new-tool demo-two
```

命令生成 `src/content/tools/demo-two.md`（文案、日期、步骤、FAQ、优先推荐的相关 slug 和可选声明）和 `src/tools/demo-two/index.astro`（工具空壳）。填写文案并实现工具；日期决定首页排序，相关工具自动包含其他工具，`related` 中的 slug 会排在前面。首页、工具路由和 sitemap 自动发现新词。上线前重新构建并运行检查，也要实际测试功能和手机显示。不要把未完成的空壳当成可上线工具。

## 上线设置

在 `src/site.config.ts` 填站名、正式域名（仅 origin，如 `https://example.com`）、联系邮箱、主色、Cloudflare Web Analytics token、广告开关、可信广告代码和商标黑名单。正式域名为空时所有 HTML 页面加 noindex，sitemap 为空且 robots 不声明 sitemap；填写后生成对应 canonical、OG URL 和 sitemap。部署到 Cloudflare Pages 时使用 `npm run build`，输出目录 `dist`，Node 版本设为 24。将域名和邮箱替换成真实值，并根据实际统计、广告和数据处理方式更新隐私政策后再上线；广告代码是直接插入页面的 HTML，只填写可信服务商提供的代码。
