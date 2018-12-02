const fs = require("fs");

function load_gt(filename) {
  let gt_data = fs.readFileSync(filename, "utf8");

  gt_data = gt_data.replace("\r", ""); // Clean from garbage
  gt_data = gt_data.split("\n");

  let stucture = gt_data[0].split("\t");

  let data = [];
  data[0] = [];

  for (let i = 1; i < gt_data.length; i++) {
    data[i] = gt_data[i].split("\t");
  }

  let result = {};

  result.structure = stucture;
  result.data = data;

  return result;
}

module.exports.load_gt = load_gt;
