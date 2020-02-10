
async function sendEmail (data) {
  console.log('Sending Email With Body: ', JSON.stringify(data, null, 2));
  
}

module.exports = {
  sendEmail
};