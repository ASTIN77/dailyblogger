module.exports = {
  apps: [{
    name: "dailyblogger",
    cwd: "/var/www/dailyblogger",
    script: "npm",
    args: "start",
    env_file: ".env",
    env: { NODE_ENV: "production", PORT: "3003" }
  }]
}
