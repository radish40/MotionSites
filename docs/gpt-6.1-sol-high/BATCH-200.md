# 前 200 项阶段交付

本轮范围为清单第 1–200 项，每个设计选择一个主提示词，使用 GPT-6.1 Sol High 独立会话生成可运行网页。

- 成果索引：https://tool.luo-xd.com/motionsites-results/
- 源码仓库：https://github.com/radish40/MotionSites/tree/main/generated/gpt-6.1-sol-high
- 清单：manifest.json、inventory.csv、inventory.md。
- 全量核验：audits/200-completed.json，覆盖原提示词快照、实际模型/推理配置、独立会话、远端源码提交、线上 HTML、桌面和手机截图、群聊逐项回执，以及项目需要的服务端运行状态。
- 额外着色器实测：audits/nimbus-grid-embed.json。

按用户要求在第 200 项交付并验证后暂停。第 201–380 项共 180 项保持未开始；恢复时从第 201 项继续，不重建已有设计会话。生成队列与每 30 分钟的进度汇报停止；已发布网页和所需生产服务继续运行。

外链失效的素材、恢复方法和近似之处记录在各项目 README.md / result.json 中。Layered Depth、Mythic Naturecore、Neo Museum 的素材恢复另有验收记录。页面交互为真实代码实现，素材恢复的近似不等同于恢复原始视频。手机检查使用 Chromium 视口与触控模拟，未覆盖所有实体手机浏览器。

恢复执行前，需按用户新指示调整 `scripts/generation/dispatch.py` 的 `BATCH_STOP_NUMBER` 与 manifest 的 `current_batch` 范围，再启用队列和进度定时器。当前两者均已停止并禁用，硬上限仍为 200。
