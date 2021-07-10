#!/bin/bash

if [ -z "$npm_package_name" ]; then
  echo "Package name in \`package.json\` is not defined. Run the deploy via \`npm run deploy\`"
  exit 1
fi

if [ -z "$AWS_PROFILE" ]; then
  echo "Profile is not defined. Define it with \`AWS_PROFILE\` environment variable"
  exit 1
fi

if [ -z "$AWS_REGION" ]; then
  echo "Region is not defined. Define it with \`AWS_REGION\` environment variable"
  exit 1
fi

NAME="${NAME:-$npm_package_name}"
PROJECT="serverless-${NAME}"
BUCKET="serverless-packages-${AWS_REGION}"

# make a build directory to store artifacts
rm -rf build
mkdir build

# generate next stage yaml file
aws cloudformation package \
  --template-file template.yaml \
  --output-template-file build/output.yaml \
  --s3-bucket $BUCKET

# the actual deployment step
aws cloudformation deploy \
  --template-file build/output.yaml \
  --stack-name $PROJECT \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides Description="$npm_package_description"  StackDescription="$npm_package_description"
