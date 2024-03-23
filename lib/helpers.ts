import axios from "axios";

export const heartDataFetcher = async (accessToken: string) => {
  let data = JSON.stringify({
    aggregateBy: [
      {
        dataTypeName: "com.google.heart_rate.summary",
        dataSourceId:
          "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm",
      },
    ],
    bucketByTime: {
      durationMillis: 60000,
    },
    startTimeMillis: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTimeMillis: new Date().getTime(),
  });
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: data,
  };
  let responseData = [0];
  return new Promise((resolve, reject) => {
    axios
      .request(config)
      .then((response) => {
        let bucket = response.data.bucket;
        let rawData = bucket
          .map((minute: any) => {
            return {
              y: minute.dataset[0]?.point[0]?.value[0]?.fpVal
                ? minute.dataset[0]?.point[0]?.value[0]?.fpVal
                : null,
              x: new Date(parseInt(minute.startTimeMillis)),
            };
          })
          .filter((dataset: any) => dataset.y);
        resolve(rawData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
