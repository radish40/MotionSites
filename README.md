# MotionSites 合集

三个开源资料库整理而成的设计提示词画廊。**380 个设计、601 个不同文本版本，327 个设计带本地预览。**

- 在线画廊：https://tool.luo-xd.com/motionsites-preview/
- 维护仓库：https://github.com/radish40/MotionSites
- 支持来源/分类/媒体筛选、全文搜索、同一设计的版本切换、复制与 Markdown 导出。
- 193 个设计默认展示图片，134 个默认展示视频；53 个暂无预览并明确标注。
- 同一设计的其他预览资源也可在详情页选择。

## 直接运行

仓库根目录已包含生成后的静态网站。使用 Python 3.9+：

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080/ 。请通过 HTTP 访问，不要直接双击 HTML，因为数据按需加载。

## 数据来源和去重

| 来源 | 原始输入 |
| --- | --- |
| [zhaosenlin12-creator/MotionSites](https://github.com/zhaosenlin12-creator/MotionSites) | 317 条，画廊界面及主要预览资源 |
| [xianxian-sensen/motionsites-prompts](https://github.com/xianxian-sensen/motionsites-prompts) | 328 条 |
| [TheSatyam-Singh/motionsites.ai](https://github.com/TheSatyam-Singh/motionsites.ai) | 132 个 Markdown 文件 |

776 条有效输入合并为 380 个设计、601 个版本。相同 ID、规范化后的完整标题，或完全相同的完整正文归入同一设计。相同正文仅保留一份并保留所有来源；只忽略首尾空白和 CRLF 差异，不做语义相似删除。不同文本保留为不同版本。

WISA Space 的一个文件只有“没有提示词”的占位说明，未计入有效输入。AI Automation Hero 的一个 `.mp4` 实际是 HLS 清单，未作为可播放 MP4 导入。完整导入记录、正文摘要、归并关系和异常见 [导入报告](docs/merge-report.json)。

源快照及对应上游提交见 [imports/README.md](imports/README.md)。原许可证保留在各快照和 [licenses/](licenses/) 下。预览素材沿用来源仓库的文件，不额外声明其授权范围。

## 重新构建和验证

不依赖某台服务器的绝对路径，不需要重新克隆三个源仓库。

```bash
python3 scripts/unified/build.py
python3 scripts/unified/verify-data.py
python3 -m http.server 8080 --directory dist
```

构建输出到 `dist/`；源数据位于 `imports/`，所有媒体只存一份在 `assets/`。验证脚本逐条检查有效输入的完整正文与来源都保留，并检查版本摘要及媒体文件。

浏览器测试需要 Playwright Core 和 Chromium，可使用：

```bash
docker run --rm \
  -e PLAYWRIGHT_MODULE=/app/node_modules/playwright-core \
  -v "$PWD":/work --entrypoint node louislam/uptime-kuma:2 \
  /work/scripts/unified/check.cjs
```

测试覆盖来源数量、视频播放、版本切换、精确复制导出、无预览设计、全文搜索和桌面/手机布局。截图和临时文件写入忽略的 `qa/`。GitHub Pages 工作流使用构建后的 `dist/`，不发布导入源码和开发文件。

## 后续维护

- 合并逻辑：`scripts/unified/build.py`
- 界面构建：`scripts/unified/ui.py`，以及同目录的 JS/CSS 补丁
- 原画廊模板：`imports/gallery/index.html`、`imports/gallery/ms_script.js`
- 输入快照：`imports/gallery/`、`imports/original/`、`imports/library/`
- 原始媒体与字体：`assets/`
- 更新发布文件：构建验证后执行 `python3 scripts/unified/sync-static.py`，再提交源文件和生成文件。

原 fork 中的其他脚本、示例和旧文档保留作参考；**当前合集的构建入口是 `scripts/unified/build.py`**，不要用旧 `scripts/build.js` 覆盖合并结果。

工具站的发布说明见 [docs/toolbox-deployment.md](docs/toolbox-deployment.md)；UI 选择建议见 [docs/toolbox-ui-options.md](docs/toolbox-ui-options.md)。
