import User from "../models/user";
import Project from "../models/project";

export const currentUser = async (req, res) => {
  try {
    //find user with id from verified token
    //log user, exclude password
    const user = await User.findById(req.user._id)
      .select("-password -passwordResetCode -role -projects")
      .exec();
    console.log("CURRENT_USER", user);
    return res.send(user);
  } catch (err) {
    console.log(err);
  }
};

export const otherUser = async (req, res) => {
  try {
    //find user with id from params
    //log user, exclude password
    // userId;
    const user = await User.findById(req.params.userId)
      .select("-password -passwordResetCode -role -projects")
      .exec();
    console.log("Other USER", user);
    return res.send(user);
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(slug);
    const user = await User.findById(userId).exec();
    // console.log("Project FOUND => ", project);

    if (user._id != req.user._id) {
      return res.status(400).send("Unauthorized");
    }

    const update = await User.findOneAndUpdate(userId, req.body, {
      new: true,
    }).exec();

    const updated = await User.findById(userId)
      .select("-password -passwordResetCode -role -bookmarks -projects")
      .exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const deleteUser = async (req, res) => {
  const { _id } = req.params;

  const user = await User.findOne({ _id: req.user._id });

  if (_id != req.user._id || user.role === "Admin" || user.role === "Dev") {
    return res.status(400).send("Unauthorized");
  }

  const deletedUser = await Project.findOneAndDelete({
    _id: _id,
  }).exec();
  res.send(`Deleted User ${deletedUser}`);
};
