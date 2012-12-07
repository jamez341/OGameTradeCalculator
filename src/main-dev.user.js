// ==UserScript==
// @name	   OGame Trade Calculator
// @description    Adds a trade calculator to the OGame interface
// @namespace      http://userscripts.org/users/68563/scripts
// @downloadURL    https://userscripts.org/scripts/source/151002.user.js
// @updateURL      https://userscripts.org/scripts/source/151002.meta.js
// @version	2.5.5
// @include	*://*.ogame.*/game/index.php?*page=*
// ==/UserScript==
/*! OGame Trade Calculator (C) 2012 Elías Grande Cásedas | GNU-GPL | gnu.org/licenses */
(function(){
////////////

var IDP,
SCRIPT =
{
	VERSION      : [2,5,4],
	ID_PREFIX    : (IDP=/*[IDP]*/'o_trade_calc_'/*[/IDP]*/),
	NAME	     : 'OGame Trade Calculator',
	HOME_URL     : 'http://userscripts.org/scripts/show/151002',
	UPDATE_URL   : 'https://userscripts.org/scripts/source/151002.meta.js',
	UPDATE_JSONP : 'https://dl.dropbox.com/u/89283239/OGame%20Trade%20Calculator/dist/updater.js',
	DOWNLOAD_URL : 'https://userscripts.org/scripts/source/151002.user.js',
	TESTED_OGAME_VERSION : '5.2.0-beta7'
},

parseVersion = function (version)
{
	var i,v = version.split(/\D+/g);
	for (i in v)
		v[i]=parseInt(v[i]);
	return v;
},

/* true if (v1<v2) OR (v1==v2 && eq) */
v1_less_than_v2 = function(v1,v2,eq)
{
	var i,
	l1 = v1.length,
	l2 = v2.length,
	lm = Math.min(l1,l2);
	for (i=0; i<lm; i++)
		if (v1[i]>v2[i]) return false;
		else if (v1[i]<v2[i]) return true;
	if (l1>l2) return false;
	if (l1<l2) return true;
	if (arguments.length>2 && eq) return true;
	return false;
}

var win = window, doc, $;
try{if (unsafeWindow) win = unsafeWindow;}
catch(e){}
doc = win.document;
$ = win.jQuery;

var storage =
{
	obj : win.localStorage,
	set : function (id,data)
	{
		return this.obj.setItem(IDP+id,JSON.stringify(data));
	},
	get : function (id)
	{
		var value = this.obj.getItem(IDP+id);
		return (value==null) ? null : JSON.parse(value);
	},
	remove : function (id)
	{
		return this.obj.removeItem(IDP+id);
	}
}

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

var onDOMContentLoaded = function()
{

////////////////////////////////////
//                                //
//   START onDOMContentLoaded()   //
//                                //
////////////////////////////////////
$ = win.jQuery; // tampermonkey fix

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

var OGAME =
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
	init : function()
	{
		return {
			LANGUAGE : this.getMeta('ogame-language',''),
			VERSION  : parseVersion(this.getMeta('ogame-version','0'))
		}
	}
}
).init();

var COLOR =
{
	/*! [colors] */
	MET : '#FF7700',
	CRY : '#00FFFF',
	DEU : '#FF33FF',
	SC  : '#FFFFFF',
	LC  : '#FFFFFF'
	/*! [/colors] */
}

var I18N =
({
	text : {},
	set : function(pattern,obj)
	{
		if (pattern.test(OGAME.LANGUAGE)) $.extend(true,this.text,obj);
		return this;
	},
	init : function()
	{
		var res = (win.initAjaxResourcebox+'').split(/tooltip\s*[\"\']\s*\:\s*[\"\']/);
		this.text.RES_MET = res[1].split('|').shift();
		this.text.RES_CRY = res[2].split('|').shift();
		this.text.RES_DEU = res[3].split('|').shift();
		return this;
	}
}
).init(
/*! [i18n=en] */
).set(/.*/,
{
	// Number separators
	THO_SEP : ",",
	DEC_SEP : ".",
	// Menu button
	MENU    : "Trade C.",
	// Window title
	TITLE   : "Trade calculator",
	CONFIG  : "Settings",
	// Update
	UPD_AVA : "Update available",
	INSTALL : "Install",
	GO_HOME : "Visit the site of the script",
	// Actions
	ACTION  : "Action",
	BUY     : "I buy",
	SELL    : "I sell",
	// Ratio
	RATIO   : "Ratio",
	ILLEGAL : "illegal",
	MAX     : "Maximum",
	REG     : "Regular",
	MIN     : "Minimum",
	// Output
	IN_EXCH : "In exchange for",
	RESULT  : "Result",
	SEND    : "I send",
	RECEIVE : "I receive",
	RES     : "Resources",
	// Ships
	LC_SHIP : "LC", // Abb. of "Large Cargo Ship"
	SC_SHIP : "SC", // Abb. of "Small Cargo Ship"
	OR      : "or", // e.g. 100 (LC) or 500 (SC)
	// Message
	MESSAGE : "Message",
	// Place of delivery
	WHERE   : "Place of delivery",
	PLANET  : "Planet",
	MOON    : "Moon",
	CUR_PLA : "Current planet",
	SEL_CUR : "Select current planet or moon",
	// Config » Ratio list
	RAT_LST : "Ratio list",
	NAME    : "Name",
	LEGAL   : "Legal",
	YES     : "Yes",
	NO      : "No",
	DEFAULT : "Default",
	NEW     : "New",
	// Config » Default values
	DEF_VAL : "Default values",
	// Config » Abbs & keys
	ABB_KEY : "Abbreviations and auto-complete keys",
	USE_ABB : "Use abbreviations when possible",
	UNABB   : "Unabbreviate fields when the mouse is over them",
	ABB_MIL : "Abbreviation for millions",
	ABB_THO : "Abbreviation for thousands",
	KEY_MIL : "Key to write millions (6 zeros)",
	KEY_THO : "Key to write thousands (3 zeros)",
	// Config » Message tpl
	MES_TPL : "Message template",
	RES_DTP : "Restore default template",
	// Config » Import / Export
	IE_CONF : "Import / Export configuration",
	IMPORT  : "Import",
	EXPORT  : "Export",
	// Config » Buttons
	ACCEPT  : "Accept",
	CANCEL  : "Cancel",
	RES_DEF : "Restore default settings",
	// Config » Contact
	CONTACT : "Contact information"
}
/*! [i18n=es] */
).set(/es|ar|mx/,
{
	// Number separators
	THO_SEP : ".",
	DEC_SEP : ",",
	// Menu button
	MENU    : "C. Comercio",
	// Window title
	TITLE   : "Calculadora de comercio",
	CONFIG  : "Configuración",
	// Update
	UPD_AVA : "Actualización disponible",
	INSTALL : "Instalar",
	GO_HOME : "Visitar página del script",
	// Actions
	ACTION  : "Acción",
	BUY     : "Compro",
	SELL    : "Vendo",
	// Ratio
	RATIO   : "Ratio",
	ILLEGAL : "ilegal",
	MAX     : "Máximo",
	REG     : "Normal",
	MIN     : "Mínimo",
	// Output
	IN_EXCH : "A cambio de",
	RESULT  : "Resultado",
	SEND    : "Envío",
	RECEIVE : "Recibo",
	RES     : "Recursos",
	// Ships
	LC_SHIP : "NGC", // Abb. of "Large Cargo Ship"
	SC_SHIP : "NPC", // Abb. of "Small Cargo Ship"
	OR      : "o", // e.g. 100 (LC) or 500 (SC)
	// Message
	MESSAGE : "Mensaje",
	// Place of delivery
	WHERE   : "Lugar de entrega",
	PLANET  : "Planeta",
	MOON    : "Luna",
	CUR_PLA : "Planeta actual",
	SEL_CUR : "Seleccionar planeta o luna actual",
	// Config » Ratio list
	RAT_LST : "Lista de ratios",
	NAME    : "Nombre",
	LEGAL   : "Legal",
	YES     : "Si",
	NO      : "No",
	DEFAULT : "Por defecto",
	NEW     : "Nuevo",
	// Config » Default values
	DEF_VAL : "Valores por defecto",
	// Config » Abbs & keys
	ABB_KEY : "Abreviaciones y teclas de autocompletado",
	USE_ABB : "Usar abreviaciones cuando sea posible",
	UNABB   : "Desabreviar campos al poner el ratón encima",
	ABB_MIL : "Abreviación para millones",
	ABB_THO : "Abreviación para miles",
	KEY_MIL : "Tecla para escribir millones (6 ceros)",
	KEY_THO : "Tecla para escribir miles (3 ceros)",
	// Config » Message tpl
	MES_TPL : "Plantilla de mensaje",
	RES_DTP : "Restaurar plantilla por defecto",
	// Config » Import / Export
	IE_CONF : "Importar / Exportar configuración",
	IMPORT  : "Importar",
	EXPORT  : "Exportar",
	// Config » Buttons
	ACCEPT  : "Aceptar",
	CANCEL  : "Cancelar",
	RES_DEF : "Restaurar ajustes por defecto",
	// Config » Contact
	CONTACT : "Información de contacto"
}
/*! [i18n=nl] by sanctuary http://userscripts.org/users/431052 */
).set(/nl/,
{
	// Number separators
	THO_SEP : ",",
	DEC_SEP : ".",
	// Menu button
	MENU    : "Trade C.",
	// Window title
	TITLE   : "Trade calculator",
	CONFIG  : "Instellingen",
	// Update
	UPD_AVA : "Update beschikbaar",
	INSTALL : "Installeren",
	GO_HOME : "Bezoek de web van het script",
	// Actions
	ACTION  : "Actie",
	BUY     : "Ik koop",
	SELL    : "Ik verkoop",
	// Ratio
	RATIO   : "Verhouding",
	ILLEGAL : "illegaal",
	MAX     : "Maximaal",
	REG     : "Gemiddeld",
	MIN     : "Minimaal",
	// Output
	IN_EXCH : "In ruil voor",
	RESULT  : "Resultaat",
	SEND    : "Ik verstuur",
	RECEIVE : "Ik ontvang",
	RES     : "Grondstoffen",
	// Ships
	LC_SHIP : "GV", // Abb. of "Groot vrachtschip"
	SC_SHIP : "KV", // Abb. of "Klein vrachtschip"
	OR      : "of", // e.g. 100 (GV) or 500 (KV)
	// Message
	MESSAGE : "Bericht",
	// Place of delivery
	WHERE   : "Plaats van levering",
	PLANET  : "Planeet",
	MOON    : "Maan",
	CUR_PLA : "Huidige planeet",
	SEL_CUR : "Kies huidige planeet of maan",
	// Config » Ratio list
	RAT_LST : "Verhouding lijst",
	NAME    : "Naam",
	LEGAL   : "Legaal",
	YES     : "Ja",
	NO      : "Nee",
	DEFAULT : "Standaard",
	NEW     : "Nieuw",
	// Config » Default values
	DEF_VAL : "Standaard waarde",
	// Config » Abbs & keys
	ABB_KEY : "Toets afkortingen en automatisch aanvullen",
	USE_ABB : "Gebruik afkortingen wanneer mogelijk",
	UNABB   : "Verkort velden wanneer de muis over het veld staat",
	ABB_MIL : "Afkorting voor miljoen",
	ABB_THO : "Afkorting voor duizend",
	KEY_MIL : "Toets voor miljoen te schrijven (6 nullen)",
	KEY_THO : "Toets voor duizend te schrijven (3 nullen)",
	// Config » Message tpl
	MES_TPL : "Bericht sjabloon",
	RES_DTP : "Herstel standaard sjabloon",
	// Config » Import / Export
	IE_CONF : "Invoer / Uitvoer configuratie",
	IMPORT  : "Invoer",
	EXPORT  : "Uitvoer",
	// Config » Buttons
	ACCEPT  : "Accepteer",
	CANCEL  : "Annuleer",
	RES_DEF : "Herstel naar standaard instellingen",
	// Config » Contact
	CONTACT : "Contactinformatie"
}
/*! [/i18n] */
).text;

var TPL =
{
	/*! [css] */
	CSS :
		"#"+IDP+"window select{"+
			"visibility:visible !important;"+ // ogame 5.2.0-beta7 fix
		"}"+
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
			"display:block;"+
			"height:16px;"+
			"width:16px;"+
			"background:url(http://gf3.geo.gfsrv.net/cdne7/1f57d944fff38ee51d49c027f574ef.gif);"+
			"float:right;"+
			"margin:8px 0 0 0;"+
			"opacity:0.5;"+
		"}"+
		"#"+IDP+"config_but:hover{"+
			"opacity:1;"+
		"}"+
		"#"+IDP+"window.config input[type=\"button\"]{"+
			"margin:0 5px 0 5px;"+
		"}"+
		"#"+IDP+"config,"+
		"#"+IDP+"window.config #"+IDP+"calc,"+
		"#"+IDP+"window.config #"+IDP+"config_but,"+
		//"#"+IDP+"window.config ."+IDP+"calc_only,"+
		"#"+IDP+"window.calc ."+IDP+"config_only{"+
			"display:none;"+
		"}"+
		"#"+IDP+"window.config #"+IDP+"config{"+
			"display:block;"+
		"}"+
		"#"+IDP+"main,"+
		"#"+IDP+"update{"+
			"padding:15px 25px 0 25px;"+
			"background: url(\"http://gf1.geo.gfsrv.net/cdn9e/4f73643e86a952be4aed7fdd61805a.gif\") repeat-y scroll 5px 0px transparent;"+
		"}"+
		"#"+IDP+"main *{"+
			"font-size:11px;"+
		"}"+
		"#"+IDP+"update div{"+
			"font-size:11px;"+
			"border:1px solid #000;"+
			"color:#99CC00;"+
			"line-height:30px;"+
			"text-align:center;"+
			"font-weight:bold;"+
		"}"+
		"#"+IDP+"update a{"+
			"margin-left:15px;"+
		"}"+
		"#"+IDP+"window table{"+
			"width:620px;"+ // 670 [window] - (25+25) [main padding] - 2 [border]
			"background-color:#0D1014;"+
			"border-collapse:collapse;"+
			"clear:both;"+
		"}"+
		"#"+IDP+"window.calc table{"+
			"border:1px solid #000;"+
			"margin:0 0 20px 0;"+
		"}"+
		"#"+IDP+"window.calc table.last{"+
			"margin:0;"+
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
		"."+IDP+"input,"+
		"."+IDP+"output{"+
			"width:112px;"+
			"padding:0 2px 0 0;"+
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
		"."+IDP+"select1row{"+
			"padding-left:2px;"+
		"}"+
		"."+IDP+"select1row select{"+
			"width:250px !important;"+
			"text-align:left;"+
			"margin:0;"+
		"}"+
		"#"+IDP+"selCurPla_button{"+
			"margin-left:30px"+
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
			"opacity:0.7;"+
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
			"opacity:1;"+
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
		"#"+IDP+"window.config textarea{"+
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
		"."+IDP+"fieldwrapper:before,"+ // from: .ui-helper-clearfix
		"."+IDP+"fieldwrapper:after{"+
			"content:\"\";"+
			"display:table;"+
		"}"+
		"."+IDP+"fieldwrapper:after{"+ // from: .ui-helper-clearfix
			"clear:both;"+
		"}"+
		"."+IDP+"fieldwrapper{"+
			"padding:7px 0 7px 0;"+
		"}"+
		"."+IDP+"fieldwrapper label,"+
		"."+IDP+"thefield{"+
			"color:#6F9FC8;"+
			"height:22px;"+
			"line-height:22px;"+
			"float:left;"+
			"margin:2px 0 0 0;"+
		"}"+
		"."+IDP+"fieldwrapper label{"+
			"font-weight:bold;"+
			"width:320px;"+
			"margin:0 15px 0 0;"+
			"padding:0 0 0 10px;"+
		"}"+
		"."+IDP+"thefield input[type=\"text\"],"+
		"."+IDP+"thefield select{"+
			"width:200px"+
		"}"+
		"",
	
	/*! [tpl=action_options] */
	ACTION_OPT :
		'<option value="sell">'+I18N.SELL+'</option>'+
		'<option value="buy">'+I18N.BUY+'</option>',
	
	/*! [tpl=output_options] */
	OUTPUT_OPT :
		'<option value="m">'+I18N.RES_MET+'</option>'+
		'<option value="c">'+I18N.RES_CRY+'</option>'+
		'<option value="d">'+I18N.RES_DEU+'</option>'+
		'<option value="mc">'+I18N.RES_MET+' + '+I18N.RES_CRY+'</option>'+
		'<option value="md">'+I18N.RES_MET+' + '+I18N.RES_DEU+'</option>'+
		'<option value="cd">'+I18N.RES_CRY+' + '+I18N.RES_DEU+'</option>',
	
	/*! [tpl=void_href] */
	VOID_HREF : 'href="javascript:void(0)"',

	/*! [tpl=window] */
	WINDOW :
		'<div id="'+IDP+'window" class="calc">'+
			'<div id="'+IDP+'header">'+
				'<h4>'+I18N.TITLE+'<span class="'+IDP+'config_only"> &raquo; '+I18N.CONFIG+'</span></h4>'+
				'<a id="'+IDP+'close" href="javascript:void(0);" class="close_details close_ressources"></a>'+
				'<a id="'+IDP+'config_but" href="javascript:void(0);"></a>'+
			'</div>'+
			'<div id="'+IDP+'main">'+
				//#
				//# CALC
				//#
				'<div id="'+IDP+'calc">'+
					'<table cellspacing="0" cellpadding="0"><tbody>'+
						// calc titles
						'<tr>'+
							'<th colspan="2"></th>'+
							'<th>'+I18N.RES_MET+'</th>'+
							'<th>'+I18N.RES_CRY+'</th>'+
							'<th>'+I18N.RES_DEU+'</th>'+
						'</tr>'+
						// action :: action & input resources
						'<tr class="alt">'+
							'<td class="'+IDP+'label">'+I18N.ACTION+'</td>'+
							'<td class="'+IDP+'select">'+
								'<select id="'+IDP+'action">'+
									'{this.ACTION_OPT}'+
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
						// ratio :: ratio select & ratio fields
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
						// in exchange for :: output select & percent fields
						'<tr class="alt">'+
							'<td class="'+IDP+'label">'+I18N.IN_EXCH+'</td>'+
							'<td class="'+IDP+'select">'+
								'<select id="'+IDP+'output">'+
									'{this.OUTPUT_OPT}'+
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
						// output resources
						'<tr>'+
							'<td class="'+IDP+'label" colspan="2">'+I18N.RESULT+'</td>'+
							'<td class="'+IDP+'output" id="'+IDP+'output_met"></td>'+
							'<td class="'+IDP+'output" id="'+IDP+'output_cry"></td>'+
							'<td class="'+IDP+'output" id="'+IDP+'output_deu"></td>'+
						'</tr>'+
					'</tbody></table>'+
					//
					// CARGOS
					//
					'<table cellspacing="0" cellpadding="0"><tbody>'+
						// cargos titles
						'<tr>'+
							'<th></th>'+
							'<th>'+I18N.RES+'</th>'+
							'<th>'+I18N.LC_SHIP+'</th>'+
							'<th>'+I18N.SC_SHIP+'</th>'+
						'</tr>'+
						// send cargos
						'<tr class="alt">'+
							'<td class="'+IDP+'label">'+I18N.SEND+'</td>'+
							'<td class="'+IDP+'output overmark" id="'+IDP+'sendRes">0</td>'+
							'<td class="'+IDP+'output" id="'+IDP+'sendLC">0</td>'+
							'<td class="'+IDP+'output" id="'+IDP+'sendSC">0</td>'+
						'</tr>'+
						// receive cargos
						'<tr>'+
							'<td class="'+IDP+'label">'+I18N.RECEIVE+'</td>'+
							'<td class="'+IDP+'output undermark" id="'+IDP+'receiveRes">0</td>'+
							'<td class="'+IDP+'output" id="'+IDP+'receiveLC">0</td>'+
							'<td class="'+IDP+'output" id="'+IDP+'receiveSC">0</td>'+
						'</tr>'+
					'</tbody></table>'+
					//
					// PLACE OF DELIVERY
					//
					'<table cellspacing="0" cellpadding="0"><tbody>'+
						// title
						'<tr class="alt">'+
							'<td class="'+IDP+'label" colspan="5">'+I18N.WHERE+'</td>'+
						'</tr>'+
						// select
						'<tr class="alt">'+
							'<td class="'+IDP+'select1row" colspan="5">'+
								'<select id="'+IDP+'planet"></select>'+
								'<a {this.VOID_HREF} id="'+IDP+'selCurPla_button">'+I18N.SEL_CUR+'</a>'+
							'</td>'+
						'</tr>'+
					'</tbody></table>'+
					//
					// MESSAGE
					//
					'<table cellspacing="0" cellpadding="0" class="last"><tbody>'+
						// title
						'<tr class="alt">'+
							'<td class="'+IDP+'label" colspan="5">'+I18N.MESSAGE+'</td>'+
						'</tr>'+
						// textarea
						'<tr class="alt">'+
							'<td class="'+IDP+'textarea" colspan="5">'+
								'<textarea id="'+IDP+'message" cols="1" rows="1" readonly="readonly"></textarea>'+
							'</td>'+
						'</tr>'+
					'</tbody></table>'+
				'</div>'+
				//#
				//# CONFIG
				//#
				'<div id="'+IDP+'config">'+
					//
					// RATIO LIST
					//
					'<div class="'+IDP+'config_title">'+I18N.RAT_LST+'</div>'+
					'<div class="'+IDP+'config_box">'+
						'<table cellspacing="0" cellpadding="0">'+
						'<tbody id="'+IDP+'ratioList">'+
							// titles
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
							// config.data.ratioList (added dynamically)
						'</tbody>'+
						'</table>'+
					'</div>'+
					//
					// DEFAULT VALUES
					//
					'<div class="'+IDP+'config_title">'+I18N.DEF_VAL+'</div>'+
					'<div class="'+IDP+'config_box '+IDP+'hidden">'+
						// config.data.defAction
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.ACTION+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<select id="'+IDP+'defAction">'+
									'{this.ACTION_OPT}'+
								'</select>'+
							'</div>'+
						'</div>'+
						// config.data.defOutput
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.IN_EXCH+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<select id="'+IDP+'defOutput">'+
									'{this.OUTPUT_OPT}'+
								'</select>'+
							'</div>'+
						'</div>'+
						// config.data.selCurPla
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.SEL_CUR+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<input id="'+IDP+'selCurPla" type="checkbox" />'+
							'</div>'+
						'</div>'+
					'</div>'+
					//
					// ABBREVIATIONS & AUTOCOMPLETE KEYS
					//
					'<div class="'+IDP+'config_title">'+I18N.ABB_KEY+'</div>'+
					'<div class="'+IDP+'config_box '+IDP+'hidden">'+
						// config.data.abb
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.USE_ABB+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<input id="'+IDP+'abb" type="checkbox" />'+
							'</div>'+
						'</div>'+
						// config.data.overUnabb
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.UNABB+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<input id="'+IDP+'overUnabb" type="checkbox" />'+
							'</div>'+
						'</div>'+
						// config.data.millionAbb
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.ABB_MIL+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<input id="'+IDP+'millionAbb" type="text" maxlength="10" />'+
							'</div>'+
						'</div>'+
						// config.data.thousandAbb
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.ABB_THO+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<input id="'+IDP+'thousandAbb" type="text" maxlength="10" />'+
							'</div>'+
						'</div>'+
						// config.data.millionKey
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.KEY_MIL+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<input id="'+IDP+'millionKey" type="text" maxlength="1" />'+
							'</div>'+
						'</div>'+
						// config.data.thousandKey
						'<div class="'+IDP+'fieldwrapper">'+
							'<label>'+I18N.KEY_THO+':</label>'+
							'<div class="'+IDP+'thefield">'+
								'<input id="'+IDP+'thousandKey" type="text" maxlength="1" />'+
							'</div>'+
						'</div>'+
					'</div>'+
					//
					// MESSAGE TEMPLATE
					//
					'<div class="'+IDP+'config_title">'+I18N.MES_TPL+'</div>'+
					'<div class="'+IDP+'config_box '+IDP+'hidden">'+
						'<textarea id="'+IDP+'messageTpl"></textarea>'+
						'<div class="textCenter">'+
							'<input id="'+IDP+'messageTpl_restore" type="button" value="'+I18N.RES_DTP+'" class="btn_blue">'+
						'</div>'+
					'</div>'+
					//
					// IMPORT & EXPORT
					//
					'<div class="'+IDP+'config_title">'+I18N.IE_CONF+'</div>'+
					'<div class="'+IDP+'config_box '+IDP+'ie_conf '+IDP+'hidden">'+
						'<textarea id="'+IDP+'ie_conf"></textarea>'+
						'<input id="'+IDP+'ie_import" type="button" value="'+I18N.IMPORT+'" class="btn_blue">'+
						'<input id="'+IDP+'ie_export" type="button" value="'+I18N.EXPORT+'" class="btn_blue">'+
					'</div>'+
					//
					// CONTACT
					//
					'<div class="'+IDP+'config_title">'+I18N.CONTACT+'</div>'+
					'<div class="'+IDP+'config_box '+IDP+'hidden">'+
						'<table cellspacing="0" cellpadding="0"><tbody>'+
							/*'<tr>'+
								'<th>#</th>'+
								'<th>Description</th>'+
								'<th>Link</th>'+
							'</tr>'+*/
							'<tr class="alt">'+
								'<td class="'+IDP+'label '+IDP+'pos">1</td>'+
								'<td>Userscripts</td>'+
								'<td><a href="http://userscripts.org/scripts/discuss/151002" target="_blank">Discuss OGame Trade Calculator - userscripts.org</a></td>'+
							'</tr>'+
							'<tr>'+
								'<td class="'+IDP+'label '+IDP+'pos">2</td>'+
								'<td>Ogame Origin</td>'+
								'<td><a href="http://board.origin.ogame.de/board6-origin/board38-tools-scripts-skins/board39-tolerated-tools-addons-scripts/4367-ogame-trade-calculator/" target="_blank">[Tolerated] OGame Trade Calculator - board.origin.ogame.de</a></td>'+
							'</tr>'+
							'<tr class="alt">'+
								'<td class="'+IDP+'label '+IDP+'pos">3</td>'+
								'<td>Ogame España</td>'+
								'<td><a href="http://board.ogame.com.es/board859-ogamelacomunidad/board860-comunidad/board422-utilidadesyskinsparaogame/1224751-scriptcalculadoradecomerciolegal/" target="_blank">[Script] Calculadora de Comercio [Legal] - board.ogame.com.es</a></td>'+
							'</tr>'+
						'</tbody></table>'+
					'</div>'+
					//
					// BUTTONS
					//
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
	// menubutton must not use references to other TPLs, like "{this.VOID_HREF}"
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
				'<a {this.VOID_HREF} class="'+IDP+'icon_up"></a>'+
				'<a {this.VOID_HREF} class="'+IDP+'icon_down"></a>'+
				'<a {this.VOID_HREF} class="'+IDP+'icon_trash disabled"></a>'+
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
				'<a {this.VOID_HREF} class="'+IDP+'icon_up"></a>'+
				'<a {this.VOID_HREF} class="'+IDP+'icon_down"></a>'+
				'<a {this.VOID_HREF} class="'+IDP+'icon_trash"></a>'+
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
				'<a {this.VOID_HREF} class="'+IDP+'icon_add"></a>'+
			'</td>'+
			'<td class="'+IDP+'legal"></td>'+
			'<td class="'+IDP+'label">-</td>'+
		'</tr>',
	
	/*! [tpl=update] */
	UPDATE :
		'<div id="'+IDP+'update"><div>'+
			'Actualización disponible'+
			((typeof(GM_xmlhttpRequest)=="undefined")?'':
			('<a target="_blank" href="'+SCRIPT.DOWNLOAD_URL+'">'+
				'Instalar'+
			'</a>'))+
			'<a target="_blank" href="'+SCRIPT.HOME_URL+'">'+
				'Ir a la página del script'+
			'</a>'+
		'</div></div>',
	/*! [/tpl] */
	
	init : function()
	{
		for (var i in this) if (typeof(this[i])=='string')
			for (var j in this) if (typeof(this[j])=='string')
				this[i] = this[i].replaceAll('{this.'+j+'}',this[j]);
	}
}

var DEFAULT_RATIOS = (function()
{
	var uni = $('meta[name="ogame-universe"]').attr('content');
	/*! [default_ratios] */
	return /^\w+\.ogame\.org$/.test(uni)
		? [3,2,1,2,1,1,3,2,1]
		: [3,2,1,2,1.5,1,3,2,1];
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
	getDefaultData : function ()
	{
		return {
			/*! [config=default] */
			version : SCRIPT.VERSION.slice(0),
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
			abb	        : false,
			overUnabb   : false,
			selCurPla   : false,
			messageTpl  :
				"[b]{?b}{I18N.BUY}{/b}{?s}{I18N.SELL}{/s}:[/b] "+
				"{?m}[b][color={COLOR.MET}]{m}[/color][/b] ({I18N.RES_MET}){?cd} + {/cd}{/m}"+
				"{?c}[b][color={COLOR.CRY}]{c}[/color][/b] ({I18N.RES_CRY}){?d} + {/d}{/c}"+
				"{?d}[b][color={COLOR.DEU}]{d}[/color][/b] ({I18N.RES_DEU}){/d}"+
				"\n[b]{I18N.IN_EXCH}:[/b] "+
				"{?M}[b][color={COLOR.MET}]{M}[/color][/b] ({I18N.RES_MET}){?CD} + {/CD}{/M}"+
				"{?C}[b][color={COLOR.CRY}]{C}[/color][/b] ({I18N.RES_CRY}){?D} + {/D}{/C}"+
				"{?D}[b][color={COLOR.DEU}]{D}[/color][/b] ({I18N.RES_DEU}){/D}"+
				"\n\n[b]* {I18N.SEND}:[/b] {sr} ({I18N.RES}) = "+
				"[b][color={COLOR.LC}]{sl}[/color][/b] ({I18N.LC_SHIP}) {I18N.OR} "+
				"[b][color={COLOR.SC}]{ss}[/color][/b] ({I18N.SC_SHIP})"+
				"\n[b]* {I18N.RECEIVE}:[/b] {rr} ({I18N.RES}) = "+
				"[b][color={COLOR.LC}]{rl}[/color][/b] ({I18N.LC_SHIP}) {I18N.OR} "+
				"[b][color={COLOR.SC}]{rs}[/color][/b] ({I18N.SC_SHIP})"+
				"\n\n[b]* {I18N.RATIO}:[/b] {rm}:{rc}:{rd}"+
				"{?w}\n[b]* {I18N.WHERE}:[/b] {wg}:{ws}:{wp} ({wt}){/w}"+
				"\n\n[b][url={SCRIPT.HOME_URL}]{SCRIPT.NAME}[/url][/b]"
			/*! [/config] */
		}
	},
	abbRE : /^\S+$/,
	keyRE : /^\S$/,
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
		var _exp, e = expected+'';
		if (/^[\<\>]\d+$/.test(e))
		{
			if (e.charAt(0)=='>') _exp = 'greater';
			else _exp = 'less';
			_exp += ' than '+e.slice(1);
		}
		else
			_exp = '"'+e.split(':').join(" or ")+'"'
		
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
	_errorValueRE : function (name,expected,found)
	{
		this._error(name+': value "'+found+'" doesn\'t match the expected RegExp "'+expected+'"');
	},
	_errorLength : function (name,expected,found)
	{
		this._errorExpected(name,'length',expected,found);
	},
	parseData : function (data)
	{
		var i, aux, found, _this = this, d = (typeof(data)=='string') ? JSON.parse(data) : data,
		_bool = 'boolean', _str = 'string', _num = 'number';
		if ((found=typeof(d.defAction))!=_str) _this._errorType('defAction',_str,found);
		if (typeof(d.ratioList)=='undefined') _this._errorUndefined('ratioList');
		if (!(/^sell|buy$/.test(d.defAction))) _this._errorValue('defAction','sell:buy',d.defAction);
		found = typeof(d.defRatio);
		if (!(/^number|string$/.test(found))) _this._errorType('defRatio',_str+':'+_num,found);
		var maxNotFound = true, minNotFound = true, defNotFound = true;
		for (i=0;i<d.ratioList.length;i++)
		{
			aux = d.ratioList[i];
			if ((found=aux.ratio.length)!=3) _this._errorLength('ratioList['+i+']',3,found);
			if ((aux.ratio[0]+=0)<=0) _this._errorValue('ratioList['+i+'].ratio[0]','>0',aux.ratio[0]);
			if ((aux.ratio[1]+=0)<=0) _this._errorValue('ratioList['+i+'].ratio[1]','>0',aux.ratio[1]);
			if ((aux.ratio[2]+=0)<=0) _this._errorValue('ratioList['+i+'].ratio[2]','>0',aux.ratio[2]);
			if (aux.id==d.defRatio) defNotFound = false;
			if (/^MAX|MIN|REG$/.test(aux.id+''))
			{
				if (aux.id=='MAX') maxNotFound = false;
				else if (aux.id=='MIN') minNotFound = false;
			}
			else
			{
				if ((found=typeof(aux.id))!=_num) _this._errorType('ratioList['+i+'].id',_num,found);
				if ((found=typeof(aux.name))!=_str) _this._errorType('ratioList['+i+'].name',_str,found);
			}
		}
		if (maxNotFound) _this._error('ratioList: maximum ratio (id="MAX") not found');
		if (minNotFound) _this._error('ratioList: minimum ratio (id="MIN") not found');
		if (defNotFound) _this._error('ratioList: default ratio (id="'+d.defRatio+'" == defRatio) not found');
		aux = d.ratioList.slice(0).sort();
		for (i=1;i<aux.length;i++) if(aux[i-1].id==aux[i].id) _this._error('ratioList: duplicate id "'+aux[i].id+'" found');
		if (!(/^m|c|d|mc|md|cd$/.test(d.defOutput))) _this._errorValue('defOutput','m:c:d:mc:md:cd',d.defOutput);
		if ((found=typeof(d.millionAbb))!=_str) _this._errorType('millionAbb',_str,found);
		if ((found=d.millionAbb.length)<1) _this._errorLength('millionAbb','>0',found);
		if (!_this.abbRE.test(found=d.millionAbb)) _this._errorValueRE('millionAbb',_this.abbRE,found);
		if ((found=typeof(d.millionKey))!=_str) _this._errorType('millionKey',_str,found);
		if ((found=d.millionKey.length)!=1) _this._errorLength('millionKey',1,found);
		if (!_this.keyRE.test(found=d.millionKey)) _this._errorValueRE('millionKey',_this.keyRE,found);
		if ((found=typeof(d.thousandAbb))!=_str) _this._errorType('thousandAbb',_str,found);
		if ((found=d.thousandAbb.length)<1) _this._errorLength('thousandAbb','>0',found);
		if (!_this.abbRE.test(found=d.thousandAbb)) _this._errorValueRE('thousandAbb',_this.abbRE,found);
		if ((found=typeof(d.thousandKey))!=_str) _this._errorType('thousandKey',_str,found);
		if ((found=d.thousandKey.length)!=1) _this._errorLength('thousandKey',1,found);
		if (!_this.keyRE.test(found=d.thousandKey)) _this._errorValueRE('thousandKey',_this.keyRE,found);
		if ((found=typeof(d.abb))!=_bool) _this._errorType('abb',_bool,found);
		if ((found=typeof(d.overUnabb))!=_bool) _this._errorType('overUnabb',_bool,found);
		if ((found=typeof(d.selCurPla))!=_bool) _this._errorType('selCurPla',_bool,found);
		if ((found=typeof(d.messageTpl))!=_str) _this._errorType('messageTpl',_str,found);
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
	updateVersion : function (data)
	{
		var v = (typeof(data.version)=='undefined') ? 0 : data.version,
		i,
		def = this.getDefaultData();
		if (v1_less_than_v2(v,[2,4])) data.messageTpl  = def.messageTpl;
		if (v1_less_than_v2(v,[2,5,3]))
		{
			var list = data.ratioList, found = false;
			for (i in list) if (list[i].id=='MAX') break;
			if (i < list.length || list[i].ratio.join(':')=='5:3:1')
				list[i].ratio = this.getRatioById('MAX',def).ratio;
		}
		data.version = def.version;
		for (i in def)
			if (typeof(data[i])=='undefined')
				data[i] = def[i];
		return data;
	},
	save : function (data)
	{
		if (arguments.length>0) this.data = data;
		this.data = this.updateVersion(this.data);
		storage.set('config',this.data);
		return this;
	},
	load : function ()
	{
		var data = storage.get('config');
		if (data==null)
			this.data = this.getDefaultData();
		else
			this.save(data);
		return this;
	},
	remove : function ()
	{
		storage.remove('config');
		this.data = this.getDefaultData();
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
	make : function (action,input,output,send,receive,ratio,planet)
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
			'{sr}' : send.res,
			'{sl}' : send.lc,
			'{ss}' : send.sc,
			'{rr}' : receive.res,
			'{rl}' : receive.lc,
			'{rs}' : receive.sc,
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
	if (arguments.length>1) this.val(value);
}

Input.prototype =
{
	val : function (value)
	{
		if (arguments.length<1) return this.jqo.val();
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

var Checkbox = function (jqo,value)
{
	this.jqo = jqo;
	if (arguments.length>1) this.val(value);
}

Checkbox.prototype = $.extend({},Input.prototype,
{
	val : function (value)
	{
		if (arguments.length<1) return this.isChecked();
		if (value)
			this.check();
		else
			this.uncheck();
		return this;
	},
	check : function ()
	{
		this.jqo.attr('checked','checked').prop('checked', true);
		return this;
	},
	uncheck : function ()
	{
		this.jqo.prop('checked', false).removeAttr('checked');
		return this;
	},
	isChecked : function ()
	{
		return (this.jqo.attr('checked')=='checked');
	}
});

var TextInput = function (jqo,value,regExp,clearOnFocus/*[,allowEmpty][,onChange]*/)
{
	var _this = this, input = (_this.jqo = jqo), _onChange;
	_this.value = value;
	_this.regExp = regExp;
	_this.clearOnFocus = clearOnFocus;
	_this.allowEmpty = true;
	_this.onChange = doNothing;
	if (arguments.length > 4)
	{
		if (arguments.length > 5)
		{
			_this.allowEmpty = arguments[4];
			_this.onChange = arguments[5];
		}
		else
			if (typeof(arguments[4])=='function') _this.onChange = arguments[4];
			else _this.allowEmpty = (arguments[4]&&true);
	}
	_onChange = function()
	{
		var value = input.val(),
		len = value.length;
		win.console.log (_this.regExp,'"'+value+'"',_this.regExp.test(value));
		if(_this.allowEmpty||len>0)
		{
			if(_this.regExp.test(value))
				_this.value = value.trim();
			else
			{
				var caret = input.caret(),
				start = len - caret.start,
				end   = len - caret.end;
				len   = _this.value.length;
				start = Math.max(Math.min(len-start,len),0);
				end   = Math.max(Math.min(len-end,len),0);
				input.val(_this.value);
				input.caret(start,end);
			}
			_this.onChange();
		}
	}
	input.val(value).keyup(_onChange).change(_onChange).blur(function()
	{
		input.val(_this.value);
	}
	).focus(function()
	{
		if(_this.clearOnFocus)
		{
			if(_this.allowEmpty) _this.val('')
			else input.val('');
		}
	});
}

TextInput.prototype = $.extend({},Input.prototype,
{
	val : function (value)
	{
		if (arguments.length<1) return this.value;
		this.jqo.val(this.value=value);
		return this;
	}
});

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

NumberInput.prototype = $.extend({},Input.prototype,
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

var NumberOutput = function(jqo, /*integer*/ value)
{
	var _this = this;
	_this.jqo = jqo;
	_this.val(value);
	_this.jqo.mouseenter(
		function(){_this._mouseenter();}
	).mouseleave(
		function(){_this._mouseleave();}
	);
}
NumberOutput.prototype =
{
	val : function (value)
	{
		if (arguments.length>0)
		{
			this.jqo.text(NumberFormat.formatI(value));
			this.num = value;
			return this;
		}
		return this.jqo.text();
	},
	_mouseenter : function ()
	{
		if (config.data.overUnabb && this.num > 0)
			this.jqo.text(NumberFormat.formatI(this.num,true));
	},
	_mouseleave : function ()
	{
		if (config.data.overUnabb)
			this.jqo.text(NumberFormat.formatI(this.num));
	}
}

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
			_this._setCurrent(option);
		if (o.find('.moonlink').get().length>0)
		{
			option = $('<option value="moon:'+c+'">['+c+'] ('+I18N.MOON+')</option>').appendTo(select).addClass(IDP+'moon');
			if (c==currentPCoord && currentPType=='moon')
				_this._setCurrent(option);
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
	},
	_setCurrent : function (option)
	{
		option.addClass(IDP+'highlight').html(option.html()+' &laquo; '+I18N.CUR_PLA);
		if (config.data.selCurPla) option.attr('selected','selected');
		this.current = option;
		this.set();
	},
	clickCurrent : function ()
	{
		this.jqo.val(this.current.val()).change();
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
		if (
			(!_this.isLimit)&&
			(_this.isNew||_this.id!='REG'||_this.name!=I18N.REG)
		) info.name = _this.name;
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
	findIDP : function (id)
	{
		return this.window.find('#'+IDP+id);
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
		return _this;
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
		_this.planet = new PlanetSelect(
			_this.findIDP('planet'),
			function(){_this.onChange();}
		);
		return _this;
	},
	makeActionSelect : function ()
	{
		var _this = this;
		_this.actionJqo = _this.findIDP('action').change(function()
		{
			_this.action = $(this).val();
			_this.onChange();
		}
		).val(_this.action=config.data.defAction);
		return _this;
	},
	makeResourceInput : function (type /*met|cry|deu*/,value)
	{
		var _this = this;
		_this['input'+type.capitalize()] = new NumberInput(
			_this.findIDP('input_'+type), // jQuery object
			value, // value
			'i',   // type : i = integer
			false, // clearOnFocus
			true,  // allow0
			function(){ // onChange
				_this.checkOutputSelect().onChange();
			}
		);
		return _this;
	},
	makeRatioSelect : function ()
	{
		var _this = this;
		this.ratioSelectJqo = _this.findIDP('ratio').change(function()
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
		return _this.updateRatioSelect();
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
		this.ogameDropDown(select);
		return this;
	},
	makeRatioInput: function (type /*met|cry|deu*/,value)
	{
		var _this = this;
		_this['ratio'+type.capitalize()] = new NumberInput(
			_this.findIDP('ratio_'+type), // jQuery object
			value, // value
			'f',   // type : f = float
			true,  // clearOnFocus
			false, // allow0
			function(){ // onChange
				_this.checkRatio().onChange();
			}
		);
		return _this;
	},
	checkRatio : function()
	{
		var _this = this;
		if (calcRatioChecker.isLegal(
			_this.ratioMet.num,
			_this.ratioCry.num,
			_this.ratioDeu.num
		))
			_this.ratioIllegal.hide();
		else
			_this.ratioIllegal.show();
		return _this;
	},
	makePercentInput : function (type /*met|cry|deu*/)
	{
		var _this = this, id = 'percent'+type.capitalize();
		_this[id] = new NumberInput(
			_this.findIDP('percent_'+type), // jQuery object
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
		return _this;
	},
	checkOutputSelect : function ()
	{
		var _this = this,
		jqo = _this.outputJqo, 
		sel = jqo.val(),
		im = (_this.inputMet.num>0),
		ic = (_this.inputCry.num>0),
		id = (_this.inputDeu.num>0),
		om = /m/.test(sel),
		oc = /c/.test(sel),
		od = /d/.test(sel);
		if (!im && !ic && id && !om && !oc && od)
			jqo.val('mc').change();
		else if (!im && ic && !id && !om && oc && !od)
			jqo.val('md').change();
		else if (im && !ic && !id && om && !oc && !od)
			jqo.val('cd').change();
		else if ((!im && ic && id) || om && ((ic && oc) || (id && od)))
			jqo.val('m').change();
		else if ((im && !ic && id) || oc && ((im && om) || (id && od)))
			jqo.val('c').change();
		else if ((im && ic && !id) || od && ((im && om) || (ic && oc)))
			jqo.val('d').change();
		return _this;
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
		this.outputJqo = _this.findIDP('output').change(function()
		{
			_this.changeOutputSelect($(this).val());
			_this.onChange();
		});
		return _this;
	},
	toggleConfigCalc : function ()
	{
		this.window.toggleClass('config').toggleClass('calc');
		return this;
	},
	updateConfigData : function(configData)
	{
		var _this = this,
		cData = (arguments.length>0) ? configData : config.data;
		ratioList.updateData(cData);
		cData.defAction = _this.defAction.val();
		cData.defOutput = _this.defOutput.val();
		cData.selCurPla = _this.selCurPla.val();
		cData.abb = _this.abb.val();
		cData.overUnabb = _this.overUnabb.val();
		cData.millionAbb = _this.millionAbb.val();
		cData.millionKey = _this.millionKey.val();
		cData.thousandAbb = _this.thousandAbb.val();
		cData.thousandKey = _this.thousandKey.val();
		cData.messageTpl = _this.messageTpl.val();
		return _this;
	},
	updateConfigIface : function(configData)
	{
		var _this = this,
		cData = (arguments.length>0) ? configData : config.data;
		confRatioChecker.setLimits(cData);
		ratioList.build(cData);
		_this.defAction.val(cData.defAction);
		_this.defOutput.val(cData.defOutput);
		_this.selCurPla.val(cData.selCurPla);
		_this.abb.val(cData.abb);
		_this.overUnabb.val(cData.overUnabb);
		_this.millionAbb.val(cData.millionAbb);
		_this.millionKey.val(cData.millionKey);
		_this.thousandAbb.val(cData.thousandAbb);
		_this.thousandKey.val(cData.thousandKey);
		_this.messageTpl.val(cData.messageTpl);
		_this.ieInput.val('');
		return _this;
	},
	updateCalcIface : function()
	{
		calcRatioChecker.setLimits();
		this.inputMet.set(this.inputMet.num);
		this.inputCry.set(this.inputCry.num);
		this.inputDeu.set(this.inputDeu.num);
		this.updateRatioSelect().checkRatio().onChange();
		return this;
	},
	makeConfigButtons : function ()
	{
		var _this = this;
		_this.findIDP('config_but').click(function()
		{
			_this.toggleConfigCalc();
		});
		_this.findIDP('config_accept').click(function()
		{
			_this.updateConfigData();
			config.save();
			_this.updateCalcIface();
			_this.toggleConfigCalc();
		});
		_this.findIDP('config_cancel').click(function()
		{
			_this.updateConfigIface();
			_this.toggleConfigCalc();
		});
		_this.findIDP('config_default').click(function()
		{
			config.remove();
			_this.updateCalcIface();
			_this.updateConfigIface();
			_this.toggleConfigCalc();
		});
		return _this;
	},
	makeImportExport : function ()
	{
		var _this = this;
		_this.ieInput = _this.findIDP('ie_conf').focus(function(){$(this).select();});
		_this.findIDP('ie_import').click(function()
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
		_this.findIDP('ie_export').click(function()
		{
			var data = $.extend({},config.data);
			_this.updateConfigData(data);
			_this.ieInput.val('').val(JSON.stringify(data)).select();
		});
		return _this;
	},
	makeAbbKey : function ()
	{
		var _this = this;
		_this.abb = new Checkbox(_this.findIDP('abb'));
		_this.overUnabb = new Checkbox(_this.findIDP('overUnabb'));
		_this.millionAbb = new TextInput (
			_this.findIDP('millionAbb'), // jqo
			config.data.millionAbb, // value
			config.abbRE, // regExp
			true, // clearOnFocus
			false // allowEmpty
		);
		_this.thousandAbb = new TextInput (
			_this.findIDP('thousandAbb'), // jqo
			config.data.thousandAbb, // value
			config.abbRE, // regExp
			true, // clearOnFocus
			false // allowEmpty
		);
		_this.millionKey = new TextInput (
			_this.findIDP('millionKey'), // jqo
			config.data.millionKey, // value
			config.keyRE, // regExp
			true, // clearOnFocus
			false // allowEmpty
		);
		_this.thousandKey = new TextInput (
			_this.findIDP('thousandKey'), // jqo
			config.data.thousandKey, // value
			config.keyRE, // regExp
			true, // clearOnFocus
			false // allowEmpty
		);
		return _this;
	},
	makeMessageTpl : function ()
	{
		var _this = this;
		_this.messageTpl = _this.findIDP('messageTpl');
		_this.findIDP('messageTpl_restore').click(function(){
			_this.messageTpl.val(config.getDefaultData().messageTpl);
		});
		return _this;
	},
	clearExport : function ()
	{
		this.ieInput.val('');
		return this;
	},
	needUpdate : false,
	showUpdate : function ()
	{
		this.needUpdate = true;
		this.menuButton.addClass('middlemark');
		try
		{
			this.findIDP('main').before($(TPL.UPDATE));
		}
		catch(e){}
	},
	ogameDropDown : function (select)
	{
		var i, j, oldDD, newDD, isNew, id, _change, _info, prevStyle=null;
		try {
			if (select.hasClass('dropdownInitialized'))
			{
				select.removeClass('dropdownInitialized');
				oldDD = select.next('.dropdown');
				id = oldDD.attr('rel');
				prevStyle = oldDD.attr('style');
				oldDD.remove();
				$('#'+id).remove();
			}
			oldDD = $('.dropdown.dropdownList').get();
			select.ogameDropDown();
		}
		catch (e) {
			return false;
		}
		_info = {
			select : select
		}
		_change = function()
		{
			var val, text;
			val  = _info.select.val();
			text = _info.select.find('[value="'+val+'"]').text();
			_info.dropdown.attr('data-value',val).text(text);
			//win.console.log(val,text);
		}
		newDD = $('.dropdown.dropdownList').get();
		for (i=0;i<oldDD.length;i++) oldDD[i] = $(oldDD[i]);
		for (i=0;i<newDD.length;i++)
		{
			newDD[i] = $(newDD[i]);
			id = newDD[i].attr('id');
			isNew = true;
			for (j=0;j<oldDD.length;j++)
				if (oldDD[j].attr('id')==id)
				{
					isNew = false;
					break;
				}
			if (isNew)
			{
				_info.dropdown = $('.dropdown [rel="'+id+'"]');
				if(prevStyle!=null) _info.dropdown.parent().attr('style',prevStyle);
				//_info.dropdownList = newDD[i];
				_change();
				select.change(_change);
				break;
			}
		}
		return true;
	},
	ogameDropDowns : function ()
	{
		var i, selects = this.window.find('select').get();
		if (!this.ogameDropDown($(selects[0]))) return;
		for (i=1;i<selects.length;i++)
			this.ogameDropDown($(selects[i]));
			
	},
	makeWindow : function ()
	{
		TPL.init();
		config.load();
		calcRatioChecker = new RatioChecker();
		confRatioChecker = new RatioChecker();
		var _this = this, defaultRatio = config.getRatioById(config.data.defRatio);
		_this.ogameHide = $('#inhalt').after(this.window=$(TPL.WINDOW).hide());
		if (_this.needUpdate) _this.showUpdate();
		_this.addCss(TPL.CSS).show();
		_this.ratioIllegal = _this.findIDP('ratio_illegal').hide();
		_this.outputMessage = _this.findIDP('message').click(function(){$(this).select();});
		_this.outputMet = new NumberOutput(_this.findIDP('output_met'),0);
		_this.outputCry = new NumberOutput(_this.findIDP('output_cry'),0);
		_this.outputDeu = new NumberOutput(_this.findIDP('output_deu'),0);
		_this.sendRes = new NumberOutput(_this.findIDP('sendRes'),0);
		_this.sendLC  = new NumberOutput(_this.findIDP('sendLC') ,0);
		_this.sendSC  = new NumberOutput(_this.findIDP('sendSC') ,0);
		_this.receiveRes = new NumberOutput(_this.findIDP('receiveRes'),0);
		_this.receiveLC  = new NumberOutput(_this.findIDP('receiveLC') ,0);
		_this.receiveSC  = new NumberOutput(_this.findIDP('receiveSC') ,0);
		_this.findIDP('close').click(function(){_this.hide();});
		_this.makeActionSelect(
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
		_this.findIDP('selCurPla_button').click(function(){_this.planet.clickCurrent();});
		_this.menuButtonAction = function(){_this.toggle();}
		
		// config
		
		_this.makeImportExport(); // << first because the dropdown uses it
		configDropdownList.init(_this.findIDP('config'),_this);
		ratioList.init(_this.findIDP('ratioList'),this);
		_this.defAction = _this.findIDP('defAction');
		_this.defOutput = _this.findIDP('defOutput');
		_this.selCurPla = new Checkbox(_this.findIDP('selCurPla'));
		_this.makeAbbKey(
			).makeMessageTpl(
			).makeConfigButtons(
			).updateConfigIface();
		
		// ogame dropdowns
		
		_this.ogameDropDowns();
		
		return _this;
	},
	onChange : function()
	{
		var _this = this,
		out = calc(
			_this.inputMet.num,
			_this.inputCry.num,
			_this.inputDeu.num,
			_this.ratioMet.num,
			_this.ratioCry.num,
			_this.ratioDeu.num,
			_this.percentMet.num,
			_this.percentCry.num,
			_this.percentDeu.num
		);
		_this.outputMet.val(out.met);
		_this.outputCry.val(out.cry);
		_this.outputDeu.val(out.deu);
		if (_this.action=='buy')
		{
			_this.sendRes.val(out.met + out.cry + out.deu);
			_this.receiveRes.val(_this.inputMet.num + _this.inputCry.num + _this.inputDeu.num);
		}
		else
		{
			_this.receiveRes.val(out.met + out.cry + out.deu);
			_this.sendRes.val(_this.inputMet.num + _this.inputCry.num + _this.inputDeu.num);
		}
		_this.sendLC.val(Math.ceil(_this.sendRes.num/25000));
		_this.sendSC.val(Math.ceil(_this.sendRes.num/5000));
		_this.receiveLC.val(Math.ceil(_this.receiveRes.num/25000));
		_this.receiveSC.val(Math.ceil(_this.receiveRes.num/5000));
		_this.outputMessage.text(messageMaker.make(
			_this.action,
			{
				met : _this.inputMet.txt,
				cry : _this.inputCry.txt,
				deu : _this.inputDeu.txt,
			},
			{
				met : _this.outputMet.val(),
				cry : _this.outputCry.val(),
				deu : _this.outputDeu.val(),
			},
			{
				res : _this.sendRes.val(),
				lc  : _this.sendLC.val(),
				sc  : _this.sendSC.val(),
			},
			{
				res : _this.receiveRes.val(),
				lc  : _this.receiveLC.val(),
				sc  : _this.receiveSC.val(),
			},
			{
				met : _this.ratioMet.txt,
				cry : _this.ratioCry.txt,
				deu : _this.ratioDeu.txt,
			},
			_this.planet
		));
		return _this;
	},
	init : function ()
	{
		return this.makeMenuButton();
	}
}
).init();

var getLatestVersion = (typeof(GM_xmlhttpRequest)=="undefined")
// without Greasemonkey: JSONP => my Dropbox
? function ()
{
	$('body').append($(
		'<script src="'+SCRIPT.UPDATE_JSONP+'" type="text/javascript" />'
	));
}
// with Greasemonkey: GM_xmlhttpRequest => userscript.org => .meta.js
: function ()
{
	GM_xmlhttpRequest(
	{
		method: "GET",
		url : SCRIPT.UPDATE_URL,
		onload : function (response)
		{
			var lines = response.responseText.split("\n"),
			i,
			re = /^\s*\/\/\s*\@version\s+(\d+(?:\.\d+)*)\s*$/;
			for (i in lines)
				if (re.test(lines[i]))
					return win[IDP+'onVersionFound'](
						lines[i].replace(re,'$1')
					);
		}
	});
}

var TIMESTAMP = Math.floor(utime()/1000);
var cfuCache =
{
	defaultData : function ()
	{
		return {
			interval  : 7,
			noCheck   : false,
			version   : SCRIPT.VERSION,
			timestamp : 0,
			versionOG : OGAME.VERSION
		}
	},
	load : function ()
	{
		this.data = storage.get('cfu');
		this.data = $.extend(
			this.defaultData(),
			(this.data==null) ? {} : this.data
		);
	},
	update : function (version)
	{
		$.extend(this.data,
		{
			timestamp : TIMESTAMP,
			versionOG : OGAME.VERSION,
			version   : (arguments.length>0) ? version : this.data.version
		});
		storage.set('cfu',this.data);
	},
	save : function (data)
	{
		this.data = $.extend(this.defaultData(),this.data,(arguments.length>0)?data:{});
		storage.set('cfu',this.data);
	}
}

var checkForUpdates = function (onUpdateNeeded)
{
	var _onUpdateNeeded=onUpdateNeeded;
	cfuCache.load ();
	if (cfuCache.data.noCheck)
		return cfuCache.update(SCRIPT.VERSION);

	// the running version is older than the cached one
	// no need to recheck
	// win.console.log(SCRIPT.VERSION, cfuCache.data.version);
	if (v1_less_than_v2(SCRIPT.VERSION, cfuCache.data.version))
	{
		cfuCache.update();
		return _onUpdateNeeded();
	}
	
	// win.console.log(cfuCache.data.versionOG, OGAME.VERSION);
	// win.console.log(TIMESTAMP,cfuCache.data.timestamp+86400*cfuCache.data.interval);
	if (
		// new ogame version
		(v1_less_than_v2(cfuCache.data.versionOG, OGAME.VERSION)) ||
		// at least cache.interval days since the last check
		(TIMESTAMP > cfuCache.data.timestamp+86400*cfuCache.data.interval)
	)
	{
		// export onVersionFound function to the unsafeWindow
		win[IDP+'onVersionFound'] = function (versionStr)
		{
			cfuCache.update(parseVersion(versionStr));
			if (v1_less_than_v2(SCRIPT.VERSION,cfuCache.data.version))
				_onUpdateNeeded();
		}
		// find out the latest version
		// and run onVersionFound with it
		getLatestVersion();
	}
}
 
// setTimeout to avoid freezing the script
// seems that it waits for the GM_xmlhttpRequest response
// is not a real problem, just ugly
setTimeout(function(){
	checkForUpdates(function(){iface.showUpdate();});
},1);

//////////////////////////////////
//                              //
//   END onDOMContentLoaded()   //
//                              //
//////////////////////////////////
}

/*! [onDOMContentLoaded] by Dean Edwards & Matthias Miller & John Resig */
var init = function()
{
	// quit if this function has already been called
	if (arguments.callee.done) return;

	// flag this function so we don't do the same thing twice
	arguments.callee.done = true;

	// kill the timer
	if (_timer) clearInterval(_timer);

	// do stuff
	onDOMContentLoaded();
};

/* for Mozilla/Opera9 */
if (doc.addEventListener)
	doc.addEventListener("DOMContentLoaded", init, false);

/* for Safari */
if (/WebKit/i.test(win.navigator.userAgent)) { // sniff
	var _timer = setInterval(
		function()
		{
			if (/loaded|complete/.test(doc.readyState))
				init(); // call the onload handler
		},
		10
	);
}

/* for other browsers */
win.onload = init;

/////
})();
