import { API_KEY } from "./config";

const fetchData = async <T extends object>(
  url: string,
): Promise<T[] | void> => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  } as const;

  // then, catchで記述した場合
  // return fetch(url, options)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     return response.json();
  //   })
  //   .then((json) => json.results as T[])
  //   .catch((err) => console.error(err));

  // awaitで記述した場合
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    return json.results as T[];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export default fetchData;
