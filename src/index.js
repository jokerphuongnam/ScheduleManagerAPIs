const Express  = require('express')
const Morgan = require('morgan')
const helmet = require('helmet')
const rotatingFileStream = require('rotating-file-stream')
const Cors = require('cors')
const path = require('path')
const userRouter = require('./router/UserRouterAPIs')
const scheduleRouter = require('./router/ScheduleRouterAPIs')
const bodyParser = require('body-parser')

const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 4000
const app = Express()

// set up lib
app.use(helmet())
const accessLogStream = rotatingFileStream.createStream('access.log', {
    interval: '1d',
    path: path.join('log')
})
app.use(isProduction ? Morgan('combined', {
    stream: accessLogStream
}) : Morgan('dev'))
app.use(Cors())

app.use(Express.json())
app.use(Express.urlencoded({ extended: false }))
app.use(Express.static(path.join(__dirname, 'public')))

// su dung bo phan giai application/json
app.use(bodyParser.json());

// su dung bo phan giai application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))
//form-urlencoded
app.use(Express.static('/'))

app.use('/user', userRouter)
app.use('/schedule', scheduleRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})