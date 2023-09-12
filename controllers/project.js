import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Project from "../models/project";
import User from "../models/user";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
  // console.log(req.body);
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "bucket4lms",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload to s3
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    // image params
    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    // send remove request to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  const { about, number, timeframe, language, type } = req.body;

  try {
    const project = await new Project({
      type,
      prompt: {
        about: about,
        number: number,
        timeframe: timeframe,
        language: language,
      },
      response: "artificial project",
      creator: req.user._id,
    }).save();

    res.json(project);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Project creation failed. Try again.");
  }
};

// find project by id
export const read = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params._id })
      .populate("creator", "_id name title")
      .exec();

    res.json(project);
  } catch (err) {
    console.log(err);
  }
};

// find all projects
export const projects = async (req, res) => {
  try {
    const all = await Project.find({})
      .populate("creator", "_id name title")
      .sort({ updatedAt: -1 })
      .exec();
    res.json(all);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Getting all projects failed");
  }
};

// find a user's projects
export const userProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const projects = await Project.find({ creator: req.user._id })
      .populate("creator", "_id name title")
      .sort({ updatedAt: -1 })
      .exec();
    res.json(projects);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Get user's project failed");
  }
};

// other user's projects
export const otherUser = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.params.userId })
      .populate("creator", "_id name title")
      .sort({ updatedAt: -1 })
      .exec();
    res.json(projects);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Get user's project failed");
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { _id } = req.params;
    const project = await Project.findOne({ _id }).select("creator").exec();
    const user = await User.findOne({ _id: req.user._id });

    if (project.creator._id != req.user._id) {
      return res.status(400).send("Unauthorized");
    }

    const deletedProject = await Project.findOneAndDelete({
      _id: req.params._id,
    }).exec();
    res.send(`Deleted Project ${deletedProject}`);
  } catch (err) {
    console.log(err);
    return res.status(400).send("delete project failed");
  }
};

export const update = async (req, res) => {
  try {
    const { _id } = req.params;

    const project = await Project.findOne({ _id }).exec();

    if (project.creator != req.user._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Project.findOneAndUpdate({ _id }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

// Send to email
