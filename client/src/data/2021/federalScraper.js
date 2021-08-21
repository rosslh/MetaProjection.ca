const fetch = require("node-fetch");
const JSDOM = require("jsdom").JSDOM;
const puppeteer = require("puppeteer");
const chromium = require("chrome-aws-lambda");
const fetchAndRetry = require("fetch-retry")(fetch);

const output = {
  parties: [
    {
      name: "cpc",
      projections: {},
    },
    {
      name: "lpc",
      projections: {},
    },
    {
      name: "ndp",
      projections: {},
    },
    {
      name: "bq",
      projections: {},
    },
    {
      name: "gpc",
      projections: {},
    },
    {
      name: "ind",
      projections: {},
    },
    {
      name: "ppc",
      projections: {},
    },
    {
      name: "mav",
      projections: {},
    },
  ],
};

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

function get338() {
  const partyColors = {
    lpc: "#990000",
    cpc: "#0000FF",
    ndp: "#b45f06",
    bq: "#00b0f0",
    gpc: "#00b050",
    ind: "#808080",
    ppc: "#551A8B",
    mav: "#84BD00",
  };
  const nearestColor = require("nearest-color").from(partyColors);
  const url = "https://338canada.com/districts.htm";
  return fetch(url)
    .then(resp => resp.text())
    .then(text => {
      const dom = new JSDOM(text);
      const { document } = dom.window;
      const list = Array.from(
        document.querySelectorAll("table tbody tr td:nth-child(7)")
      )
        .map(x => {
          const color = x.innerHTML.match(/color:(.*);/);
          return {
            party: color ? nearestColor(color[1]).name : null,
            seats: parseFloat(x.textContent),
          };
        })
        .filter(x => !isNaN(x.seats));
      for (const result of list) {
        output.parties.find(
          x => x.name == result.party
        ).projections.threethirtyeight = result.seats;
      }
      return output;
    });
}

function getCalculatedPolitics() {
  const url =
    "https://calculatedpolitics.ca/projection/canadian-federal-election/";
  return fetchAndRetry(url, {
    retries: 3,
    retryDelay: attemptNumber => Math.pow(2, attemptNumber) * 8000, // 8000, 16000, 32000
  })
    .then(resp => resp.text())
    .then(text => {
      const dom = new JSDOM(text);
      const { document } = dom.window;
      const list = [
        ...document.querySelectorAll(
          "div.vc_tta-panel:nth-child(2) table tr" // only select from correct tab
        ),
      ]
        .filter(x =>
          ["liberal", "conservative", "ndp", "bloc", "green", "other"].some(
            word => x.textContent.toLowerCase().includes(word)
          )
        )
        .map(x => {
          const party = getShortPartyString(x.children[0].textContent);
          const seats = parseFloat(
            x.children[1].querySelector("div div:nth-child(2)").textContent
          );
          return { party, seats };
        });

      for (const result of list) {
        output.parties.find(
          x => x.name == result.party
        ).projections.calculatedPolitics = result.seats;
      }
      return output;
    });
}

async function getCBC() {
  const url = "https://newsinteractives.cbc.ca/elections/poll-tracker/canada/";
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  }); // using puppeteer because they load dynamic content
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );
  await page.goto(url);

  await page.addScriptTag({ content: `${getShortPartyString}` });

  await page.waitForSelector(".dsb__svg--canada");

  const list = await page.evaluate(() => {
    const label = document
      .querySelector(".dsb__svg--canada")
      .getAttribute("aria-label");
    const parties = [
      "Liberal",
      "Conservative",
      "New Democrat",
      "Bloc Québécois",
      "Green",
      "Other",
    ];
    const totals = parties.map(party =>
      label.match(new RegExp(`${party}: [0-9]+`, "g"))
    );
    const output = totals.map(([total]) => {
      return {
        party: getShortPartyString(total.split(": ")[0]),
        seats: parseFloat(total.split(": ")[1]),
      };
    });
    return output;
  });

  await browser.close();

  for (const result of list) {
    output.parties.find(x => x.name === result.party).projections.cbc =
      result.seats;
  }
  return output;
}

function getCdnElectionWatch() {
  const url = "http://cdnelectionwatch.blogspot.com/";
  return fetch(url)
    .then(resp => resp.text())
    .then(text => {
      const dom = new JSDOM(text);
      const { document } = dom.window;
      const root = [
        ...document.querySelectorAll(".sidebar.section div.widget.Text"),
      ].find(x => x.textContent.toLowerCase().includes("current projection"));

      const list = [...root.querySelectorAll("table tbody tr")]
        .filter(x => x.querySelector("td img[alt]:only-child"))
        .map(x => {
          const party = getShortPartyString(
            x.querySelector("td img[alt]:only-child").getAttribute("alt")
          );
          const seats = parseFloat(x.textContent);
          return { party, seats };
        });

      for (const result of list) {
        output.parties.find(
          x => x.name === result.party
        ).projections.cdnElectionWatch = result.seats;
      }
      return output;
    });
}

function getAverages() {
  for (const party of output.parties) {
    party.sum = 0;
    for (const projection in party.projections) {
      party.sum += party.projections[projection];
    }
    party.avg = party.sum / Object.keys(party.projections).length;

    party.avg = Math.round(party.avg * 100) / 100;

    delete party.sum;
  }
}

function validateOutput() {
  output.valid = output.parties
    .filter(p => p.name !== "ind" && p.name !== "ppc" && p.name !== "mav")
    .every(party => Object.keys(party.projections).length === 3); // TODO: update to 3 once projection works
  if (!output.valid) {
    console.error("Output format invalid", output.parties);
    process.exit();
  }
}

function sort() {
  output.parties = output.parties.sort((a, b) => b.avg - a.avg);
}

function saveToFile() {
  console.log("saving");
  var fs = require("fs");
  const date = new Date().toISOString().substring(0, 10);
  fs.writeFileSync(
    `src/data/2021/federal/${date}.json`,
    JSON.stringify(output, null, 2),
    "utf8",
    () => {}
  );
}

console.log("Federal scraper");

Promise.all([
  get338(),
  getCalculatedPolitics(),
  getCBC(),
  // getCdnElectionWatch(), // TODO: enable once projection is up
]).then(() => {
  getAverages();
  sort();
  validateOutput();
  saveToFile();
});
