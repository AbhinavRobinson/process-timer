/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const { RtcTokenBuilder, RtcRole } = require('agora-access-token')

const AWS = require('aws-sdk')

// Agora App Id
const appID = 'cbc3098a370649a09784656a887ffd96'

// DynamoDB Client
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' })
const TableName = 'channel-staging'

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (_, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	next()
})

app.get('/agora/appId', function (_, res) {
	// Add your code here
	res.json({ appID })
})

const params = {
	TableName,
	Key: {
		channelID: 1,
	},
}

const getChannelData = async () => {
	try {
		const data = await docClient.get(params).promise()
		return data.Item
	} catch (e) {
		return e
	}
}

const increaseChannelCount = async (channelName, count) => {
	await docClient
		.put({
			TableName,
			Item: {
				channelID: 1,
				channelName,
				channelCount: count + 1,
			},
		})
		.promise()
}

const updateChannelName = async (channelName) => {
	const newName = (parseInt(channelName) + 1).toString()
	try {
		await docClient
			.put({
				TableName,
				Item: {
					channelID: 1,
					channelName: newName,
					channelCount: 0,
				},
			})
			.promise()
	} catch (e) {
		throw e
	}
	return newName
}

app.post('/agora/token', async (_, res) => {
	const appCertificate = '362e61ca49f64a258718fc595cd98a19'

	let channelName
	let err
	//Getting the number of people in the current channel
	const currentChannelData = await getChannelData().catch((e) => ({ failed: true, err: e.toString() }))

	if (currentChannelData == null || currentChannelData.failed) res.json({ failed: 'querying db failed', reason: currentChannelData.err })

	if (currentChannelData.channelCount < 2) {
		channelName = currentChannelData.channelName
		await increaseChannelCount(currentChannelData.channelName, currentChannelData.channelCount).catch(() => {
			err = 'error increasing channel count'
		})
	} else {
		channelName = await updateChannelName(currentChannelData.channelName).catch((e) => {
			err = e.toString() + ' channelUpdate'
		})
	}

	if (err) res.json({ currentChannelData, failed: 'failed db ops', reason: err })

	const uid = 0 // This is set to 0 since the user is not being tracked and anyone can join
	// const account = '2882341273'
	const role = RtcRole.PUBLISHER

	const expirationTimeInSeconds = 3600

	const currentTimestamp = Math.floor(Date.now() / 1000)

	const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

	// IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

	// Build token with uid
	const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs)

	res.json({ sucess: 'Token Generated Successfully', token, channel: channelName, appID })

	// Build token with user account
	//	const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs)
	//	console.log('Token With UserAccount: ' + tokenB)
	//	res.json({ success: 'post call succeed!', url: req.url })
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
