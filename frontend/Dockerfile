# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./

COPY packages/axios/package.json ./packages/axios/
COPY packages/color/package.json ./packages/color/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/materials/package.json ./packages/materials/
COPY packages/scripts/package.json ./packages/scripts/
COPY packages/uno-preset/package.json ./packages/uno-preset/
COPY packages/utils/package.json ./packages/utils/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY src/ ./src/
COPY build/ ./build/
COPY public/ ./public/
COPY tsconfig.json vite.config.ts uno.config.ts eslint.config.js index.html .env ./

RUN pnpm build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh

RUN apk add --no-cache curl && chmod +x /entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -fs -o /dev/null http://localhost:3000/ || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]