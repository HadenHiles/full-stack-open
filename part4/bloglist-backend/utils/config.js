const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../../../atlas-credentials.env'), quiet: true })
dotenv.config({ quiet: true })

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI
const DATABASE_NAME = process.env.NODE_ENV === 'test' ? 'bloglist_test' : undefined

module.exports = { MONGODB_URI, PORT, DATABASE_NAME }
