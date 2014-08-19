var nino = require('../../lib/nino');

function isvalidJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

nino.serial(function(err, data) {
  if (isvalidJSON(data)) {
    console.log(JSON.parse(data));
  }
});
