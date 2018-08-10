var nodesForGraph = null;
var connectionForGraph = null;
var network = null;

var nodes = []

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setLevel(id, level) {
  nodesForGraph.find(function(element) {return element['id'] == id})["level"] = level;
}

function createNode(opts) {
  if (!opts.hasOwnProperty("id") || !opts.hasOwnProperty("title") || !opts.hasOwnProperty("metric") || !opts.hasOwnProperty("current_level") || !opts.hasOwnProperty("trend") || !opts.hasOwnProperty("source") || !opts.hasOwnProperty("trend_direction")) {
    console.log(opts)
    throw "Missing property"
  }
  
  /*
  {
    id: "",
    title: "",
    metric: "",
    current_level: "",
    trend: "",
    source: "",
    trend_direction: ""
  }
  */ 
  if (opts.trend_direction == 'neutral') {
    var backgroundColor = 'white'
  } else if (opts.trend_direction == 'positive') {
    var backgroundColor = 'rgb(187, 247, 200)'
  } else if (opts.trend_direction == 'negative') {
    var backgroundColor = 'rgb(255, 124, 124)'
  }
  //build label
  var labelForGraph = "<b>" + opts.title + "</b>"
  if (opts.hasOwnProperty("metric") && opts["metric"] != null) {
    labelForGraph = labelForGraph + ": " + opts["metric"]
  }
  if (opts.hasOwnProperty("current_level") && opts["current_level"] != null) {
    labelForGraph = labelForGraph + "\n---\n" + opts["current_level"]
  }
  if (opts.hasOwnProperty("trend") && opts["trend"] != null) {
    labelForGraph = labelForGraph + "\n---\n" + opts["trend"]
  }
  if (opts.hasOwnProperty("source") && opts["source"] != null) {
    labelForGraph = labelForGraph + "\n---\nSource: " + opts["source"]
  }
  nodesForGraph.push({
    id: opts.id,
    label: labelForGraph,
    font: {
      multi: true
    },
    margin: 10,
    shape: 'box',
    color: {
      background: backgroundColor,
      border: 'black'
    },
    widthConstraint: {
      minimum: 200
    },
    heightConstraint: {
      minimum: 120
    }
  });

  if (opts["metric"] == null) {
    opts["metric"] = "-"
  }
  if (opts["current_level"] == null) {
    opts["current_level"] = "-"
  }
  if (opts["trend"] == null) {
    opts["trend"] = "-"
  }
  if (opts["source"] == null) {
    opts["source"] = "-"
  }

  if (opts.trend_direction == 'neutral') {
    opts["isNeutral"] = true
  } else if (opts.trend_direction == 'positive') {
    opts["isPositive"] = true
  } else if (opts.trend_direction == 'negative') {
    opts["isNegative"] = true
  }
  nodes.push(opts)
}

