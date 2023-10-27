const email = "kishanmandora7@gmail.com";
const GET_URL = "https://one00x-data-analysis.onrender.com/assignment?email=";
const POST_URL = "https://one00x-data-analysis.onrender.com/assignment";

async function getData(email) {
  try {
    const response = await fetch(`${GET_URL}${email}`);
    const assignmentId = response.headers.get("x-assignment-id");
    const data = await response.json();

    return [data, assignmentId];
  } catch (err) {
    console.log(err);
    return getData();
  }
}

function getBuzzWord(data) {
  const buzzWords = {};

  data.forEach((item) => {
    buzzWords[item] ? (buzzWords[item] += 1) : (buzzWords[item] = 1);
  });

  const maxCount = Object.values(buzzWords).reduce((prev, curr) =>
    curr > prev ? curr : prev
  );

  const buzzWordsArr = Object.keys(buzzWords).filter(
    (key) => buzzWords[key] === maxCount
  );

  console.log("buzzWordsArr", buzzWordsArr);

  return buzzWordsArr;
}

async function completeDataAnalysis(email) {
  const [data, assignmentId] = await getData(email);
  const buzzWords = getBuzzWord(data);

  console.log("buzzWords", buzzWords);
}

completeDataAnalysis(email);
