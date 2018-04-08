function joinObjects(higherObjectId, lowerObjectId, yOffset, showArrow){
  $("." + higherObjectId).each( function( index, element ){
      var higherObject = $(this)
      var dashboard = higherObject.closest('.dashboard');
      var lowerObject = dashboard.find("." + lowerObjectId)
      var highPointX = higherObject.offset().left + (higherObject.width() / 2);
      var highPointY = higherObject.offset().top + higherObject.height() + 1 + yOffset;
      var lowPointX = lowerObject.offset().left + (lowerObject.width() / 2);
      var lowPointY = lowerObject.offset().top;
      createLine(highPointX, highPointY, lowPointX, lowPointY, showArrow);

      if (showArrow) {
        var lowPointX = highPointX - 10;
        var lowPointY = highPointY + 10;
        createLine(highPointX, highPointY, lowPointX, lowPointY);

        var lowPointX = highPointX + 10;
        var lowPointY = highPointY + 10;
        createLine(highPointX, highPointY, lowPointX, lowPointY);
      }
  });
}

function createLine(x1,y1,x2,y2){
  var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  var transform = 'rotate('+angle+'deg)';
  var line = $('<div>')
    .appendTo('body')
    .addClass('line')
    .css({
      'z-index': -1,
      'position': 'absolute',
      '-webkit-transform': transform,
      '-moz-transform':    transform,
      'transform':         transform
    })
    .width(length)
    .offset({
      left: x1 < x2 ? x1 : x1 - (x1-x2),
      top: y1 < y2 ? y1 : y1 - (y1-y2)
    });
  return line;
}

$(function() {

  $(".policy-buttons :input").change(function() {
      var id = $(this).attr("id");
      if (id == "policy-off-button-on") {
          $("#policy-on-button-off").parent().removeClass("active");
          $("#policy-on-button-on").parent().addClass("active");
          $("#policy-off").hide()
          $("#policy-on").show()
      } else if (id == "policy-on-button-off") {
          $("#policy-off-button-on").parent().removeClass("active");
          $("#policy-off-button-off").parent().addClass("active");
          $("#policy-on").hide()
          $("#policy-off").show()
      }
      return false;
  });


  $(".level-buttons :input").change(function() {
      var level = $(this).data('level');
      var dashboard = $(this).closest('.dashboard');
      dashboard.find('.variable-card-row').hide();
      var cardRow = dashboard.find("[data-level='" + level + "']").filter('.variable-card-row');
      cardRow.show();
  });

  $(".dropdown-item").click(function() {
    var year = $(this).data('year');
    var dashboard = $(this).closest('.dashboard')

    var selectedText = $(this).text();
    var button = dashboard.find('.dropdown-toggle');
    button.text(selectedText);

    dashboard.find('.year-dependant-text').hide()
    var growthText = dashboard.find("[data-year='" + year + "']").filter('.year-dependant-text');
    growthText.show();
  });

  joinObjects('connector-us-unemployment', 'connector-us-growth', 0, true);
  joinObjects('connector-us-growth', 'connector-us-debt', 0, true);
  joinObjects('connector-poverty', 'connector-unemployment', 0, true);
  joinObjects('connector-inequality', 'connector-unemployment', 0, true);
  joinObjects('connector-meaning', 'connector-unemployment', 0, true);
  joinObjects('connector-social', 'connector-unemployment', 0, true);
  joinObjects('connector-unemployment', 'connector-growth', 0, true);
  joinObjects('connector-growth', 'connector-infrastructure', 15, false);
  joinObjects('connector-growth', 'connector-protection', 15, false);
  joinObjects('connector-growth', 'connector-primary', 0, true);

});