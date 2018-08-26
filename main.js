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
      var trendColorSymbol = ''
    } else if (opts.trend_direction == 'positive') {
      var trendColorSymbol = '_'
    } else if (opts.trend_direction == 'negative') {
      var trendColorSymbol = '*'
    }
    var backgroundColor = 'white'
    //build label
    var labelForGraph = opts.title
    if (opts.hasOwnProperty("metric") && opts["metric"] != null) {
      labelForGraph = labelForGraph + ": " + opts["metric"]
    }
    if (opts.hasOwnProperty("current_level") && opts["current_level"] != null) {
      labelForGraph = labelForGraph + "\n---\n" + opts["current_level"]
    }
    if (opts.hasOwnProperty("trend") && opts["trend"] != null) {
      labelForGraph = labelForGraph + "\n---\n" + trendColorSymbol + opts["trend"] + trendColorSymbol
    }
    if (opts.hasOwnProperty("source") && opts["source"] != null) {
      labelForGraph = labelForGraph + "\n---\nSource: " + opts["source"]
    }
    nodes_for_graph.push({
      id: opts.id,
      label: labelForGraph,
      font: {
        multi: 'md'
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
    nodes: {
      font: {
        bold: {
          color: '#dc3545'
        },
        ital: {
          color: '#28a745'
        }
      }
    },
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
    physics: false
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
  node["source_is_link"] = node.hasOwnProperty("source") && node["source"] != null && node["source"].includes("http")
  node["isMainNode"] = true
  node["show_contributing_factor_s"] = node["childCount"] != 1

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
  $('.nodeTitle').text(node.title)
  $('#childCount').text(connectionsLeadingToChildren.length)



  //
  for (var i = 0; i < connectionsLeadingToChildren.length; i++) {
    var childNode = nodes_for_mobile_view.find(function(element) {return element['id'] == connectionsLeadingToChildren[i]["to"]})
    var connectionsLeadingToChildsChildren = connections_for_graph.filter(edge => edge['from'] == childNode.id);
    childNode["childCount"] = connectionsLeadingToChildsChildren.length
    if (connectionsLeadingToChildren[i]["label"] != null) {
      childNode["connection_label"] = connectionsLeadingToChildren[i]["label"]
    }
    childNode["show_contributing_factor_s"] = childNode["childCount"] != 1
    childNode["source_is_link"] = childNode.hasOwnProperty("source") && childNode["source"] != null && childNode["source"].includes("http")
    if (childNode.parent_link.positive_relationship) {
      //xxx
      var div = $('#childNodesImprove')
    } else {
      var div = $('#childNodesWorsen')
    }
    addNodeToPage(childNode, div)
  }
  if (connectionsLeadingToChildren.length == 0) {
    $('#nothingHere').show()
    $('#childNodesImproveHeading').hide()
    $('#childNodesWorsenHeading').hide()
  }
  if ($('#childNodesImprove').is(':empty')){
    $('#childNodesImprove').html("<div class='col-sm'>Nothing</div>")
  }
  if ($('#childNodesWorsen').is(':empty')){
    $('#childNodesWorsen').html("<div class='col-sm'>Nothing</div>")
  }
  

  var introModalViewedCookie = getCookie('introModalViewed');
  if (introModalViewedCookie == null && window.location.href.indexOf("policyviews") > -1) {
    $('#introModal').modal('toggle')
    setCookie('introModalViewed', 'true');
  }

  $('.nodeLink').each(function() {
    var href = $(this).attr('href');
    $(this).attr('href', href + "&source_id=" + window.source_id + "&id=" + window.entity_id);
  });
  

});