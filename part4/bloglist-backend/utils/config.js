const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../../../atlas-credentials.env'), quiet: true })
dotenv.config({ quiet: true })

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

module.exports = { MONGODB_URI, PORT }
