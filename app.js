const email = "kishanmandora7@gmail.com";
const GET_URL = `https://one00x-data-analysis.onrender.com/assignment?email=${email}`;

let data, assignmentId;

async function getData() {
  try {
    const response = await fetch(GET_URL);
    assignmentId = response.headers.get("x-assignment-id");
    data = await response.json();
  } catch (err) {
    console.log(err);
  }

  return [data, assignmentId];
}

getData();
