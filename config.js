// centralize all configuration for the server

module.exports = {
    'secretKey': process.env.SECRET_KEY,
    'mongoUrl': process.env.MONGO_URL
}