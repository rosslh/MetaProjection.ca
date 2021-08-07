const fetch = require("node-fetch");
const JSDOM = require("jsdom").JSDOM;
const slugify = require("slugify");
var fetchAndRetry = require('fetch-retry')(fetch);
// Winning party, confidence (toss-up: 0, leans: 0.5, likely/safe: 1),

const output = {
  districts: [],
};

const fs = require("fs");
const districts = JSON.parse(fs.readFileSync("src/data/districts.json"));

function getShortPartyString(input) {
  input = input.toLowerCase().trim();
  if (input.charAt(0) === "o") {
    // "other"
    return "ind";
  }
  return (
    ["lpc", "cpc", "ndp", "bq", "gpc", "ind", "ppc", "mav"].find(
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
  const url = "http://338canada.com/districts.htm";
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
            /(.*)(toss up| likely| leaning| safe)/i
          );
          return {
            district: parseInt(x.firstChild.textContent.trim().split(" ")[0]),
            party: getShortPartyString(party[1]),
            confidence:
              party.length === 3 ? getConfidenceScore(party[2]) : null,
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
    "https://calculatedpolitics.ca/projection/canadian-federal-election";
  const urls = [
    "ontario",
    "quebec",
    "british-columbia",
    "alberta",
    "prairies",
    "atlantic",
    "north",
  ].map(extension => `${baseUrl}-${extension}/`);

  return Promise.all(
    urls.map(url =>
      fetch(url)
        .then(resp => resp.text())
        .then(text => {
          const dom = new JSDOM(text);
          const { document } = dom.window;
          const rows = [...document.querySelectorAll("table tbody tr")];
          list = rows
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
              const projection = {
                party: party,
                confidence: confidence,
              };
              output.districts.find(
                x => x.number === district
              ).projections.calculatedPolitics = projection;
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
      const ranking = data.scores.sort((a, b) => {
        return b.score - a.score;
      });
      winner = ranking[0];
      if (
        ranking[0].score >= 0.5 &&
        (!ranking[1] || ranking[0].score > ranking[1].score)
      ) {
        data.winner = winner;
      }
    }
    return data;
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getGeography() {
  const url =
    "https://represent.opennorth.ca/boundaries/federal-electoral-districts/";

  for (const [i, district] of output.districts.entries()) {
    await sleep(1000);
    fetchAndRetry(`${url}${district.number}`, {
      retries: 3,
      retryDelay: attemptNumber => Math.pow(2, attemptNumber) * 8000 // 8000, 16000, 32000
    })
      .then(resp => resp.text())
      .then(async text => {
        try {
          const data = JSON.parse(text);
          district.position = {
            x: data.centroid.coordinates[1],
            y: data.centroid.coordinates[0],
          };
          district.bounds = [
            [data.extent[1], data.extent[0]],
            [data.extent[3], data.extent[2]],
          ];
          output.districts[i] = district;
          saveToFile(district.number);
        } catch (e) {
          console.error(district.number, e);
          await sleep(60000);
        }
      });
  }
}

function getNames() {
  output.districts = output.districts.map(district => {
    const name = districts.find(x => x.number === district.number).name;
    return {
      ...district,
      name,
      slug: slugify(name),
    };
  });
}

function validateOutput() {
  output.valid = output.districts.every(
    d =>
      d.projections.threethirtyeight &&
      d.projections.calculatedPolitics &&
      d.number
  );
  if (!output.valid) {
    console.log(output.districts.slice(0, 10));
    process.exit();
    throw "Invalid output";
  }
}

function saveToFile(num) {
  console.log(num);
  var fs = require("fs");
  fs.writeFile(
    `src/data/2021/byDistrict/${num}.json`,
    JSON.stringify(output.districts.find(x => x.number === num), null, 2),
    "utf8",
    () => {}
  );
}

scaffoldOutput();

console.log("District scraper");

Promise.all([get338(), getCalculatedPolitics()]).then(() => {
  getTotals();
  getWinners();
  getNames();
  getGeography();
  validateOutput();
});
