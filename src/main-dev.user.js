// ==UserScript==
// @name           Commerce Calculator for OGame
// @description    Adds a commerce calculator to the OGame interface
// @namespace      http://userscripts.org/users/68563/scripts
// @downloadURL    https://userscripts.org/scripts/source/151002.user.js
// @updateURL      https://userscripts.org/scripts/source/151002.meta.js
// @version        1.4
// @include        *://*.ogame.*/game/index.php?*page=*
// ==/UserScript==
/*! Commerce Calculator for OGame (C) 2012 Elías Grande Cásedas | GNU-GPL | gnu.org/licenses */
(function(){
////////////

var win = window, doc, $;
try{if (unsafeWindow) win = unsafeWindow;}
catch(e){}
doc = win.document;
$ = win.jQuery;

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

var SCRIPT =
{
	ID_PREFIX : "o_commerce_",
	NAME      : "Commerce Calculator for OGame",
	SHOW_URL  : "http://userscripts.org/scripts/show/151002"
}

var INFO =
({
	info :
	{
		RAT_MAX : [5,3,1],
		RAT_REG : [3,2,1],
		RAT_MIN : [2,1.5,1]
	},
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
		this.info.LANGUAGE = this.getMeta('ogame-language','');
		this.info.RES_MET = this.getResource('metal_box');
		this.info.RES_CRY = this.getResource('crystal_box');
		this.info.RES_DEU = this.getResource('deuterium_box');
		return this.info;
	}
}
).init();

var COLOR =
{
	MET : '#FF7700',
	CRY : '#00FFFF',
	DEU : '#FF33FF'
}

var I18N =
({
	i18n : {
		RES_MET : INFO.RES_MET.getName('RES_MET'),
		RES_CRY : INFO.RES_CRY.getName('RES_CRY'),
		RES_DEU : INFO.RES_DEU.getName('RES_DEU')
	},
	set : function(pattern,obj)
	{
		if (pattern.test(INFO.LANGUAGE))
			this.text = $.extend(true,this.i18n,obj);
		return this;
	}
}
).set(/.*/,
{
	THO_SEP : ',',
	DEC_SEP : '.',
	MENU    : 'Commerce C.',
	TITLE   : 'Commerce calculator',
	ACTION  : 'Action',
	BUY     : 'I buy',
	SELL    : 'I sell',
	RATIO   : 'Ratio',
	LEGAL   : 'legal',
	ILLEGAL : 'illegal',
	CUSTOM  : 'Custom',
	IN_EXCH : 'In exchange for',
	RES_ONE : 'A resource',
	RES_MIX : 'Resource mix',
	MESSAGE : 'Message',
	WHERE   : 'Place of delivery',
	PLANET  : 'Planet',
	MOON    : 'Moon',
	CUR_PLA : 'Current planet',
/*	FAV_RAT : 'Ratios favoritos',
	SEL_ACT : 'Select action',
	ADD_RAT : 'Add current ratio to favorites',
	DEL_RAT : 'Delete selected ratio from favorites',
	DEF_RAT : 'Set selected ratio as default ratio',*/
	MAX     : 'Maximum',
	REG     : 'Regular',
	MIN     : 'Minimum'
}
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
	LEGAL   : 'legal',
	ILLEGAL : 'ilegal',
	CUSTOM  : 'Personalizado',
	IN_EXCH : 'A cambio de',
	RES_ONE : 'Un recurso',
	RES_MIX : 'Mezcla de recursos',
	MESSAGE : 'Mensaje',
	WHERE   : 'Lugar de entrega',
	PLANET  : 'Planeta',
	MOON    : 'Luna',
	CUR_PLA : 'Planeta actual',
/*	FAV_RAT : 'Ratios favoritos',
	SEL_ACT : 'Seleccionar acción',
	ADD_RAT : 'Añadir ratio actual a favoritos',
	DEL_RAT : 'Eliminar ratio seleccionado de favoritos',
	DEF_RAT : 'Establecer ratio seleccionado como ratio por defecto',*/
	MAX     : 'Máximo',
	REG     : 'Normal',
	MIN     : 'Mínimo'
}
).text;

