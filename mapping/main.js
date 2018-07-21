var nodes = null;
var edges = null;
var network = null;
var directionInput = document.getElementById("direction");

function setLevel(id,level) {
  nodes.find(function(element) {return element['id'] == id})["level"] = level;
}

function createNode(id, label) {
  nodes.push({
    id: id,
    label: label,
    shape: 'box',
    color: {
      background: 'white',
      border: 'black'
    },
    widthConstraint: {
      minimum: 200
    },
    heightConstraint: {
      minimum: 120
    }
  });
}

function createLink(from, to, positiveRelationship) {
  if (positiveRelationship) {
    var label = '→\n→'
  } else {
    var label = '→\n←'
  }
  edges.push({
    from: from,
    to: to,
    arrows: 'from',
    label: label,
    font: {
      background: 'white',
      size: 25
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
    nodes = [];
    edges = [];
    var connectionCount = [];

    createNode('overall', "Overall view")
    setLevel('overall',0)

    createNode('economics', "Economics")
    setLevel('economics',1)
    createLink('overall', 'economics', true)
    createNode('health', "Health")
    setLevel('health',1)
    createLink('overall', 'health', true)
    createNode('society', "Society")
    setLevel('society',1)
    createLink('overall', 'society', true)

    // economics
    createNode('employment', "Employment: Prime age employment rate\n---\n2018: 79%\n---\n1994 → 2018: +0.52% | +0.41pp\n---\nSource: Federal Reserve Bank of St. Louis")
    setLevel('employment',2)
    createLink('economics', 'employment', true)
    createNode('inequality', "Inequality")
    setLevel('inequality',2)
    createLink('economics', 'inequality', false)
    createNode('productivity', "Productivity: Annual total factor productivity growth rate\n---\n2013: +0.88%\n---\n1996-2004 avg → 2005-2013 avg: -50% | -0.87pp\n---\nSource: U.S. Total Factor Productivity Slowdown - Evidence from the U.S. States")
    setLevel('productivity',2)
    createLink('economics', 'productivity', true)
    createNode('mobility', "Wealth mobility: Chance of a child becoming richer than their parents\n---\n2014: 50%\n---\n1970 → 2014: -46% | -42pp\n---\nSource: http://www.nber.org/papers/w22910")
    setLevel('mobility',2)
    createLink('economics', 'mobility', true)
    createNode('product_quality', "Product quality & range: No quantitative measurement\n---\n2000 → 2018:Increased\n")
    setLevel('product_quality',2)
    createLink('economics', 'product_quality', true)
    createNode('income', "Income")
    setLevel('income',2)
    createLink('economics', 'income', true)
    createNode('poverty', "Poverty")
    setLevel('poverty',2)
    createLink('economics', 'poverty', false)
    // economics level 3
    createNode('gini_index', "Gini index\n---\n2016: 41.5\n---\n2000 → 2016: +2.72% | +1.1pp\n---\nSource: Federal Reserve Bank of St. Louis")
    setLevel('gini_index',3)
    createLink('inequality', 'gini_index', true)
    createNode('wealth_1%', "Wealth share of top 1%\n---\n2012: 41.8%\n---\n2000 → 2012: +23% | +7.7pp\n---\nSource: Gabriel Zucman")
    setLevel('wealth_1%',3)
    createLink('inequality', 'wealth_1%', true)
    createNode('wealth_5%', "Wealth share of top 5%\n---\n2012: 64.6%\n---\n2000 → 2012: +14% | +8.1pp\n---\nSource: Gabriel Zucman")
    setLevel('wealth_5%',3)
    createLink('inequality', 'wealth_5%', true)
    createNode('gdp_growth_rate', "GDP growth rate\n---\n2017: 2.27%\n---\n1961-1980 avg → 1981-2017 avg: -30% | -1.17pp\n---\nSource: World Bank")
    setLevel('gdp_growth_rate',3)
    createLink('mobility', 'gdp_growth_rate', true)
    createNode('gdp_growth_distribution', "GDP growth distribution equality: TBD\n---\n1961→2017: Decreased")
    setLevel('gdp_growth_distribution',3)
    createLink('mobility', 'gdp_growth_distribution', true)
    createNode('real_compensation', "Real compensation per hour\n---\n2017: TBD\n---\n2000 → 2017: +11.5%\n---\nSource: Federal Reserve Bank of St. Louis")
    setLevel('real_compensation',3)
    createLink('income', 'real_compensation', true)
    createNode('real_median', "Real median personal income\n---\n2016: TBD\n---\n2000 → 2016: +3.7%\n---\nSource: Federal Reserve Bank of St. Louis")
    setLevel('real_median',3)
    createLink('income', 'real_median', true)
    //
    createNode('child_poverty', "Child poverty: % of children living in poverty\n---\n2016: 15.6%\n---\n2000 → 2016: -13% | -2.4pp\n---\nSource: Center on Budget and Policy Priorities")
    setLevel('child_poverty',3)
    createLink('poverty', 'child_poverty', true)
    createNode('homelessness', "Homelessness: % of population that is homeless\n---\n2017: 0.21%\n---\n2007 → 2017: -21% | -0.04pp\n---\nSource: U.S. Department of Housing and Urban Development")
    setLevel('homelessness',3)
    createLink('poverty', 'homelessness', true)

    // health
    createNode('carbon_emissions', "Carbon emissions: Annual million metric tons\n---\n2017: 5087.7\n---\n2005 → 2017: -13.23% | -776\n---\nSource: https://bit.ly/2mnvG49")
    setLevel('carbon_emissions',2)
    createLink('health', 'carbon_emissions', false)
    createNode('teen_pregnancy', "Teen pregnancy: Births per 1,000 females aged 15-19\n---\n2014: 24.2\n---\n1990 → 2014: -61% | -37.6\n---\nSource: Pew Research Center")
    setLevel('teen_pregnancy',2)
    createLink('health', 'teen_pregnancy', false)
    createNode('drug_use', "Drugs")
    setLevel('drug_use',2)
    createLink('health', 'drug_use', false)
    createNode('mortality', "Mortality")
    setLevel('mortality',2)
    createLink('health', 'mortality', false)
    // health level 3, mortality
    createNode('life_expectancy', "Life expectancy\n---\n2016: 78.69y\n---\n2000 → 2016: +2.68% | +2.05y\n---\nSource: Federal Reserve Bank of St. Louis")
    setLevel('life_expectancy',3)
    createLink('mortality', 'life_expectancy', false)
    createNode('infant_mortality', "Infant mortality: % of births resulting in death\n---\n2016: 0.56%\n---\n1960 → 2016: -78.38% | -2.03pp\n---\nSource: Federal Reserve Bank of St. Louis")
    setLevel('infant_mortality',3)
    createLink('mortality', 'infant_mortality', true)
    createNode('minority_mortality', "Minority mortality: TBD\n---\n2000→2017:Decreased")
    setLevel('minority_mortality',3)
    createLink('mortality', 'minority_mortality', true)
    createNode('white_mortality', "White mortality: TBD\n---\n2000→2017:Increased")
    setLevel('white_mortality',3)
    createLink('mortality', 'white_mortality', true)
    createNode('suicides', "Suicides: Per 100k residents\n---\n2015: 13.3\n---\n2000 → 2015: +28% | +2.9\n---\nSource: National Institute on Drug Abuse")
    setLevel('suicides',3)
    createLink('mortality', 'suicides', true)
    // health level 3, drugs
    createNode('alcoholism', "Alcoholism: % of adults with dependency\n---\n2013: 13%\n---\n1992 → 2013: +73% | +5.5pp\n---\nSource: National Epidemiologic Survey on Alcohol and Related Conditions/JAMA")
    setLevel('alcoholism',3)
    createLink('drug_use', 'alcoholism', false)
    createNode('opiods', "Opiods: Opioid prescriptions, millions\n---\n2013: 207m\n---\n2000 → 2013: +64% | +81m\n---\nSource: National Institute on Drug Abuse")
    setLevel('opiods',3)
    createLink('drug_use', 'opiods', false)
    createNode('heroin', "Heroin: % of population who used\n---\n2013: 0.22%\n---\n2002 → 2013: +57% | +0.08pp\n---\nSource: Substance Abuse and Mental Health Services Administration")
    setLevel('heroin',3)
    createLink('drug_use', 'heroin', false)
    createNode('drug_deaths', "Drug deaths: % of population\n---\n2016: 0.020%\n---\n1999 → 2016: +233% | +0.014pp\n---\nSource: https://www.drugabuse.gov")
    setLevel('drug_deaths',3)
    createLink('drug_use', 'drug_deaths', false)

    // society
    createNode('happiness', "Happiness: World Happiness Report score\n---\n2017: 6.886/10\n---\n2008 → 2017:-0.315\n---\nSource: http://worldhappiness.report/")
    setLevel('happiness',2)
    createLink('society', 'happiness', true)
    createNode('international_perception', "International perception: % of non-US people who perceive the US as a major threat to their country\n---\n2017: 38%\n---\n2013 → 2017: +52% | +13pp\n---\nSource: Pew Research Center")
    setLevel('international_perception',2)
    createLink('society', 'international_perception', false)
    createNode('crime', "Crime")
    setLevel('crime',2)
    createLink('society', 'crime', false)
    createNode('trust', "Trust")
    setLevel('trust',2)
    createLink('society', 'trust', true)
    createNode('minority_rights', "Minority rights")
    setLevel('minority_rights',2)
    createLink('society', 'minority_rights', true)
    // society level 3
    createNode('crime_rate', "Crime: Annual crime rate per 100k residents\n---\n2012: 3,200\n---\n1990 → 2012: -45% | -2,618\n---\nSource: https://bit.ly/1S5ohzu")
    setLevel('crime_rate',3)
    createLink('crime', 'crime_rate', true)
    createNode('incarceration', "Incarceration: People in prison or local jail per 100k residents 18 or older\n---\n2016: 860\n---\n2000 → 2016: -7% | -60\n---\nSource: Bureau of Justice Statistics")
    setLevel('incarceration',3)
    createLink('crime', 'incarceration', true)
    createNode('government_trust', "Trust in government: % who trust the govt in Washington always or most of the time\n---\n2017: 18%\n---\n2000 → 2017: -47% | -16pp\n---\nSource: Pew Research Center")
    setLevel('government_trust',3)
    createLink('trust', 'government_trust', true)
    createNode('social_trust', "Social trust: % who say most people can be trusted\n---\n2014: 31%\n---\n2000 → 2014: -11% | -4pp\n---\nSource: Our World in Data")
    setLevel('social_trust',3)
    createLink('trust', 'social_trust', true)
    createNode('gay_rights', "Gay rights: No quantitative measurement\n---\n2000 → 2018:Increased\n")
    setLevel('gay_rights',3)
    createLink('minority_rights', 'gay_rights', true)
    createNode('hate_crimes', "Hate crimes: Amount in 10 largest cities\n---\n2017: 1,038\n---\n2010 → 2017: +33.08% | +258\n---\nSource: Center for the Study of Hate and Extremism")
    setLevel('hate_crimes',3)
    createLink('minority_rights', 'hate_crimes', false)



    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
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
                levelSeparation: 500
            }
        },
        physics:false
    };
    network = new vis.Network(container, data, options);
}
$( document ).ready(function() {
  console.log("hi");
  draw()
});