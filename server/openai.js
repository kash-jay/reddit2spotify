const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const extractSongTitles = async (subreddit, title, description, comments) => {
  var prompt = `
Subreddit: ${subreddit}
Post Title: ${title ? title : ""}
Post Description: ${description ? description : ""}
Comments:
  `;
  comments.forEach((comment) => {
    prompt += `- ${comment.body}\n`;
  });


  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You will be provided with a Reddit Post Title, Post Description, Subreddit, and Comments made on the post. Your task is to extract a list of song titles and artist names from it and return solely a comma separated list of song titles and corresponding artist names as follows: Song 1 Title - Artist Name, Song 2 Title - Artist Name, Song 3 Title - Artist Name ... Song N Title - Artist Name"
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": prompt,
          }
        ]
      }
    ],
    temperature: 0.1,
    max_tokens: 2800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log("returning chatgpt message")
  return response.choices[0].message.content;
};

module.exports = { extractSongTitles };
