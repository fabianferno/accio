export const sendMail = (email, name, credential) => {
  var response = "not-sent";

  fetch(`https://accio-be.herokuapp.com/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { email: email, name: name, credential: credential },
  }).then((res) => {
    res
      .json()
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        response = error;
      });
  });
  return response;
};
