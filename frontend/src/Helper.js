/**
 * @function
 * @param {DateTime} time */
export const formatDate = (time) => {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  return `${day}.${month}.${year}`;
};

export const formatDateTime = (time) => {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// const Test = () => {
//   return <p>Test</p>
// }
