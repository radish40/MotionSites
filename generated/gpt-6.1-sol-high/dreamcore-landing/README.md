# Dreamcore Landing

React + TypeScript + Vite 单页，页面标题为 **Step Into Wonder**。所有组件、场景、内联样式和动画逻辑均位于 `src/App.tsx`；Tailwind 仅承担响应式布局，xl 为 1100px。包含 480vh 双幕视差、开场帷幕、鼠标惯性移动、滚动弧形卡片，以及桌面/平板/手机三个布局。

## 运行和构建

本项目发布基址固定为 `/motionsites-results/dreamcore-landing/`。

```bash
npm ci
npm run dev
npm run build
npm run preview
```

无 Node 的主机可使用现有 Docker 镜像：

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

构建产物在 `dist/`。没有推送或部署；依赖锁文件为 `package-lock.json`，`node_modules` 不应提交。

## 浏览器验证

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

脚本用镜像现有 Chromium 和 playwright-core 启动真实生产预览，检查 1440×1000、390×844、834×1000：标题、字体、图片加载、水平溢出、导航跳转、返回顶部、View Reel、Descend、多个滚动阶段的视差及弧形卡片变换。输出为 `browser-checks.json`，桌面和手机首幕及第二幕截图在 `screenshots/`。检查会断言图片（包括卡片 CSS 背景图）均成功解码、九张弧形卡片存在、无水平溢出、无脚本异常、无控制台错误和无网络失败。额外检查所有运行时图片请求均为本站地址。

## 素材替代与原图差异

本次修复依照授权，将现有降级素材转为默认的本地资源。五张指定 Cloudinary 原图此前均返回 HTTP 401，响应为 `cloud_name dy5er7kv5 is disabled`。默认页面已完全移除这些请求，不再先请求失败再切换，也不会在账户恢复后自动切换设计。

| 图层 | 当前实现 | 与原图的差异 |
| --- | --- | --- |
| 世界 | `public/assets/dream-1.webp` | 提示词原卡片 1 的山水拱门图，替代无法取得的世界背景 |
| 门框 | `public/assets/dream-3.webp` 加椭圆透明遮罩 | 提示词原卡片 3 的柱廊图，代替原透明门框；构图和开口形状有差异 |
| 左右帷幕 | 内联 CSS 渐变、透明遮罩 | 代码绘制的紫色布褶，不是原帷幕纹理 |
| 云层 | 内联 SVG 椭圆、渐变和高斯模糊 | 代码绘制的柔和云团，不是原云层轮廓 |
| 三张卡片 | 本地 `dream-1.webp`、`dream-2.webp`、`dream-3.webp` | 内容来自提示词指定的三个 Higgs 地址，原样下载 |

这些本地图片是独立场景素材，并非页面预览截图。两幕、帷幕开场、鼠标视差、滚动缩放/淡出、九张弧形卡片及所有已有交互均保留。当前页面是经授权的素材替代版本，**不代表恢复原始像素或通过原图视觉一致性验收**。图片来源、文件大小和 SHA-256 校验值保存在 `asset-sources.json`，部署只需 `dist/`，图片不再依赖远程图床。

原始失效地址存档（仅作说明，运行时不请求）：

- `https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779707217/image_1_vdzwae.png`
- `https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706559/curtain_left_znkmva.png`
- `https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706564/curtain_right_paeyym.png`
- `https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706392/image_2_gkcdlx.png`
- `https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706555/bottom_clouds_xskut6.png`

Google Fonts 的 Viaoda Libre / Imprima 仍按原要求通过 Google Fonts 链接加载，检查时成功；字体为当前唯一远程素材依赖。

提示词没有提供视频、独立导航页面或联系地址，因此 View Reel、Descend 和导航保留原有的沉浸滚动行为；弧形卡片由页面滚动控制。
