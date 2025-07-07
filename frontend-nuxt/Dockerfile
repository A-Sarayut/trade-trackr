# # Use the official Bun image
# FROM oven/bun:1.2

# # Set working directory
# WORKDIR /frontend-nuxt

# # Copy dependencies first
# COPY package.json ./

# # Install dependencies using Bun
# RUN bun install

# # Copy the rest of the project
# COPY . .

# # Expose Nuxt dev server port
# EXPOSE 3000

# # Start Nuxt in development mode
# CMD ["bun", "run", "dev", "--hostname", "0.0.0.0", "--port", "3000"]


# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json ./

# use ignore-scripts to avoid builting node modules like better-sqlite3
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the entire project
COPY . .

RUN bun --bun run build

# copy production dependencies and source code into final image
FROM oven/bun:1 AS production
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output /app

# run the app
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "--bun", "run", "/app/server/index.mjs" ]
