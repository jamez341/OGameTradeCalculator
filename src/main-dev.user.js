// ==UserScript==
// @name           OGame Trade Calculator
// @description    Adds a trade calculator to the OGame interface
// @namespace      http://userscripts.org/users/68563/scripts
// @downloadURL    https://userscripts.org/scripts/source/151002.user.js
// @updateURL      https://userscripts.org/scripts/source/151002.meta.js
// @version        2.2.1
// @include        *://*.ogame.*/game/index.php?*page=*
// ==/UserScript==
/*! OGame Trade Calculator (C) 2012 Elías Grande Cásedas | GNU-GPL | gnu.org/licenses */
(function(){
////////////

var IDP,
SCRIPT =
{
	ID_PREFIX : (IDP='o_trade_calc_'),
	NAME      : 'OGame Trade Calculator',
	HOME_URL  : 'http://userscripts.org/scripts/show/151002',
	TESTED_OGAME_VERSION : '5.2.0-beta1'
}

var win = window, doc, $;
try{if (unsafeWindow) win = unsafeWindow;}
catch(e){}
doc = win.document;
$ = win.jQuery;

$.getScript('/cdn/js/greasemonkey/version-check.js', function() {
	win.oGameVersionCheck(SCRIPT.NAME, SCRIPT.TESTED_OGAME_VERSION, SCRIPT.HOME_URL);
});

/*! jCaret (C) 2010 C. F. Wong | cloudgen.w0ng.hk | www.opensource.org/licenses/mit-license.php */
(function($,len,createRange,duplicate){
	$.fn.caret=function(options,opt2){
		var start,end,t=this[0],browser=$.browser.msie;
		if(typeof options==="object" && typeof options.start==="number" && typeof options.end==="number") {
			start=options.start;
			end=options.end;
		} else if(typeof options==="number" && typeof opt2==="number"){
			start=options;
			end=opt2;
		} else if(typeof options==="string"){
			if((start=t.value.indexOf(options))>-1) end=start+options[len];
			else start=null;
		} else if(Object.prototype.toString.call(options)==="[object RegExp]"){
			var re=options.exec(t.value);
			if(re != null) {
				start=re.index;
				end=start+re[0][len];
			}
		}
		if(typeof start!="undefined"){
			if(browser){
				var selRange = this[0].createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end-start);
				selRange.select();
			} else {
				this[0].selectionStart=start;
				this[0].selectionEnd=end;
			}
			this[0].focus();
			return this
		} else {
			// Modification as suggested by Андрей Юткин
           if(browser){
				var selection=document.selection;
                if (this[0].tagName.toLowerCase() != "textarea") {
                    var val = this.val(),
                    range = selection[createRange]()[duplicate]();
                    range.moveEnd("character", val[len]);
                    var s = (range.text == "" ? val[len]:val.lastIndexOf(range.text));
                    range = selection[createRange]()[duplicate]();
                    range.moveStart("character", -val[len]);
                    var e = range.text[len];
                } else {
                    var range = selection[createRange](),
                    stored_range = range[duplicate]();
                    stored_range.moveToElementText(this[0]);
                    stored_range.setEndPoint('EndToEnd', range);
                    var s = stored_range.text[len] - range.text[len],
                    e = s + range.text[len]
                }
			// End of Modification
            } else {
				var s=t.selectionStart,
					e=t.selectionEnd;
			}
			var te=t.value.substring(s,e);
			return {start:s,end:e,text:te,replace:function(st){
				return t.value.substring(0,s)+st+t.value.substring(e,t.value[len])
			}}
		}
	}
})($,"length","createRange","duplicate");
/*! [/jCaret] */

String.prototype.replaceAll = function (search, replacement)
{
	return this.split(search).join(replacement);
}

String.prototype.recursiveReplaceMap = function (org, rep, index)
{
	if (index==0)
		return this.split(org[0]).join(rep[0]);

	var i, arr = this.split(org[index]);
	for (i in arr)
	{
		arr[i] = arr[i].recursiveReplaceMap(org, rep, index-1);
	}
	
	return arr.join(rep[index]);
}

String.prototype.replaceMap = function (replaceMap)
{
	var key, org, rep, count;
	org = new Array();
	rep = new Array();
	
	count = 0;
	for (key in replaceMap)
	{
		org.push(key);
		rep.push(replaceMap[key]);
		count ++;
	}
	
	if (count==0)
		return this;
	else
		return this.recursiveReplaceMap(org,rep,count-1);
}

String.prototype.capitalize = function()
{
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.trim = function()
{
	return this.replace(/^\s+/,'').replace(/\s+$/,'');
}

var INFO =
({
	getMeta : function (name,def)
	{
		try {
			return $('meta[name="'+name+'"]').attr('content');
		}
		catch (e) {
			if (arguments.length>1) return def;
			else return null;
		}
	},
	getResource : function (id)
	{
		var resource =
		{
			NAME : '',
			AMOUNT : 0,
			getName : function(varName) // used in I18N.text definition
			{
				var resName = this.NAME+'';
				INFO[varName] = this.AMOUNT+0;
				return resName;
			}
		};
		var title = $('#'+id).attr('title');
		resource.NAME = title.split(':').shift();
		resource.AMOUNT = parseInt(title.split('/tr').shift().replace(/\D/g,''));
		return resource;
	},
	init : function()
	{
		return {
			LANGUAGE : this.getMeta('ogame-language',''),
			RES_MET  : this.getResource('metal_box'),
			RES_CRY  : this.getResource('crystal_box'),
			RES_DEU  : this.getResource('deuterium_box')
		}
	}
}
).init();

var COLOR =
{
	/*! [colors] */
	MET : '#FF7700',
	CRY : '#00FFFF',
	DEU : '#FF33FF'
	/*! [/colors] */
}

var I18N =
({
	text : {
		RES_MET : INFO.RES_MET.getName('RES_MET'),
		RES_CRY : INFO.RES_CRY.getName('RES_CRY'),
		RES_DEU : INFO.RES_DEU.getName('RES_DEU')
	},
	set : function(pattern,obj)
	{
		if (pattern.test(INFO.LANGUAGE)) $.extend(true,this.text,obj);
		return this;
	}
}
/*! [i18n=en] */
).set(/.*/,
{
	THO_SEP : ',',
	DEC_SEP : '.',
	MENU    : 'Trace C.',
	TITLE   : 'Trade calculator',
	ACTION  : 'Action',
	BUY     : 'I buy',
	SELL    : 'I sell',
	RATIO   : 'Ratio',
	ILLEGAL : 'illegal',
	IN_EXCH : 'In exchange for',
	RESULT  : 'Result',
	MESSAGE : 'Message',
	WHERE   : 'Place of delivery',
	PLANET  : 'Planet',
	MOON    : 'Moon',
	CUR_PLA : 'Current planet',
	MAX     : 'Maximum',
	REG     : 'Regular',
	MIN     : 'Minimum',
	RAT_LST : 'Ratio list',
	NAME    : 'Name',
	LEGAL   : 'Legal',
	YES     : 'Yes',
	NO      : 'No',
	DEFAULT : 'Default',
	NEW     : 'New',
	IE_CONF : 'Import / Export configuration',
	IMPORT  : 'Import',
	EXPORT  : 'Export',
	ACCEPT  : 'Accept',
	CANCEL  : 'Cancel',
	RES_DEF : 'Restore default settings'
}
/*! [i18n=es] */
).set(/es|ar|mx/,
{
	THO_SEP : '.',
	DEC_SEP : ',',
	MENU    : 'C. Comercio',
	TITLE   : 'Calculadora de comercio',
	ACTION  : 'Acción',
	BUY     : 'Compro',
	SELL    : 'Vendo',
	RATIO   : 'Ratio',
	ILLEGAL : 'ilegal',
	IN_EXCH : 'A cambio de',
	RESULT  : 'Resultado',
	MESSAGE : 'Mensaje',
	WHERE   : 'Lugar de entrega',
	PLANET  : 'Planeta',
	MOON    : 'Luna',
	CUR_PLA : 'Planeta actual',
	MAX     : 'Máximo',
	REG     : 'Normal',
	MIN     : 'Mínimo',
	RAT_LST : 'Lista de ratios',
	NAME    : 'Nombre',
	LEGAL   : 'Legal',
	YES     : 'Si',
	NO      : 'No',
	DEFAULT : 'Por defecto',
	NEW     : 'Nuevo',
	IE_CONF : 'Importar / Exportar configuración',
	IMPORT  : 'Importar',
	EXPORT  : 'Exportar',
	ACCEPT  : 'Aceptar',
	CANCEL  : 'Cancelar',
	RES_DEF : 'Restaurar ajustes por defecto'
}
/*! [/i18n] */
).text;

var TPL =
{
	/*! [css] */
	CSS :
		"#"+IDP+"window{"+
			"float:left;"+
			"position:relative;"+
			"width:670px;"+
			"overflow:visible;"+
			"z-index:2;"+
		"}"+
		"#galaxy #"+IDP+"window{"+
			"top:-44px;"+
		"}"+
		"#"+IDP+"header{"+
			"height:28px;"+
			"position: relative;"+
			"background: url(\"http://gf1.geo.gfsrv.net/cdn63/10e31cd5234445e4084558ea3506ea.gif\") no-repeat scroll 0px 0px transparent;"+
		"}"+
		"#"+IDP+"header h4{"+
			"height:28px;"+
			"line-height:28px;"+
			"text-align:center;"+
			"color:#6F9FC8;"+
			"font-size:12px;"+
			"font-weight:bold;"+
			"position:absolute;"+
			"top:0;left:100px;right:100px;"+
		"}"+
		"#"+IDP+"config_but{"+
			'display:block;'+
			'height:16px;'+
			'width:16px;'+
			'background:url(http://gf3.geo.gfsrv.net/cdne7/1f57d944fff38ee51d49c027f574ef.gif);'+
			'float:right;'+
			'margin:8px 0 0 0;'+
			'opacity:0.5;'+
		"}"+
		"#"+IDP+"config_but:hover{"+
			'opacity:1;'+
		"}"+
		"#"+IDP+"window.config input[type=\"button\"]{"+
			'margin:0 5px 0 5px;'+
		"}"+
		"#"+IDP+"window.config #"+IDP+"config_but{"+
			'display:none;'+
		"}"+
		"#"+IDP+"config,"+
		"#"+IDP+"window.config #"+IDP+"calc{"+
			'display:none;'+
		"}"+
		"#"+IDP+"window.config #"+IDP+"config{"+
			'display:block;'+
		"}"+
		"#"+IDP+"main{"+
			"padding:15px 25px 0 25px;"+
			"background: url(\"http://gf1.geo.gfsrv.net/cdn9e/4f73643e86a952be4aed7fdd61805a.gif\") repeat-y scroll 5px 0px transparent;"+
		"}"+
		"#"+IDP+"main *{"+
			"font-size:11px;"+
		"}"+
		"#"+IDP+"window table{"+
			"width:620px;"+ // 670 [window] - (25+25) [main padding] - 2 [border]
			"background-color:#0D1014;"+
			"border-collapse:collapse;"+
			"clear:both;"+
		"}"+
		"#"+IDP+"window.config table{"+
			"width:598px;"+ // 620 [prev style] - (5+5) [box margin] - (5+5) [box paddding] - 2 [box border]
		"}"+
		"#"+IDP+"main th{"+
			"color:#6F9FC8;"+
			//"color:#FFF;"+
			"text-align:center;"+
			"font-weight:bold;"+
		"}"+
		"."+IDP+"label,"+
		"."+IDP+"label *{"+
			"color:grey;"+
			"text-align:left;"+
		"}"+
		"."+IDP+"label{"+
			"padding:0 5px 0 5px;"+
			"font-weight:bold;"+
		"}"+
		"#"+IDP+"window.config ."+IDP+"label{"+
			"text-align:center;"+
		"}"+
		"#"+IDP+"main tr,"+
		"#"+IDP+"main td,"+
		"#"+IDP+"main th{"+
			"height:28px;"+
			"line-height:28px;"+
		"}"+
		"#"+IDP+"main input[type=\"text\"]{"+
			"width:100px;"+
			"text-align:center;"+
		"}"+
		"option."+IDP+"highlight{"+
			"color:lime !important;"+
			"font-weight:bold;"+
		"}"+
		"option."+IDP+"moon{"+
			"color:orange;"+
		"}"+
		"."+IDP+"select{"+
			"width:150px;"+
			"text-align:left;"+
		"}"+
		"."+IDP+"select select{"+
			"width:130px;"+
			"text-align:center;"+
		"}"+
		"#"+IDP+"main option{"+
			"padding:1px 5px 1px 5px;"+
		"}"+
		"."+IDP+"input{"+
			"width:112px;"+
			"padding:0 1px 0 1px;"+
			"text-align:right;"+
		"}"+
		"."+IDP+"name{"+
			"width:142px;"+
			"padding:0 1px 0 1px;"+
			"text-align:right;"+
		"}"+
		"#"+IDP+"main ."+IDP+"name input{"+
			"width:130px;"+
			"text-align:center;"+
		"}"+
		"."+IDP+"ratio{"+
			"width:82px;"+
			"padding:0 1px 0 1px;"+
			"text-align:right;"+
		"}"+
		"#"+IDP+"main ."+IDP+"ratio input{"+
			"width:70px;"+
			"text-align:center;"+
		"}"+
		"#"+IDP+"ratio_illegal{"+
			"color:red;"+
		"}"+
		"."+IDP+"output{"+
			"width:108px;"+
			"text-align:center;"+
			"font-weight:bold;"+
		"}"+
		"#"+IDP+"output_met{"+
			"color:"+COLOR.MET+";"+
		"}"+
		"#"+IDP+"output_cry{"+
			"color:"+COLOR.CRY+";"+
		"}"+
		"#"+IDP+"output_deu{"+
			"color:"+COLOR.DEU+";"+
		"}"+
		"."+IDP+"textarea{"+
			"padding:0 3px 0 3px !important;"+
		"}"+
		"#"+IDP+"message{"+
			"width:601px;"+
			"height:50px !important;"+
			"margin:0 !important;"+
		"}"+
		"#"+IDP+"planet{"+
			"width:auto;"+
			"text-align:left;"+
			"margin:0;"+
		"}"+
		"."+IDP+"select1row select{"+
			"width:auto;"+
			"text-align:left;"+
			"margin:0;"+
		"}"+
		"#"+IDP+"footer{"+
			"height:17px;"+
			"background: url(\"http://gf1.geo.gfsrv.net/cdn30/aa3e8edec0a2681915b3c9c6795e6f.gif\") no-repeat scroll 2px 0px transparent;"+
		"}"+
		"."+IDP+"config_title{"+
			"font-size:11px;"+
			"font-weight:bold;"+
			"color:#6F9FC8;"+
			"line-height:22px;"+
			"background:url(\"http://gf1.geo.gfsrv.net/cdn0b/d55059f8c9bab5ebf9e8a3563f26d1.gif\") no-repeat scroll 0 0 #13181D;"+
			"height:22px;"+
			"margin:0 0 10px 0;"+
			"padding:0 0 0 40px;"+ /* (25+15)px :: div+label (OG options) */
			"border:1px solid #000;"+
			"overflow:hidden;"+
			"cursor:pointer;"+
		"}"+
		"."+IDP+"config_title:hover{"+
			"color:#A7AFB7;"+
			"background-color:#23282D;"+
			"border-color:#13181D;"+
		"}"+
		"."+IDP+"config_box{"+
			"border:1px solid #000;"+
			"margin:5px 5px 10px 5px;"+
			"padding:5px;"+
		"}"+
		"#"+IDP+"new_ratio input{"+
			//"border-color:#0D0;"+
			"border-color:#9C0;"+
		"}"+
		"."+IDP+"check,"+
		"."+IDP+"name_noedit{"+
			"text-align:center;"+
		"}"+
		"."+IDP+"check input{"+
			"vertical-align:text-bottom;"+
		"}"+
		"."+IDP+"check input[type=\"checkbox\"]{"+
			"vertical-align:middle;"+
		"}"+
		"."+IDP+"action{"+
			"text-align:center;"+
			"padding:0 3px 0 3px;"+
		"}"+
		"."+IDP+"action a{"+
			"background:url(\"http://gf1.geo.gfsrv.net/cdn94/297ee218d94064df0a66bd41a04d28.png\") scroll 0 0 no-repeat;"+
			"width:16px;"+
			"height:16px;"+
			"display:inline-block;"+
			"vertical-align:top;"+
			"position:relative;"+
			"top:5px;"+ // (28[line-h] - 18[this-h])/2
			"border:1px solid #000;"+
			"border-radius:2px;"+
			//"margin: 0 0 0 1px;"+
			'opacity:0.7;'+
		"}"+
		"a."+IDP+"icon_up,"+
		"a."+IDP+"icon_down,"+
		"a."+IDP+"icon_add{"+
			"background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAAXNSR0IArs4c6QAAAvpQTFRFbomeXHaLb4mdgpyveJaxdpSweZKk////W3qXVnKNRWB6AAAANTU1PT09MUJTJzVD/6gAzAAA/9IA/wAAqsrjvtjrna25PlVsTWiCqbjESGF6YHyaOk9ldZOwTWeCPj4+PlRsVHeYRGKBUXCRQVx6VnibTGmFVnmbRWOERWSEXn+chJusPVhzU3SVQ19+TGyKU3aXPVRrTGqHkrHKPVZwUW6KQ2GAU3aZO09lcJCqYHqORV95UW6LTGeBQFlySGB5SmF6Q2B+VnmaUG2JVnSQS2qHSmeCL0RaXHmUU3WVoLzSqcTYQ2GCPFZxPVZxkaa1RWSDPFZyRl96XH2ZTGqGS2qJO1Ru1d7lV3SROk5kQVp0QVpz5erua4OWqLnGpcDUWn2ewMzVlK/EqLbCcY+qj6zESmF3r7zHob3TTGaAlqi2haO9XniNQ115TWiD8vX4k7DGZ4mqyNTdSmaBpcHWcImdjaKynbrRdY6hvMnTSWeHYXyaq7jDV3SQ6+/zo7/Ur8rd8PP1javGhaK82uLmq8bZq7vHh6a+0NrgnLjOhJqqUG+QpL/VsL7JdJOuXnmSytTcj6OxT2qE+Pn7eZm0zCszfZmxhqXBdZGpXHaOS2uKboynr73J4ebrhKO7obLAmLfR+vv9nLfNip+uX3yYXn+bdoyec42gobC9pbS/yNPbYX2aPVRtt8XPmLTLbo2odI2geI2fVHKT2OHo3OLoRGGBRmODkK7HaImkaomka4unjaCw/f7/mbjRXnyXd4+jf5Wmp8HWjq3IiqnEeZOqPlVtVHeXYH2ai6CxYYCbZIKfZn+TTGeDVnWQb5GtVnWRSWWASmWATGuKc5CpusXOU3GQlLPMXHqXUnSUZoSifJq0fJu3ZHyT/v//dpOwqcXZYHqSYnuQ7fDz7PD0XHyYWnaRkKW1TGiFTGmEj6zDYXuPPFdzPVdzrsndhpytVHaYh52uXn6c8PP2jqzFQFt5jKvFcYqeQl99gZ+52uHmRGKAyNTcV3iaqsbZDVW+rgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AsJFTcNV6u1fQAAAE9JREFUKM/dkjEOACAIA6tL//9jFaORqhtxsBO9CS4AyQXSKwkEpAfkIMgttNh4AUtCALQ/9NGPu4A87/erj/6DD30HBZuPwztsPmIFqY8CjdEFo21taJsAAAAASUVORK5CYII=);"+
		"}"+
		"a."+IDP+"icon_down{"+
			"background-position:0px -16px"+
		"}"+
		"a."+IDP+"icon_add{"+
			"background-position:0px -32px"+
		"}"+
		"."+IDP+"action a:hover{"+
			'opacity:1;'+
			"border-color:#08090b;"+
		"}"+
		"."+IDP+"action a.disabled,"+
		"."+IDP+"action aldisabled:hover{"+
			"opacity:0.1;"+
			"cursor:default;"+
		"}"+
		/*"a."+IDP+"icon_checkmark{"+
			"background-position:0px -608px"+
		"}"+
		/*"a."+IDP+"icon_edit{"+
			"background-position:0px -336px"+
		"}"+*/
		"a."+IDP+"icon_trash{"+
			"background-position:0px -304px"+
		"}"+
		"#"+IDP+"window.config .undermark,"+
		"#"+IDP+"window.config .overmark{"+
			"font-weight:bold;"+
			"text-align:center;"+
		"}"+
		"#"+IDP+"ie_conf{"+
			"display:block;"+
			"width:586px;"+
			"margin:0 0 5px 0;"+
		"}"+
		"."+IDP+"ie_conf{"+
			"text-align:center"+
		"}"+
		"."+IDP+"hidden{"+
			"position:fixed;"+
			"left:-10000px;"+
		"}"+
		"",

	/*! [tpl=window] */
	WINDOW :
		'<div id="'+IDP+'window" class="calc">'+
			'<div id="'+IDP+'header">'+
				'<h4>'+I18N.TITLE+'</h4>'+
				'<a id="'+IDP+'close" href="javascript:void(0);" class="close_details close_ressources"></a>'+
				'<a id="'+IDP+'config_but" href="javascript:void(0);"></a>'+
			'</div>'+
			'<div id="'+IDP+'main">'+
				'<div id="'+IDP+'calc">'+
					'<table cellspacing="0" cellpadding="0">'+
					'<tbody>'+
						'<tr>'+
							'<th colspan="2"></th>'+
							'<th>'+I18N.RES_MET+'</th>'+
							'<th>'+I18N.RES_CRY+'</th>'+
							'<th>'+I18N.RES_DEU+'</th>'+
						'</tr>'+
						'<tr class="alt">'+
							'<td class="'+IDP+'label">'+I18N.ACTION+'</td>'+
							'<td class="'+IDP+'select">'+
								'<select id="'+IDP+'action">'+
									'<option value="sell">'+I18N.SELL+'</option>'+
									'<option value="buy">'+I18N.BUY+'</option>'+
								'</select>'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'input_met" type="text" value="">'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'input_cry" type="text" value="">'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'input_deu" type="text" value="">'+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="'+IDP+'label">'+
								I18N.RATIO+
								'<span id="'+IDP+'ratio_illegal">'+
									' ('+I18N.ILLEGAL+')'+
								'</span>'+
							'</td>'+
							'<td class="'+IDP+'select">'+
								'<select id="'+IDP+'ratio"></select>'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'ratio_met" type="text" value="">'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'ratio_cry" type="text" value="">'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'ratio_deu" type="text" value="">'+
							'</td>'+
						'</tr>'+
						'<tr class="alt">'+
							'<td class="'+IDP+'label">'+I18N.IN_EXCH+'</td>'+
							'<td class="'+IDP+'select">'+
								'<select id="'+IDP+'output">'+
									'<option value="m">'+I18N.RES_MET+'</option>'+
									'<option value="c">'+I18N.RES_CRY+'</option>'+
									'<option value="d">'+I18N.RES_DEU+'</option>'+
									'<option value="mc">'+I18N.RES_MET+' + '+I18N.RES_CRY+'</option>'+
									'<option value="md">'+I18N.RES_MET+' + '+I18N.RES_DEU+'</option>'+
									'<option value="cd">'+I18N.RES_CRY+' + '+I18N.RES_DEU+'</option>'+
								'</select>'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'percent_met" type="text" value="">'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'percent_cry" type="text" value="">'+
							'</td>'+
							'<td class="'+IDP+'input">'+
								'<input id="'+IDP+'percent_deu" type="text" value="">'+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="'+IDP+'label" colspan="2">'+I18N.RESULT+'</td>'+
							'<td class="'+IDP+'output" id="'+IDP+'output_met"></td>'+
							'<td class="'+IDP+'output" id="'+IDP+'output_cry"></td>'+
							'<td class="'+IDP+'output" id="'+IDP+'output_deu"></td>'+
						'</tr>'+
						'<tr><td colspan="5">&nbsp;</td></tr>'+
						'<tr class="alt">'+
							'<td class="'+IDP+'label" colspan="5">'+I18N.PLANET+'</td>'+
						'</tr>'+
						'<tr class="alt">'+
							'<td class="'+IDP+'select1row" colspan="5">'+
								'<select id="'+IDP+'planet"></select>'+
							'</td>'+
						'</tr>'+
						'<tr><td colspan="5">&nbsp;</td></tr><tr class="alt">'+
							'<td class="'+IDP+'label" colspan="5">'+I18N.MESSAGE+'</td>'+
						'</tr>'+
						'<tr class="alt">'+
							'<td class="'+IDP+'textarea" colspan="5">'+
								'<textarea id="'+IDP+'message" cols="1" rows="1" readonly="readonly"></textarea>'+
							'</td>'+
						'</tr>'+
					'</tbody>'+
					'</table>'+
				'</div>'+
				'<div id="'+IDP+'config">'+
					'<div class="'+IDP+'config_title">'+I18N.RAT_LST+'</div>'+
					'<div class="'+IDP+'config_box">'+
						'<table cellspacing="0" cellpadding="0">'+
						'<tbody id="'+IDP+'ratio_list">'+
							'<tr>'+
								'<th>#</th>'+
								'<th>'+I18N.NAME+'</th>'+
								'<th>'+I18N.RES_MET+'</th>'+
								'<th>'+I18N.RES_CRY+'</th>'+
								'<th>'+I18N.RES_DEU+'</th>'+
								'<th>'+I18N.ACTION+'</th>'+
								'<th>'+I18N.LEGAL+'</th>'+
								'<th>'+I18N.DEFAULT+'</th>'+
							'</tr>'+
						'</tbody>'+
						'</table>'+
					'</div>'+
					/*'<div class="'+IDP+'config_title">Valores por defecto</div>'+
					'<div class="'+IDP+'config_title">Plantilla de mensaje</div>'+*/
					'<div class="'+IDP+'config_title">'+I18N.IE_CONF+'</div>'+
					'<div class="'+IDP+'config_box '+IDP+'ie_conf '+IDP+'hidden">'+
						'<textarea id="'+IDP+'ie_conf"></textarea>'+
						'<input id="'+IDP+'ie_import" type="button" value="'+I18N.IMPORT+'" class="btn_blue">'+
						'<input id="'+IDP+'ie_export" type="button" value="'+I18N.EXPORT+'" class="btn_blue">'+
					'</div>'+
					'<div class="textCenter">'+
						'<input id="'+IDP+'config_accept" type="button" value="'+I18N.ACCEPT+'" class="btn_blue">'+
						'<input id="'+IDP+'config_cancel" type="button" value="'+I18N.CANCEL+'" class="btn_blue">'+
						'<input id="'+IDP+'config_default" type="button" value="'+I18N.RES_DEF+'" class="btn_blue">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div id="'+IDP+'footer"></div>'+
		'</div>',
	
	/*! [tpl=button] */
	MENUBUTTON :
		'<li>'+
			'<a id="'+IDP+'menubutton" class="menubutton" href="javascript:void(0)" accesskey="" target="_self">'+
				'<span class="textlabel">'+I18N.MENU+'</span>'+
			'</a>'+
		'</li>',
	
	/*! [tpl=ratio_list_limit] */
	RATIO_LIST_LIMIT :
		'<tr>'+
			'<td class="'+IDP+'label '+IDP+'pos"></td>'+
			'<td class="'+IDP+'name_noedit"></td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_met" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_cry" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_deu" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'action">'+
				'<a href="javascript:void(0)" class="'+IDP+'icon_up"></a>'+
				'<a href="javascript:void(0)" class="'+IDP+'icon_down"></a>'+
				'<a href="javascript:void(0)" class="'+IDP+'icon_trash disabled"></a>'+
			'</td>'+
			'<td class="'+IDP+'label">-</td>'+
			'<td class="'+IDP+'check">'+
				'<input name="'+IDP+'def_ratio" type="radio" />'+
			'</td>'+
		'</tr>',
	
	/*! [tpl=ratio_list_item] */
	RATIO_LIST_ITEM :
		'<tr>'+
			'<td class="'+IDP+'label '+IDP+'pos"></td>'+
			'<td class="'+IDP+'name">'+
				'<input class="'+IDP+'edit_ratio_name" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_met" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_cry" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_deu" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'action">'+
				'<a href="javascript:void(0)" class="'+IDP+'icon_up"></a>'+
				'<a href="javascript:void(0)" class="'+IDP+'icon_down"></a>'+
				'<a href="javascript:void(0)" class="'+IDP+'icon_trash"></a>'+
			'</td>'+
			'<td class="'+IDP+'legal"></td>'+
			'<td class="'+IDP+'check">'+
				'<input name="'+IDP+'def_ratio" type="radio" />'+
			'</td>'+
		'</tr>',
	
	/*! [tpl=ratio_list_new] */
	RATIO_LIST_NEW :
		'<tr id="'+IDP+'new_ratio">'+
			'<td class="undermark '+IDP+'pos"></td>'+
			'<td class="'+IDP+'name">'+
				'<input class="'+IDP+'edit_ratio_name" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_met" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_cry" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'ratio">'+
				'<input class="'+IDP+'edit_ratio_deu" type="text" />'+
			'</td>'+
			'<td class="'+IDP+'action">'+
				'<a href="javascript:void(0)" class="'+IDP+'icon_add"></a>'+
			'</td>'+
			'<td class="'+IDP+'legal"></td>'+
			'<td class="'+IDP+'label">-</td>'+
		'</tr>',
	/*! [/tpl] */
}

var DEFAULT_RATIOS = (function()
{
	var uni = $('meta[name="ogame-universe"]').attr('content');
	/*! [default_ratios] */
	return /^\w+\.ogame\.org$/.test(uni)
		? [3,2,1,2,1,1,3,2,1]
		: [5,3,1,2,1.5,1,3,2,1];
	/*! [/default_ratios] */
}
)();

var utime = function()
{
	return (new Date()).getTime();
}

var doNothing = function(){}
var preventDefault = function(e){e.preventDefault();}

var config =
{
	DEFAULT_DATA :
	{
		/*! [config=default] */
		defAction : 'sell',
		ratioList :
		[
			{id:'MAX', ratio:[DEFAULT_RATIOS[0],DEFAULT_RATIOS[1],DEFAULT_RATIOS[2]]},
			{id:'MIN', ratio:[DEFAULT_RATIOS[3],DEFAULT_RATIOS[4],DEFAULT_RATIOS[5]]},
			{id:'REG', ratio:[DEFAULT_RATIOS[6],DEFAULT_RATIOS[7],DEFAULT_RATIOS[8]]}
		],
		defRatio    : 'REG',
		defOutput   : 'm',
		millionAbb  : 'M',
		millionKey  : 'm',
		thousandAbb : 'K',
		thousandKey : 'k',
		abb         : false,
		overUnabb   : false,
		messageTpl  :
			"[b]{?b}{I18N.BUY}{/b}{?s}{I18N.SELL}{/s}:[/b] "+
			"{?m}[b][color={COLOR.MET}]{m}[/color][/b] ({I18N.RES_MET}){?cd} + {/cd}{/m}"+
			"{?c}[b][color={COLOR.CRY}]{c}[/color][/b] ({I18N.RES_CRY}){?d} + {/d}{/c}"+
			"{?d}[b][color={COLOR.DEU}]{d}[/color][/b] ({I18N.RES_DEU}){/d}"+
			"\n[b]{I18N.IN_EXCH}:[/b] "+
			"{?M}[b][color={COLOR.MET}]{M}[/color][/b] ({I18N.RES_MET}){?CD} + {/CD}{/M}"+
			"{?C}[b][color={COLOR.CRY}]{C}[/color][/b] ({I18N.RES_CRY}){?D} + {/D}{/C}"+
			"{?D}[b][color={COLOR.DEU}]{D}[/color][/b] ({I18N.RES_DEU}){/D}"+
			"\n\n[b]* {I18N.RATIO}:[/b] {rm}:{rc}:{rd}"+
			"{?w}\n[b]* {I18N.WHERE}:[/b] {wg}:{ws}:{wp} ({wt}){/w}"+
			"\n\n[b][url={SCRIPT.HOME_URL}]{SCRIPT.NAME}[/url][/b]"
		/*! [/config] */
	},
	_error : function (msg)
	{
		throw 'DataError: '+msg;
	},
	_errorUndefined : function (name)
	{
		this._error(name+' is undefined');
	},
	_errorExpected : function (name,type,expected,found)
	{
		var _exp;
		if (/^[\<\>]\d+$/.test(expected))
		{
			if (expected.charAt(0)=='>') _exp = 'greater';
			else _exp = 'less';
			_exp += ' than '+expected.slice(1);
			//_exp = expected.charAt(0)+' '+expected.slice(1);
		}
		else
			_exp = '"'+expected.split(':').join(" or ")+'"'
		
		this._error(name+': '+type+' '+_exp+' expected but "'+found+'" found');
	},
	_errorType : function (name,expected,found)
	{
		if (found=='undefined') this._errorUndefined(name);
		else this._errorExpected(name,'type',expected,found);
	},
	_errorValue : function (name,expected,found)
	{
		this._errorExpected(name,'value',expected,found);
	},
	_errorLength : function (name,expected,found)
	{
		this._errorExpected(name,'length',expected,found);
	},
	parseData : function (data)
	{
		var i, aux, found, d = (typeof(data)=='string') ? JSON.parse(data) : data;
		if ((found=typeof(d.defAction))!='string') this._errorType('defAction','string',found);
		if (typeof(d.ratioList)=='undefined') this._errorUndefined('ratioList');
		if (!(/^sell|buy$/.test(d.defAction))) this._errorValue('defAction','sell:buy',d.defAction);
		found = typeof(d.defRatio);
		if (!(/^number|string$/.test(found))) this._errorType('defRatio','string:number',found);
		var maxNotFound = true, minNotFound = true, defNotFound = true;
		for (i=0;i<d.ratioList.length;i++)
		{
			aux = d.ratioList[i];
			if ((found=aux.ratio.length)!=3) this._errorLength('ratioList['+i+']',3,found);
			if ((aux.ratio[0]+=0)<=0) this._errorValue('ratioList['+i+'].ratio[0]','>0',aux.ratio[0]);
			if ((aux.ratio[1]+=0)<=0) this._errorValue('ratioList['+i+'].ratio[1]','>0',aux.ratio[1]);
			if ((aux.ratio[2]+=0)<=0) this._errorValue('ratioList['+i+'].ratio[2]','>0',aux.ratio[2]);
			if (aux.id==d.defRatio) defNotFound = false;
			if (/^MAX|MIN|REG$/.test(aux.id+''))
			{
				if (aux.id=='MAX') maxNotFound = false;
				else if (aux.id=='MIN') minNotFound = false;
			}
			else
			{
				if ((found=typeof(aux.id))!='number') this._errorType('ratioList['+i+'].id','number',found);
				if ((found=typeof(aux.name))!='string') this._errorType('ratioList['+i+'].name','string',found);
			}
		}
		if (maxNotFound) this._error('ratioList: maximum ratio (id="MAX") not found');
		if (minNotFound) this._error('ratioList: minimum ratio (id="MIN") not found');
		if (defNotFound) this._error('ratioList: default ratio (id="'+d.defRatio+'" == defRatio) not found');
		aux = d.ratioList.slice(0).sort();
		for (i=1;i<aux.length;i++) if(aux[i-1].id==aux[i].id) this._error('ratioList: duplicate id "'+aux[i].id+'" found');
		if (!(/^m|c|d|mc|md|cd$/.test(d.defOutput))) this._errorValue('defOutput','m:c:d:mc:md:cd',d.defOutput);
		if ((found=typeof(d.millionAbb))!='string') this._errorType('millionAbb','string',found);
		if ((found=d.millionAbb.length)<1) this._errorLength('millionAbb','>0',found);
		if ((found=typeof(d.millionKey))!='string') this._errorType('millionKey','string',found);
		if ((found=d.millionKey.length)!=1) this._errorLength('millionKey',1,found);
		if ((found=typeof(d.thousandAbb))!='string') this._errorType('thousandAbb','string',found);
		if ((found=d.thousandAbb.length)<1) this._errorLength('thousandAbb','>0',found);
		if ((found=typeof(d.thousandKey))!='string') this._errorType('thousandKey','string',found);
		if ((found=d.thousandKey.length)!=1) this._errorLength('thousandKey',1,found);
		if ((found=typeof(d.abb))!='boolean') this._errorType('abb','boolean',found);
		if ((found=typeof(d.overUnabb))!='boolean') this._errorType('overUnabb','boolean',found);
		if ((found=typeof(d.messageTpl))!='string') this._errorType('messageTpl','string',found);
		return d;
	},
	getRatio : function (index,data)
	{
		var item = (arguments.length>1) ? data.ratioList[index] : this.data.ratioList[index],
		id = item.id+'',
		name,
		ratio = item.ratio.slice(0);
		if ('name' in item)
			name = item.name+'';
		else
			name = I18N[id];
		return {
			id    : id,
			ratio : ratio,
			name  : name,
			val   : id+':'+ratio[0]+':'+ratio[1]+':'+ratio[2],
			met   : ratio[0],
			cry   : ratio[1],
			deu   : ratio[2]
		}
	},
	getRatioById : function (id,data)
	{
		var i, d = (arguments.length>1) ? data : this.data, list = d.ratioList;
		for (i in list)
			if (list[i].id==id)
				return this.getRatio(i,d);
		return null;
	},
	save : function(data)
	{
		if (arguments.length>0) this.data = data;
		win.localStorage.setItem(IDP+'config', JSON.stringify(this.data));
		return this;
	},
	load : function()
	{
		var data = win.localStorage.getItem(IDP+'config');
		if (data==null)
			this.data = this.DEFAULT_DATA;
		else
			this.data = JSON.parse(data);
		return this;
	},
	remove : function()
	{
		win.localStorage.removeItem(IDP+'config');
		this.data = this.DEFAULT_DATA;
	}
}

var NumberFormat =
{
	formatI : function (n,writing)
	{
		var nStr, w = (arguments.length>1 && writing);
		if (w && n=='') return '';
		if (typeof(n)=='string')
			nStr = ('0'+n+'').replace(
				new RegExp(config.data.thousandKey+'$','i'), '000'
			).replace(
				new RegExp(config.data.millionKey+'$','i'), '000000'
			).replace(
				/\D/g,'' // delete NaN chars
			).replace(
				/^0+(\d)/,'$1' // delete leading zeros
			);
		else
			nStr = n.toFixed()+'';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(nStr)) {
			nStr = nStr.replace(rgx, '$1' + I18N.THO_SEP + '$2');
		}
		if (!w && config.data.abb) return nStr.replace(
			/\D000\D000$/, config.data.millionAbb
		).replace(
			/\D(\d*[1-9]+)0*\D000$/, I18N.DEC_SEP+'$1'+config.data.millionAbb
		).replace(
			/\D000$/, config.data.thousandAbb
		);
		return nStr;
	},
	formatF : function (n,writing)
	{
		var nStr, x, x1, x2, w = (arguments.length>1 && writing);
		if (w && n=='') return '';
		if (typeof(n)=='string')
			nStr = ('0'+n+'').replace(
				/[\.\,]$/,I18N.DEC_SEP // allow .|, as decimal separator (if last char)
			).replace(
				// delete NaN chars except decimal separator
				new RegExp('[^0-9\\'+I18N.DEC_SEP+']','g'),''
			).replace(
				/^0+(\d)/,'$1' // delete leading zeros
			);
		else
			nStr = (n+'').replace('.',I18N.DEC_SEP);
		x = nStr.split(I18N.DEC_SEP);
		x1 = x[0];
		x2 = x.length > 1 ? I18N.DEC_SEP + x[1] : '';
		if (nStr[nStr.length-1]==I18N.DEC_SEP && w) x2 = I18N.DEC_SEP;
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + I18N.THO_SEP + '$2');
		}
		return x1 + x2;
	},
	parseI : function (n)
	{
		var num = NumberFormat.parseF(n);
		if (new RegExp(config.data.thousandAbb+'$','i').test(n))
			num = num*1000;
		else if (new RegExp(config.data.millionAbb+'$','i').test(n))
			num = num*1000000;
		return Math.round(num);
	},
	parseF : function (n)
	{
		return parseFloat(n.replaceAll(I18N.THO_SEP,'').replace(I18N.DEC_SEP,'.').replace(/[^\d\.]/g,''));
	}
}

