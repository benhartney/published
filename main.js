var nodesForGraph = null;
var edgesForGraph = null;
var network = null;

var nodes = []

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

function nodeTemplate(node) {
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
  return "<div class='col-sm-4'><div class='alert alert-dark' role='alert'><a href=?id=" + node["id"] + ">" + node["title"] + "</a></div></div>"
}

function createNode(opts) {
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

  nodes.push(opts)
}

function createLink(parent, child, positiveRelationship, lowerIsGood, custom=null) {
  //if (positiveRelationship) {
  //  var label = '→\n→'
  //} else {
  //  var label = '→\n←'
  //}
  //if (lowerIsGood) {
  //  var label = 'improves'
  //} else {
  //  var label = 'worsens'
  //}
  edgesForGraph.push({
    from: parent,
    to: child,
    arrows: 'from',
    label: custom,
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
  edgesForGraph = [];
  var connectionCount = [];

  createNode({
    id: 'overall',
    title: "Overall view",
    trend_direction: 'neutral'
  })
  setLevel('overall',0)

  createNode({
    id: 'economics',
    title: "Economics",
    trend_direction: 'neutral'
  })
  setLevel('economics',1)
  createLink('overall', 'economics', true, true)
  createNode({
    id: 'health',
    title: "Health",
    trend_direction: 'neutral'
  })
  setLevel('health',1)
  createLink('overall', 'health', true, true)
  createNode({
    id: 'society',
    title: "Society",
    trend_direction: 'neutral'
  })
  setLevel('society',1)
  createLink('overall', 'society', true, true)

  // economics
  createNode({
    id: 'inequality',
    title: "Inequality",
    trend_direction: 'negative'
  })
  setLevel('inequality',2)
  createLink('economics', 'inequality', false, false)
  createNode({
    id: 'mobility',
    title: "Wealth mobility",
    metric: "Chance of a child becoming richer than their parents",
    current_level: "2014: 50%",
    trend: "1970 → 2014: -46% | -42pp",
    source: "http://www.nber.org/papers/w22910",
    trend_direction: 'negative'
  })
  setLevel('mobility',2)
  createLink('economics', 'mobility', true, true)
  createNode({
    id: 'income',
    title: "Income",
    trend_direction: 'positive'
  })
  setLevel('income',2)
  createLink('economics', 'income', true, true)
  createNode({
    id: 'poverty',
    title: "Poverty",
    trend_direction: 'positive'
  })
  setLevel('poverty',2)
  createLink('economics', 'poverty', false, false)
  createNode({
    id: 'employment',
    title: "Employment",
    metric: "Prime age employment rate",
    current_level: "2018: 79%",
    trend: "1994 → 2018: +0.52% | +0.41pp",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'positive'
  })
  setLevel('employment',2)
  createLink('economics', 'employment', true, true)
  createNode({
    id: 'productivity',
    title: "Productivity",
    metric: "Annual total factor productivity growth rate",
    current_level: "2013: +0.88%",
    trend: "1996-2004 avg → 2005-2013 avg: -50% | -0.87pp",
    source: "U.S. Total Factor Productivity Slowdown - Evidence from the U.S. States",
    trend_direction: 'negative'
  })
  setLevel('productivity',2)
  createLink('economics', 'productivity', true, true)
  createNode({
    id: 'product_quality',
    title: "Product quality & range",
    metric: "No quantitative measurement",
    current_level: "2000 → 2018: Increased",
    trend_direction: 'positive'
  })
  setLevel('product_quality',2)
  createLink('economics', 'product_quality', true, true)
  // economics level 3
  createNode({
    id: 'gini_index',
    title: "Gini index",
    current_level: "2016: 41.5",
    trend: "2000 → 2016: +2.72% | +1.1pp",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'negative'
  })
  setLevel('gini_index',3)
  createLink('inequality', 'gini_index', true, false)
  createNode({
    id: 'wealth_1%',
    title: "Wealth share of top 1%",
    current_level: "2012: 41.8%",
    trend: "2000 → 2012: +23% | +7.7pp",
    source: "Gabriel Zucman",
    trend_direction: 'negative'
  })
  setLevel('wealth_1%',3)
  createLink('inequality', 'wealth_1%', true, false)
  createNode({
    id: 'wealth_5%',
    title: "Wealth share of top 5%",
    current_level: "2012: 64.6%",
    trend: "2000 → 2012: +14% | +8.1pp",
    source: "Gabriel Zucman",
    trend_direction: 'negative'
  })
  setLevel('wealth_5%',3)
  createLink('inequality', 'wealth_5%', true, false)
  createNode({
    id: 'gdp_growth_rate',
    title: "GDP growth rate",
    current_level: "2017: 2.27%",
    trend: "1961-1980 avg → 1981-2017 avg: -30% | -1.17pp",
    source: "World Bank",
    trend_direction: 'negative'
  })
  setLevel('gdp_growth_rate',3)
  createLink('mobility', 'gdp_growth_rate', true, true, "Explanatory power: 29%\nSource:\nhttps://www.nber.org/papers/w22910")
  createNode({
    id: 'gdp_growth_distribution',
    title: "GDP growth distribution equality",
    metric: "TBD",
    trend: "1961→2017: Decreased",
    trend_direction: 'negative'
  })
  setLevel('gdp_growth_distribution',3)
  createLink('mobility', 'gdp_growth_distribution', true, true, "Explanatory power: 71%\nSource:\nhttps://www.nber.org/papers/w22910")
  createNode({
    id: 'real_compensation',
    title: "Real compensation per hour",
    current_level: "2017: TBD",
    trend: "2000 → 2017: +11.5%",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'positive'
  })
  setLevel('real_compensation',3)
  createLink('income', 'real_compensation', true, true)
  createNode({
    id: 'real_median',
    title: "Real median personal income",
    current_level: "2016: TBD",
    trend: "2000 → 2016: +3.7%",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: 'positive'
  })
  setLevel('real_median',3)
  createLink('income', 'real_median', true, true)
  //
  createNode({
    id: 'child_poverty',
    title: "Child poverty",
    metric: "% of children living in poverty",
    current_level: "2016: 15.6%",
    trend: "2000 → 2016: -13% | -2.4pp",
    source: "Center on Budget and Policy Priorities",
    trend_direction: 'positive'
  })
  setLevel('child_poverty',3)
  createLink('poverty', 'child_poverty', true, false)
  createNode({
    id: 'homelessness',
    title: "Homelessness",
    metric: "% of population that is homeless",
    current_level: "2017: 0.21%",
    trend: "2007 → 2017: -21% | -0.04pp",
    source: "U.S. Department of Housing and Urban Development",
    trend_direction: 'positive'
  })
  setLevel('homelessness',3)
  createLink('poverty', 'homelessness', true, false)

  // health
  createNode({
    id: 'drugs',
    title: "Drugs",
    trend_direction: 'negative'
  })
  setLevel('drugs',2)
  createLink('health', 'drugs', false, false)
  createNode({
    id: 'mortality',
    title: "Mortality",
    trend_direction: 'neutral'
  })
  setLevel('mortality',2)
  createLink('health', 'mortality', false, false)
  createNode({
    id: 'carbon_emissions',
    title: "Carbon emissions",
    metric: "Annual million metric tons",
    current_level: "2017: 5087.7",
    trend: "2005 → 2017: -13.23% | -776",
    source: "https://bit.ly/2mnvG49",
    trend_direction: 'positive'
  })
  setLevel('carbon_emissions',2)
  createLink('health', 'carbon_emissions', false, false)
  createNode({
    id: "teen_pregnancy",
    title: "Teen pregnancy",
    metric: "Births per 1,000 females aged 15-19",
    current_level: "2014: 24.2",
    trend: "1990 → 2014: -61% | -37.6",
    source: "Pew Research Center",
    trend_direction: "positive"
  })
  setLevel('teen_pregnancy',2)
  createLink('health', 'teen_pregnancy', false, false)
  // health level 3, mortality
  createNode({
    id: "life_expectancy",
    title: "Life expectancy",
    metric: null,
    current_level: "2016: 78.69y",
    trend: "2000 → 2016: +2.68% | +2.05y",
    source: "Federal Reserve Bank of St Louis",
    trend_direction: "positive"
  })
  setLevel('life_expectancy',3)
  createLink('mortality', 'life_expectancy', false, true)
  createNode({
    id: "infant_mortality",
    title: "Infant mortality",
    metric: "% of births resulting in death",
    current_level: "2016: 0.56%",
    trend: "1960 → 2016: -78.38% | -2.03pp",
    source: "Federal Reserve Bank of St. Louis",
    trend_direction: "positive"
  })
  setLevel('infant_mortality',3)
  createLink('mortality', 'infant_mortality', true, false)
  createNode({
    id: "minority_mortality",
    title: "Minority mortality",
    metric: "TBD",
    current_level: null,
    trend: "2000 → 2017:Decreased",
    source: null,
    trend_direction: "positive"
  })
  setLevel('minority_mortality',3)
  createLink('mortality', 'minority_mortality', true, false)
  createNode({
    id: "white_mortality",
    title: "White mortality",
    metric: "TBD",
    current_level: null,
    trend: "2000 → 2017:Increased",
    source: null,
    trend_direction: "negative"
  })
  setLevel('white_mortality',3)
  createLink('mortality', 'white_mortality', true, false)
  createNode({
    id: "suicides",
    title: "Suicides",
    metric: "Per 100k residents",
    current_level: "2015: 13.3",
    trend: "2000 → 2015: +28% | +2.9",
    source: "National Institute on Drug Abuse",
    trend_direction: "negative"
  })
  setLevel('suicides',3)
  createLink('mortality', 'suicides', true, false)
  // health level 3, drugs
  createNode({
    id: "alcoholism",
    title: "Alcoholism",
    metric: "% of adults with dependency",
    current_level: "2013: 13%",
    trend: "1992 → 2013: +73% | +5.5pp",
    source: "National Epidemiologic Survey on Alcohol and Related Conditions/JAMA",
    trend_direction: "negative"
  })
  setLevel('alcoholism',3)
  createLink('drugs', 'alcoholism', true, false)
  createNode({
    id: "opiods",
    title: "Opiods",
    metric: "Opioid prescriptions, millions",
    current_level: "2013: 207m",
    trend: "2000 → 2013: +64% | +81m",
    source: "National Institute on Drug Abuse",
    trend_direction: "negative"
  })
  setLevel('opiods',3)
  createLink('drugs', 'opiods', true, false)
  createNode({
    id: "heroin",
    title: "Heroin",
    metric: "% of population who used",
    current_level: "2013: 0.22%",
    trend: "2002 → 2013: +57% | +0.08pp",
    source: "Substance Abuse and Mental Health Services Administration",
    trend_direction: "negative"
  })
  setLevel('heroin',3)
  createLink('drugs', 'heroin', true, false)
  createNode({
    id: "drug_deaths",
    title: "Drug deaths",
    metric: "% of population",
    current_level: "2016: 0.020%",
    trend: "1999 → 2016: +233% | +0.014pp",
    source: "https://www.drugabuse.gov",
    trend_direction: "negative"
  })
  setLevel('drug_deaths',3)
  createLink('drugs', 'drug_deaths', true, false)

  // society
  createNode({
    id: "crime",
    title: "Crime",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "positive"
  })
  setLevel('crime',2)
  createLink('society', 'crime', false, false)
  createNode({
    id: "trust",
    title: "Trust",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "negative"
  })
  setLevel('trust',2)
  createLink('society', 'trust', true, true)
  createNode({
    id: "minority_rights",
    title: "Minority rights",
    metric: null,
    current_level: null,
    trend: null,
    source: null,
    trend_direction: "neutral"
  })
  setLevel('minority_rights',2)
  createLink('society', 'minority_rights', true, true)
  createNode({
    id: "happiness",
    title: "Happiness",
    metric: "World Happiness Report score",
    current_level: "2017: 6.886/10",
    trend: "2008 → 2017:-0.315",
    source: "http://worldhappiness.report/",
    trend_direction: "negative"
  })
  setLevel('happiness',2)
  createLink('society', 'happiness', true, true)
  createNode({
    id: "international_perception",
    title: "International perception",
    metric: "% of non-US people who perceive the US as a major threat to their country",
    current_level: "2017: 38%",
    trend: "2013 → 2017: +52% | +13pp",
    source: "Pew Research Center",
    trend_direction: "negative"
  })
  setLevel('international_perception',2)
  createLink('society', 'international_perception', false, false)
  // society level 3
  createNode({
    id: "crime_rate",
    title: "Crime",
    metric: "Annual crime rate per 100k residents",
    current_level: "2012: 3,200",
    trend: "1990 → 2012: -45% | -2,618",
    source: "https://bit.ly/1S5ohzu",
    trend_direction: "positive"
  })
  setLevel('crime_rate',3)
  createLink('crime', 'crime_rate', true, false)
  createNode({
    id: "incarceration",
    title: "Incarceration",
    metric: "People in prison or local jail per 100k residents 18 or older",
    current_level: "2016: 860",
    trend: "2000 → 2016: -7% | -60",
    source: "Bureau of Justice Statistics",
    trend_direction: "positive"
  })
  setLevel('incarceration',3)
  createLink('crime', 'incarceration', true, false)
  createNode({
    id: "government_trust",
    title: "Trust in government",
    metric: "% who trust the govt in Washington always or most of the time",
    current_level: "2017: 18%",
    trend: "2000 → 2017: -47% | -16pp",
    source: "Pew Research Center",
    trend_direction: "negative"
  })
  setLevel('government_trust',3)
  createLink('trust', 'government_trust', true, true)
  createNode({
    id: "social_trust",
    title: "Social trust",
    metric: "% who say most people can be trusted",
    current_level: "2014: 31%",
    trend: "2000 → 2014: -11% | -4pp",
    source: "Our World in Data",
    trend_direction: "negative"
  })
  setLevel('social_trust',3)
  createLink('trust', 'social_trust', true, true)
  createNode({
    id: "gay_rights",
    title: "Gay rights",
    metric: "No quantitative measurement",
    current_level: null,
    trend: "2000 → 2018: Increased",
    source: null,
    trend_direction: "positive"
  })
  setLevel('gay_rights',3)
  createLink('minority_rights', 'gay_rights', true, true)
  createNode({
    id: "hate_crimes",
    title: "Hate crimes",
    metric: "Amount in 10 largest cities",
    current_level: "2017: 1,038",
    trend: "2010 → 2017: +33.08% | +258",
    source: "Center for the Study of Hate and Extremism",
    trend_direction: "negative"
  })
  setLevel('hate_crimes',3)
  createLink('minority_rights', 'hate_crimes', false, false)



  // create a network
  var container = document.getElementById('map');
  var data = {
    nodes: nodesForGraph,
    edges: edgesForGraph
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
  
  console.log(nodes)
  draw()

  var id = getParameterByName('id')
  if (id === null) {
    id = 'overall'
  }

  var node = nodes.find(function(element) {return element['id'] == id})

  addNodeToPage(node, $('#node'))

  var edgesforParents = edgesForGraph.filter(edge => edge['to'] == id);
  for (var i = 0; i < edgesforParents.length; i++) {
    var parentNode = nodes.find(function(element) {return element['id'] == edgesforParents[i]["from"]})
    addNodeToPage(parentNode, $('#parentNodes'))
  }

  var edgesforChildren = edgesForGraph.filter(edge => edge['from'] == id);
  for (var i = 0; i < edgesforChildren.length; i++) {
    var childNode = nodes.find(function(element) {return element['id'] == edgesforChildren[i]["to"]})
    addNodeToPage(childNode, $('#childNodes'))
  }

});