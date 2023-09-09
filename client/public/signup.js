document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(signupForm);
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log(formDataObject)
      fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      })
        .then((response) => {
          if (response.ok) {

            alert("Signup successful!");
            window.location.href = "http://127.0.0.1:5500/client/login.html";
            return response.json();
          } else {
            alert("Signup failed. Please try again.");
            throw new Error("Signup failed.");
          }
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });


