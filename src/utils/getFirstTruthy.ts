export default function getFirstTruthy(data: any[]) {
  let result = null;

  for (const value of data) {
    if (Boolean(value)) {
      result = value;
      break;
    }
  }

  return result;
}
