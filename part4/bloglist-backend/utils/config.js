const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../../../atlas-credentials.env'), quiet: true })
dotenv.config({ quiet: true })

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI
const isTestRun = process.env.NODE_ENV === 'test'
const DATABASE_NAME = isTestRun ? 'bloglist_test' : undefined
const SECRET = process.env.SECRET

module.exports = { MONGODB_URI, PORT, DATABASE_NAME, SECRET }
