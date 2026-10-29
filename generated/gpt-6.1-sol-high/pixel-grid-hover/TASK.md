# 单项目生成任务：Pixel Grid Hover

只处理这个设计。先完整读取同目录 PROMPT.md，然后依照原文构建网页。不要读取其他项目或其他提示词，不创建子代理或其他会话，不推送、不部署、不发群消息。所有产物只写入本目录：/home/opc/motionsites/generated/gpt-6.1-sol-high/pixel-grid-hover。

项目索引名称必须保留为 Pixel Grid Hover，设计 ID 为 pixel-grid-hover。网页内标题与品牌按提示词要求。模型要求 gpt-6.1-sol，推理强度 high。使用原提示词要求的技术栈、文案、素材、字体、动画和交互，完整实现，不能用原预览截图充当页面。

本设计自己的原始视觉参考为 `/home/opc/motionsites/assets/previews/pixel-grid-hover.webp`（仅在文件存在时读取；WebP 可能包含动画多帧）。可用它对照构图、素材和动画，仍然禁止读取其他设计。若指定素材失效，尽力恢复原文件；确实无法恢复时，可从本设计参考中提取独立素材并重建必要动画，保留真实 DOM 布局、文字和控件。不要使用带页面文字、按钮的整页截图或整段参考视频充当网页。提取素材须隔离对应元素，记录来源、恢复方法、近似部分和验证限制；恢复代码及素材仅写入本项目。

发布路径 /motionsites-results/pixel-grid-hover/，所有资源应适应此子路径。源码及配置放在本目录，构建后的可发布静态文件放在 dist/，dist/index.html 必须存在；原生 HTML 项目同样复制完整运行文件到 dist/。不要提交 node_modules。保存依赖锁文件。

主机没有 Node/npm/git，可用现有 Docker 镜像 louislam/uptime-kuma:2（含 Node22/npm、Chromium、/app/node_modules/playwright-core）。例如：
```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v /home/opc/motionsites/generated/gpt-6.1-sol-high/pixel-grid-hover:/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```
Vite 应配置 base: '/motionsites-results/pixel-grid-hover/'。若必须查询文档遵守你的浏览规则。不要修改主机系统、Nginx、共享目录和其他项目。不需要给原提示词另加功能。

必须真实构建并做浏览器检查。可在临时 Docker 内起 HTTP 服务，使用现有 playwright-core + Chromium，检查桌面1440x1000、手机390x844、主要交互、脚本错误和布局溢出。截图保存 screenshots/desktop.png 与 screenshots/mobile.png。字体/素材外链失效须记录并尽力处理，不虚构成功。

完成后写 README.md（本项目说明/运行/验证/限制）、result.json，包含 title,id,status(ready 或 blocked),build_command,checks,asset_issues,notes。ready 表示可交付管理会话验收，不代表已上线。只处理这个项目直到完成。
