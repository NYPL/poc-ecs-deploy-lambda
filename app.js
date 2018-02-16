'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()

const AWS = require('aws-sdk')

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

app.post('/api/v0.1/private/ecs-deploy', (req, res) => {
  console.log('REQUEST RECEIVED')
  console.log(req.body)

  let ecs = new AWS.ECS({
    region: 'us-east-1',
    accessKeyId: process.env.ECS_DEPLOYER_ACCESS_KEY,
    secretAccessKey: process.env.ECS_DEPLOYER_SECRET
  })

  let params = {
    cluster: req.body.repository.name,
    service: req.body.repository.name,
    forceNewDeployment: true
  }

  ecs.updateService(params, function (err, data) {
    if (err) {
      console.log('SERVICE UPDATE FAILED')
      console.log(err)

      return res.status(400).json(err)
    }
    else {
      console.log('SERVICE UPDATE SUCCEEDED')
      console.log(data)

      return res.json(data)
    }
  })
})

// Export your express server so you can import it in the lambda function.
module.exports = app
