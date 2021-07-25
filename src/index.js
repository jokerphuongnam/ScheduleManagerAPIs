import Express from 'express'
import Morgan from 'morgan'
import helmet from 'helmet'
import rotatingFileStream from 'rotating-file-stream'
import Cors from 'cors'
import path from 'path'
import Multer from 'multer'
import userRouter from './router/UserRouterAPIs'
import scheduleRouter from './router/ScheduleRouterAPIs'

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
app.use(Express.urlencoded({
    extended: false
}))
app.use(Express.json({
    extended: false
}))
app.use(Express.static('/'))
app.use(Multer().array())

// collect route direction
app.use('/user', userRouter)
app.use('/schedule', scheduleRouter)


app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})