var RatioChecker = function()
{
	if (arguments.length<1) this.setLimits();
	else if (arguments.length<2) this.setLimits(arguments[0]);
	else this.setLimits(arguments[0],arguments[1]);
}

RatioChecker.prototype =
{
	limits : [], // order: m/c-min, m/c-max, m/d-min, m/d-max, c/d-min, c/d-max
	isLegal : function ()
	{
		var r;
		if (arguments.length==1) r = arguments[0];
		else r = [arguments[0],arguments[1],arguments[2]];
		var rat = r[0]/r[1], i=0;
		if (rat<this.limits[i++] || rat>this.limits[i++]) return false;
		rat = r[0]/r[2];
		if (rat<this.limits[i++] || rat>this.limits[i++]) return false;
		rat = r[1]/r[2];
		if (rat<this.limits[i++] || rat>this.limits[i++]) return false;
		return true;
	},
	setLimits : function (limit1, limit2)
	{
		if (arguments.length<2)
		{
			var mx,mn,i,list = (arguments.length>0) ? limit1.ratioList : config.data.ratioList;
			for (i in list)
			{
				if      (list[i].id=='MAX') mx = list[i].ratio;
				else if (list[i].id=='MIN') mn = list[i].ratio;
			}
			return this.setLimits(mx,mn);
		}
		this.limits = [];
		var r1 = limit1[0]/limit1[1], r2 = limit2[0]/limit2[1];
		this.limits.push(Math.min(r1,r2));
		this.limits.push(Math.max(r1,r2));
		r1 = limit1[0]/limit1[2]; r2 = limit2[0]/limit2[2];
		this.limits.push(Math.min(r1,r2));
		this.limits.push(Math.max(r1,r2));
		r1 = limit1[1]/limit1[2]; r2 = limit2[1]/limit2[2];
		this.limits.push(Math.min(r1,r2));
		this.limits.push(Math.max(r1,r2));
		return this;
	}
}

