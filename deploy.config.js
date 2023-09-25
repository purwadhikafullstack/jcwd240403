module.exports = {
  apps: [
    {
      name: "JCWD-2404-03", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3403,
      },
      time: true,
    },
  ],
};
