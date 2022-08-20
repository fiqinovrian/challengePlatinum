const hello = (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Hello World',
    });
};

module.exports = {
    hello,
}