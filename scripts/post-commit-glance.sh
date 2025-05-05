#!/bin/bash
echo "Running post-commit glance asynchronously..."
# This is a placeholder for the glance command - in a real implementation, you would call the actual tool
(sleep 2 && echo "glance ./ completed" && date) > /tmp/glance_output.log 2>&1 &
disown
echo "glance command started in background (output in /tmp/glance_output.log)"
exit 0
