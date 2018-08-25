var nodes_for_graph = [];
var connections_for_graph = [];
var network = null;

var nodes_for_mobile_view = []

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
  var nodeToSetLevelFor = nodes_for_graph.find(function(element) {return element['id'] == id})
  if (nodeToSetLevelFor != null) {
    nodeToSetLevelFor["level"] = level;
  }
}
function createNode(opts) {
  if (window.source_id == 'all' || opts["id"] == "overall" || opts["source_ids"].includes(window.source_id)) {
    if (!opts.hasOwnProperty("id") || !opts.hasOwnProperty("title") || !opts.hasOwnProperty("metric") || !opts.hasOwnProperty("current_level") || !opts.hasOwnProperty("trend") || !opts.hasOwnProperty("source") || !opts.hasOwnProperty("trend_direction") || !opts.hasOwnProperty("noMetricExpected") || !opts.hasOwnProperty("source_ids") || !opts.hasOwnProperty("parent_link")) {
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
    nodes_for_graph.push({
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

    if (opts.parent_link == null) {
      opts.level = 0
    } else {
      var parent_node = nodes_for_mobile_view.find(function(element) {return element['id'] == opts.parent_link.parent_id})
      opts.level = parent_node.level + 1
    }
    setLevel(opts.id, opts.level)

    if (opts.parent_link != null) {
      createLink({
        parent_id: opts.parent_link.parent_id,
        child_id: opts.id,
        positive_relationship: opts.parent_link.positive_relationship,
        lower_is_good: opts.parent_link.lower_is_good,
        label: opts.parent_link.label
      })
    }




    // only for mobile view
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
    nodes_for_mobile_view.push(opts)
  }
}

function createLink(opts){

  // both nodes must already exist!

  //if (opts.positive_relationship) {
  //  var label = '→\n→'
  //} else {
  //  var label = '→\n←'
  //}
  //if (opts.lower_is_good) {
  //  var label = 'improves'
  //} else {
  //  var label = 'worsens'
  //}

  //
  var parent_node = nodes_for_graph.find(function(element) {return element['id'] == opts.parent_id})
  var child_node = nodes_for_graph.find(function(element) {return element['id'] == opts.child_id})
  if (parent_node != null && child_node != null) {

    connections_for_graph.push({
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
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function setupData() {
  // order within each entity matters
  window.all_data = {
    brookings: {
      display_name: "Brookings",
      sources: [
        {
          id: "brookings_wage_article",
          title: "Article: Thirteen facts about wage growth",
          url: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth/"
        }
      ],
      nodes: [
        {
          id: "overall",
          title: "Brooking's view",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: true,
          source_ids: ['brookings_wage_article'],
          parent_link: null
        },
        {
          id: "economy",
          title: "Economy",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: true,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'overall',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "real_wage_of_typical_worker",
          title: "Real wage of typical worker",
          metric: "Wage of median worker, inflation adjusted",
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "allocation_of_real_wages",
          title: "Allocation of real wages",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'real_wage_of_typical_worker',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "real_wages",
          title: "Real wages",
          metric: "Average hourly earnings (inflation adjusted, 2016 dollars)",
          current_level: "2017: $22",
          trend: "1973 → 2017: +10%",
          source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'real_wage_of_typical_worker',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "labor_productivity",
          title: "How productive workers are",
          metric: "Labor productivity index (inflation adjusted)",
          current_level: null,
          trend: "1947 → 2017: +423%",
          source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth",
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'real_wages',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {//xxx
          id: "labor_share_of_national_income",
          title: "Share of national income that is received by workers",
          metric: null,
          current_level: "2017: 56.8%",
          trend: "1974 → 2017:  -12% | -7.7pp",
          source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'real_wages',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "inflation",
          title: "Inflation",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'real_wages',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "labor_demand",
          title: "Demand for labor",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'real_wages',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "economic_growth",
          title: "Strength of economy",
          metric: "Economic growth",
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_demand',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "labor_bargaining_power",
          title: "Labor bargaining power",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_share_of_national_income',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "competition_within_and_across_industries",
          title: "Competition within and across industries",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_share_of_national_income',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "technological_progress",
          title: "technological progress",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_share_of_national_income',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "capital_intensity_of_production",
          title: "Capital intensity of production",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_share_of_national_income',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "offshoring_of_labor-intensive_production",
          title: "offshoring of labor-intensive production",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_share_of_national_income',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "superstar_firms",
          title: "superstar firms",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_share_of_national_income',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "market_concentration",
          title: "Market concentration",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['brookings_wage_article'],
          parent_link: {
            parent_id: 'labor_share_of_national_income',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        }



      ]
    },
    noah_smith: {
      display_name: "Noah Smith",
      sources: [
        {
          id: "noah_bloomberg",
          title: "Article: 8 Charts Show Where America Stands in the 21st Century",
          url: "https://www.bloomberg.com/view/articles/2018-07-13/eight-charts-show-where-america-stands-in-the-21st-century"
        },
        {
          id: "civil_asset_forfeiture_tweet",
          title: "Tweet: Civil asset forfeiture",
          url: "https://twitter.com/Noahpinion/status/847221084936036352"
        }
      ],
      nodes: [
        {
          id: "overall",
          title: "Noah Smith's view",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: true,
          source_ids: ['noah_bloomberg', "civil_asset_forfeiture_tweet"],
          parent_link: null
        },
        {
          id: "economy",
          title: "Economy",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: true,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'overall',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "health",
          title: "Health",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: true,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'overall',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "society",
          title: "Society",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: true,
          source_ids: ['noah_bloomberg', "civil_asset_forfeiture_tweet"],
          parent_link: {
            parent_id: 'overall',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "inequality",
          title: "Inequality",
          metric: null,
          current_level: null,
          trend: "2000 → 2016: Increased",
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: 'mobility',
          title: "Wealth mobility",
          metric: "Chance of a child becoming richer than their parents",
          current_level: "2014: 50%",
          trend: "1970 → 2014: -46% | -42pp",
          source: "http://www.nber.org/papers/w22910",
          trend_direction: 'negative',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "income",
          title: "Income",
          metric: null,
          current_level: null,
          trend: "2000 → 2017: Improved",
          source: null,
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "poverty",
          title: "Poverty",
          metric: null,
          current_level: null,
          trend: "2000 → 2017: Improved",
          source: null,
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: 'employment',
          title: "Employment",
          metric: "Prime age employment rate",
          current_level: "2018: 79%",
          trend: "1994 → 2018: +0.52% | +0.41pp",
          source: "Federal Reserve Bank of St. Louis",
          trend_direction: 'positive',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: 'productivity',
          title: "Productivity",
          metric: "Annual total factor productivity growth rate",
          current_level: "2013: +0.88%",
          trend: "1996-2004 avg → 2005-2013 avg: -50% | -0.87pp",
          source: "U.S. Total Factor Productivity Slowdown - Evidence from the U.S. States",
          trend_direction: 'negative',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "product_quality",
          title: "Product quality & range",
          metric: null,
          current_level: null,
          trend: "2000 → 2018: Increased",
          source: null,
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'economy',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: 'gini_index',
          title: "Gini index",
          metric: "Gini index",
          current_level: "2016: 41.5",
          trend: "2000 → 2016: +2.72% | +1.1pp",
          source: "Federal Reserve Bank of St. Louis",
          trend_direction: 'negative',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'inequality',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: 'wealth_1',
          title: "Wealth share of top 1%",
          metric: "Wealth share of top 1%",
          current_level: "2012: 41.8%",
          trend: "2000 → 2012: +23% | +7.7pp",
          source: "Gabriel Zucman",
          trend_direction: 'negative',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'inequality',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: 'wealth_5',
          title: "Wealth share of top 5%",
          metric: "Wealth share of top 5%",
          current_level: "2012: 64.6%",
          trend: "2000 → 2012: +14% | +8.1pp",
          source: "Gabriel Zucman",
          trend_direction: 'negative',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'inequality',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: 'gdp_growth_rate',
          title: "GDP growth rate",
          metric: "GDP growth rate",
          current_level: "2017: 2.27%",
          trend: "1961-1980 avg → 1981-2017 avg: -30% | -1.17pp",
          source: "World Bank",
          trend_direction: 'negative',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'mobility',
            positive_relationship: true,
            lower_is_good: true,
            label: "Explanatory power: 29%.\nSource:\nhttps://www.nber.org/papers/w22910"
          }
        },
        {
          id: 'gdp_growth_distribution',
          title: "GDP growth distribution equality",
          metric: null,
          current_level: null,
          trend: "1961 → 2017: Decreased",
          source: "World Bank",
          trend_direction: 'negative',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'mobility',
            positive_relationship: true,
            lower_is_good: true,
            label: "Explanatory power: 71%\nSource:\nhttps://www.nber.org/papers/w22910"
          }
        },
        {
          id: 'real_compensation',
          title: "Real compensation per hour",
          metric: "Real compensation per hour",
          current_level: "2017: TBD",
          trend: "2000 → 2017: +11.5%",
          source: "Federal Reserve Bank of St. Louis",
          trend_direction: 'positive',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'income',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: 'real_median',
          title: "Real median personal income",
          metric: "Real median personal income",
          current_level: "2016: TBD",
          trend: "2000 → 2016: +3.7%",
          source: "Federal Reserve Bank of St. Louis",
          trend_direction: 'positive',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'income',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: 'child_poverty',
          title: "Child poverty",
          metric: "% of children living in poverty",
          current_level: "2016: 15.6%",
          trend: "2000 → 2016: -13% | -2.4pp",
          source: "Center on Budget and Policy Priorities",
          trend_direction: 'positive',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'poverty',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: 'homelessness',
          title: "Homelessness",
          metric: "% of population that is homeless",
          current_level: "2017: 0.21%",
          trend: "2007 → 2017: -21% | -0.04pp",
          source: "U.S. Department of Housing and Urban Development",
          trend_direction: 'positive',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'poverty',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "drugs",
          title: "Drugs",
          metric: null,
          current_level: null,
          trend: "1992 → 2016: Increased",
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'health',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "mortality",
          title: "Mortality",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'health',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: 'carbon_emissions',
          title: "Carbon emissions",
          metric: "Annual million metric tons",
          current_level: "2017: 5087.7",
          trend: "2005 → 2017: -13.23% | -776",
          source: "https://bit.ly/2mnvG49",
          trend_direction: 'positive',
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'health',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "teen_pregnancy",
          title: "Teen pregnancy",
          metric: "Births per 1,000 females aged 15-19",
          current_level: "2014: 24.2",
          trend: "1990 → 2014: -61% | -37.6",
          source: "Pew Research Center",
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'health',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "life_expectancy",
          title: "Life expectancy",
          metric: "Life expectancy",
          current_level: "2016: 78.69y",
          trend: "2000 → 2016: +2.68% | +2.05y",
          source: "Federal Reserve Bank of St Louis",
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'mortality',
            positive_relationship: false,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "infant_mortality",
          title: "Infant mortality",
          metric: "% of births resulting in death",
          current_level: "2016: 0.56%",
          trend: "1960 → 2016: -78.38% | -2.03pp",
          source: "Federal Reserve Bank of St. Louis",
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'mortality',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "minority_mortality",
          title: "Minority mortality",
          metric: null,
          current_level: null,
          trend: "2000 → 2017: Decreased",
          source: null,
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'mortality',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "white_mortality",
          title: "White mortality",
          metric: null,
          current_level: null,
          trend: "2000 → 2017: Increased",
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'mortality',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "suicides",
          title: "Suicides",
          metric: "Per 100k residents",
          current_level: "2015: 13.3",
          trend: "2000 → 2015: +28% | +2.9",
          source: "National Institute on Drug Abuse",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'mortality',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "alcoholism",
          title: "Alcoholism",
          metric: "% of adults with dependency",
          current_level: "2013: 13%",
          trend: "1992 → 2013: +73% | +5.5pp",
          source: "National Epidemiologic Survey on Alcohol and Related Conditions/JAMA",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'drugs',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "opiods",
          title: "Opiods",
          metric: "Opioid prescriptions, millions",
          current_level: "2013: 207m",
          trend: "2000 → 2013: +64% | +81m",
          source: "National Institute on Drug Abuse",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'drugs',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "heroin",
          title: "Heroin",
          metric: "% of population who used",
          current_level: "2013: 0.22%",
          trend: "2002 → 2013: +57% | +0.08pp",
          source: "Substance Abuse and Mental Health Services Administration",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'drugs',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "drug_deaths",
          title: "Drug deaths",
          metric: "% of population",
          current_level: "2016: 0.020%",
          trend: "1999 → 2016: +233% | +0.014pp",
          source: "https://www.drugabuse.gov",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'drugs',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "crime",
          title: "Crime & Legal System",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg', "civil_asset_forfeiture_tweet"],
          parent_link: {
            parent_id: 'society',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "trust",
          title: "Trust",
          metric: null,
          current_level: null,
          trend: "2000 → 2017: Decreased",
          source: null,
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'society',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "minority_rights",
          title: "Minority rights",
          metric: null,
          current_level: null,
          trend: null,
          source: null,
          trend_direction: "neutral",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'society',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "happiness",
          title: "Happiness",
          metric: "World Happiness Report score",
          current_level: "2017: 6.886/10",
          trend: "2008 → 2017:-0.315",
          source: "http://worldhappiness.report/",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'society',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "international_perception",
          title: "International perception",
          metric: "% of non-US people who perceive the US as a major threat to their country",
          current_level: "2017: 38%",
          trend: "2013 → 2017: +52% | +13pp",
          source: "Pew Research Center",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'society',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "civil_asset_forfeiture",
          title: "Civil asset forfeiture",
          metric: "Cash seized by DEA without civil/criminal charges filed or judicial review",
          current_level: "2007 → 2016: $3.2 billion",
          trend: "-",
          source: "https://oig.justice.gov/reports/2017/e1702.pdf",
          trend_direction: "neutral",
          noMetricExpected: false,
          source_ids: ['civil_asset_forfeiture_tweet'],
          parent_link: {
            parent_id: 'crime',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "crime_rate",
          title: "Crime",
          metric: "Annual crime rate per 100k residents",
          current_level: "2012: 3,200",
          trend: "1990 → 2012: -45% | -2,618",
          source: "https://bit.ly/1S5ohzu",
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'crime',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "incarceration",
          title: "Incarceration",
          metric: "People in prison or local jail per 100k residents 18 or older",
          current_level: "2016: 860",
          trend: "2000 → 2016: -7% | -60",
          source: "Bureau of Justice Statistics",
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'crime',
            positive_relationship: true,
            lower_is_good: false,
            label: null
          }
        },
        {
          id: "government_trust",
          title: "Trust in government",
          metric: "% who trust the govt in Washington always or most of the time",
          current_level: "2017: 18%",
          trend: "2000 → 2017: -47% | -16pp",
          source: "Pew Research Center",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'trust',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "social_trust",
          title: "Social trust",
          metric: "% who say most people can be trusted",
          current_level: "2014: 31%",
          trend: "2000 → 2014: -11% | -4pp",
          source: "Our World in Data",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'trust',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "gay_rights",
          title: "Gay rights",
          metric: "No quantitative measurement",
          current_level: null,
          trend: "2000 → 2018: Increased",
          source: null,
          trend_direction: "positive",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'minority_rights',
            positive_relationship: true,
            lower_is_good: true,
            label: null
          }
        },
        {
          id: "hate_crimes",
          title: "Hate crimes",
          metric: "Amount in 10 largest cities",
          current_level: "2017: 1,038",
          trend: "2010 → 2017: +33.08% | +258",
          source: "Center for the Study of Hate and Extremism",
          trend_direction: "negative",
          noMetricExpected: false,
          source_ids: ['noah_bloomberg'],
          parent_link: {
            parent_id: 'minority_rights',
            positive_relationship: false,
            lower_is_good: false,
            label: null
          }
        }
      ]
    }
  }
  for (var i = 0; i < window.all_data[window.entity_id].nodes.length; i++) {
    createNode(window.all_data[window.entity_id].nodes[i])
  }
  
}

function draw() {
  destroy();
  //var connectionCount = [];





  // create a network
  var container = document.getElementById('map');
  var data = {
    nodes: nodes_for_graph,
    edges: connections_for_graph
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
  window.entity_id = getParameterByName('id')
  window.source_id = getParameterByName('source_id')
  if (source_id === null) {
    window.source_id = 'all'
  }

  



  
  setupData()
  var node_id = getParameterByName('node_id')
  if (node_id === null) {
    node_id = 'overall'
  }
  draw()

  var entity_display_name = window.all_data[window.entity_id].display_name
  $(document).prop('title', "Policy Views: " + entity_display_name);
  $('#entity_name_heading').text(entity_display_name);

  for (var i = 0; i < window.all_data[window.entity_id].sources.length; i++) {
    var source = document.getElementById("source-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(window.all_data[window.entity_id].sources[i]);
    $('#source_selectors').append(html)
  }
  $('input[type=radio][name=source_selector]').change(function() {
    window.location = "view.html?source_id=" + this.value + "&id=" + window.entity_id;
  });
  $("input[name=source_selector][value=" + window.source_id + "]").prop('checked', true);


  var node = nodes_for_mobile_view.find(function(element) {return element['id'] == node_id})
  node["isMainNode"] = true

  var parentChain = [];
  // assumes only one parent
  var connectionForParent = connections_for_graph.find(function(edge) {return edge['to'] == node_id})
  while (connectionForParent != undefined){
    var parentNode = nodes_for_mobile_view.find(function(element) {return element['id'] == connectionForParent["from"]})
    parentChain.unshift(parentNode)
    var connectionForParent = connections_for_graph.find(function(edge) {return edge['to'] == parentNode.id})
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

  var connectionsLeadingToChildren = connections_for_graph.filter(edge => edge['from'] == node_id).filter(val => {
    return nodes_for_mobile_view.find(function(element) {return element['id'] == val["to"]}) != null;
  });
  //
  node["childCount"] = connectionsLeadingToChildren.length
  addNodeToPage(node, $('#node'))
  $('#childCount').text(connectionsLeadingToChildren.length)
  if (connectionsLeadingToChildren.length == 1) {
    $('#contributing_factor_s').hide()
  } else {
    $('#contributing_factor_s').show()
  }

  //
  for (var i = 0; i < connectionsLeadingToChildren.length; i++) {
    var childNode = nodes_for_mobile_view.find(function(element) {return element['id'] == connectionsLeadingToChildren[i]["to"]})
    var connectionsLeadingToChildsChildren = connections_for_graph.filter(edge => edge['from'] == childNode.id);
    childNode["childCount"] = connectionsLeadingToChildsChildren.length
    if (connectionsLeadingToChildren[i]["label"] != null) {
      childNode["connection_label"] = connectionsLeadingToChildren[i]["label"]
    }
    childNode["show_contributing_factor_s"] = childNode["childCount"] != 1
    addNodeToPage(childNode, $('#childNodes'))
  }
  if (connectionsLeadingToChildren.length == 0) {
    $('#nothingHere').show()
  }
  

  var introModalViewedCookie = getCookie('introModalViewed');
  if (introModalViewedCookie == null && window.location.href.indexOf("policyviews") > -1) {
    $('#introModal').modal('toggle')
    setCookie('introModalViewed', 'true');
  }

  $('.nodeLink').each(function() {
    var href = $(this).attr('href');
    $(this).attr('href', href + "&source_id=" + window.source_id + "&id="+window.entity_id);
  });
  

});