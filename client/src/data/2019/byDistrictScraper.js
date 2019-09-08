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
      winner: {
        party: null,
        confidence: 0,
      },
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
    "https://calculatedpolitics.ca/2019-canadian-federal-election/";
  const urls = [
    "ontario",
    "quebec",
    "british-columbia",
    "alberta",
    "prairies",
    "atlantic",
    "north",
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
                x.children.length === 9 && x.innerHTML.includes("smalltextcol")
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

function getWinners() {
  output.districts.map(data => {
    if (data.scores.length) {
      const winner = data.scores.reduce((prev, current) => {
        return prev.score > current.score ? prev : current;
      });
      if (winner.score <= 0.5) {
        return null;
      }
      data.winner = winner;
      return data;
    }
    return data;
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentCoords(num) {
  try {
    const data = JSON.parse(fs.readFileSync(`byDistrict/${num}.json`));
    return data && data.position;
  } catch (e) {
    return null;
  }
}

async function getCoordinates() {
  const url =
    "https://represent.opennorth.ca/boundaries/federal-electoral-districts/";

  for (const [i, district] of output.districts.entries()) {
    const currentPosition = getCurrentCoords(district.number);
    // if (!currentPosition) {
    await sleep(1800);
    console.log(district.number);
    fetch(`${url}${district.number}`)
      .then(resp => resp.text())
      .then(async text => {
        try {
          const data = JSON.parse(text);
          district.position = {
            y: data.centroid.coordinates[0],
            x: data.centroid.coordinates[1],
          };
          output.districts[i] = district;
          saveToFile(district.number);
        } catch (e) {
          console.error(district.number, e);
          await sleep(60000);
        }
      });
    // } else {
    //   district.position = currentPosition;
    //   output.districts[i] = district;
    //   saveToFile(district.number);
    // }
  }
}

function getNames() {
  output.districts = output.districts.map(district => {
    return {
      ...district,
      name: districts.find(x => x.number === district.number).name,
    };
  });
}

function validateOutput() {
  output.valid = true; // TODO: actually check if the output makes sense
}

function saveToFile(num) {
  var fs = require("fs");
  fs.writeFile(
    `byDistrict/${num}.json`,
    JSON.stringify(output.districts.find(x => x.number === num), null, 2),
    "utf8",
    () => {}
  );
}

scaffoldOutput();

Promise.all([get338(), getCalculatedPolitics()]).then(() => {
  getTotals();
  getWinners();
  getNames();
  getCoordinates();
  validateOutput();
});
