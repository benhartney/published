$.fn.typingFinished = function(timeout, callback) {
  var timer = undefined,
      self = $(this);

  self.keyup(function(e) {
    if(typeof timer == "undefined") {
      timer = setTimeout(function() {
        callback(e);
      }, timeout);
    }
  }).keydown(function(e) {
    if(typeof timer !== "undefined") {
      clearTimeout(timer);
      timer = undefined;
    }
  });

  return self;
}

function create_chart(country) {
  var ctx = $("#countryOutcomeChart");
  var countryOutcomeChart = new Chart(ctx, {
    "type":"line",
    "data":{
      "labels":["2014","2015"],
      "datasets":[
        {
          "data":[
            country["2014"]["weighted_outcome_display"],
            country["2015"]["weighted_outcome_display"]
          ],
          "fill":false,
          "borderColor":"rgb(75, 192, 192)",
          "lineTension":0.1
        }
      ]
    },
    "options": {
      "legend": {
        "display":false
      },
      "scales": {
        "yAxes": [
          {
            "display": true,
            "ticks": {
              //"beginAtZero":true,
              //"min": 2,
              //"max": 10
            }
          }
        ]
      }
    }
  })
}

const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return (Math.round(value * multiplier) / multiplier).toFixed(precision);
}

function average(arr) {
  if (window.geo) {
    return jStat.geomean(arr)
  } else {
    return arrAvg(arr)
  }
}

function convertStringToInt(income) {
  if (typeof(income) == "string") {
    return parseInt(income.replace(/\,/g,''))
  } else {
    return income
  }
}

jQuery.fn.forceNumeric = function () {

     return this.each(function () {
         $(this).keydown(function (e) {
             var key = e.which || e.keyCode;

             if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
             // numbers   
                key >= 48 && key <= 57 ||
             // Numeric keypad
                key >= 96 && key <= 105 ||
             // comma, period and minus, . on keypad
                key == 190 || key == 188 || key == 109 || key == 110 ||
             // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
             // Home and End
                key == 35 || key == 36 ||
             // left and right arrows
                key == 37 || key == 39 ||
             // Del and Ins
                key == 46 || key == 45)
                return true;

            return false;
        });
    });
}


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


/* ****************************************************************************************************************************** */


function expectedSchoolingIndex(expectedSchoolingValue) {
  var expectedSchoolingMin = 0//$('#expected-schooling-min').val()
  var expectedSchoolingMax = $('#expected-schooling-max').val()
  if (expectedSchoolingValue > expectedSchoolingMax) {
    expectedSchoolingValue = expectedSchoolingMax
  } else if (expectedSchoolingValue < expectedSchoolingMin) {
    expectedSchoolingValue = expectedSchoolingMin
  }
  return (expectedSchoolingValue  /  expectedSchoolingMax)
}

function meanSchoolingIndex(meanSchoolingValue) {
  var meanSchoolingMin = 0//$('#mean-schooling-min').val()
  var meanSchoolingMax = $('#mean-schooling-max').val()
  if (meanSchoolingValue > meanSchoolingMax) {
    meanSchoolingValue = meanSchoolingMax
  } else if (meanSchoolingValue < meanSchoolingMin) {
    meanSchoolingValue = meanSchoolingMin
  }
  return (meanSchoolingValue  /  meanSchoolingMax)
}

function lifeExpectancyIndex(lifeExpectancyValue) {
  var lifeExpectancyMin = 20//$('#life-expectancy-min').val()
  var lifeExpectancyMax = $('#life-expectancy-max').val()
  if (lifeExpectancyValue > lifeExpectancyMax) {
    lifeExpectancyValue = lifeExpectancyMax
  } else if (lifeExpectancyValue < lifeExpectancyMin) {
    lifeExpectancyValue = lifeExpectancyMin
  }
  return ((lifeExpectancyValue - lifeExpectancyMin) / (lifeExpectancyMax - lifeExpectancyMin))
}

function incomeIndex(incomeValue) {
  var incomeMin = 100//$('#income-min').val()
  var incomeMax = $('#income-max').val()
  if (incomeValue > incomeMax) {
    incomeValue = incomeMax
  } else if (incomeValue < incomeMin) {
    incomeValue = incomeMin
  }
  if (window.incomeLog) {
    return (Math.log(incomeValue) - Math.log(incomeMin))  /  (Math.log(incomeMax) - Math.log(incomeMin))
  } else {
    return (incomeValue - incomeMin)  /  (incomeMax - incomeMin)
  }
}

/* ****************************************************************************************************************************** */

