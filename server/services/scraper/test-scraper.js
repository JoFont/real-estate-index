const axios = require("axios");

const url = 'https://www.imovirtual.com/comprar/apartamento/';

axios(url)
.then(response => {
  const html = response.data;
  console.log(html);
})
.catch(console.error);