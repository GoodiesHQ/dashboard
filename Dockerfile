FROM node:20-alpine AS build

# Determines if the image is built with the 300mb+ JSON icon library
ARG DASHBOARD_INSTALL_ICONS=0
ENV DASHBOARD_INSTALL_ICONS=${DASHBOARD_INSTALL_ICONS}

# Set up app directory
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY scripts ./scripts

# Install all dependencies
RUN npm install

# Copy all source files needed
RUN mv package.json package-prod.json
RUN mv package-lock.json package-lock-prod.json
COPY . ./
RUN mv package-prod.json package.json
RUN mv package-lock-prod.json package-lock.json
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/build/ ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/scripts ./scripts
ENV DASHBOARD_SKIP_POSTINSTALL=1
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "/app/build/index.js"]