FROM node:25-alpine3.23@sha256:822f2c66ce3be207a9cc7fc15f7898bbd7093e2141fc060918211f57ac567f26
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
LABEL "repository"="https://github.com/step-security/release-drafter"
LABEL "homepage"="https://github.com/step-security/release-drafter"
LABEL "maintainer"="step-security"
LABEL "com.github.actions.name"="Release Drafter"
LABEL "com.github.actions.description"="Drafts your next release notes as pull requests are merged into master."
LABEL "com.github.actions.icon"="edit-2"
LABEL "com.github.actions.color"="orange"
WORKDIR /app
COPY . .
RUN npm ci
ENTRYPOINT [ "/app/node_modules/.bin/probot" ]
CMD [ "receive", "/app/index.js" ]