function calculateCountries() {


  var lifeExpectancyWeighting = $('#life-expectancy-weighting').text()
  var meanSchoolingWeighting = $('#mean-schooling-weighting').text()
  var expectedSchoolingWeighting = $('#expected-schooling-weighting').text()
  var incomeWeighting = $('#income-weighting').text()

  var lifeExpectancyMax = $('#life-expectancy-max').val()
  var meanSchoolingMax = $('#mean-schooling-max').val()
  var expectedSchoolingMax = $('#expected-schooling-max').val()
  var incomeMax = $('#income-max').val()

  const factor = 0.01111111111 // this is just the component that gets the equal increases all >= 1, when weighting is at 100%. I think any number could be used here, but this one just creates a good starting point number visual for the equal weight increases using the default weights

  const lifeExpectancyIndexChange = 0.005128205128
  const meanSchoolingIndexChange = 0.01111111111
  const expectedSchoolingIndexChange = 0.009259259259
  const incomeIndexChange = 0.000004450378282

  var maxPossible = average([
    lifeExpectancyIndex(lifeExpectancyMax) * ((factor / lifeExpectancyWeighting) / lifeExpectancyIndexChange),
    (((meanSchoolingIndex(meanSchoolingMax) * ((factor / meanSchoolingWeighting) / meanSchoolingIndexChange)) + (expectedSchoolingIndex(expectedSchoolingMax) * ((factor / expectedSchoolingWeighting) / expectedSchoolingIndexChange))) / 2),
    incomeIndex(incomeMax) * ((factor / incomeWeighting) / incomeIndexChange)
  ])

  
  for (var i = 0; i < window.countries.length; i++) {
      var x = ["2015", "2014"]
      for (var a = 0; a < x.length; a++) {
        var temp = x[a]
        var lifeExpectancyValue = window.countries[i][temp]["life_expectancy"]
        var meanSchoolingValue = window.countries[i][temp]["mean_schooling"]
        var expectedSchoolingValue = window.countries[i][temp]["expected_schooling"]
        var incomeValue = convertStringToInt(window.countries[i][temp]["income"])

        var outcome = average([
          lifeExpectancyIndex(lifeExpectancyValue) * ((factor / lifeExpectancyWeighting) / lifeExpectancyIndexChange),
          ((meanSchoolingIndex(meanSchoolingValue) * ((factor / meanSchoolingWeighting) / meanSchoolingIndexChange)) + (expectedSchoolingIndex(expectedSchoolingValue) * ((factor / expectedSchoolingWeighting) / expectedSchoolingIndexChange)))  /  2,
          incomeIndex(incomeValue) * ((factor / incomeWeighting ) / incomeIndexChange)
        ])

        var weightedOutcome = outcome / maxPossible

        window.countries[i][temp]["weighted_outcome"] = weightedOutcome
        window.countries[i][temp]["weighted_outcome_display"] = round(weightedOutcome*10, 1)
      }
  }



  window.countries.sort(function(a,b) {
    return (a["2015"]["weighted_outcome"] < b["2015"]["weighted_outcome"]) ? 1 : ((b["2015"]["weighted_outcome"] < a["2015"]["weighted_outcome"]) ? -1 : 0);
  });

  $("#table-body").empty()

  for (var i = 0; i < window.countries.length; i++) {
    $("#table-body").append("<tr class='country-row' id='" + window.countries[i]["id"] + "'><th>" + (i + 1) + "</th><td><a href='#' class='edit-country'>" + window.countries[i]["name"] + "</a></td><td>" + window.countries[i]["2015"]["weighted_outcome_display"] + '</td><td><a href="#" class="edit-country"><svg class="octicon octicon-pencil" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 0 1 1.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"></path></svg></a></td></tr>')
  }

  if (typeof window.country_being_edited !== 'undefined') {

    var countryRow = $('#' + window.country_being_edited["id"])

    countryRow.addClass("selected-country")

    if(typeof window.timer !== "undefined") {
      clearTimeout(window.timer);
      window.timer = undefined;
    }
    if(typeof window.timer == "undefined") {
      window.timer = setTimeout(function() {
        $('#table-column').animate({
            scrollTop: countryRow.position().top - 200,
        }, 1000, function() {});
      }, 500);
    }



    create_chart(window.country_being_edited)

  }


}

