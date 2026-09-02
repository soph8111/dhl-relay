export const RUNNER_FRAGMENT = /* groq */ `
  _id,
  firstName,
  lastName,
  alias,
  age,
  gender,
  "imageUrl": image.asset->url,
  "teamNames": *[_type == "team" && references(^._id)].teamName
`;
