const { Appsignal } = require("@appsignal/nodejs");

new Appsignal({
  active: true,
  name: "My App",
  pushApiKey: "c168c2b3-084f-4afe-abb6-a9ba519d451f",
});
