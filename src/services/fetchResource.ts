export default async (url: string) => {
  return fetch(url).then((res) => res.body);
};
