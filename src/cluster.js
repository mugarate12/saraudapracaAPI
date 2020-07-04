const cluster = require('cluster')
const { cpus } = require('os')

if (cluster.isMaster) {
  cpus.forEach(() => cluster.fork())

  cluster.on('exit', (worker) => {
    cluster.fork()
  })
} else {
  require('./server')
}
