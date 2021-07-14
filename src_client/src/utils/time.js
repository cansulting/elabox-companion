export const formatTime = (timeStamp) => {
  if (formatTime === null) return "...";

  let formattedTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timeStamp * 1000));

  return formattedTime;
};