var calcRatioChecker, confRatioChecker;

var calc = function (met,cry,deu,rMet,rCry,rDeu,pMet,pCry,pDeu)
{
	//alert(met+":"+cry+":"+deu+"\n"+rMet+":"+rCry+":"+rDeu+"\n"+pMet+":"+pCry+":"+pDeu);
	return {
		met : Math.round(((met+(cry/rCry)*rMet+(deu/rDeu)*rMet)/100)*pMet),
		cry : Math.round((((met/rMet)*rCry+cry+(deu/rDeu)*rCry)/100)*pCry),
		deu : Math.round((((met/rMet)*rDeu+(cry/rCry)*rDeu+deu)/100)*pDeu)
	}
}

var messageMaker =
{
	parseIf : function (tpl,srch,keep)
	{
		var st = '{?'+srch+'}', nd = '{/'+srch+'}';
		if (keep) return tpl.split(st).join('').split(nd).join('');
		
		var i, j, aux, out = tpl;
		while ((i=out.indexOf(st))>=0 && (j=out.indexOf(nd))>=0 && i<j)
		{
			out = out.split(st);
			for (i=1; i<out.length; i++)
			{
				aux = out[i].split(nd);
				if (aux.length>1)
				{
					aux.shift();
					out[i] = nd+aux.shift()+aux.join(nd);
				}
			}
			out = out.join(st).split(st+nd).join('');
		}
		return out;
	},
	parseIfs : function(tpl,cond_map)
	{
		var tmp = tpl+'',
		out = tpl+'',
		re = /\{\?(\!?\w)+\}/,
		cond,
		cond_val,
		pos,
		end,
		aux;
		
		while (re.test(tmp))
		{
			cond = (re.exec(tmp)+'').replace(/\}.*$/,'').replace(/^.*\{/,'');
			tmp = tmp.split('{'+cond+'}').join('');
			try
			{
				cond = cond.replace(/[^\w\!]/g,'');
				if ((aux=cond[pos=0])=='!')
					cond_val = !cond_map[++pos];
				else
					cond_val = cond_map[aux];
				end = cond.length - 1;
				cond_val = cond_map[cond[pos]];
				while (pos<end)
					if ((aux=cond[++pos])=='!')
						cond_val = (cond_val || !cond_map[++pos]);
					else
						cond_val = (cond_val || cond_map[aux]);
				out = this.parseIf(out,cond,cond_val)
			}
			catch (e) {alert(e);}
		}
		return out;
	},
	make : function (action,input,output,ratio,planet)
	{
		var i, re = /[1-9]/,
		out = this.parseIfs(
			config.data.messageTpl,
			{
				b : (action=='buy'),
				s : (action=='sell'),
				m : re.test(input.met),
				c : re.test(input.cry),
				d : re.test(input.deu),
				M : re.test(output.met),
				C : re.test(output.cry),
				D : re.test(output.deu),
				w : planet.use
			}
		);
		out = out.replaceMap({
			'{m}'  : input.met,
			'{c}'  : input.cry,
			'{d}'  : input.deu,
			'{M}'  : output.met,
			'{C}'  : output.cry,
			'{D}'  : output.deu,
			'{rm}' : ratio.met,
			'{rc}' : ratio.cry,
			'{rd}' : ratio.deu,
			'{wg}' : planet.galaxy,
			'{ws}' : planet.system,
			'{wp}' : planet.planet,
			'{wt}' : planet.use ? '{I18N.'+(planet.type+'').toUpperCase()+'}' : 0
		});
		for (i in I18N)
			out = out.replaceAll('{I18N.'+i+'}',I18N[i]);
		for (i in SCRIPT)
			out = out.replaceAll('{SCRIPT.'+i+'}',SCRIPT[i]);
		for (i in COLOR)
			out = out.replaceAll('{COLOR.'+i+'}',COLOR[i]);
		return out;
	}
}

