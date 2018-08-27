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
        title: "Brooking's overall view for the US",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: true,
        source_ids: ['brookings_wage_article'],
        parent_link: null
      },
      {
        id: "economy",
        title: "Health of economy",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: true,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'overall',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "real_wage_of_typical_worker",
        title: "Real wage of typical worker",
        metric: "Wage of median worker, inflation adjusted",
        current_level: null,
        trend_copy: null,
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth/",
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "equality_of_real_wages",
        title: "Equality of real wages",
        metric: null,
        current_level: null,
        trend_copy: "1979 → 2016: Decreased",
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth/",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'real_wage_of_typical_worker',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "globalization",
        title: "Globalization",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "Haskel et al. 2012",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'equality_of_real_wages',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "us_imports",
        title: "U.S. Manufacturing Imports",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth/",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'globalization',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "wage_benefit_to_a_college_degree",
        title: "Wage benefit for a college degree",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth/",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'equality_of_real_wages',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "union_membership",
        title: "Union membership",
        metric: "% of workers that belong to a union",
        current_level: "2006: 10%",
        trend_copy: "1956 → 2016: -64% | -18pp",
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth/",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'equality_of_real_wages',
          positive_relationship: false,
          connection_source: "Card 2001",
          label: "Unionization rates of men fell from 1973 to 1993...these trends account for 15-20% of the rise in male wage inequality."
        }
      },
      {
        id: "technological_progress_2",
        title: "Technological change that raises the relative productivity of high-skill workers",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "Autor, Katz, and Kearney 2008; Goldin and Katz 2010",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'equality_of_real_wages',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "real_wages",
        title: "Real wages",
        metric: "Average hourly earnings (inflation adjusted, 2016 dollars)",
        current_level: "2017: $22",
        trend_copy: "1973 → 2017: +10%",
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'real_wage_of_typical_worker',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "labor_productivity",
        title: "How productive workers are",
        metric: "Labor productivity index (inflation adjusted)",
        current_level: null,
        trend_copy: "1947 → 2017: +423%",
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth",
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'real_wages',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "labor_share_of_national_income",
        title: "Share of national income that is received by workers",
        metric: null,
        current_level: "2017: 56.8%",
        trend_copy: "1974 → 2017:  -12% | -7.7pp",
        metric_source: "https://www.brookings.edu/research/thirteen-facts-about-wage-growth",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'real_wages',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "inflation",
        title: "Inflation",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'real_wages',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "labor_demand",
        title: "Demand for labor",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'real_wages',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "economic_growth",
        title: "Strength of economy",
        metric: "Economic growth",
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_demand',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "labor_bargaining_power",
        title: "Labor bargaining power",
        metric: null,
        current_level: null,
        trend_copy: "Decreased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_share_of_national_income',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "competition_within_and_across_industries",
        title: "Competition within and across industries",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_share_of_national_income',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "technological_progress",
        title: "Technological progress",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "International Monetary Fund 2017",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_share_of_national_income',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "capital_intensity_of_production",
        title: "Capital intensity of production",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "Karabarbounis and Neiman 2014",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_share_of_national_income',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "offshoring_of_labor_intensive_production",
        title: "Offshoring of labor-intensive production",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_share_of_national_income',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "superstar_firms",
        title: "Superstar firms",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "Autor et al. 2017",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_share_of_national_income',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "market_concentration",
        title: "Market concentration",
        metric: null,
        current_level: null,
        trend_copy: "Increased",
        metric_source: "Furman 2016",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['brookings_wage_article'],
        parent_link: {
          parent_id: 'labor_share_of_national_income',
          positive_relationship: false,
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
        title: "Noah Smith's overall view for the US",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: true,
        source_ids: ['noah_bloomberg', "civil_asset_forfeiture_tweet"],
        parent_link: null
      },
      {
        id: "economy",
        title: "Health of economy",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: true,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'overall',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "health",
        title: "Health of people",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: true,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'overall',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "society",
        title: "Health of society",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: true,
        source_ids: ['noah_bloomberg', "civil_asset_forfeiture_tweet"],
        parent_link: {
          parent_id: 'overall',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "inequality",
        title: "Inequality",
        metric: null,
        current_level: null,
        trend_copy: "2000 → 2016: Increased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: 'mobility',
        title: "Wealth mobility",
        metric: "Chance of a child becoming richer than their parents",
        current_level: "2014: 50%",
        trend_copy: "1970 → 2014: -46% | -42pp",
        metric_source: "http://www.nber.org/papers/w22910",
        improved_or_worsened_or_neutral_in_context_only: 'worsened',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "income",
        title: "Income",
        metric: null,
        current_level: null,
        trend_copy: "2000 → 2017: Increased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "poverty",
        title: "Poverty",
        metric: null,
        current_level: null,
        trend_copy: "2000 → 2017: Improved",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: 'employment',
        title: "Employment",
        metric: "Prime age employment rate",
        current_level: "2018: 79%",
        trend_copy: "1994 → 2018: +0.52% | +0.41pp",
        metric_source: "Federal Reserve Bank of St. Louis",
        improved_or_worsened_or_neutral_in_context_only: 'improved',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'productivity',
        title: "Productivity",
        metric: "Annual total factor productivity growth rate",
        current_level: "2013: +0.88%",
        trend_copy: "1996-2004 avg → 2005-2013 avg: -50% | -0.87pp",
        metric_source: "U.S. Total Factor Productivity Slowdown - Evidence from the U.S. States",
        improved_or_worsened_or_neutral_in_context_only: 'worsened',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "product_quality",
        title: "Product quality & range",
        metric: null,
        current_level: null,
        trend_copy: "2000 → 2018: Increased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'economy',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'gini_index',
        title: "Gini index",
        metric: "Gini index",
        current_level: "2016: 41.5",
        trend_copy: "2000 → 2016: +2.72% | +1.1pp",
        metric_source: "Federal Reserve Bank of St. Louis",
        improved_or_worsened_or_neutral_in_context_only: 'worsened',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'inequality',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'wealth_1',
        title: "Wealth share of top 1%",
        metric: "Wealth share of top 1%",
        current_level: "2012: 41.8%",
        trend_copy: "2000 → 2012: +23% | +7.7pp",
        metric_source: "Gabriel Zucman",
        improved_or_worsened_or_neutral_in_context_only: 'worsened',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'inequality',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'wealth_5',
        title: "Wealth share of top 5%",
        metric: "Wealth share of top 5%",
        current_level: "2012: 64.6%",
        trend_copy: "2000 → 2012: +14% | +8.1pp",
        metric_source: "Gabriel Zucman",
        improved_or_worsened_or_neutral_in_context_only: 'worsened',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'inequality',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'gdp_growth_rate',
        title: "GDP growth rate",
        metric: "GDP growth rate",
        current_level: "2017: 2.27%",
        trend_copy: "1961-1980 avg → 1981-2017 avg: -30% | -1.17pp",
        metric_source: "World Bank",
        improved_or_worsened_or_neutral_in_context_only: 'worsened',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'mobility',
          positive_relationship: true,
          connection_source: "https://www.nber.org/papers/w22910",
          label: "Explanatory power: 29%"
        }
      },
      {
        id: 'gdp_growth_distribution',
        title: "GDP growth distribution equality",
        metric: null,
        current_level: null,
        trend_copy: "1961 → 2017: Decreased",
        metric_source: "World Bank",
        improved_or_worsened_or_neutral_in_context_only: 'worsened',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'mobility',
          positive_relationship: true,
          connection_source: "https://www.nber.org/papers/w22910",
          label: "Explanatory power: 71%"
        }
      },
      {
        id: 'real_compensation',
        title: "Real compensation per hour",
        metric: "Real compensation per hour",
        current_level: "2017: TBD",
        trend_copy: "2000 → 2017: +11.5%",
        metric_source: "Federal Reserve Bank of St. Louis",
        improved_or_worsened_or_neutral_in_context_only: 'improved',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'income',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'real_median',
        title: "Real median personal income",
        metric: "Real median personal income",
        current_level: "2016: TBD",
        trend_copy: "2000 → 2016: +3.7%",
        metric_source: "Federal Reserve Bank of St. Louis",
        improved_or_worsened_or_neutral_in_context_only: 'improved',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'income',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'child_poverty',
        title: "Child poverty",
        metric: "% of children living in poverty",
        current_level: "2016: 15.6%",
        trend_copy: "2000 → 2016: -13% | -2.4pp",
        metric_source: "Center on Budget and Policy Priorities",
        improved_or_worsened_or_neutral_in_context_only: 'improved',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'poverty',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: 'homelessness',
        title: "Homelessness",
        metric: "% of population that is homeless",
        current_level: "2017: 0.21%",
        trend_copy: "2007 → 2017: -21% | -0.04pp",
        metric_source: "U.S. Department of Housing and Urban Development",
        improved_or_worsened_or_neutral_in_context_only: 'improved',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'poverty',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "drugs",
        title: "Drugs",
        metric: null,
        current_level: null,
        trend_copy: "1992 → 2016: Increased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'health',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "mortality",
        title: "Mortality",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'health',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: 'carbon_emissions',
        title: "Carbon emissions",
        metric: "Annual million metric tons",
        current_level: "2017: 5087.7",
        trend_copy: "2005 → 2017: -13.23% | -776",
        metric_source: "https://bit.ly/2mnvG49",
        improved_or_worsened_or_neutral_in_context_only: 'improved',
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'health',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "teen_pregnancy",
        title: "Teen pregnancy",
        metric: "Births per 1,000 females aged 15-19",
        current_level: "2014: 24.2",
        trend_copy: "1990 → 2014: -61% | -37.6",
        metric_source: "Pew Research Center",
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'health',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "life_expectancy",
        title: "Life expectancy",
        metric: "Life expectancy",
        current_level: "2016: 78.69y",
        trend_copy: "2000 → 2016: +2.68% | +2.05y",
        metric_source: "Federal Reserve Bank of St Louis",
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'mortality',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "infant_mortality",
        title: "Infant mortality",
        metric: "% of births resulting in death",
        current_level: "2016: 0.56%",
        trend_copy: "1960 → 2016: -78.38% | -2.03pp",
        metric_source: "Federal Reserve Bank of St. Louis",
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'mortality',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "minority_mortality",
        title: "Minority mortality",
        metric: null,
        current_level: null,
        trend_copy: "2000 → 2017: Decreased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'mortality',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "white_mortality",
        title: "White mortality",
        metric: null,
        current_level: null,
        trend_copy: "2000 → 2017: Increased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'mortality',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "suicides",
        title: "Suicides",
        metric: "Per 100k residents",
        current_level: "2015: 13.3",
        trend_copy: "2000 → 2015: +28% | +2.9",
        metric_source: "National Institute on Drug Abuse",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'mortality',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "alcoholism",
        title: "Alcoholism",
        metric: "% of adults with dependency",
        current_level: "2013: 13%",
        trend_copy: "1992 → 2013: +73% | +5.5pp",
        metric_source: "National Epidemiologic Survey on Alcohol and Related Conditions/JAMA",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'drugs',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "opiods",
        title: "Opiods",
        metric: "Opioid prescriptions, millions",
        current_level: "2013: 207m",
        trend_copy: "2000 → 2013: +64% | +81m",
        metric_source: "National Institute on Drug Abuse",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'drugs',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "heroin",
        title: "Heroin",
        metric: "% of population who used",
        current_level: "2013: 0.22%",
        trend_copy: "2002 → 2013: +57% | +0.08pp",
        metric_source: "Substance Abuse and Mental Health Services Administration",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'drugs',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "drug_deaths",
        title: "Drug deaths",
        metric: "% of population",
        current_level: "2016: 0.020%",
        trend_copy: "1999 → 2016: +233% | +0.014pp",
        metric_source: "https://www.drugabuse.gov",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'drugs',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "crime",
        title: "Crime",
        metric: null,
        current_level: null,
        trend_copy: "Improved",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg', "civil_asset_forfeiture_tweet"],
        parent_link: {
          parent_id: 'society',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "trust",
        title: "Trust",
        metric: null,
        current_level: null,
        trend_copy: "2000 → 2017: Decreased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'society',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "minority_rights",
        title: "Minority rights",
        metric: null,
        current_level: null,
        trend_copy: null,
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'society',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "happiness",
        title: "Happiness",
        metric: "World Happiness Report score",
        current_level: "2017: 6.886/10",
        trend_copy: "2008 → 2017:-0.315",
        metric_source: "http://worldhappiness.report/",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'society',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "international_perception",
        title: "International perception",
        metric: "% of non-US people who perceive the US as a major threat to their country",
        current_level: "2017: 38%",
        trend_copy: "2013 → 2017: +52% | +13pp",
        metric_source: "Pew Research Center",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'society',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "civil_asset_forfeiture",
        title: "Civil asset forfeiture",
        metric: "Cash seized by DEA without civil/criminal charges filed or judicial review",
        current_level: "2007 → 2016: $3.2 billion",
        trend_copy: "-",
        metric_source: "https://oig.justice.gov/reports/2017/e1702.pdf",
        improved_or_worsened_or_neutral_in_context_only: "neutral",
        noMetricExpected: false,
        source_ids: ['civil_asset_forfeiture_tweet'],
        parent_link: {
          parent_id: 'crime',
          positive_relationship: false,
          label: null
        }
      },
      {
        id: "crime_rate",
        title: "Crime",
        metric: "Annual crime rate per 100k residents",
        current_level: "2012: 3,200",
        trend_copy: "1990 → 2012: -45% | -2,618",
        metric_source: "https://bit.ly/1S5ohzu",
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'crime',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "incarceration",
        title: "Incarceration",
        metric: "People in prison or local jail per 100k residents 18 or older",
        current_level: "2016: 860",
        trend_copy: "2000 → 2016: -7% | -60",
        metric_source: "Bureau of Justice Statistics",
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'crime',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "government_trust",
        title: "Trust in government",
        metric: "% who trust the govt in Washington always or most of the time",
        current_level: "2017: 18%",
        trend_copy: "2000 → 2017: -47% | -16pp",
        metric_source: "Pew Research Center",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'trust',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "social_trust",
        title: "Social trust",
        metric: "% who say most people can be trusted",
        current_level: "2014: 31%",
        trend_copy: "2000 → 2014: -11% | -4pp",
        metric_source: "Our World in Data",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'trust',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "gay_rights",
        title: "Gay rights",
        metric: "No quantitative measurement",
        current_level: null,
        trend_copy: "2000 → 2018: Increased",
        metric_source: null,
        improved_or_worsened_or_neutral_in_context_only: "improved",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'minority_rights',
          positive_relationship: true,
          label: null
        }
      },
      {
        id: "hate_crimes",
        title: "Hate crimes",
        metric: "Amount in 10 largest cities",
        current_level: "2017: 1,038",
        trend_copy: "2010 → 2017: +33.08% | +258",
        metric_source: "Center for the Study of Hate and Extremism",
        improved_or_worsened_or_neutral_in_context_only: "worsened",
        noMetricExpected: false,
        source_ids: ['noah_bloomberg'],
        parent_link: {
          parent_id: 'minority_rights',
          positive_relationship: false,
          label: null
        }
      }
    ]
  }
}