$(document).ready(function() {

  $('#life-expectancy-weighting-reduce').click(function() {
    var existingVal = convertStringToInt($('#life-expectancy-weighting').text())
    $('#life-expectancy-weighting').text(existingVal + 1)
    calculateCountries();
    return false;
  });

  $('#life-expectancy-weighting-increase').click(function() {
    var existingVal = convertStringToInt($('#life-expectancy-weighting').text())
    if (existingVal > 1) {
      $('#life-expectancy-weighting').text(existingVal - 1)
      calculateCountries();
    }
    return false;
  });

  $('#mean-schooling-weighting-reduce').click(function() {
    var existingVal = convertStringToInt($('#mean-schooling-weighting').text())
    $('#mean-schooling-weighting').text(existingVal + 1)
    calculateCountries();
    return false;
  });

  $('#mean-schooling-weighting-increase').click(function() {
    var existingVal = convertStringToInt($('#mean-schooling-weighting').text())
    if (existingVal > 1) {
      $('#mean-schooling-weighting').text(existingVal - 1)
      calculateCountries();
    }
    return false;
  });

    $('#expected-schooling-weighting-reduce').click(function() {
    var existingVal = convertStringToInt($('#expected-schooling-weighting').text())
    $('#expected-schooling-weighting').text(existingVal + 1)
    calculateCountries();
    return false;
  });

  $('#expected-schooling-weighting-increase').click(function() {
    var existingVal = convertStringToInt($('#expected-schooling-weighting').text())
    if (existingVal > 1) {
      $('#expected-schooling-weighting').text(existingVal - 1)
      calculateCountries();
    }
    return false;
  });

    $('#income-weighting-reduce').click(function() {
    var existingVal = convertStringToInt($('#income-weighting').text())
    $('#income-weighting').text(existingVal + 1000)
    calculateCountries();
    return false;
  });

  $('#income-weighting-increase').click(function() {
    var existingVal = convertStringToInt($('#income-weighting').text())
    if (existingVal > 500) {
      $('#income-weighting').text(existingVal - 1000)
      calculateCountries();
    }
    return false;
  });

  $('#introContinue').click(function() {
    $('#intro').hide();
    setCookie('introHidden','true',7);
    return false;
  });

  $('#showIntro').click(function() {
    $('#intro').show();
    return false;
  });

  var introHiddenCookieValue = getCookie('introHidden');
  console.log("introHiddenCookieValue")
  console.log(introHiddenCookieValue)
  if (introHiddenCookieValue != null) {
    $('#intro').hide();
  }




  

  $("input").forceNumeric();

  $('body').on('click', '.edit-country', function() {
    $('.country-row').removeClass('selected-country')
    var row = $(this).parent().parent()
    row.addClass('selected-country')
    var id = row.attr('id')
    window.country_being_edited = window.countries.find(function(element) {
      return element["id"] == id
    });
    $('#life-expectancy').val(window.country_being_edited["2015"]["life_expectancy"])
    $('#mean-schooling').val(window.country_being_edited["2015"]["mean_schooling"])
    $('#expected-schooling').val(window.country_being_edited["2015"]["expected_schooling"])
    $('#income').val(window.country_being_edited["2015"]["income"])
    $('#country-name').text("Country Stats: " + window.country_being_edited["name"])
    $('#countryEditInstructions').hide()
    $('#country-inputs').show()

    create_chart(window.country_being_edited)


    return false
  });

  

  $('#geoCheckbox').change(function() {
    window.geo = this.checked
    calculateCountries();
    $('#geoCheckbox').val(this.checked);  
  });

  

  $('#incomeLogCheckbox').change(function() {
    window.incomeLog = this.checked
    calculateCountries();
    $('#incomeLogCheckbox').val(this.checked);  
  });

  window.geo = $('#geoCheckbox').is(":checked")
  window.incomeLog = $('#incomeLogCheckbox').is(":checked")

  //$('.model-input').typingFinished(500, function(e) {
  //  calculateCountries();
  //});

  $('#life-expectancy').typingFinished(500, function(e) {
    window.country_being_edited["2015"]["life_expectancy"] = convertStringToInt($(e["target"]).val())
    calculateCountries();
  });
  $('#mean-schooling').typingFinished(500, function(e) {
    window.country_being_edited["2015"]["mean_schooling"] = convertStringToInt($(e["target"]).val())
    calculateCountries();
  });
  $('#expected-schooling').typingFinished(500, function(e) {
    window.country_being_edited["2015"]["expected_schooling"] = convertStringToInt($(e["target"]).val())
    calculateCountries();
  });
  $('#income').typingFinished(500, function(e) {
    window.country_being_edited["2015"]["income"] = convertStringToInt($(e["target"]).val())
    calculateCountries();
  });

  var data = [[1,"Norway",0.949,,81.7,81.6,17.7,17.5,12.7,12.6,"67,614",64992,5,,1],[2,"Australia",0.939,,82.5,82.4,20.4,20.2,13.2,13,"42,822",42261,19,,3],[2,"Switzerland",0.939,,83.1,83,16.0,15.8,13.4,12.8,"56,364",56431,7,,2],[4,"Germany",0.926,,81.1,80.9,17.1,16.5,13.2,13.1,"45,000",43919,13,,4],[5,"Denmark",0.925,,80.4,80.2,19.2,18.7,12.7,12.7,"44,519",44025,13,,6],[5,"Singapore",0.925,,83.2,83,15.4,15.4,11.6,10.6,"78,162",76628,-3,,4],[7,"Netherlands",0.924,,81.7,81.6,18.1,17.9,11.9,11.9,"46,326",45435,8,,6],[8,"Ireland",0.923,,81.1,80.9,18.6,18.6,12.3,12.2,"43,798",39568,11,,8],[9,"Iceland",0.921,,82.7,82.6,19.0,19,12.2,10.6,"37,065",35182,20,,9],[10,"Canada",0.920,,82.2,82,16.3,15.9,13.1,13,"42,582",42155,12,,9],[10,"United States",0.920,,79.2,79.1,16.5,16.5,13.2,12.9,"53,245",52947,1,,11],[12,"Hong Kong, China (SAR)",0.917,,84.2,84,15.7,15.6,11.6,11.2,"54,265",53959,-2,,12],[13,"New Zealand",0.915,,82.0,81.8,19.2,19.2,12.5,12.5,"32,870",32689,20,,13],[14,"Sweden",0.913,,82.3,82.2,16.1,15.8,12.3,12.1,"46,251",45636,2,,15],[15,"Liechtenstein",0.912,,80.2,80,14.6,15,12.4,11.8,"75,065",79851,-11,,14],[16,"United Kingdom",0.909,,80.8,80.7,16.3,16.2,13.3,13.1,"37,931",39267,10,,16],[17,"Japan",0.903,,83.7,83.5,15.3,15.3,12.5,11.5,"37,268",36927,10,,17],[18,"Korea (Republic of)",0.901,,82.1,81.9,16.6,16.9,12.2,11.9,"34,541",33890,12,,18],[19,"Israel",0.899,,82.6,82.4,16.0,16,12.8,12.5,"31,215",30676,16,,19],[20,"Luxembourg",0.898,,81.9,81.7,13.9,13.9,12.0,11.7,"62,471",58711,-12,,20],[21,"France",0.897,,82.4,82.2,16.3,16,11.6,11.1,"38,085",38056,4,,22],[22,"Belgium",0.896,,81.0,80.8,16.6,16.3,11.4,11.3,"41,243",41187,1,,21],[23,"Finland",0.895,,81.0,80.8,17.0,17.1,11.2,10.3,"38,868",38695,1,,23],[24,"Austria",0.893,,81.6,81.4,15.9,15.7,11.3,10.8,"43,609",43869,-4,,24],[25,"Slovenia",0.890,,80.6,80.4,17.3,16.8,12.1,11.9,"28,664",27852,13,,25],[26,"Italy",0.887,,83.3,83.1,16.3,16,10.9,10.1,"33,573",33030,6,,27],[27,"Spain",0.884,,82.8,82.6,17.7,17.3,9.8,9.6,"32,779",32045,7,,26],[28,"Czech Republic",0.878,,78.8,78.6,16.8,16.4,12.3,12.3,"28,144",26660,11,,28],[29,"Greece",0.866,,81.1,80.9,17.2,17.6,10.5,10.3,"24,808",24524,16,,29],[30,"Brunei Darussalam",0.865,,79.0,78.8,14.9,14.5,9.0,8.8,"72,843",72570,-25,,30],[30,"Estonia",0.865,,77.0,76.8,16.5,16.5,12.5,12.5,"26,362",25214,12,,31],[32,"Andorra",0.858,,81.5,81.3,13.5,13.5,10.3,9.6,"47,979",43978,-18,,32],[33,"Cyprus",0.856,,80.3,80.2,14.3,14,11.7,11.6,"29,459",28633,4,,34],[33,"Malta",0.856,,80.7,80.6,14.6,14.4,11.3,10.3,"29,500",27930,3,,35],[33,"Qatar",0.856,,78.3,78.2,13.4,13.8,9.8,9.1,"129,916",123124,-32,,33],[36,"Poland",0.855,,77.6,77.4,16.4,15.5,11.9,11.8,"24,117",23177,11,,36],[37,"Lithuania",0.848,,73.5,73.3,16.5,16.4,12.7,12.4,"26,006",24500,7,,37],[38,"Chile",0.847,,82.0,81.7,16.3,15.2,9.9,9.8,"21,665",21290,16,,38],[38,"Saudi Arabia",0.847,,74.4,74.3,16.1,16.3,9.6,8.7,"51,320",52821,-26,,38],[40,"Slovakia",0.845,,76.4,76.3,15.0,15.1,12.2,12.2,"26,764",25845,1,,40],[41,"Portugal",0.843,,81.2,80.9,16.6,16.3,8.9,8.2,"26,104",25757,2,,41],[42,"United Arab Emirates",0.840,,77.1,77,13.3,13.3,9.5,9.5,"66,203",60868,-35,,42],[43,"Hungary",0.836,,75.3,75.2,15.6,15.4,12.0,11.6,"23,394",22916,6,,43],[44,"Latvia",0.830,,74.3,74.2,16.0,15.2,11.7,11.5,"22,589",22281,7,,44],[45,"Argentina",0.827,,76.5,76.3,17.3,17.9,9.9,9.8,"20,945",22050,12,,45],[45,"Croatia",0.827,,77.5,77.3,15.3,14.8,11.2,11,"20,291",19409,14,,46],[47,"Bahrain",0.824,,76.7,76.6,14.5,14.4,9.4,9.4,"37,236",38599,-19,,46],[48,"Montenegro",0.807,,76.4,76.2,15.1,15.2,11.3,11.2,"15,410",14558,24,,49],[49,"Russian Federation",0.804,,70.3,70.1,15.0,14.7,12.0,12,"23,286",22352,1,,48],[50,"Romania",0.802,,74.8,74.7,14.7,14.2,10.8,10.8,"19,428",18108,11,,51],[51,"Kuwait",0.800,,74.5,74.4,13.3,14.7,7.3,7.2,"76,075",83961,-48,,50],[52,"Belarus",0.796,,71.5,71.3,15.7,15.7,12.0,12,"15,629",16676,19,,51],[52,"Oman",0.796,,77.0,76.8,13.7,13.6,8.1,8,"34,402",34858,-21,,53],[54,"Barbados",0.795,,75.8,75.6,15.3,15.4,10.5,10.5,"14,952",12488,20,,54],[54,"Uruguay",0.795,,77.4,77.2,15.5,15.5,8.6,8.5,"19,148",19283,8,,54],[56,"Bulgaria",0.794,,74.3,74.2,15.0,14.4,10.8,10.6,"16,261",15596,13,,57],[56,"Kazakhstan",0.794,,69.6,69.4,15.0,15,11.7,11.4,"22,093",20867,-3,,56],[58,"Bahamas",0.792,,75.6,75.4,12.7,12.6,10.9,10.9,"21,565",21336,-3,,58],[59,"Malaysia",0.789,,74.9,74.7,13.1,12.7,10.1,10,"24,620",22762,-13,,59],[60,"Palau",0.788,,72.9,72.7,14.3,13.7,12.3,12.3,"13,771",13496,21,,62],[60,"Panama",0.788,,77.8,77.6,13.0,13.3,9.9,9.3,"19,470",18192,0,,60],[62,"Antigua and Barbuda",0.786,,76.2,76.1,13.9,14,9.2,9.2,"20,907",20070,-4,,61],[63,"Seychelles",0.782,,73.3,73.1,14.1,13.4,9.4,9.4,"23,886",23300,-15,,63],[64,"Mauritius",0.781,,74.6,74.4,15.2,15.6,9.1,8.5,"17,948",17470,1,,64],[65,"Trinidad and Tobago",0.780,,70.5,70.4,12.7,12.3,10.9,10.9,"28,049",26090,-25,,64],[66,"Costa Rica",0.776,,79.6,79.4,14.2,13.9,8.7,8.4,"14,006",13413,14,,66],[66,"Serbia",0.776,,75.0,74.9,14.4,14.4,10.8,10.5,"12,202",12190,22,,66],[68,"Cuba",0.775,,79.6,79.4,13.9,13.8,11.8,11.5,"7,455",7301,48,,69],[69,"Iran (Islamic Republic of)",0.774,,75.6,75.4,14.8,15.1,8.8,8.2,"16,395",15440,-2,,68],[70,"Georgia",0.769,,75.0,74.9,13.9,13.8,12.2,12.1,"8,856",7164,38,,71],[71,"Turkey",0.767,,75.5,75.3,14.6,14.5,7.9,7.6,"18,705",18677,-7,,72],[71,"Venezuela (Bolivarian Republic of)",0.767,,74.4,74.2,14.3,14.2,9.4,8.9,"15,129",16159,2,,70],[73,"Sri Lanka",0.766,,75.0,74.9,14.0,13.7,10.9,10.8,"10,789",9779,21,,72],[74,"Saint Kitts and Nevis",0.765,,74.0,73.8,13.7,12.9,8.4,8.4,"22,436",20805,-22,,75],[75,"Albania",0.764,,78.0,77.8,14.2,11.8,9.6,9.3,"10,252",9943,24,,75],[76,"Lebanon",0.763,,79.5,79.3,13.3,13.8,8.6,7.9,"13,312",16509,8,,74],[77,"Mexico",0.762,,77.0,76.8,13.3,13.1,8.6,8.5,"16,383",16056,-9,,77],[78,"Azerbaijan",0.759,,70.9,70.8,12.7,11.9,11.2,11.2,"16,413",16428,-12,,77],[79,"Brazil",0.754,,74.7,74.5,15.2,15.2,7.8,7.7,"14,145",15175,-1,,79],[79,"Grenada",0.754,,73.6,73.4,15.8,15.8,8.6,8.6,"11,502",10939,13,,80],[81,"Bosnia and Herzegovina",0.750,,76.6,76.5,14.2,13.6,9.0,8.3,"10,091",9638,22,,82],[82,"The former Yugoslav Republic of Macedonia",0.748,,75.5,75.4,12.9,13.4,9.4,9.3,"12,405",11780,5,,83],[83,"Algeria",0.745,,75.0,74.8,14.4,14,7.8,7.6,"13,533",13054,-1,,84],[84,"Armenia",0.743,,74.9,74.7,12.7,12.3,11.3,10.9,"8,189",8124,28,,85],[84,"Ukraine",0.743,,71.1,71,15.3,15.1,11.3,11.3,"7,361",8178,34,,81],[86,"Jordan",0.741,,74.2,74,13.1,13.5,10.1,9.9,"10,111",11365,15,,85],[87,"Peru",0.740,,74.8,74.6,13.4,13.1,9.0,9,"11,295",11015,6,,89],[87,"Thailand",0.740,,74.6,74.4,13.6,13.5,7.9,7.3,"14,519",13323,-11,,88],[89,"Ecuador",0.739,,76.1,75.9,14.0,14.2,8.3,7.6,"10,536",10605,6,,87],[90,"China",0.738,,76.0,75.8,13.5,13.1,7.6,7.5,"13,345",12547,-7,,91],[91,"Fiji",0.736,,70.2,70,15.3,15.7,10.5,9.9,"8,245",7493,20,,91],[92,"Mongolia",0.735,,69.8,69.4,14.8,14.6,9.8,9.3,"10,449",10729,4,,93],[92,"Saint Lucia",0.735,,75.2,75.1,13.1,12.6,9.3,9.3,"9,791",9765,14,,90],[94,"Jamaica",0.730,,75.8,75.7,12.8,12.4,9.6,9.7,"8,350",7415,16,,94],[95,"Colombia",0.727,,74.2,74,13.6,13.5,7.6,7.3,"12,762",12040,-10,,95],[96,"Dominica",0.726,,77.9,77.8,12.8,12.7,7.9,7.9,"10,096",9994,6,,95],[97,"Suriname",0.725,,71.3,71.1,12.7,12.7,8.3,7.7,"16,018",15617,-27,,97],[97,"Tunisia",0.725,,75.0,74.8,14.6,14.6,7.1,6.8,"10,249",10404,3,,97],[99,"Dominican Republic",0.722,,73.7,73.5,13.2,13.1,7.7,7.6,"12,756",11883,-13,,101],[99,"Saint Vincent and the Grenadines",0.722,,73.0,72.9,13.3,13.4,8.6,8.6,"10,372",9937,-1,,99],[101,"Tonga",0.721,,73.0,72.8,14.3,14.7,11.1,10.7,"5,284",5069,33,,101],[102,"Libya",0.716,,71.8,71.6,13.4,14,7.3,7.3,"14,303",14911,-25,,100],[103,"Belize",0.706,,70.1,70,12.8,13.6,10.5,10.5,"7,375",7614,14,,103],[104,"Samoa",0.704,,73.7,73.4,12.9,12.9,10.3,10.3,"5,372",5327,27,,104],[105,"Maldives",0.701,,77.0,76.8,12.7,13,6.2,5.8,"10,383",12328,-8,,105],[105,"Uzbekistan",0.701,,69.4,68.4,12.2,11.5,12.0,10.9,"5,748",5567,21,,108],[107,"Moldova (Republic of)",0.699,,71.7,71.6,11.8,11.9,11.9,11.2,"5,026",5223,31,,105],[108,"Botswana",0.698,,64.5,64.5,12.6,12.5,9.2,8.9,"14,663",16646,-33,,107],[109,"Gabon",0.697,,64.9,64.4,12.6,12.5,8.1,7.8,"19,044",16367,-46,,109],[110,"Paraguay",0.693,,73.0,72.9,12.3,11.9,8.1,7.7,"8,182",7643,3,,110],[111,"Egypt",0.691,,71.3,71.1,13.1,13.5,7.1,6.6,"10,064",10512,-7,,111],[111,"Turkmenistan",0.691,,65.7,65.6,10.8,10.8,9.9,9.9,"14,026",13066,-32,,111],[113,"Indonesia",0.689,,69.1,68.9,12.9,13,7.9,7.6,"10,053",9788,-8,,113],[114,"Palestine State of",0.684,,73.1,72.9,12.8,13,8.9,8.9,"5,256",4699,21,,115],[115,"Viet Nam",0.683,,75.9,75.8,12.6,11.9,8.0,7.5,"5,335",5092,18,,115],[116,"Philippines",0.682,,68.3,68.2,11.7,11.3,9.3,8.9,"8,395",7915,-7,,114],[117,"El Salvador",0.680,,73.3,73,13.2,12.3,6.5,6.5,"7,732",7349,-3,,115],[118,"Bolivia (Plurinational State of)",0.674,,68.7,68.3,13.8,13.2,8.2,8.2,"6,155",5760,6,,118],[119,"South Africa",0.666,,57.7,57.4,13.0,13.6,10.3,9.9,"12,087",12122,-30,,119],[120,"Kyrgyzstan",0.664,,70.8,70.6,13.0,12.5,10.8,10.6,"3,097",3044,32,,120],[121,"Iraq",0.649,,69.6,69.4,10.1,10.1,6.6,6.4,"11,608",14003,-30,,121],[122,"Cabo Verde",0.648,,73.5,73.3,13.5,13.5,4.8,4.7,"6,049",6094,3,,122],[123,"Morocco",0.647,,74.3,74,12.1,11.6,5.0,4.4,"7,195",6850,-4,,123],[124,"Nicaragua",0.645,,75.2,74.9,11.7,11.5,6.5,6,"4,747",4457,16,,124],[125,"Guatemala",0.640,,72.1,71.8,10.7,10.7,6.3,5.6,"7,063",6929,-4,,126],[125,"Namibia",0.640,,65.1,64.8,11.7,11.3,6.7,6.2,"9,770",9418,-18,,126],[127,"Guyana",0.638,,66.5,66.4,10.3,10.3,8.4,8.5,"6,884",6522,-5,,125],[127,"Micronesia (Federated States of)",0.638,,69.3,69.1,11.7,11.7,9.7,9.7,"3,291",3432,22,,126],[129,"Tajikistan",0.627,,69.6,69.4,11.3,11.2,10.4,10.4,"2,601",2517,30,,129],[130,"Honduras",0.625,,73.3,73.1,11.2,11.1,6.2,5.5,"4,466",3938,11,,130],[131,"India",0.624,,68.3,68,11.7,11.7,6.3,5.4,"5,663",5497,-4,,131],[132,"Bhutan",0.607,,69.9,69.5,12.5,12.6,3.1,3,"7,081",7176,-12,,132],[133,"Timor-Leste",0.605,,68.5,68.2,12.5,11.7,4.4,4.4,"5,371",5363,-1,,133],[134,"Vanuatu",0.597,,72.1,71.9,10.8,10.6,6.8,6.8,"2,805",2803,23,,134],[135,"Congo",0.592,,62.9,62.3,11.1,11.1,6.3,6.1,"5,503",6012,-7,,135],[135,"Equatorial Guinea",0.592,,57.9,57.6,9.2,9,5.5,5.5,"21,517",21056,-79,,137],[137,"Kiribati",0.588,,66.2,66,11.9,12.3,7.8,7.8,"2,475",2434,23,,136],[138,"Lao People's Democratic Republic",0.586,,66.6,66.2,10.8,10.6,5.2,5,"5,049",4680,-2,,137],[139,"Bangladesh",0.579,,72.0,71.6,10.2,10,5.2,5.1,"3,341",3191,8,,140],[139,"Ghana",0.579,,61.5,61.4,11.5,11.5,6.9,7,"3,839",3852,5,,140],[139,"Zambia",0.579,,60.8,60.1,12.5,13.5,6.9,6.6,"3,464",3734,7,,139],[142,"Sao Tome and Principe",0.574,,66.6,66.5,12.0,11.3,5.3,4.7,"3,070",2918,12,,142],[143,"Cambodia",0.563,,68.8,68.4,10.9,10.9,4.7,4.4,"3,095",2949,10,,143],[144,"Nepal",0.558,,70.0,69.6,12.2,12.4,4.1,3.3,"2,337",2311,19,,144],[145,"Myanmar",0.556,,66.1,65.9,9.1,8.6,4.7,4.1,"4,943",4608,-6,,146],[146,"Kenya",0.555,,62.2,61.6,11.1,11,6.3,6.3,"2,881",2762,10,,147],[147,"Pakistan",0.550,,66.4,66.2,8.1,7.8,5.1,4.7,"5,031",4866,-10,,148],[148,"Swaziland",0.541,,48.9,49,11.4,11.3,6.8,7.1,"7,522",5542,-33,,149],[149,"Syrian Arab Republic",0.536,,69.7,69.6,9.0,12.3,5.1,6.3,"2,441",2728,13,,145],[150,"Angola",0.533,,52.7,52.3,11.4,11.4,5.0,4.7,"6,291",6822,-27,,150],[151,"Tanzania (United Republic of)",0.531,,65.5,65,8.9,9.2,5.8,5.1,"2,467",2411,10,,152],[152,"Nigeria",0.527,,53.1,52.8,10.0,9,6.0,5.9,"5,443",5341,-23,,151],[153,"Cameroon",0.518,,56.0,55.5,10.4,10.4,6.1,6,"2,894",2803,2,,154],[154,"Papua New Guinea",0.516,,62.8,62.6,9.9,9.9,4.3,4,"2,712",2463,4,,153],[154,"Zimbabwe",0.516,,59.2,57.5,10.3,10.9,7.7,7.3,"1,588",1615,20,,158],[156,"Solomon Islands",0.515,,68.1,67.9,9.6,9.2,5.3,5,"1,561",1540,19,,155],[157,"Mauritania",0.513,,63.2,63.1,8.5,8.5,4.3,3.8,"3,527",3560,-12,,155],[158,"Madagascar",0.512,,65.5,65.1,10.3,10.3,6.1,6,"1,320",1328,25,,157],[159,"Rwanda",0.498,,64.7,64.2,10.8,10.3,3.8,3.7,"1,617",1458,14,,162],[160,"Comoros",0.497,,63.6,63.3,11.1,11.5,4.8,4.6,"1,335",1456,22,,160],[160,"Lesotho",0.497,,50.1,49.8,10.7,11.1,6.1,5.9,"3,319",3306,-12,,161],[162,"Senegal",0.494,,66.9,66.5,9.5,7.9,2.8,2.5,"2,250",2188,3,,163],[163,"Haiti",0.493,,63.1,62.8,9.1,8.7,5.2,4.9,"1,657",1669,9,,164],[163,"Uganda",0.493,,59.2,58.5,10.0,9.8,5.7,5.4,"1,670",1613,8,,165],[165,"Sudan",0.490,,63.7,63.5,7.2,7,3.5,3.1,"3,846",3809,-22,,165],[166,"Togo",0.487,,60.2,59.7,12.0,12.2,4.7,4.5,"1,262",1228,18,,167],[167,"Benin",0.485,,59.8,59.6,10.7,11.1,3.5,3.3,"1,979",1767,1,,168],[168,"Yemen",0.482,,64.1,63.8,9.0,9.2,3.0,2.6,"2,300",3519,-4,,159],[169,"Afghanistan",0.479,,60.7,60.4,10.1,9.3,3.6,3.2,"1,871",1885,1,,169],[170,"Malawi",0.476,,63.9,62.8,10.8,10.8,4.4,4.3,"1,073",747,16,,170],[171,"Côte d'Ivoire",0.474,,51.9,51.5,8.9,8.9,5.0,4.3,"3,163",3171,-20,,172],[172,"Djibouti",0.473,,62.3,62,6.3,6.4,4.1,3.8,"3,216",3276,-22,,171],[173,"Gambia",0.452,,60.5,60.2,8.9,8.8,3.3,2.8,"1,541",1507,3,,173],[174,"Ethiopia",0.448,,64.6,64.1,8.4,8.5,2.6,2.4,"1,523",1428,5,,174],[175,"Mali",0.442,,58.5,58,8.4,8.4,2.3,2,"2,218",1583,-9,,175],[176,"Congo (Democratic Republic of the)",0.435,,59.1,58.7,9.8,9.8,6.1,6,680,680,15,,178],[177,"Liberia",0.427,,61.2,60.9,9.9,9.5,4.4,4.1,683,805,13,,177],[178,"Guinea-Bissau",0.424,,55.5,55.2,9.2,9,2.9,2.8,"1,369",1362,3,,179],[179,"Eritrea",0.420,,64.2,63.7,5.0,4.1,3.9,3.9,"1,490",1130,1,,181],[179,"Sierra Leone",0.420,,51.3,50.9,9.5,8.6,3.3,3.1,"1,529",1780,-1,,176],[181,"Mozambique",0.418,,55.5,55.1,9.1,9.3,3.5,3.2,"1,098",1123,4,,182],[181,"South Sudan",0.418,,56.1,55.7,4.9,7.6,4.8,5.4,"1,882",2332,-12,,179],[183,"Guinea",0.414,,59.2,58.8,8.8,8.7,2.6,2.4,"1,058",1096,4,,182],[184,"Burundi",0.404,,57.1,56.7,10.6,10.1,3.0,2.7,691,758,5,,184],[185,"Burkina Faso",0.402,,59.0,58.7,7.7,7.8,1.4,1.4,"1,537",1591,-8,,185],[186,"Chad",0.396,,51.9,51.6,7.3,7.4,2.3,1.9,"1,991",2085,-19,,186],[187,"Niger",0.353,,61.9,61.4,5.4,5.4,1.7,1.5,889,908,1,,187],[188,"Central African Republic",0.352,,51.5,50.7,7.1,7.2,4.2,4.2,587,581,4,,188]]

  window.countries = []
  for (var i = 0; i < data.length; i++) {
      var h = {}
      h["name"] = data[i][1]
      h["id"] = h["name"].replace(/[^0-9a-zA-Z]/g, '')

      h["2015"] = {}
      h["2015"]["life_expectancy"] = data[i][4]
      h["2015"]["expected_schooling"] = data[i][6]
      h["2015"]["mean_schooling"] = data[i][8]
      h["2015"]["income"] = convertStringToInt(data[i][10])

      h["2014"] = {}
      h["2014"]["life_expectancy"] = data[i][5]
      h["2014"]["expected_schooling"] = data[i][7]
      h["2014"]["mean_schooling"] = data[i][9]
      h["2014"]["income"] = convertStringToInt(data[i][11])
      
      window.countries.push(h)
  }

  calculateCountries();

  if ($(window).width() > 1440) {
    $('#main-container').addClass("container")
  } else {
    $('#main-container').addClass("container-fluid")
  }
  $('#main-container').removeClass("invisible")
  //$('#main-container').removeClass("invisible")

  
  $('.weighting-change-button').click(function() {
    $('#weightingInfo').show()
  });
  



});