var Input = function (jqo,value)
{
	this.jqo = jqo;
	if (arguments.length>1) this.set(value);
}

Input.prototype =
{
	set : function (value)
	{
		this.jqo.val(value);
		return this;
	},
	disable : function ()
	{
		this.jqo.attr('disabled','disabled').prop('disabled', true);
		return this;
	},
	enable : function ()
	{
		this.jqo.prop("disabled", false).removeAttr('disabled');
		return this;
	},
	isDisabled : function ()
	{
		return (this.jqo.attr('disabled')=='disabled');
	}
}

/*
	type is 'float', 'integer' or 'percent' (only the first char is used)
*/
var NumberInput = function (jqo,value,type,clearOnFocus/*[,allow0][,onChange]*/)
{
	var _this = this, input = (this.jqo = jqo), _onChange, _type = type;
	this.allow0 = true;
	this.focused = false;
	this.onChange = doNothing;
	this.clearOnFocus = clearOnFocus;
	_type = type.substring(0,1).toUpperCase();
	if (this.typePercent=(_type=='P')) _type = 'F';
	this.formatFunc = NumberFormat['format'+_type];
	this.parseFunc  = NumberFormat['parse' +_type];
	if (arguments.length > 4)
	{
		if (arguments.length > 5)
		{
			this.allow0 = arguments[4];
			this.onChange = arguments[5];
		}
		else
			if (typeof(arguments[4])=='function') this.onChange = arguments[4];
			else this.allow0 = (arguments[4]&&true);
	}
	this.set(value);
	_onChange = function()
	{
		var o = _this.jqo,
		value = o.val(),
		caret = o.caret(),
		len   = value.length,
		start = len - caret.start,
		end   = len - caret.end;
		value = _this.formatFunc(o.val(),true);
		len   = value.length;
		start = Math.max(Math.min(len-start,len),0);
		end   = Math.max(Math.min(len-end,len),0);
		num   = (value=='') ? 0 : _this.parseFunc(value);
		if (_this.allow0 || num>0)
			_this.set(value,true).onChange(_this);
		o.caret(start,end);
	};
	input.keyup(function(e){
		// avoid weird stuff on tab navigation
		if (!(/^9|16$/.test(e.which+''))) _onChange();
	}).change(_onChange).blur(function()
	{
		_this.set(_this.num); // force reformat
		//$(this).val(_this.txt);
		_this.focused = false;
	}).focus(function()
	{
		_this.focused = true;
		var o = $(this);
		if (_this.clearOnFocus||_this.num==0) o.val('');
		else
		{
			var caret = o.caret(), len = o.val().length;
			o.val(_this.formatFunc(_this.num,true));
			if (caret.end==len)
				if (caret.start==len)
					caret.start=(--caret.end);
				else
					caret.end--;
			len = o.val().length;
			o.caret(
				Math.min(Math.max(0,caret.start),len),
				Math.min(Math.max(0,caret.end),len)
			);
		}
	}).mouseenter(function()
	{
		if(config.data.overUnabb && !(_this.typePercent||_this.focused||_this.clearOnFocus))
		{
			var o = _this.jqo;
			o.val(_this.formatFunc(_this.num,true));
			if (o.val()=='') o.val(0);
		}
	}).mouseleave(function()
	{
		if(config.data.overUnabb && !(_this.typePercent||_this.focused||_this.clearOnFocus))
			_this.jqo.val(_this.txt);
	});
}

