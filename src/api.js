// const BASE_URL = "https://wedev-api.sky.pro/api/leaderboard";
const URL_2 = "https://wedev-api.sky.pro/api/v2/leaderboard";

export const getLeaderboard = async () => {
  return await fetch(URL_2, {
    method: "GET",
  }).then(res => {
    return res.json();
  });
};

export const postLeaderboard = async ({ name, time, achievements }) => {
  console.log(achievements);
  return await fetch(URL_2, {
    method: "POST",
    body: JSON.stringify({
      name,
      time,
      achievements,
    }),
  }).then(res => {
    return res.json();
  });
};