var CSS = "."+SCRIPT.ID_PREFIX+"window{"+
	"float:left;"+
	"position:relative;"+
	"width:670px;"+
	"overflow:visible;"+
	"z-index:2;"+
"}"+
"#galaxy ."+SCRIPT.ID_PREFIX+"window{"+
	"top:-44px;"+
"}"+
"."+SCRIPT.ID_PREFIX+"header{"+
	"height:28px;"+
	"line-height:28px;"+
	"text-align:center;"+
	"color:#6F9FC8;"+
	"font-size:12px;"+
	"font-weight:bold;"+
	"background: url(\"http://gf1.geo.gfsrv.net/cdn63/10e31cd5234445e4084558ea3506ea.gif\") no-repeat scroll 0px 0px transparent;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main{"+
	"padding:15px 25px 0 25px;"+
	"background: url(\"http://gf1.geo.gfsrv.net/cdn9e/4f73643e86a952be4aed7fdd61805a.gif\") repeat-y scroll 5px 0px transparent;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main *{"+
	"font-size:11px;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main table{"+
	"width:620px;"+ // 670 [window] - (25+25) [main padding] - 2 [border]
	"background-color:#0D1014;"+
    //"border: 1px solid black;"+
    "border-collapse:collapse;"+
    "clear:both;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main th{"+
	"color:#FFF;"+
	"text-align:center;"+
	//"padding-right: 5px;"+
	"font-weight:bold;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.label,"+
"."+SCRIPT.ID_PREFIX+"main td.label *{"+
	"color:grey;"+
	"text-align:left;"+
"}"+
/*"."+SCRIPT.ID_PREFIX+"main label,"+
"."+SCRIPT.ID_PREFIX+"main input[type=\"radio\"]{"+
	"cursor:pointer;"+
"}"+*/
"."+SCRIPT.ID_PREFIX+"main td.label{"+
	"padding:0 0 0 5px;"+
	"font-weight:bold;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main tr,"+
"."+SCRIPT.ID_PREFIX+"main td,"+
"."+SCRIPT.ID_PREFIX+"main th{"+
	"height:27px;"+
	"line-height:27px;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main input[type=\"text\"]{"+
	"width:100px;"+
	"text-align:right;"+
"}"+
/*"."+SCRIPT.ID_PREFIX+"main input[type=\"radio\"],"+
"."+SCRIPT.ID_PREFIX+"main input[type=\"checkbox\"]{"+
	"vertical-align:text-bottom;"+
"}"+*/
"."+SCRIPT.ID_PREFIX+"main option.highlight{"+
	"color:lime !important;"+
	"font-weight:bold;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main option.moonOption{"+
	"color:orange;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.select{"+
	"width:150px;"+
	"text-align:left;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main select{"+
	"width:130px;"+
	"text-align:center;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main option{"+
	"padding:1px 5px 1px 5px;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main input[type=\"text\"].ratio{"+
	"width:30px;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.input{"+
	"width:112px;"+
	"padding:0 1px 0 0;"+
	"text-align:right;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.input{"+
	"width:112px;"+
	"padding:0 1px 0 0;"+
	"text-align:right;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main span.illegal{"+
	"color:red;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main span.legal span.illegal{"+
	"display:none;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.output{"+
	"width:108px;"+
	"padding:0 5px 0 0;"+
	"text-align:right;"+
	"color:grey;"+
	"text-decoration:line-through;"+
	"cursor:pointer;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.output.sel{"+
	"color:#FFF;"+
	"text-decoration:none;"+
	"cursor:dafault;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.textarea{"+
	"padding:0 1px 0 1px;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main textarea{"+
	"width:602px;"+
	"height:50px !important;"+
	"margin:0;"+
"}"+
"."+SCRIPT.ID_PREFIX+"main td.select1row select{"+
	"width:auto;"+
	"text-align:left;"+
	"margin:0;"+
"}"+
"."+SCRIPT.ID_PREFIX+"footer{"+
	"height:17px;"+
	"background: url(\"http://gf1.geo.gfsrv.net/cdn30/aa3e8edec0a2681915b3c9c6795e6f.gif\") no-repeat scroll 2px 0px transparent;"+