NumberInput.prototype = $.extend(true,{},Input.prototype,
{
	set : function (value,writing)
	{
		var txt, w = (arguments.length>1 && writing);
		if (typeof(value)=='string')
		{
			txt = (value+'').replace(/\%$/,'');
			this.num = (txt=='') ? 0 : this.parseFunc(txt);
			this.txt = this.formatFunc(this.num)+(this.typePercent?'%':'');
		}
		else
		{
			this.num = value;
			this.txt = (txt=this.formatFunc(value))+(this.typePercent?'%':'');
		}
		this.jqo.val(w?txt:this.txt);
		return this;
	}
});

var PlanetSelect = function(jqo,onChange)
{
	var _this = this,
	select = (this.jqo=jqo);
	this.onChange = onChange;
	select.change(function()
	{
		_this.set().onChange();
	});
	$('<option value="">-</option>').appendTo(select);
	//<meta name="ogame-planet-coordinates" content="1:421:10"/>
	var currentPCoord = $('meta[name="ogame-planet-coordinates"]').attr('content').replace(/[^0-9\:]/g,'');
	//<meta name="ogame-planet-type" content="planet"/>
	var currentPType = $('meta[name="ogame-planet-type"]').attr('content').toLowerCase().trim();
	$.each($('#planetList').children('div').get(),function(index,value){
		var o = $(value), c = o.find('.planet-koords');
		if (c.get().length==0) return;
		c = c.text().replace(/[^0-9\:]/g,'');
		option = $('<option value="planet:'+c+'">['+c+'] '+o.find('.planet-name').text().trim()+'</option>').appendTo(select);
		if (c==currentPCoord && currentPType=='planet')
			option.addClass(IDP+'highlight').html(option.html()+' &laquo; '+I18N.CUR_PLA);
		if (o.find('.moonlink').get().length>0)
		{
			option = $('<option value="moon:'+c+'">['+c+'] ('+I18N.MOON+')</option>').appendTo(select).addClass(IDP+'moon');
			if (c==currentPCoord && currentPType=='moon')
				option.addClass(IDP+'highlight').html(option.html()+' &laquo; '+I18N.CUR_PLA);
		}
	});
}

