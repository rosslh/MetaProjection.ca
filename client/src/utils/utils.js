export const addPartyDetails = party => {
  let longName;
  let imageString;
  let color;
  switch (party.name.toLowerCase()) {
    case "lpc":
      longName = "Liberal Party of Canada";
      imageString = "lpc.png";
      color = "#D71921";
      break;
    case "cpc":
      longName = "Conservative Party of Canada";
      imageString = "cpc.png";
      color = "#0C499C";
      break;
    case "ndp":
      longName = "New Democratic Party";
      imageString = "ndp.png";
      color = "#F89921";
      break;
    case "gpc":
      longName = "Green Party of Canada";
      imageString = "gpc.png";
      color = "#3E9B36";
      break;
    case "ind":
      longName = "Independent/Other";
      imageString = "ind.png";
      color = "#aaa";
      break;
    case "bq":
      longName = "Bloc Québécois";
      imageString = "bq.png";
      color = "#00B0F0";
      break;
    case "ppc":
      longName = "People's Party of Canada";
      imageString = "ppc.jpg";
      color = "#551A8B";
      break;
    default:
      longName = party.name;
      imageString = "ind.png";
  }
  party = {
    ...party,
    longName,
    imageString,
    color,
  };
  return party;
};

export const projections = {
  calculatedPolitics: {
    name: "Calculated Politics",
    url: "https://www.calculatedpolitics.ca",
  },
  cdnElectionWatch: {
    name: "Canadian Election Watch",
    url: "http://cdnelectionwatch.blogspot.com",
  },
  threethirtyeight: {
    name: "338 Canada",
    url: "http://338canada.com/districts/districts.htm",
  },
  cbc: {
    name: "CBC Poll Tracker",
    url: "https://newsinteractives.cbc.ca/elections/poll-tracker/canada",
  },
};