"}"+
"";

var addCss = function (text)
{
	var el = doc.createElement('style');
	el.setAttribute('type','text/css');
	
	if (el.styleSheet)
		el.styleSheet.cssText = text;
	else
		el.appendChild(doc.createTextNode(text));
	
	var head = doc.getElementsByTagName("head")[0];
	head.appendChild(el);
}

var uID =
{
	seed : (new Date()).getTime(),
	get : function() {return SCRIPT.ID_PREFIX+(this.seed++);}
}

var prettyInteger = function (n,writing)
{
	if(writing&&n=='') return '';
	var nStr = ('0'+n+'').replace(/\D/g,'').replace(/^0+(\d)/,'$1');
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(nStr)) {
		nStr = nStr.replace(rgx, '$1' + I18N.THO_SEP + '$2');
	}
	return nStr;
}

var prettyFloat = function (n,writing)
{
	if(writing&&n=='') return '';
	var nStr, x, x1, x2;
	nStr = ('0'+n+'').replace(/(\.|\,)$/,I18N.DEC_SEP).replace(new RegExp('[^0-9\\'+I18N.DEC_SEP+']','g'),'').replace(/^0+(\d)/,'$1');
	x = nStr.split(I18N.DEC_SEP);
	x1 = x[0];
	x2 = x.length > 1 ? I18N.DEC_SEP + x[1] : '';
	if (nStr[nStr.length-1]==I18N.DEC_SEP && writing) x2 = I18N.DEC_SEP;
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + I18N.THO_SEP + '$2');
	}
	return x1 + x2;
}

