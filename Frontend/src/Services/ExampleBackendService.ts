class ExampleBackendService {
  static getFromBackend() {
    fetch("http://localhost:3000/api/themeA/")
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      );
  }

  static postToBackend() {
    const data = {
      text: "test",
    };

    const params = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("http://localhost:3000/api/themeA/", params)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      );
  }

  static deleteFromBackend() {
    const params = {
      method: "DELETE",
    };

    fetch("http://localhost:3000/api/themeA/123", params)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      );
  }
}

export default ExampleBackendService;
