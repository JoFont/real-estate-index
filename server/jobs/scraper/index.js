const services = require("./services/services");

const postServiceResults = data => {
	// Save data
	console.log("Data in callback", data);
};

Promise.all([
	services.olx.fetch(postServiceResults)
	// services.imovirtual.fetch(serviceLoadedCallback)
]).then(results => {
	console.log(results);
});
