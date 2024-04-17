document.addEventListener("DOMContentLoaded", async function () {
  const startAnalysisBtn = document.getElementById("start-analysis-btn");
  const resultContainer = document.getElementById("result-container");

  startAnalysisBtn.addEventListener("click", async function () {
    const dataUrl = document.getElementById("data-url").value;
    const ipAddress = document.getElementById("ip-address").value;
    const fileInput = document.getElementById("file-input");

    // Perform your behavior analysis here

    // Perform VirusTotal API Request
    const vtApiKey =
      "91e71916da95255e8265ad37d59e4784555a9e580fe1948e7f0600762011643c";
    // using ipaddress
    {
      const options = {
        method: "GET",
        headers: {
          "x-apikey": vtApiKey,
          accept: "application/json",
        },
      };

      try {
        const response = await fetch(
          `https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`,
          options
        );
        const data = await response.json();
        displayResult(data);
      } catch (err) {
        console.error(err);
      }
    }
    // using url
    {
      const options = {
        method: "POST",
        headers: {
          "x-apikey": vtApiKey,
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ url: dataUrl }),
      };

      try {
        const response = await fetch(
          "https://www.virustotal.com/api/v3/urls",
          options
        );
        const data = await response.json();

        // Extract the correct URL id from the response
        const urlId = data.data.id;
        const parts = urlId.split("-");

        // Access the middle part (index 1)
        const middlePart = parts[1];

        // Perform the second fetch request with the correct URL id
        const options2 = {
          method: "GET",
          headers: {
            "x-apikey": vtApiKey,
            accept: "application/json",
          },
        };

        //wait for 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10000));

        const response2 = await fetch(
          `https://www.virustotal.com/api/v3/urls/${middlePart}`,
          options2
        );
        const data2 = await response2.json();
        displayResult(data2);
      } catch (err) {
        console.error(err);
      }
    }
    // using file
    {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      const options = {
        method: "POST",
        headers: {
          "x-apikey": vtApiKey,
        },
        body: formData,
      };
      try {
        const response = await fetch(
          "https://www.virustotal.com/api/v3/files",
          options
        );
        const data = await response.json();
        const fileId = data.data.id;
        const options2 = {
          method: "GET",
          headers: {
            "x-apikey": vtApiKey,
            accept: "application/json",
          },
        };
        //wait for 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const response2 = await fetch(
          `https://www.virustotal.com/api/v3/analyses/${fileId}`,
          options2
        );
        const data2 = await response2.json();
        displayResult(data2);
      } catch (err) {
        console.error(err);
      }
    }
  });

  function displayResult(data) {
    resultContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
});
