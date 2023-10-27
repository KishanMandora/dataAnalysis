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

  return buzzWordsArr;
}

async function submitBuzzWord(email, assignmentId, buzzWords) {
  let index = 0;
  let isCorrect = false;

  while (!isCorrect && index < buzzWords.length) {
    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          answer: buzzWords[index],
          assignment_id: assignmentId,
        }),
      });

      const data = await response.json();

      if (data.result === "submitted_correct") {
        isCorrect = true;
        break;
      }
    } catch (err) {
      console.log(err);
    }

    index++;
  }

  return isCorrect ? buzzWords[index] : "No correct answer found";
}

async function completeDataAnalysis(email) {
  const [data, assignmentId] = await getData(email);
  const buzzWords = getBuzzWord(data);
  const buzzWord = await submitBuzzWord(email, assignmentId, buzzWords);

  console.log(
    `The buzz word for ${email} with assignmentId ${assignmentId} is ${buzzWord}`
  );
}

completeDataAnalysis(email);
