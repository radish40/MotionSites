# 工具站发布

维护入口为本仓库。在线路由保持 `/motionsites-preview/`。纯静态文件，无后端数据库。

```bash
python3 scripts/unified/build.py
python3 scripts/unified/verify-data.py
mkdir -p .work/package
ln -sfn ../../dist .work/package/motionsites-preview
tar -chzf .work/motionsites-addon.tar.gz -C .work/package motionsites-preview
sudo /opt/private-toolbox/publish.sh --motionsites-preview-addon "$PWD/.work/motionsites-addon.tar.gz"
```

此命令仅适用于已经安装统一发布器的工具服务器。发布器保留其他路由及首页文件，原子切换版本。既有 Nginx 路由允许同源图片、字体、视频和 JSON；无需开放第三方脚本或内联脚本。

更新前保留当前版本指针和发布包。部署浏览器检查可在 `scripts/unified/check.cjs` 的 Docker 命令中增加 `-e LIVE=1`。GitHub Pages 使用相对资源路径，同一份 dist 可放在其他静态站点的子路径下。
