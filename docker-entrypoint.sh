#!/bin/sh
set -e

echo "Starting Movie Management App..."
echo "API_URL: ${API_URL}"

cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
  VITE_API_URL: "${API_URL}"
};
EOF

echo "Generated runtime config:"
cat /usr/share/nginx/html/config.js

if ! grep -q "config.js" /usr/share/nginx/html/index.html; then
    echo "Adding config.js to index.html..."
    sed -i 's|</head>|  <script src="/config.js"></script>\n  </head>|' /usr/share/nginx/html/index.html
fi

echo "Configuration applied successfully!"
echo "App will be available on port 3000"

exec "$@"