PlanetSelect.prototype =
{
	use  : false,
	type : 0,
	galaxy : 0,
	system : 0,
	planet : 0,
	set : function (v)
	{
		var value = ((arguments.length>0) ? v : this.jqo.val()).split(':');
		if (value.length<4)
			this.use = false;
		else
		{
			this.use    = true;
			this.type   = value.shift();
			this.galaxy = value.shift();
			this.system = value.shift();
			this.planet = value.shift();
		}
		return this;
	}
}

var RatioListItem = function(list,pos,info)
{
	var i,aux,_this = this,ratio;
	if (arguments.length<4)
	{
		this.isNew = false;
		this.name = ('name' in info)
			? info.name
			: (info.id == 'MAX')
				? I18N.MAX
				: (info.id == 'MIN')
					? I18N.MIN
					: I18N.REG;
	
		this.id  = info.id;
		ratio = info.ratio;
	}
	else
	{
		this.isNew = true;
		this.name = '*'+I18N.NEW;
		ratio = config.getRatioById(info.defRatio,info).ratio;
	}
	this.list = list;
	
	if (this.isLimit = /^MIN|MAX$/.test(this.id))
	{
		this.jqo = $(TPL.RATIO_LIST_LIMIT).appendTo(list.jqo);
		this.jqo.find('.'+IDP+'name_noedit').text(this.name);
	}
	else
	{
		this.jqo = $(this.isNew ? TPL.RATIO_LIST_NEW : TPL.RATIO_LIST_ITEM).appendTo(list.jqo);
		this.nameInput = this.jqo.find('.'+IDP+'edit_ratio_name');
		this.nameInput.change(function()
			{_this.name = _this.nameInput.val().trim();}
		).keyup(function()
			{_this.nameInput.change();}
		).val(this.name);
	}
	
	this.posLabel = this.jqo.find('.'+IDP+'pos');
	this.setPos(pos);
	
	aux = ['met','cry','deu'];
	for (i in aux)
		this[aux[i]+'Input'] = new NumberInput(
			this.jqo.find('.'+IDP+'edit_ratio_'+aux[i]), // jQuery object
			ratio[i], // value
			'f',   // type : f = float
			true,  // clearOnFocus
			false, // allow0
			function(){ // onChange
				_this.list.onChange();
			}
		);
	
	this.addButton = this.jqo.find('.'+IDP+'icon_add').click(function()
	{
		var list = _this.list,
		newItem = new RatioListItem(list,_this.pos,_this.getInfo());
		newItem.disableDown().jqo.after(_this.jqo);
		list.list[_this.pos] = newItem;
		list.list[_this.pos-1].enableDown();
		_this.nameInput.val(_this.name = '*'+I18N.NEW);
		_this.setPos(++_this.pos);
	});
	
	this.upButton = this.jqo.find('.'+IDP+'icon_up').click(function(){
		_this.move(true);
	});
	this.upDisabled = false;
	this.downButton = this.jqo.find('.'+IDP+'icon_down').click(function(){
		_this.move(false);
	});
	this.downDisabled = false;
	this.trashButton = this.jqo.find('.'+IDP+'icon_trash');
	if (this.isLimit)
		this.trashButton.addClass('disabled');
	else
		this.trashButton.click(function()
		{
			_this.remove();
		});
	this.radio = this.jqo.find('input[name="'+IDP+'def_ratio"]').click(function()
	{
		_this.list.defRatio = _this.id;
	});
	if (list.defRatio == this.id)
		this.radio.click();
		
	this.legal = this.jqo.find('.'+IDP+'legal');
}

