const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
import Router from 'koa-router'
const router = new Router({
  prefix: '/blog'
})
router.get('/list', async (ctx) => {
  ctx.body = {
    list: ['北京', '上海', '菏泽']
  }
})
// export default router

const app = new Koa()

app.use(router.routes()).use(router.allowedMethods())
  //引入定义的接口
// import listInterface from './interface/main'
const blog_api =  require('./interface/main')



// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  // app.use(router.routes());
  // app.use(router.allowedMethods())

  app.use(router.routes()).use(router.allowedMethods())



// app.use(listInterface.routes()).use(listInterface.allowedMethods())
}

start()