function createLink(opts){//(parent, child, positiveRelationship, lowerIsGood, custom=null) {
  //if (opts.positiveRelationship) {
  //  var label = '→\n→'
  //} else {
  //  var label = '→\n←'
  //}
  //if (opts.lowerIsGood) {
  //  var label = 'improves'
  //} else {
  //  var label = 'worsens'
  //}
  connectionForGraph.push({
    from: opts.parent_id,
    to: opts.child_id,
    arrows: 'from',
    label: opts.label,
    font: {
      background: 'white',
      size: 15
    }
  });
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  nodesForGraph = [];
  connectionForGraph = [];
  var connectionCount = [];

  createNode({
    id: "overall",
    title: "Overall view",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "neutral",
    noMetricExpected: true
  })
  setLevel('overall', 0)

  createNode({
    id: "economy",
    title: "Economy",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "neutral",
    noMetricExpected: true
  })
  setLevel('economy', 1)
  createLink({
    parent_id: 'overall',
    child_id: 'economy',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "health",
    title: "Health",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "neutral",
    noMetricExpected: true
  })
  setLevel('health', 1)
  createLink({
    parent_id: 'overall',
    child_id: 'health',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "society",
    title: "Society",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "neutral",
    noMetricExpected: true
  })
  setLevel('society', 1)
  createLink({
    parent_id: 'overall',
    child_id: 'society',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })

  // economy
  createNode({
    id: "inequality",
    title: "Inequality",
    metric: null,
    current_level: null,
    trend: "2000 → 2016: Increased",
    source: null,
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('inequality', 2)
  createLink({
    parent_id: 'economy',
    child_id: 'inequality',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: 'mobility',
    title: "Wealth mobility",
    metric: "Chance of a child becoming richer than their parents",
    current_level: "2014: 50%",
    trend: "1970 → 2014: -46% | -42pp",
    source: "http://www.nber.org/papers/w22910",
    trend_direction: 'negative',
    noMetricExpected: false
  })
  setLevel('mobility', 2)
  createLink({
    parent_id: 'economy',
    child_id: 'mobility',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "income",
    title: "Income",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('income', 2)
  createLink({
    parent_id: 'economy',
    child_id: 'income',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "poverty",
    title: "Poverty",
    metric: null,
    current_level: null,
    trend: "2000 → 2017: Improved",
    source: null,
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('poverty', 2)
  createLink({
    parent_id: 'economy',
    child_id: 'poverty',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: 'employment',
    title: "Employment",
    metric: "Prime age employment rate",
    current_level: "2018: 79%",
    trend: "1994 → 2018: +0.52% | +0.41pp",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'positive',
    noMetricExpected: false
  })
  setLevel('employment', 2)
  createLink({
    parent_id: 'economy',
    child_id: 'employment',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: 'productivity',
    title: "Productivity",
    metric: "Annual total factor productivity growth rate",
    current_level: "2013: +0.88%",
    trend: "1996-2004 avg → 2005-2013 avg: -50% | -0.87pp",
    source: "U.S. Total Factor Productivity Slowdown - Evidence from the U.S. States",
    trend_direction: 'negative',
    noMetricExpected: false
  })
  setLevel('productivity', 2)
  createLink({
    parent_id: 'economy',
    child_id: 'productivity',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "product_quality",
    title: "Product quality & range",
    metric: null,
    current_level: "2000 → 2018: Increased",
    trend: null,
    source: null,
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('product_quality', 2)
  createLink({
    parent_id: 'economy',
    child_id: 'product_quality',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  // economy level 3
  createNode({
    id: 'gini_index',
    title: "Gini index",
    metric: "Gini index",
    current_level: "2016: 41.5",
    trend: "2000 → 2016: +2.72% | +1.1pp",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'negative',
    noMetricExpected: false
  })
  setLevel('gini_index', 3)
  createLink({
    parent_id: 'inequality',
    child_id: 'gini_index',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: 'wealth_1',
    title: "Wealth share of top 1%",
    metric: "Wealth share of top 1%",
    current_level: "2012: 41.8%",
    trend: "2000 → 2012: +23% | +7.7pp",
    source: "Gabriel Zucman",
    trend_direction: 'negative',
    noMetricExpected: false
  })
  setLevel('wealth_1', 3)
  createLink({
    parent_id: 'inequality',
    child_id: 'wealth_1',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: 'wealth_5',
    title: "Wealth share of top 5%",
    metric: "Wealth share of top 5%",
    current_level: "2012: 64.6%",
    trend: "2000 → 2012: +14% | +8.1pp",
    source: "Gabriel Zucman",
    trend_direction: 'negative',
    noMetricExpected: false
  })
  setLevel('wealth_5', 3)
  createLink({
    parent_id: 'inequality',
    child_id: 'wealth_5',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: 'gdp_growth_rate',
    title: "GDP growth rate",
    metric: "GDP growth rate",
    current_level: "2017: 2.27%",
    trend: "1961-1980 avg → 1981-2017 avg: -30% | -1.17pp",
    source: "World Bank",
    trend_direction: 'negative',
    noMetricExpected: false
  })
  setLevel('gdp_growth_rate', 3)
  createLink({
    parent_id: 'mobility',
    child_id: 'gdp_growth_rate',
    positiveRelationship: true,
    lowerIsGood: true,
    label: "Explanatory power: 29%.\nSource:\nhttps://www.nber.org/papers/w22910"
  })
  createNode({
    id: 'gdp_growth_distribution',
    title: "GDP growth distribution equality",
    metric: null,
    current_level: null,
    trend: "1961 → 2017: Decreased",
    source: "World Bank",
    trend_direction: 'negative',
    noMetricExpected: false
  })
  setLevel('gdp_growth_distribution', 3)
  createLink({
    parent_id: 'mobility',
    child_id: 'gdp_growth_distribution',
    positiveRelationship: true,
    lowerIsGood: true,
    label: "Explanatory power: 71%\nSource:\nhttps://www.nber.org/papers/w22910"
  })
  createNode({
    id: 'real_compensation',
    title: "Real compensation per hour",
    metric: "Real compensation per hour",
    current_level: "2017: TBD",
    trend: "2000 → 2017: +11.5%",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'positive',
    noMetricExpected: false
  })
  setLevel('real_compensation', 3)
  createLink({
    parent_id: 'income',
    child_id: 'real_compensation',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: 'real_median',
    title: "Real median personal income",
    metric: "Real median personal income",
    current_level: "2016: TBD",
    trend: "2000 → 2016: +3.7%",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'positive',
    noMetricExpected: false
  })
  setLevel('real_median', 3)
  createLink({
    parent_id: 'income',
    child_id: 'real_median',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  //
  createNode({
    id: 'child_poverty',
    title: "Child poverty",
    metric: "% of children living in poverty",
    current_level: "2016: 15.6%",
    trend: "2000 → 2016: -13% | -2.4pp",
    source: "Center on Budget and Policy Priorities",
    trend_direction: 'positive',
    noMetricExpected: false
  })
  setLevel('child_poverty', 3)
  createLink({
    parent_id: 'poverty',
    child_id: 'child_poverty',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: 'homelessness',
    title: "Homelessness",
    metric: "% of population that is homeless",
    current_level: "2017: 0.21%",
    trend: "2007 → 2017: -21% | -0.04pp",
    source: "U.S. Department of Housing and Urban Development",
    trend_direction: 'positive',
    noMetricExpected: false
  })
  setLevel('homelessness', 3)
  createLink({
    parent_id: 'poverty',
    child_id: 'homelessness',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })

  // health
  createNode({
    id: "drugs",
    title: "Drugs",
    metric: null,
    current_level: null,
    trend: "1992 → 2016: Increased",
    source: null,
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('drugs', 2)
  createLink({
    parent_id: 'health',
    child_id: 'drugs',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "mortality",
    title: "Mortality",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "neutral",
    noMetricExpected: false
  })
  setLevel('mortality', 2)
  createLink({
    parent_id: 'health',
    child_id: 'mortality',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: 'carbon_emissions',
    title: "Carbon emissions",
    metric: "Annual million metric tons",
    current_level: "2017: 5087.7",
    trend: "2005 → 2017: -13.23% | -776",
    source: "https://bit.ly/2mnvG49",
    trend_direction: 'positive',
    noMetricExpected: false
  })
  setLevel('carbon_emissions', 2)
  createLink({
    parent_id: 'health',
    child_id: 'carbon_emissions',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "teen_pregnancy",
    title: "Teen pregnancy",
    metric: "Births per 1,000 females aged 15-19",
    current_level: "2014: 24.2",
    trend: "1990 → 2014: -61% | -37.6",
    source: "Pew Research Center",
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('teen_pregnancy', 2)
  createLink({
    parent_id: 'health',
    child_id: 'teen_pregnancy',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  // health level 3, mortality
  createNode({
    id: "life_expectancy",
    title: "Life expectancy",
    metric: "Life expectancy",
    current_level: "2016: 78.69y",
    trend: "2000 → 2016: +2.68% | +2.05y",
    source: "Federal Reserve Bank of St Louis",
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('life_expectancy', 3)
  createLink({
    parent_id: 'mortality',
    child_id: 'life_expectancy',
    positiveRelationship: false,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "infant_mortality",
    title: "Infant mortality",
    metric: "% of births resulting in death",
    current_level: "2016: 0.56%",
    trend: "1960 → 2016: -78.38% | -2.03pp",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('infant_mortality', 3)
  createLink({
    parent_id: 'mortality',
    child_id: 'infant_mortality',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "minority_mortality",
    title: "Minority mortality",
    metric: null,
    current_level: null,
    trend: "2000 → 2017: Decreased",
    source: null,
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('minority_mortality', 3)
  createLink({
    parent_id: 'mortality',
    child_id: 'minority_mortality',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "white_mortality",
    title: "White mortality",
    metric: null,
    current_level: null,
    trend: "2000 → 2017: Increased",
    source: null,
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('white_mortality', 3)
  createLink({
    parent_id: 'mortality',
    child_id: 'white_mortality',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "suicides",
    title: "Suicides",
    metric: "Per 100k residents",
    current_level: "2015: 13.3",
    trend: "2000 → 2015: +28% | +2.9",
    source: "National Institute on Drug Abuse",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('suicides', 3)
  createLink({
    parent_id: 'mortality',
    child_id: 'suicides',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  // health level 3, drugs
  createNode({
    id: "alcoholism",
    title: "Alcoholism",
    metric: "% of adults with dependency",
    current_level: "2013: 13%",
    trend: "1992 → 2013: +73% | +5.5pp",
    source: "National Epidemiologic Survey on Alcohol and Related Conditions/JAMA",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('alcoholism', 3)
  createLink({
    parent_id: 'drugs',
    child_id: 'alcoholism',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "opiods",
    title: "Opiods",
    metric: "Opioid prescriptions, millions",
    current_level: "2013: 207m",
    trend: "2000 → 2013: +64% | +81m",
    source: "National Institute on Drug Abuse",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('opiods', 3)
  createLink({
    parent_id: 'drugs',
    child_id: 'opiods',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "heroin",
    title: "Heroin",
    metric: "% of population who used",
    current_level: "2013: 0.22%",
    trend: "2002 → 2013: +57% | +0.08pp",
    source: "Substance Abuse and Mental Health Services Administration",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('heroin', 3)
  createLink({
    parent_id: 'drugs',
    child_id: 'heroin',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "drug_deaths",
    title: "Drug deaths",
    metric: "% of population",
    current_level: "2016: 0.020%",
    trend: "1999 → 2016: +233% | +0.014pp",
    source: "https://www.drugabuse.gov",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('drug_deaths', 3)
  createLink({
    parent_id: 'drugs',
    child_id: 'drug_deaths',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })

  // society
  createNode({
    id: "crime",
    title: "Crime",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('crime', 2)
  createLink({
    parent_id: 'society',
    child_id: 'crime',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "trust",
    title: "Trust",
    metric: null,
    current_level: null,
    trend: "2000 → 2017: Decreased",
    source: null,
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('trust', 2)
  createLink({
    parent_id: 'society',
    child_id: 'trust',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "minority_rights",
    title: "Minority rights",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "neutral",
    noMetricExpected: false
  })
  setLevel('minority_rights', 2)
  createLink({
    parent_id: 'society',
    child_id: 'minority_rights',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "happiness",
    title: "Happiness",
    metric: "World Happiness Report score",
    current_level: "2017: 6.886/10",
    trend: "2008 → 2017:-0.315",
    source: "http://worldhappiness.report/",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('happiness', 2)
  createLink({
    parent_id: 'society',
    child_id: 'happiness',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "international_perception",
    title: "International perception",
    metric: "% of non-US people who perceive the US as a major threat to their country",
    current_level: "2017: 38%",
    trend: "2013 → 2017: +52% | +13pp",
    source: "Pew Research Center",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('international_perception', 2)
  createLink({
    parent_id: 'society',
    child_id: 'international_perception',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })
  // society level 3
  createNode({
    id: "crime_rate",
    title: "Crime",
    metric: "Annual crime rate per 100k residents",
    current_level: "2012: 3,200",
    trend: "1990 → 2012: -45% | -2,618",
    source: "https://bit.ly/1S5ohzu",
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('crime_rate', 3)
  createLink({
    parent_id: 'crime',
    child_id: 'crime_rate',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "incarceration",
    title: "Incarceration",
    metric: "People in prison or local jail per 100k residents 18 or older",
    current_level: "2016: 860",
    trend: "2000 → 2016: -7% | -60",
    source: "Bureau of Justice Statistics",
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('incarceration', 3)
  createLink({
    parent_id: 'crime',
    child_id: 'incarceration',
    positiveRelationship: true,
    lowerIsGood: false,
    label: null
  })
  createNode({
    id: "government_trust",
    title: "Trust in government",
    metric: "% who trust the govt in Washington always or most of the time",
    current_level: "2017: 18%",
    trend: "2000 → 2017: -47% | -16pp",
    source: "Pew Research Center",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('government_trust', 3)
  createLink({
    parent_id: 'trust',
    child_id: 'government_trust',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "social_trust",
    title: "Social trust",
    metric: "% who say most people can be trusted",
    current_level: "2014: 31%",
    trend: "2000 → 2014: -11% | -4pp",
    source: "Our World in Data",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('social_trust', 3)
  createLink({
    parent_id: 'trust',
    child_id: 'social_trust',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "gay_rights",
    title: "Gay rights",
    metric: "No quantitative measurement",
    current_level: null,
    trend: "2000 → 2018: Increased",
    source: null,
    trend_direction: "positive",
    noMetricExpected: false
  })
  setLevel('gay_rights', 3)
  createLink({
    parent_id: 'minority_rights',
    child_id: 'gay_rights',
    positiveRelationship: true,
    lowerIsGood: true,
    label: null
  })
  createNode({
    id: "hate_crimes",
    title: "Hate crimes",
    metric: "Amount in 10 largest cities",
    current_level: "2017: 1,038",
    trend: "2010 → 2017: +33.08% | +258",
    source: "Center for the Study of Hate and Extremism",
    trend_direction: "negative",
    noMetricExpected: false
  })
  setLevel('hate_crimes', 3)
  createLink({
    parent_id: 'minority_rights',
    child_id: 'hate_crimes',
    positiveRelationship: false,
    lowerIsGood: false,
    label: null
  })



  // create a network
  var container = document.getElementById('map');
  var data = {
    nodes: nodesForGraph,
    edges: connectionForGraph
  };

  var options = {
    interaction: {
      dragNodes: false
    },
    edges: {
      smooth: {
        type: 'cubicBezier',
        forceDirection: 'vertical',
        roundness: 0.4
      }
    },
    layout: {
      hierarchical: {
        direction: "UD",
        nodeSpacing: 600,
        levelSeparation: 300
      }
    },
    physics:false
  };
  network = new vis.Network(container, data, options);
}

function addNodeToPage(node, $div) {
  var source = document.getElementById("node-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template(node);
  $div.append(html)
}

$(document).ready(function() {
  
  draw()

  var id = getParameterByName('id')
  if (id === null) {
    id = 'overall'
  }

  var node = nodes.find(function(element) {return element['id'] == id})
  node["isMainNode"] = true


  var parentChain = [];
  // assumes only one parent
  var connectionForParent = connectionForGraph.find(function(edge) {return edge['to'] == id})
  while (connectionForParent != undefined){
    var parentNode = nodes.find(function(element) {return element['id'] == connectionForParent["from"]})
    parentChain.unshift(parentNode)
    var connectionForParent = connectionForGraph.find(function(edge) {return edge['to'] == parentNode.id})
  }
  
  for (var i = 0; i < parentChain.length; i++) {
    var source = document.getElementById("parent-chain-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(parentChain[i]);
    $('#parentNodes').append(html)
  }
  if (parentChain.length == 0) {
    $('#parentNodes').hide()
  }

  var connectionsForChildren = connectionForGraph.filter(edge => edge['from'] == id);
  //
  console.log("connectionsForChildren")
  console.log(connectionsForChildren)
  node["childCount"] = connectionsForChildren.length
  addNodeToPage(node, $('#node'))
  $('#childCount').text(connectionsForChildren.length)
  //
  for (var i = 0; i < connectionsForChildren.length; i++) {
    var childNode = nodes.find(function(element) {return element['id'] == connectionsForChildren[i]["to"]})
    var connectionsForChildsChildren = connectionForGraph.filter(edge => edge['from'] == childNode.id);
    childNode["childCount"] = connectionsForChildsChildren.length
    if (connectionsForChildren[i]["label"] != null) {
      childNode["connection_label"] = connectionsForChildren[i]["label"]
    }
    addNodeToPage(childNode, $('#childNodes'))
  }
  if (connectionsForChildren.length == 0) {
    $('#nothingHere').show()
  }
  

  var introModalViewedCookie = getCookie('introModalViewed');
  if (introModalViewedCookie == null) {
    $('#introModal').modal('toggle')
    setCookie('introModalViewed', 'true');
  }

});