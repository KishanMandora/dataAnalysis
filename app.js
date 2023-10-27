const email = "kishanmandora7@gmail.com";
const GET_URL = "https://one00x-data-analysis.onrender.com/assignment?email=";
const POST_URL = "https://one00x-data-analysis.onrender.com/assignment";

async function getData(email, failCount = 5) {
  try {
    const response = await fetch(`${GET_URL}${email}`);

    if (!response.ok) {
      throw new Error("Error in fetching data, please try again");
    } else {
      const assignmentId = response.headers.get("x-assignment-id");
      const data = await response.json();

      return [data, assignmentId];
    }
  } catch (err) {
    if (failCount <= 0) {
      console.log(
        "Failed to fetch data, please try again later after sometime"
      );
      return [[], null];
    } else {
      console.log(err);
      failCount--;
      return getData(email, failCount);
    }
  }
}

function getBuzzWord(data) {
  if (data.length === 0) {
    return [];
  }

  const buzzWordsFrequency = {};

  data.forEach((item) => {
    buzzWordsFrequency[item]
      ? (buzzWordsFrequency[item] += 1)
      : (buzzWordsFrequency[item] = 1);
  });

  const maxCount = Object.values(buzzWordsFrequency).reduce((prev, curr) =>
    curr > prev ? curr : prev
  );

  const topBuzzWords = Object.keys(buzzWordsFrequency).filter(
    (key) => buzzWordsFrequency[key] === maxCount
  );

  return topBuzzWords;
}

async function submitBuzzWord(email, assignmentId, topBuzzWords) {
  if (!assignmentId) {
    return [false, "assignment Id not found, please try again"];
  }

  if (topBuzzWords.length === 0) {
    return [false, "No buzz word found"];
  }

  let index = 0;
  let isCorrect = false;

  while (!isCorrect && index < topBuzzWords.length) {
    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          answer: topBuzzWords[index],
          assignment_id: assignmentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error in submitting data, please try again");
      } else {
        const data = await response.json();

        if (data.result === "submitted_correct") {
          isCorrect = true;
          break;
        }
      }
    } catch (err) {
      index--;
      console.log(err);
    }

    index++;
  }

  return isCorrect
    ? [true, topBuzzWords[index]]
    : [false, "No correct answer found"];
}

async function completeDataAnalysis(email) {
  const [data, assignmentId] = await getData(email);
  const topBuzzWords = getBuzzWord(data);
  const [validResult, msgOrBuzzWord] = await submitBuzzWord(
    email,
    assignmentId,
    topBuzzWords
  );

  if (validResult) {
    console.log(
      `Correct answer for ${email} with id of ${assignmentId} is ${msgOrBuzzWord}`
    );
  } else {
    console.log(msgOrBuzzWord);
  }
}

completeDataAnalysis(email);
