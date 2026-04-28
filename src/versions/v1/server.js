const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`v1 server running on ${port}`));
