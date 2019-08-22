const fetch = require("node-fetch");
const JSDOM = require("jsdom").JSDOM;

// Winning party, confidence (toss-up: 0, leans: 0.5, likely/safe: 1),

const output = {
  districts: [],
};

const fs = require("fs");
const districts = JSON.parse(fs.readFileSync("../districts.json"));

function getShortPartyString(input) {
  input = input.toLowerCase().trim();
  if (input.charAt(0) === "o") {
    // "other"
    return "ind";
  }
  return (
    ["lpc", "cpc", "ndp", "bq", "gpc", "ind", "ppc"].find(
      x => input.charAt(0) === x.charAt(0)
    ) || null
  );
}

function cleanString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]/g, "");
}

function getDistrictNumber(str) {
  str = cleanString(str);
  const district = districts.find(
    x => cleanString(x.name) === str || cleanString(x.name_fr) == str
  );
  return district ? parseInt(district.number) : null;
}

function scaffoldOutput() {
  for (const district of districts) {
    output.districts.push({
      number: parseInt(district.number),
      projections: {
        threethirtyeight: {},
        calculatedPolitics: {},
      },
      scores: [],
    });
  }
}

function getConfidenceScore(str) {
  switch (str.trim().toLowerCase()) {
    case "safe":
      return 1;
    case "likely":
      return 1;
    case "leaning":
      return 0.5;
    case "leans":
      return 0.5;
    default:
      return 0;
  }
}

function get338() {
  const url = "http://338canada.com/districts/districts.htm";
  return fetch(url)
    .then(resp => resp.text())
    .then(text => {
      const dom = new JSDOM(text);
      const { document } = dom.window;
      const list = Array.from(document.querySelectorAll("table tbody tr"))
        .filter(
          x =>
            x.children.length === 3 &&
            ["toss up", "leaning", "likely", "safe"].some(keyword =>
              x.textContent.toLowerCase().includes(keyword)
            )
        )
        .map(x => {
          const party = x.textContent.match(
            /(toss up|likely |leaning |safe )(.*)/i
          );
          return {
            district: parseInt(x.firstChild.textContent.trim().split(" ")[0]),
            party: getShortPartyString(party[2]),
            confidence:
              party.length === 3 ? getConfidenceScore(party[1]) : null,
          };
        });
      for (const result of list) {
        output.districts.find(
          x => x.number === result.district
        ).projections.threethirtyeight = {
          party: result.party,
          confidence: result.confidence,
        };
      }
      return output;
    });
}

function getCalculatedPolitics() {
  const baseUrl =
    "https://www.calculatedpolitics.com/project/2019-canadian-federal-election-region-";
  const urls = [
    "ontario",
    "quebec",
    "british-columbia",
    "alberta",
    "prairies",
    "atlantic-canada",
    "northern-canada",
  ].map(extension => `${baseUrl}${extension}`);

  return Promise.all(
    urls.map(url =>
      fetch(url)
        .then(resp => resp.text())
        .then(text => {
          const dom = new JSDOM(text);
          const { document } = dom.window;
          list = [...document.querySelectorAll("table tbody tr")]
            .filter(
              x =>
                x.children.length === 10 && x.innerHTML.includes("twitter.com")
            )
            .forEach(x => {
              const partyAndConfidence = x.children[8].textContent.trim();
              let party = partyAndConfidence;
              let confidence = 1;
              if (partyAndConfidence.toLowerCase().includes("toss-up")) {
                party = null;
                confidence = 0;
              } else if (partyAndConfidence.includes(" ")) {
                party = getShortPartyString(partyAndConfidence.split(" ")[1]);
                confidence = getConfidenceScore(
                  partyAndConfidence.split(" ")[0]
                );
              } else {
                party = getShortPartyString(partyAndConfidence);
              }
              const district = getDistrictNumber(x.children[0].textContent);
              output.districts.find(
                x => x.number === district
              ).projections.calculatedPolitics = {
                party: party,
                confidence: confidence,
              };
            });
        })
    )
  );
}

function getTotals() {
  for (const district of output.districts) {
    for (const projectionName in district.projections) {
      const projection = district.projections[projectionName];
      if (projection.party && projection.confidence) {
        if (!district.scores.find(x => x.party === projection.party)) {
          district.scores.push({ party: projection.party, score: 0 });
        }
        district.scores.find(x => x.party === projection.party).score +=
          projection.confidence;
      }
    }
    for (obj of district.scores) {
      obj.score /= Object.keys(district.projections).length;
    }
  }
}

function validateOutput() {
  output.valid = true; // TODO: actually check if the output makes sense
}

function saveToFile() {
  var fs = require("fs");
  for (const district of output.districts) {
    fs.writeFile(
      `byDistrict/${district.number}.json`,
      JSON.stringify(district, null, 2),
      "utf8",
      () => {}
    );
  }
}

scaffoldOutput();

Promise.all([get338(), getCalculatedPolitics()]).then(() => {
  getTotals();
  validateOutput();
  saveToFile();
});
