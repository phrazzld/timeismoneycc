#!/bin/bash

BRANCH_NAME=$(git symbolic-ref --short HEAD)
VALID_BRANCH_REGEX="^(feature|feat|bugfix|docs|refactor|test|chore|ci|build|perf)\/(dev-workflow-quality|[a-z0-9-]+)$"

if [[ ! $BRANCH_NAME =~ $VALID_BRANCH_REGEX ]]; then
  echo "ERROR: Branch name '$BRANCH_NAME' doesn't match the required pattern."
  echo "Branch names must follow the pattern: <type>/<description>"
  echo "where <type> is one of: feature, feat, bugfix, docs, refactor, test, chore, ci, build, perf"
  echo "and <description> uses lowercase letters, numbers, and hyphens."
  echo "Examples:"
  echo "  feature/add-login-page"
  echo "  bugfix/fix-memory-leak"
  echo "  docs/update-readme"
  exit 1
fi

echo "Branch name '$BRANCH_NAME' is valid."
exit 0