RatioListItem.prototype =
{
	getInfo : function()
	{
		var _this = this, info =
		{
			id : _this.isNew ? utime() : _this.id,
			ratio : [
				_this.metInput.num,
				_this.cryInput.num,
				_this.deuInput.num
			]
		}
		if (!_this.isLimit) info.name = _this.name;
		return info;
	},
	move : function (up)
	{
		var target,aux;
		if (up)
		{
			if (this.upDisabled) return this;
			target = this.list.list[this.pos-1];
			this.jqo.after(target.jqo);
		}
		else
		{
			if (this.downDisabled) return this;
			target = this.list.list[this.pos+1];
			target.jqo.after(this.jqo);
		}
		aux = this.pos;
		this.setPos(target.pos);
		target.setPos(aux);
		aux = target.upDisabled;
		if (this.upDisabled) target.disableUp(); else target.enableUp();
		if (aux) this.disableUp(); else this.enableUp();
		aux = target.downDisabled;
		if (this.downDisabled) target.disableDown(); else target.enableDown();
		if (aux) this.disableDown(); else this.enableDown();
		this.list.sortList();
	},
	remove : function()
	{
		var i,aux=[],list=this.list.list,newItem=this.list.newItem;
		this.jqo.remove();
		list.splice(this.pos,1);
		for (i=0; i<list.length; i++)
			aux[i]=(list[i].setPos(i));
		this.list.list = aux;
		if(this.list.defRatio==this.id)
			aux[0].radio.click();
		if(this.downDisabled)
			aux[aux.length-1].disableDown();
		if(this.upDisabled)
			aux[0].disableUp();
		newItem.setPos(newItem.pos-1);
	},
	enableUp : function()
	{
		this.upDisabled = false;
		this.upButton.removeClass('disabled');
		return this;
	},
	enableDown : function()
	{
		this.downDisabled = false;
		this.downButton.removeClass('disabled');
		return this;
	},
	disableUp : function()
	{
		this.upDisabled = true;
		this.upButton.addClass('disabled');
		return this;
	},
	disableDown : function()
	{
		this.downDisabled = true;
		this.downButton.addClass('disabled');
		return this;
	},
	setLegal : function(isLegal)
	{
		if (isLegal)
			this.legal.text(I18N.YES).addClass('undermark').removeClass('overmark');
		else
			this.legal.text(I18N.NO).addClass('overmark').removeClass('undermark');
		return this;
	},
	setPos : function(pos)
	{
		if (pos%2==0) this.jqo.addClass('alt');
		else this.jqo.removeClass('alt');
		this.pos = pos;
		this.posLabel.html(this.isNew ? '+' : pos+1);
		return this;
	}
}

var ratioList =
{
	list : [],
	limits : [],
	clear : function ()
	{
		for (var i in this.list) this.list[i].jqo.remove();
		this.list = (this.limits = []);
		try{this.newItem.jqo.remove();}catch(e){}
	},
	sortList : function ()
	{
		this.list.sort(function(a,b){return a.pos-b.pos;});
	},
	build : function (configData)
	{
		var i, item, cData = (arguments.length>0) ? configData : config.data;
		this.clear();
		this.defRatio = cData.defRatio;
		for (i=0; i<cData.ratioList.length; i++)
		{
			item = new RatioListItem(this,i,cData.ratioList[i]);
			this.list[i]=item;
			if (item.isLimit) this.limits[this.limits.length]=item;
		}
		var len = this.list.length;
		this.newItem = new RatioListItem(this,len,cData,true);
		this.list[0].disableUp();
		this.list[len-1].disableDown();
		this.onChange();
	},
	updateData : function (configData)
	{
		var cData = (arguments.length>0) ? configData : config.data;
		cData.ratioList = [];
		for (var i in this.list)
			cData.ratioList[i] = this.list[i].getInfo();
		cData.defRatio = this.defRatio;
	},
	onChangeItem : function (item)
	{
		if (!item.isLimit)
			item.setLegal(confRatioChecker.isLegal(item.getInfo().ratio));
	},
	onChange : function()
	{
		confRatioChecker.setLimits(
			this.limits[0].getInfo().ratio,
			this.limits[1].getInfo().ratio
		);
		for (var i=0; i<this.list.length; i++)
			this.onChangeItem(this.list[i]);
		this.onChangeItem(this.newItem);
	},
	init : function (jqo)
	{
		this.jqo = jqo;
		this.build();
	}
}

var ConfigDropdown = function(list,pos,title,box,iface)
{
	var _this = this;
	this.list = list;
	this.iface = iface;
	this.pos = pos;
	this.title = title.click(function(){_this._click();});
	this.box = box;
	if (box.hasClass(IDP+'hidden'))
		this.setOpen(false);
	else
		this.setOpen(true);
}

ConfigDropdown.prototype =
{
	updateOpenCss : function()
	{
		this.openCss =
		{
			height: this.box.height()+'px',
			'padding-top': this.box.css('padding-top'),
			'padding-bottom': this.box.css('padding-bottom'),
			'margin-top': this.box.css('margin-top'),
			'margin-bottom': this.box.css('margin-bottom')/*,
			'opacity': 1*/
		}
		return this;
	},
	closeCss :
	{
		height: 0,
		'padding-top': 0,
		'padding-bottom': 0,
		'margin-top': 0,
		'margin-bottom': 0/*,
		'opacity': 0*/
	},
	afterOpenCss :
	{
		height: 'auto'
	},
	duration : 250,
	setOpen : function (isOpen)
	{
		if(this.isOpen = isOpen)
			this.list.itemOpen = this;
		return this;
	},
	open : function()
	{
		this.updateOpenCss().box.removeClass(IDP+'hidden');
		return this.setOpen(true);
	},
	close : function()
	{
		this.updateOpenCss().box.addClass(IDP+'hidden');
		return this.setOpen(false);
	},
	animateOpen : function()
	{
		var afterOpenCss = this.afterOpenCss;
		this.updateOpenCss().box.css(this.closeCss).removeClass(IDP+'hidden').animate(this.openCss,this.duration,function()
		{
			$(this).css(afterOpenCss);
		});
		return this.setOpen(true);
	},
	animateClose : function()
	{
		var _this = this;
		this.updateOpenCss().box.css(this.openCss).animate(this.closeCss,this.duration,function()
		{
			$(this).addClass(IDP+'hidden').css(_this.openCss).css(_this.afterOpenCss);
		});
		return this.setOpen(false);
	},
	_click : function()
	{
		if(!this.isOpen)
		{
			this.iface.clearExport();
			this.list.itemOpen.animateClose();
			this.animateOpen();
		}
	}
}

var configDropdownList =
{
	init : function (jqo,iface)
	{
		this.jqo = jqo;
		var i, aux = [];
		jqo.find('.'+IDP+'config_title').each(function(i,e)
		{
			aux[i] = {title:$(e)};
		});
		jqo.find('.'+IDP+'config_box').each(function(i,e)
		{
			aux[i].box = $(e);
		});
		this.list = [];
		for (i=0; i<aux.length; i++)
			this.list[i] = new ConfigDropdown (this,i,aux[i].title,aux[i].box,iface);
	}
}

