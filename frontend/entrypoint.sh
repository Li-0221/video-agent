#!/bin/sh
CONFIG_FILE="${CONFIG_FILE:-/usr/share/nginx/html/env-config.js}"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR: $CONFIG_FILE does not exist, cannot determine required env vars."
  echo "Deployment blocked: please include env-config file in image."
  exit 1
fi

required_vars=$(grep -oE 'VITE_[A-Z0-9_]+' "$CONFIG_FILE" | sort -u)

missing_vars=""
for key in $required_vars; do
  value=$(printenv "$key")
  if [ -z "$value" ]; then
    missing_vars="$missing_vars $key"
  fi
done

if [ -n "$missing_vars" ]; then
  echo "ERROR: Missing required environment variables:$missing_vars"
  echo "Deployment blocked: please configure all required variables before releasing."
  exit 1
fi

echo "" >> "$CONFIG_FILE"

env | grep -E "^VITE_" | while read -r line; do
  key=${line%%=*}
  value=${line#*=}

  # 转义双引号、反斜杠和换行符
  value=$(echo "$value" | sed 's/\\/\\\\/g; s/"/\\"/g; s/'"'"'/\\'"'"'/g; s/\n/\\n/g; s/\r/\\r/g; s/\t/\\t/g')

  echo "window.__ENV__['$key'] = \"$value\";" >> "$CONFIG_FILE"
done

exec "$@"