var ratioChecker =
({
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
	init : function (limit1, limit2)
	{
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
).init(INFO.RAT_MIN,INFO.RAT_MAX);
delete ratioChecker.init;

var calc = function (met,cry,deu,rMet,rCry,rDeu)
{
	//alert(met+":"+cry+":"+deu+"\n"+rMet+":"+rCry+":"+rDeu);
	return {
		met : Math.round(met+(cry/rCry)*rMet+(deu/rDeu)*rMet),
		cry : Math.round((met/rMet)*rCry+cry+(deu/rDeu)*rCry),
		deu : Math.round((met/rMet)*rDeu+(cry/rCry)*rDeu+deu)
	}
}

var messageMaker =
({
	DEFAULT_TPL :
		"[b]{?b}{I18N.BUY}{/b}{?s}{I18N.SELL}{/s}:[/b] "+
		"{?m}[b][color={COLOR.MET}]{m}[/color][/b] ({I18N.RES_MET}){?cd} + {/cd}{/m}"+
		"{?c}[b][color={COLOR.CRY}]{c}[/color][/b] ({I18N.RES_CRY}){?d} + {/d}{/c}"+
		"{?d}[b][color={COLOR.DEU}]{d}[/color][/b] ({I18N.RES_DEU}){/d}"+
		"\n[b]{I18N.IN_EXCH}:[/b] "+
		"{?M}[b][color={COLOR.MET}]{M}[/color][/b] ({I18N.RES_MET}){/M}"+
		"{?C}[b][color={COLOR.CRY}]{C}[/color][/b] ({I18N.RES_CRY}){/C}"+
		"{?D}[b][color={COLOR.DEU}]{D}[/color][/b] ({I18N.RES_DEU}){/D}"+
		"\n\n[b]* {I18N.RATIO}:[/b] {rm}:{rc}:{rd}"+
		"{?w}\n[b]* {I18N.WHERE}:[/b] {w}{/w}"+
		"\n\n[b][url={SCRIPT.SHOW_URL}]{SCRIPT.NAME}[/url][/b]",
	
	parseIf : function (tpl,symbol,srch,keep)
	{
		var st = '{'+symbol+srch+'}', nd = '{/'+srch+'}';
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
	parseIfs : function()
	{
		var out = arguments[0],
		i=1,
		srch,keep,
		end=arguments.length;
		while (true)
		{
			srch = arguments[i++];
			keep = arguments[i++];
			out=this.parseIf(out,'?',srch,keep);
			out=this.parseIf(out,'!',srch,!keep);
			if (i==end)
				return out;
		}
	},
	make : function (action,mIn,cIn,dIn,mOut,cOut,dOut,mRat,cRat,dRat,where)
	{
		var i, re = /[1-9]/,
		out = this.parseIfs(
			this.tpl,
			'b',(action==I18N.BUY),
			's',(action==I18N.SELL),
			'm',re.test(mIn),
			'c',re.test(cIn),
			'd',re.test(dIn),
			'mc',re.test(mIn+cIn),
			'md',re.test(mIn+dIn),
			'cd',re.test(cIn+dIn),
			'M',re.test(mOut),
			'C',re.test(cOut),
			'D',re.test(dOut),
			'w',(where!='')
		);
		out = out.replaceMap({
			'{m}':mIn,
			'{c}':cIn,
			'{d}':dIn,
			'{M}':mOut,
			'{C}':cOut,
			'{D}':dOut,
			'{rm}':mRat,
			'{rc}':cRat,
			'{rd}':dRat,
			'{w}':where
		});
		for (i in I18N)
			out = out.replaceAll('{I18N.'+i+'}',I18N[i]);
		for (i in SCRIPT)
			out = out.replaceAll('{SCRIPT.'+i+'}',SCRIPT[i]);
		for (i in COLOR)
			out = out.replaceAll('{COLOR.'+i+'}',COLOR[i]);
		return out;
	},
	init : function()
	{
		this.tpl = this.DEFAULT_TPL;
		return this;
	}
}
).init();

var iface =
({
	isNotBuilded: true,
	isHidden: true,
	mkTr: function(appendTo)
	{
		return $('<tr/>'/*).mouseenter(
			function(){$(this).addClass('over');}
		).mouseleave(
			function(){$(this).removeClass('over');}
		*/).appendTo(
			appendTo
		);
	},
	/*mkRadio: function(appendTo,name,label)
	{
		var id = uID.get();
		var input = $('<input id="'+id+'" type="radio" name="'+name+'"/>').appendTo(appendTo);
		$('<label for="'+id+'">'+label+'&nbsp;</label>').appendTo(appendTo);
		return input;
	},
	mkCheckbox: function(appendTo,label)
	{
		var id = uID.get();
		var input = $('<input id="'+id+'" type="checkbox"/>').appendTo(appendTo);
		$('<label for="'+id+'">'+label+'&nbsp;</label>').appendTo(appendTo);
		return input;
	},*/
	mkIntegerInput: function(appendTo, value)
	{
		var _this = this;
		var input = $('<input type="text" value="" />').appendTo(appendTo);
		var onChange = function()
		{
			var o = $(this),
			value = prettyInteger(o.attr('value'),true);
			o.attr('value', value);
			/*if (value!='')*/ _this.doIt();
		};
		input.attr('value',prettyInteger(value),false);
		input.keydown(onChange).keyup(onChange).change(onChange).blur(function()
		{
			var o = $(this);
			o.attr('value',prettyInteger(o.attr('value'),false));
			_this.doIt();
		});
		input.focus(function(){
			$(this).attr('value','');
			onChange();
		});
		return input;
	},
	mkRatioInput: function(appendTo, value)
	{
		var _this = this;
		var input = $('<input type="text" value="" />').appendTo(appendTo);
		var backup = {value:''};
		var onChange = function()
		{
			var o = $(this),
			value = prettyFloat(o.attr('value'),true);
			o.attr('value', value);
			if (value!='') _this.doIt();
		};
		input.attr('value',prettyFloat((value+'').split('.').join(I18N.DEC_SEP),false));
		input.keydown(onChange).keyup(onChange).change(onChange).blur(function()
		{
			var o = $(this), value = prettyFloat(o.attr('value'),false);
			if (value=='0')
				o.attr('value',backup.value);
			else
			{
				backup.value = value;
				o.attr('value',value);
			}
			_this.doIt();
		});
		input.focus(function(){
			var o = $(this);
			backup.value = o.attr('value');
			o.attr('value','');
		});
		return input.addClass('ratio');
	},
	mkRatioOption: function(appendTo,ratio,name)
	{
		var rMet = (ratio[0]+'').replace('.',I18N.DEC_SEP),
		rCry = (ratio[1]+'').replace('.',I18N.DEC_SEP),
		rDeu = (ratio[2]+'').replace('.',I18N.DEC_SEP);
		return $(
			'<option value="'+rMet+':'+rCry+':'+rDeu+'">'+
			name+' '+rMet+':'+rCry+':'+rDeu+'</option>'
		).appendTo(appendTo);
	},
	build: function()
	{
		var _this = this, table, tbody, tr, td, select, option;
		this.isNotBuilded = false;
		addCss(CSS);
		this.ogameContainer = $('#inhalt');
		this.scriptContainer = $('<div/>').addClass(SCRIPT.ID_PREFIX+"window").hide();
		this.ogameContainer.after(this.scriptContainer);
		this.scriptContainer.append(
			$('<div/>').addClass(SCRIPT.ID_PREFIX+"header").text(I18N.TITLE).append(
				$('<a href="javascript:void(0);" />'
				).addClass('close_details'
				).addClass('close_ressources'
				).click(function(){_this.hide();})
			)
		);
		this.scriptContainer.append(this.scriptMain=$('<div/>').addClass(SCRIPT.ID_PREFIX+"main"));
		this.scriptContainer.append($('<div/>').addClass(SCRIPT.ID_PREFIX+"footer"));
		
		table = $('<table cellpadding="0" cellspacing="0"/>').appendTo(this.scriptMain);
		tbody = $('<tbody/>').appendTo(table);
		
		// title row
		tr = $('<tr/>').appendTo(tbody);
		$('<th/>').appendTo(tr).attr('colspan',2);
		$('<th/>').appendTo(tr).text(I18N.RES_MET);
		$('<th/>').appendTo(tr).text(I18N.RES_CRY);
		$('<th/>').appendTo(tr).text(I18N.RES_DEU);
		
		// buy/sell row
		tr = this.mkTr(tbody).addClass('alt');
		$('<td/>').appendTo(tr).addClass('label').text(I18N.ACTION);
		td = $('<td/>').appendTo(tr).addClass('select');
		select = $('<select/>').appendTo(td);
		this.actionOptions = [];
		this.actionOptions.push($('<option value="'+I18N.SELL+'">'+I18N.SELL+'</option>').appendTo(select));
		this.actionOptions.push($('<option value="'+I18N.BUY+'">'+I18N.BUY+'</option>').appendTo(select));
		this.actionSelect = select.change(function(){_this.doIt();});
		td = $('<td/>').appendTo(tr).addClass('input');
		this.inputMet = this.mkIntegerInput(td,0);
		td = $('<td/>').appendTo(tr).addClass('input');
		this.inputCry = this.mkIntegerInput(td,0);
		td = $('<td/>').appendTo(tr).addClass('input');
		this.inputDeu = this.mkIntegerInput(td,0);
		
		// ratio row
		tr = this.mkTr(tbody);
		td = $('<td/>').appendTo(tr).addClass('label');
		this.ratioIsLegal = $('<span class="legal">'+I18N.RATIO+'</span>').appendTo(td
			).append($('<span class="illegal"> ('+I18N.ILLEGAL+')</span>'));
		td = $('<td/>').appendTo(tr).addClass('select');
		select = $('<select/>').appendTo(td);
		$('<option value="">-</option>').appendTo(select);
		this.ratioOptions = [0];
		this.ratioOptions.push(this.mkRatioOption(select,INFO.RAT_REG,I18N.REG));
		this.ratioOptions.push(this.mkRatioOption(select,INFO.RAT_MIN,I18N.MIN));
		this.ratioOptions.push(this.mkRatioOption(select,INFO.RAT_MAX,I18N.MAX));
		this.ratioSelect = select.change(function(){_this.doIt();});
		td = $('<td/>').appendTo(tr).addClass('input');
		this.ratioMet = this.mkRatioInput(td,INFO.RAT_REG[0]);
		td = $('<td/>').appendTo(tr).addClass('input');
		this.ratioCry = this.mkRatioInput(td,INFO.RAT_REG[1]);
		td = $('<td/>').appendTo(tr).addClass('input');
		this.ratioDeu = this.mkRatioInput(td,INFO.RAT_REG[2]);
		
		// "in exchange for" row
		tr = this.mkTr(tbody).addClass('alt');
		$('<td/>').appendTo(tr).addClass('label').text(I18N.IN_EXCH);
		td = $('<td/>').appendTo(tr).addClass('select');
		select = $('<select/>').appendTo(td);
		this.exchangeOptions = [];
		this.exchangeOptions.push($('<option value="met">'+I18N.RES_MET+'</option>').appendTo(select));
		this.exchangeOptions.push($('<option value="cry">'+I18N.RES_CRY+'</option>').appendTo(select));
		this.exchangeOptions.push($('<option value="deu">'+I18N.RES_DEU+'</option>').appendTo(select));
		this.exchangeSelect = select.change(function(){_this.doIt();});
		this.outputMet = $('<td/>').appendTo(tr).addClass('output').click(function(){
			_this.exchangeSelect.prop('selectedIndex',0);
			_this.doIt();
		});
		this.outputCry = $('<td/>').appendTo(tr).addClass('output').click(function(){
			_this.exchangeSelect.prop('selectedIndex',1);
			_this.doIt();
		});
		this.outputDeu = $('<td/>').appendTo(tr).addClass('output').click(function(){
			_this.exchangeSelect.prop('selectedIndex',2);
			_this.doIt();
		});
		
		// empty
		this.mkTr(tbody).append($('<td/>').appendTo(tr).attr('colspan',5).html('&nbsp;'));
		
		// where row
		tr = this.mkTr(tbody).addClass('alt');
		$('<td/>').appendTo(tr).addClass('label').attr('colspan',5).text(I18N.WHERE);
		tr = this.mkTr(tbody).addClass('alt');
		td = $('<td/>').appendTo(tr).addClass('select1row').attr('colspan',5);
		select = $('<select/>').appendTo(td);
		$('<option value="">-</option>').appendTo(select);
		//<meta name="ogame-planet-coordinates" content="1:421:10"/>
		var currentPCoord = '['+$('meta[name="ogame-planet-coordinates"]').attr('content')+']';
		//<meta name="ogame-planet-type" content="planet"/>
		var currentPType = $('meta[name="ogame-planet-type"]').attr('content').toLowerCase().trim();
		this.planetOptions = [0];
		$.each($('#planetList').children('div').get(),function(index,value){
			var o = $(value), c = o.find('.planet-koords');
			if (c.get().length==0) return;
			c = c.text().trim();
			option = $('<option value="'+c+' ('+I18N.PLANET+')">'+c+' '+o.find('.planet-name').text().trim()+'</option>').appendTo(select).addClass('planetOption');
			if (c==currentPCoord && currentPType=='planet')
				option.addClass('highlight').html(option.html()+' &laquo; '+I18N.CUR_PLA);
			_this.planetOptions.push(option);
			if (o.find('.moonlink').get().length>0)
			{
				option = $('<option value="'+c+' ('+I18N.MOON+')">'+c+' ('+I18N.MOON+')</option>').appendTo(select).addClass('moonOption');
				if (c==currentPCoord && currentPType=='moon')
					option.addClass('highlight').html(option.html()+' &laquo; '+I18N.CUR_PLA);
				_this.planetOptions.push(option);
			}
		});
		this.planetSelect = select.change(function(){_this.doIt();});
		
		// empty
		this.mkTr(tbody).append($('<td/>').appendTo(tr).attr('colspan',5).html('&nbsp;'));
		
		// message row
		tr = this.mkTr(tbody).addClass('alt');
		$('<td/>').appendTo(tr).addClass('label').attr('colspan',5).text(I18N.MESSAGE);
		tr = this.mkTr(tbody).addClass('alt');
		td = $('<td/>').appendTo(tr).addClass('textarea').attr('colspan',5);
		this.outputMessage = $('<textarea rows="1" cols="1"/>').appendTo(td).attr('readonly','readonly').click(function(){$(this).select();});
		
		/*// empty
		this.mkTr(tbody).append($('<td/>').appendTo(tr).attr('colspan',5).html('&nbsp;'));
		
		// favorites row
		tr = this.mkTr(tbody).addClass('alt');
		td = $('<td/>').appendTo(tr).addClass('label').attr('colspan',5).text(I18N.FAV_RAT);
		tr = this.mkTr(tbody).addClass('alt');
		td = $('<td/>').appendTo(tr).addClass('select1row').attr('colspan',5);
		select = $('<select/>').appendTo(td);
		$('<option value="">'+I18N.SEL_ACT+'</option>').appendTo(select);
		$('<option value="add">'+I18N.ADD_RAT+'</option>').appendTo(select);
		$('<option value="del">'+I18N.DEL_RAT+'</option>').appendTo(select);
		$('<option value="def">'+I18N.DEF_RAT+'</option>').appendTo(select);*/
		
		return this.doIt();
	},
	getResource : function (jqo)
	{
		var val = jqo.attr('value');
		if (val=='') return 0;
		else return parseInt(jqo.attr('value').replace(/\D/g,''))
	},
	getRatio : function (jqo)
	{
		return parseFloat(jqo.attr('value').split(I18N.THO_SEP).join('').split(I18N.DEC_SEP).join('.'))
	},
	doIt: function()
	{
		var _this=this,aux,i = this.ratioSelect.prop('selectedIndex');
		if (i>0)
		{
			aux = this.ratioOptions[i].attr('value').split(':');
			this.ratioMet.attr('value',aux.shift());
			this.ratioCry.attr('value',aux.shift());
			this.ratioDeu.attr('value',aux.shift());
			this.ratioSelect.prop('selectedIndex',0);
		}
	
		var ratioMet = this.getRatio(this.ratioMet),
		ratioCry = this.getRatio(this.ratioCry),
		ratioDeu = this.getRatio(this.ratioDeu),
		outputRes = calc(
			this.getResource(this.inputMet),
			this.getResource(this.inputCry),
			this.getResource(this.inputDeu),
			ratioMet,
			ratioCry,
			ratioDeu
		);
		
		if (ratioChecker.isLegal(ratioMet,ratioCry,ratioDeu))
			this.ratioIsLegal.addClass('legal');
		else
			this.ratioIsLegal.removeClass('legal');
		
		this.outputMet.text(prettyInteger(outputRes.met)).removeClass('sel');
		this.outputCry.text(prettyInteger(outputRes.cry)).removeClass('sel');
		this.outputDeu.text(prettyInteger(outputRes.deu)).removeClass('sel');
		
		$.each([this.outputMet,this.outputCry,this.outputDeu],function(k,o){
			if (_this.exchangeSelect.prop('selectedIndex')==k)
				o.addClass('sel');
			else
				o.removeClass('sel');
		});
		
		this.outputMessage.text(messageMaker.make(
			this.actionSelect.val(),
			this.inputMet.val(),
			this.inputCry.val(),
			this.inputDeu.val(),
			this.outputMet.hasClass('sel') ? this.outputMet.text() : '',
			this.outputCry.hasClass('sel') ? this.outputCry.text() : '',
			this.outputDeu.hasClass('sel') ? this.outputDeu.text() : '',
			this.ratioMet.val(),
			this.ratioCry.val(),
			this.ratioDeu.val(),
			this.planetSelect.val()
		));
		
		return this;
	},
	show: function()
	{
		this.isHidden = false;
		this.ogameContainer.hide();
		this.scriptContainer.show();
		return this;
	},
	hide: function()
	{
		this.isHidden = true;
		this.scriptContainer.hide();
		this.ogameContainer.show();
		return this;
	},
	toggle: function()
	{
		if (this.isNotBuilded)
			return this.build().show();
		if (this.isHidden)
			return this.show();
		return this.hide();
	},
	menuButton:
	$(
		'<a target="_self" accesskey="" href="javascript:void(0)" class="menubutton">'+
		'<span class="textlabel">'+I18N.MENU+'</span></a>'
	).appendTo(
		$('<li/>').appendTo($('#menuTableTools'))
	),
	init: function()
	{
		var _this = this;
		this.menuButton.click(function(){_this.toggle();});
		return this;
	}
}
).init();


/////
})();