var iface =
({
	addCss : function (text)
	{
		var el = doc.createElement('style');
		el.setAttribute('type','text/css');
	
		if (el.styleSheet)
			el.styleSheet.cssText = text;
		else
			el.appendChild(doc.createTextNode(text));
	
		var head = doc.getElementsByTagName("head")[0];
		head.appendChild(el);
		
		return this;
	},
	menuButton : null,
	menuButtonAction : function ()
	{
		this.menuButtonAction = function(){}
		this.makeWindow();
	},
	makeMenuButton : function ()
	{
		var _this = this;
		this.menuButton = $(TPL.MENUBUTTON).appendTo(
			$('#menuTableTools')
		).find(
			'#'+IDP+'menubutton'
		).click(
			function(){_this.menuButtonAction();}
		);
		return this;
	},
	window    : null,
	ogameHide : null,
	isHidden  : true,
	show: function()
	{
		this.isHidden = false;
		this.ogameHide.hide();
		this.window.show();
		return this;
	},
	hide: function()
	{
		this.isHidden = true;
		this.window.hide();
		this.ogameHide.show();
		return this;
	},
	toggle: function()
	{
		if (this.isHidden) return this.show();
		return this.hide();
	},
	makePlanetSelect : function ()
	{
		var _this = this;
		this.planet = new PlanetSelect(
			this.window.find('#'+IDP+'planet'),
			function(){_this.onChange();}
		);
		return this;
	},
	makeActionSelect : function ()
	{
		var _this = this;
		this.actionJqo = this.window.find('#'+IDP+'action').change(function()
		{
			_this.action = $(this).val();
			_this.onChange();
		}
		).val(this.action=config.data.defAction);
		return this;
	},
	makeResourceInput : function (type /*met|cry|deu*/,value)
	{
		var _this = this;
		_this['input'+type.capitalize()] = new NumberInput(
			this.window.find('#'+IDP+'input_'+type), // jQuery object
			value, // value
			'i',   // type : i = integer
			false, // clearOnFocus
			true,  // allow0
			function(){ // onChange
				_this.checkOutputSelect().onChange();
			}
		);
		return this;
	},
	makeRatioSelect : function ()
	{
		var _this = this;
		this.ratioSelectJqo = this.window.find('#'+IDP+'ratio').change(function()
		{
			var value = $(this).val().split(':');
			if (value.length>3)
			{
				$(this).val('');
				_this.ratioMet.set(parseFloat(value[1]));
				_this.ratioCry.set(parseFloat(value[2]));
				_this.ratioDeu.set(parseFloat(value[3]));
				_this.checkRatio().onChange();
			}
		});
		return this.updateRatioSelect();
	},
	updateRatioSelect : function ()
	{
		var i, select = this.ratioSelectJqo.html('').append(
			$('<option value="">-</option>')
		);
		for (i in config.data.ratioList)
		{
			ratio = config.getRatio(i);
			select.append($(
				'<option value="'+ratio.val+'">'+
				NumberFormat.formatF(ratio.met)+':'+
				NumberFormat.formatF(ratio.cry)+':'+
				NumberFormat.formatF(ratio.deu)+
				' ('+ratio.name+')</option>'
			));
		}
		return this;
	},
	makeRatioInput: function (type /*met|cry|deu*/,value)
	{
		var _this = this;
		_this['ratio'+type.capitalize()] = new NumberInput(
			this.window.find('#'+IDP+'ratio_'+type), // jQuery object
			value, // value
			'f',   // type : f = float
			true,  // clearOnFocus
			false, // allow0
			function(){ // onChange
				_this.checkRatio().onChange();
			}
		);
		return this;
	},
	checkRatio : function()
	{
		if (calcRatioChecker.isLegal(
			this.ratioMet.num,
			this.ratioCry.num,
			this.ratioDeu.num
		))
			this.ratioIllegal.hide();
		else
			this.ratioIllegal.show();
		return this;
	},
	makePercentInput : function (type /*met|cry|deu*/)
	{
		var _this = this, id = 'percent'+type.capitalize();
		_this[id] = new NumberInput(
			this.window.find('#'+IDP+'percent_'+type), // jQuery object
			0,     // value
			'p',   // type : p = percent
			false, // clearOnFocus
			true,  // allow0
			function(o){ // onChange
				if (o.num>100) o.set(100,true);
				var otherId = 'percentMet', otherNum;
				if (/Met|Cry/.test(id)&&(!_this.percentDeu.isDisabled())) otherId = 'percentDeu';
				else if (/Met|Deu/.test(id)&&(!_this.percentCry.isDisabled())) otherId = 'percentCry';
				// if I use:
				//     otherNum = (100.0-o.num);
				// I get wrong results sometimes, like:
				//     100 - 33.889 = 66.1109999999
				// To solve this I manually round the unnecessary decimals
				otherNum = parseFloat((100.0-o.num).toFixed((o.num+'').split('.').pop().length));
				_this[otherId].set(otherNum);
				_this.onChange();
			}
		);
		return this;
	},
	checkOutputSelect : function ()
	{
		var sel = this.outputJqo.val(),
		im = (this.inputMet.num>0),
		ic = (this.inputCry.num>0),
		id = (this.inputDeu.num>0),
		om = /m/.test(sel),
		oc = /c/.test(sel),
		od = /d/.test(sel);
		if (!im && !ic && id && !om && !oc && od)
			this.changeOutputSelect('mc');
		else if (!im && ic && !id && !om && oc && !od)
			this.changeOutputSelect('md');
		else if (im && !ic && !id && om && !oc && !od)
			this.changeOutputSelect('cd');
		else if ((!im && ic && id) || om && ((ic && oc) || (id && od)))
			this.changeOutputSelect('m');
		else if ((im && !ic && id) || oc && ((im && om) || (id && od)))
			this.changeOutputSelect('c');
		else if ((im && ic && !id) || od && ((im && om) || (ic && oc)))
			this.changeOutputSelect('d');
		return this;
	},
	changeOutputSelect : function (value)
	{
		this.outputJqo.val(value);
		m = this.percentMet.disable().set(0),
		c = this.percentCry.disable().set(0),
		d = this.percentDeu.disable().set(0);
		if (value=='m') m.set(100);
		else if (value=='c') c.set(100);
		else if (value=='d') d.set(100);
		else if (value=='mc') {m.enable().set(50);c.enable().set(50);}
		else if (value=='md') {m.enable().set(50);d.enable().set(50);}
		else {c.enable().set(50);d.enable().set(50);}
		return this;
	},
	makeOutputSelect : function ()
	{
		var _this = this;
		this.outputJqo = this.window.find('#'+IDP+'output').change(function()
		{
			_this.changeOutputSelect($(this).val());
			_this.onChange();
		});
		return this;
	},
	toggleConfigCalc : function ()
	{
		var _this = this;
		_this.window.toggleClass('config').toggleClass('calc');
		if (_this.configNeverOpen)
		{
			_this.configNeverOpen = false;
			_this.makeImportExport();
			configDropdownList.init(_this.window.find('#'+IDP+'config'),_this);
		}
		return this;
	},
	updateConfigIface : function(configData)
	{
		var cData = (arguments.length>0) ? configData : config.data;
		confRatioChecker.setLimits(cData);
		ratioList.build(cData);
		this.ieInput.val('');
		return this;
	},
	updateCalcIface : function()
	{
		calcRatioChecker.setLimits();
		this.updateRatioSelect().checkRatio();
		return this;
	},
	updateConfigData : function(configData)
	{
		var cData = (arguments.length>0) ? (configData) : config.data;
		ratioList.updateData(configData);
		return this;
	},
	makeConfigButtons : function ()
	{
		var _this=this, w=_this.window;
		w.find('#'+IDP+'config_but').click(function()
		{
			_this.toggleConfigCalc();
		});
		w.find('#'+IDP+'config_accept').click(function()
		{
			_this.updateConfigData();
			config.save();
			_this.updateCalcIface();
			_this.toggleConfigCalc();
		});
		w.find('#'+IDP+'config_cancel').click(function()
		{
			_this.updateConfigIface();
			_this.toggleConfigCalc();
		});
		w.find('#'+IDP+'config_default').click(function()
		{
			config.remove();
			_this.updateCalcIface();
			_this.updateConfigIface();
			_this.toggleConfigCalc();
		});
		return this;
	},
	makeImportExport : function ()
	{
		var _this = this;
		this.ieInput = this.window.find('#'+IDP+'ie_conf').focus(function(){$(this).select();});
		this.window.find('#'+IDP+'ie_import').click(function()
		{
			try
			{
				var data = config.parseData(_this.ieInput.val());
				_this.updateConfigIface(data);
			}
			catch(e)
			{
				alert(e);
			}
		});
		this.window.find('#'+IDP+'ie_export').click(function()
		{
			var data = $.extend({},config.data);
			_this.updateConfigData(data);
			_this.ieInput.val('').val(JSON.stringify(data)).select();
		});
		return this;
	},
	clearExport : function ()
	{
		this.ieInput.val('');
		return this;
	},
	makeWindow : function ()
	{
		config.load();
		calcRatioChecker = new RatioChecker();
		confRatioChecker = new RatioChecker();
		var _this = this, w, defaultRatio = config.getRatioById(config.data.defRatio);
		this.ogameHide = $('#inhalt').after(w=(this.window=$(TPL.WINDOW).hide()));
		this.addCss(TPL.CSS).show();
		this.ratioIllegal = w.find('#'+IDP+'ratio_illegal').hide();
		this.outputMessage = w.find('#'+IDP+'message').click(function(){$(this).select();});
		this.outputMet = w.find('#'+IDP+'output_met').text(0);
		this.outputCry = w.find('#'+IDP+'output_cry').text(0);
		this.outputDeu = w.find('#'+IDP+'output_deu').text(0);
		w.find('#'+IDP+'close').click(function(){_this.hide();});
		this.makeActionSelect(
			).makeResourceInput('met',0
			).makeResourceInput('cry',0
			).makeResourceInput('deu',0
			).makeRatioSelect(
			).makeRatioInput('met',defaultRatio.met
			).makeRatioInput('cry',defaultRatio.cry
			).makeRatioInput('deu',defaultRatio.deu
			).makeOutputSelect(
			).makePercentInput('met'
			).makePercentInput('cry'
			).makePercentInput('deu'
			).changeOutputSelect(config.data.defOutput
			).makePlanetSelect(
			).checkRatio();
		this.menuButtonAction = function(){_this.toggle();}
		
		// config
		
		ratioList.init(w.find('#'+IDP+'ratio_list'),this);
		this.configNeverOpen = true;
		this.makeConfigButtons();
		
		return this;
	},
	onChange : function()
	{
		var out = calc(
			this.inputMet.num,
			this.inputCry.num,
			this.inputDeu.num,
			this.ratioMet.num,
			this.ratioCry.num,
			this.ratioDeu.num,
			this.percentMet.num,
			this.percentCry.num,
			this.percentDeu.num
		);
		this.outputMet.text(NumberFormat.formatI(out.met));
		this.outputCry.text(NumberFormat.formatI(out.cry));
		this.outputDeu.text(NumberFormat.formatI(out.deu));
		this.outputMessage.text(messageMaker.make(
			this.action,
			{
				met : this.inputMet.txt,
				cry : this.inputCry.txt,
				deu : this.inputDeu.txt,
			},
			{
				met : this.outputMet.text(),
				cry : this.outputCry.text(),
				deu : this.outputDeu.text(),
			},
			{
				met : this.ratioMet.txt,
				cry : this.ratioCry.txt,
				deu : this.ratioDeu.txt,
			},
			this.planet
		));
		return this;
	},
	init : function ()
	{
		return this.makeMenuButton();
	}
}
).init();

/////
})();
