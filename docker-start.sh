#! /bin/bash
echo "Migrate database..."
yarn entity:migration
echo "Starting node..."
node dist/app.js