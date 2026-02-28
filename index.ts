const app = document.getElementById("root");

if (!app) {
  throw new Error("#root not found in index.html");
}

app.innerHTML = `
  <h1>Hello, My Little React!</h1>
  <p>This is a simple implementation of React.</p>
`;
