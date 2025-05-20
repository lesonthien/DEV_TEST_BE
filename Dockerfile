
# Base image
FROM node:18-alpine  as development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

RUN yarn config set "strict-ssl" false -g

# RUN yarn cache clean --force

# Install app dependencies
RUN yarn install --frozen-lockfile --only=development

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine  as build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Creates a "dist" folder with the production build
RUN yarn build 

ENV NODE_ENV production

RUN yarn config set "strict-ssl" false -g

RUN yarn install --only=production && yarn cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine  as production

WORKDIR /app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

COPY --chown=node:node docker-start.sh ./
COPY --chown=node:node package.json ./
COPY --chown=node:node bin ./bin


# Start the server using the production build
CMD ["/bin/sh", "/app/docker-start.sh"]