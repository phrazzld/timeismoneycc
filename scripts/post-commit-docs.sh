#!/bin/bash
echo "Checking if documentation needs updating..."
# Check if any markdown files were changed in the last commit
if git diff-tree --no-commit-id --name-only -r HEAD | grep -q "\.md$"; then
  echo "Markdown files were changed, documentation might need updating"
  # In a real implementation, you would add code to generate/update documentation
  (sleep 1 && echo "Documentation check completed at $(date)") > /tmp/docs_update.log 2>&1 &
  disown
  echo "Documentation check started in background (output in /tmp/docs_update.log)"
else
  echo "No markdown files changed, skipping documentation check"
fi
exit 0
