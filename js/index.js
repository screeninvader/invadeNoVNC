"use strict";

var noVNC = require('novnc-node');
var RFB = noVNC.RFB;
var Util = noVNC.Util;
var HOST = '176.9.60.212';
var PORT = '8085';
var rfb;
var resizeTimeout;

var RFBoptions = {
    'target'        : document.querySelector('#noVNC_canvas')
  , 'encrypt'       : window.location.protocol === 'https:'
  , 'repeaterID'    : ''
  , 'true_color'    : true
  , 'local_cursor'  : true
  , 'shared'        : true
  , 'view_only'     : false
  , 'onUpdateState' : updateState
  , 'onXvpInit'     : xvpInit
  , 'onFBUComplete' : FBUComplete
};

function FBUComplete(rfb, fbu) {
  var iframe = document.querySelector('#outta_space');
  if ( iframe && iframe.hasOwnProperty('src') ) {
    iframe.src = 'http://' + HOST;
  }
  rfb.set_onFBUComplete(function() { });
}
function updateState(rfb, state, oldstate, msg) {
  var s, sb, level;
  s = document.querySelector('#noVNC_status');
  sb = document.querySelector('#noVNC_status_bar');
  switch (state) {
    case 'failed':       level = "error";  break;
    case 'fatal':        level = "error";  break;
    case 'normal':       level = "normal"; break;
    case 'disconnected': level = "normal"; break;
    case 'loaded':       level = "normal"; break;
    default:             level = "warn";   break;
  }

  if (state !== "normal") {
    xvpInit(0);
  }

  if (typeof(msg) !== 'undefined') {
    sb.setAttribute("class", "noVNC_status_" + level);
    s.innerHTML = msg;
  }
}

function xvpInit(ver) {
  var xvpbuttons;
  xvpbuttons = document.querySelector('#noVNC_xvp_buttons');
  if (ver >= 1) {
    xvpbuttons.style.display = 'inline';
  } else {
    xvpbuttons.style.display = 'none';
  }
}
window.addEventListener('load', function () {
  try {
    rfb = new RFB(RFBoptions);
  } catch (exc) {
    console.error('Unable to create RFB client -- ' + exc);
    return; // don't continue trying to connect
  }

  rfb.connect('ws://' + HOST + ':' + PORT);
});
