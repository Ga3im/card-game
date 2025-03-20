export const getLeaderboard = async () => {
  return await fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "GET",
  }).then(res => {
    return res.json();
  });
};
