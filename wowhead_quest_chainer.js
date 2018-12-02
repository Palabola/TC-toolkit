const fs = require("fs");

const data = fs.readFileSync("./example.html").toString();

let regex = /quest=(.\d*)/gm;

let found = data.match(regex);

var res = [];
var result = "";

found.map(quest => {
  quest = quest.replace("quest=", "");

  res.push(quest);
});

for (var i = 0; i <= res.length; i++) {
  if (res[i + 1] > 0) {
    result +=
      "UPDATE quest_template_addon SET PrevQuestID = " +
      res[i] +
      " WHERE ID =" +
      res[i + 1] +
      "; \n";
  }
}

console.log(result);
