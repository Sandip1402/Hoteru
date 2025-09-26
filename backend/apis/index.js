const fs = require("fs");
const path = require("path");


// to connect all apis with express app at once, no need to connect each api individually
module.exports = function registerApis(app) {
    // read all files in /apis folder
  const Files = fs.readdirSync(__dirname);  

  Files.forEach(file => {
    // skiping itself
    if (file === "index.js") return;

    // loading each file
    const apiModule = require(path.join(__dirname, file));

    // calling the exported function and providing express app
    apiModule(app);
  });
};
