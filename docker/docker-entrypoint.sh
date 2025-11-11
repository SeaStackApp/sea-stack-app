#!/bin/sh
set -e

# Prepare /etc/seastack recursively so the app can create subfolders at runtime.
SEASTACK_DIR=${SEASTACK_DIR:-/etc/seastack}

# Create directory if missing (recursively)
mkdir -p "$SEASTACK_DIR"

# Ensure ownership and secure recursive permissions.
# - chown may change ownership of a bind mount (host-side). This typically works when running as root.
# - Directories: setgid (2) + rwx for user/group (770) so new subdirs inherit group and are writable.
# - Files: 660 for user/group, no others.
chown -R nextjs:nextjs "$SEASTACK_DIR" || true
find "$SEASTACK_DIR" -type d -exec chmod 2770 {} + || true
find "$SEASTACK_DIR" -type f -exec chmod 0660 {} + || true

# Default working directory is set by Dockerfile. Run migrations then start the app as user `nextjs`.
# If PRISMA_SCHEMA_PATH is not set, Prisma will use the default schema location.

# Allow overriding the command by passing args to `docker run`.
if [ "$#" -eq 0 ]; then
  set -- node server.js
fi

# Run migrations and then exec the provided command as nextjs

run_as_nextjs() {
  if command -v runuser >/dev/null 2>&1; then
    runuser -u nextjs -- sh -lc 'prisma migrate deploy ${PRISMA_SCHEMA_PATH:+--schema "$PRISMA_SCHEMA_PATH"} && exec "$@"' sh "$@"
  elif command -v su >/dev/null 2>&1; then
        su -s /bin/sh -c 'prisma migrate deploy ${PRISMA_SCHEMA_PATH:+--schema "$PRISMA_SCHEMA_PATH"} && exec "$@"' nextjs sh "$@"
  else
    echo "No runuser/su available to drop privileges to nextjs" >&2
    exit 1
  fi
}

run_as_nextjs "$@"
