export const addPartyDetails = party => {
  let longName;
  let imageString;
  switch (party.name.toLowerCase()) {
    case "lpc":
      longName = "Liberal Party of Canada";
      imageString = "lpc.png";
      break;
    case "cpc":
      longName = "Conservative Party of Canada";
      imageString = "cpc.png";
      break;
    case "ndp":
      longName = "New Democratic Party";
      imageString = "ndp.png";
      break;
    case "gpc":
      longName = "Green Party of Canada";
      imageString = "gpc.png";
      break;
    case "ind":
      longName = "Independent/Other";
      imageString = "ind.png";
      break;
    case "bq":
      longName = "Bloc Québécois";
      imageString = "bq.png";
      break;
    case "ppc":
      longName = "People's Party of Canada";
      imageString = "ppc.jpg";
      break;
    default:
      longName = party.name;
      imageString = "ind.png";
  }
  party = {
    ...party,
    longName,
    imageString,
  };
  return party;
};

export const projections = {
  calculatedPolitics: {
    name: "Calculated Politics",
    url: "https://www.calculatedpolitics.com/project/2019-canada-election",
  },
  cdnElectionWatch: {
    name: "Canadian Election Watch",
    url: "http://cdnelectionwatch.blogspot.com/",
  },
  threethirtyeight: {
    name: "338 Canada",
    url: "http://338canada.com/districts/districts.htm",
  },
  cbc: {
    name: "CBC Poll Tracker",
    url: "https://newsinteractives.cbc.ca/elections/poll-tracker/canada/",
  },
};
