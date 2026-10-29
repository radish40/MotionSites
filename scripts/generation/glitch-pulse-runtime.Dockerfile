FROM louislam/uptime-kuma:2
WORKDIR /app/project
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY server.ts tsconfig.json ./
COPY dist ./dist
RUN mkdir -p public
ENV NODE_ENV=production
USER 1000:1000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:3000/motionsites-results/glitch-pulse/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["node"]
CMD ["--import", "tsx", "server.ts"]
