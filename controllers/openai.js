import Project from "../models/project";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_SECRET,
});
const openai = new OpenAIApi(configuration);

//business plan generator
exports.businessPlan = async (req, res) => {
  const { about, number, timeframe, language } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate ${number} business plan(s) in ${language} language to last a duration of ${timeframe} based on the following information: \n${about}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "business",
          prompt: {
            about: about,
            number: number,
            timeframe: timeframe,
            language: language,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//marketing plan generator
exports.marketingPlan = async (req, res) => {
  const { about, number, timeframe, language } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate ${number} marketing plan(s) in ${language} language to last a duration of ${timeframe} for a business with the following information: \n${about}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "marketing",
          prompt: {
            about: about,
            number: number,
            timeframe: timeframe,
            language: language,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//tweet generator
exports.tweet = async (req, res) => {
  const { about, number, paragraphs, language, tone } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate ${number} tweet(s) in ${language} language in ${paragraphs} paragraphs each that talks about: \n${about} in a ${tone} tone`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "tweet",
          prompt: {
            about,
            number,
            paragraphs,
            language,
            tone,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//quote generator
exports.quote = async (req, res) => {
  const { topic, number, language } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate ${number} quote(s) in ${language} language on the following topic: \n${topic}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "quote",
          prompt: {
            topic,
            number,
            language,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//proposal generator
exports.proposal = async (req, res) => {
  const { about, number, title, language, company_name, paragraphs } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Craft ${number} compelling proposal(s) for a job title of ${title} in ${language} language to win over clients in a company called ${company_name} in ${paragraphs} paragraphs for applying to a job about the following: \n${about}`,
      max_tokens: 1500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "proposal",
          prompt: {
            about,
            number,
            title,
            language,
            company_name,
            paragraphs,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//instaCaption generator
exports.instaCaption = async (req, res) => {
  const { about, number, words, language, tone } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate ${number} instagram post caption(s) in ${language} language in a ${tone} tone in ${words} words for a post about: \n${about}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "insta",
          prompt: { about, number, words, language, tone },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//invoice generator
exports.invoice = async (req, res) => {
  const { about, products, language, words } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate an invoice content in ${language} language for ${products} product(s) in ${words} words for an invoice that containes the following: \n${about}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "invoice",
          prompt: { about, products, language, words },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();

        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//linkedin generator
exports.linkedin = async (req, res) => {
  const { about, paragraphs, language, tone } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate a linkedin post in a ${tone} tone in ${language} language in ${paragraphs} paragraphs that talks about: \n${about}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "linkedin",
          prompt: {
            about,
            number,
            paragraphs,
            language,
            tone,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//ads generator
exports.ads = async (req, res) => {
  const { objective, audience, platform } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate an advert content for the objective "${objective}" whose target audience is "${audience}" knowing that the ads platform is ${platform}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "ads",
          prompt: {
            about,
            number,
            paragraphs,
            language,
            tone,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//paraphraser
exports.paraphrase = async (req, res) => {
  const { input } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `paraphrase the following "${input}"`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        const project = await new Project({
          type: "paraphrase",
          prompt: {
            about,
            number,
            paragraphs,
            language,
            tone,
          },
          response: response.data.choices[0].text,
          creator: req.user._id,
        }).save();
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
