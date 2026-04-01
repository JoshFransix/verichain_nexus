//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  // Disable the lockfile warning by removing redundant package-lock.json
  // We'll use the workspace root package-lock.json instead
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
