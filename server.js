const app = require("./app");
const config = require("./app/config");
const mongoose = require("mongoose");

mongoose.connect(config.db.uri)
    .then(() => {
        console.log("Conected to the database!");
    })
    .catch((error) => {
        console.log("Cannot connect to the database!", error);
        process.exit();
    });
    
const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});