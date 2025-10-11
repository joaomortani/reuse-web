module.exports = {
    flowFile: "flows.json",
    adminAuth: {
      type: "credentials",
      users: [{ username: process.env.NR_ADMIN_USER, password: process.env.NR_ADMIN_HASH, permissions: "*" }]
    },
    contextStorage: { default: { module: "localfilesystem" } }
  };