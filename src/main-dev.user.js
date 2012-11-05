// ==UserScript==
// @name           OGame Trade Calculator
// @description    Adds a trade calculator to the OGame interface
// @namespace      http://userscripts.org/users/68563/scripts
// @downloadURL    https://userscripts.org/scripts/source/151002.user.js
// @updateURL      https://userscripts.org/scripts/source/151002.meta.js
// @version        2.1
// @include        *://*.ogame.*/game/index.php?*page=*
// ==/UserScript==
/*! OGame Trade Calculator (C) 2012 Elías Grande Cásedas | GNU-GPL | gnu.org/licenses */
(function(){
////////////

var SCRIPT =
{
	ID_PREFIX : 'o_trade_calc_',
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

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
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
/*! [i18n=EN] */
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
	MIN     : 'Minimum'
}
/*! [i18n=ES] */
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
	MIN     : 'Mínimo'
}
/*! [/i18n] */
).text;

var NumberFormat =
{
	formatI : function (n,writing)
	{
		if(arguments.length>1 && writing && n=='') return '';
		var nStr;
		if (typeof(n)=='string')
			nStr = ('0'+n+'').replace(
				/[kK]$/,'000' // last char is k|K => multiply by 1 thousand
			).replace(
				/[mM]$/,'000000' // last char is m|M => multiply by 1 million
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
		return nStr;
	},
	formatF : function (n,writing)
	{
		if(arguments.length>1 && writing && n=='') return '';
		var nStr, x, x1, x2;
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
		if (nStr[nStr.length-1]==I18N.DEC_SEP && arguments.length>1 && writing) x2 = I18N.DEC_SEP;
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + I18N.THO_SEP + '$2');
		}
		return x1 + x2;
	},
	parseI : function (n)
	{
		return parseInt(n.split(I18N.THO_SEP).join(''));
	},
	parseF : function (n)
	{
		return parseFloat(n.split(I18N.THO_SEP).join('').replace(I18N.DEC_SEP,'.'));
	}
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
({
	DEFAULT_TPL :
		/*! [TPL=MESSAGE] */
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
		"\n\n[b][url={SCRIPT.HOME_URL}]{SCRIPT.NAME}[/url][/b]",
		/*! [/TPL] */
	
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
	make : function (action,input,output,ratio,where)
	{
		var i, re = /[1-9]/,
		out = this.parseIfs(
			this.tpl,
			{
				b : (action=='buy'),
				s : (action=='sell'),
				m : re.test(input.met),
				c : re.test(input.cry),
				d : re.test(input.deu),
				M : re.test(output.met),
				C : re.test(output.cry),
				D : re.test(output.deu),
				w : (where!=null)
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
			'{wg}' : (where==null) ? '' : where.galaxy,
			'{ws}' : (where==null) ? '' : where.system,
			'{wp}' : (where==null) ? '' : where.planet,
			'{wt}' : (where==null) ? '' : '{I18N.'+(where.type+'').toUpperCase()+'}'
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
	CSS :
		/*! [CSS] */
		"#"+SCRIPT.ID_PREFIX+"window{"+
			"float:left;"+
			"position:relative;"+
			"width:670px;"+
			"overflow:visible;"+
			"z-index:2;"+
		"}"+
		"#galaxy #"+SCRIPT.ID_PREFIX+"window{"+
			"top:-44px;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"header{"+
			"height:28px;"+
			"position: relative;"+
			"background: url(\"http://gf1.geo.gfsrv.net/cdn63/10e31cd5234445e4084558ea3506ea.gif\") no-repeat scroll 0px 0px transparent;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"header h4{"+
			"height:28px;"+
			"line-height:28px;"+
			"text-align:center;"+
			"color:#6F9FC8;"+
			"font-size:12px;"+
			"font-weight:bold;"+
			"position:absolute;"+
			"top:0;left:60px;right:60px;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"main{"+
			"padding:15px 25px 0 25px;"+
			"background: url(\"http://gf1.geo.gfsrv.net/cdn9e/4f73643e86a952be4aed7fdd61805a.gif\") repeat-y scroll 5px 0px transparent;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"main *{"+
			"font-size:11px;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"main table{"+
			"width:620px;"+ // 670 [window] - (25+25) [main padding] - 2 [border]
			"background-color:#0D1014;"+
			"border-collapse:collapse;"+
			"clear:both;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"main th{"+
			"color:#FFF;"+
			"text-align:center;"+
			"font-weight:bold;"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"label,"+
		"."+SCRIPT.ID_PREFIX+"label *{"+
			"color:grey;"+
			"text-align:left;"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"label{"+
			"padding:0 0 0 5px;"+
			"font-weight:bold;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"main tr,"+
		"#"+SCRIPT.ID_PREFIX+"main td,"+
		"#"+SCRIPT.ID_PREFIX+"main th{"+
			"height:28px;"+
			"line-height:28px;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"main input[type=\"text\"]{"+
			"width:100px;"+
			"text-align:center;"+
		"}"+
		"option."+SCRIPT.ID_PREFIX+"highlight{"+
			"color:lime !important;"+
			"font-weight:bold;"+
		"}"+
		"option."+SCRIPT.ID_PREFIX+"moon{"+
			"color:orange;"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"select{"+
			"width:150px;"+
			"text-align:left;"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"select select{"+
			"width:130px;"+
			"text-align:center;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"main option{"+
			"padding:1px 5px 1px 5px;"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"input{"+
			"width:112px;"+
			"padding:0 1px 0 1px;"+
			"text-align:right;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"ratio_illegal{"+
			"color:red;"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"output{"+
			"width:108px;"+
			"text-align:center;"+
			"font-weight:bold;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"output_met{"+
			"color:"+COLOR.MET+";"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"output_cry{"+
			"color:"+COLOR.CRY+";"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"output_deu{"+
			"color:"+COLOR.DEU+";"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"textarea{"+
			"padding:0 3px 0 3px !important;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"message{"+
			"width:601px;"+
			"height:50px !important;"+
			"margin:0 !important;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"planet{"+
			"width:auto;"+
			"text-align:left;"+
			"margin:0;"+
		"}"+
		"."+SCRIPT.ID_PREFIX+"select1row select{"+
			"width:auto;"+
			"text-align:left;"+
			"margin:0;"+
		"}"+
		"#"+SCRIPT.ID_PREFIX+"footer{"+
			"height:17px;"+
			"background: url(\"http://gf1.geo.gfsrv.net/cdn30/aa3e8edec0a2681915b3c9c6795e6f.gif\") no-repeat scroll 2px 0px transparent;"+
		"}"+
		"",
		/*! [/CSS] */

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

	WINDOW_TPL :
		/*! [TPL=WINDOW] */
		'<div id="'+SCRIPT.ID_PREFIX+'window">'+
			'<div id="'+SCRIPT.ID_PREFIX+'header">'+
				'<h4>'+I18N.TITLE+'</h4>'+
				'<a id="'+SCRIPT.ID_PREFIX+'close" href="javascript:void(0);" class="close_details close_ressources"></a>'+
			'</div>'+
			'<div id="'+SCRIPT.ID_PREFIX+'main">'+
				'<table cellspacing="0" cellpadding="0">'+
				'<tbody>'+
					'<tr>'+
						'<th colspan="2"></th>'+
						'<th>'+I18N.RES_MET+'</th>'+
						'<th>'+I18N.RES_CRY+'</th>'+
						'<th>'+I18N.RES_DEU+'</th>'+
					'</tr>'+
					'<tr class="alt">'+
						'<td class="'+SCRIPT.ID_PREFIX+'label">'+I18N.ACTION+'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'select">'+
							'<select id="'+SCRIPT.ID_PREFIX+'action"></select>'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'input_met" type="text" value="">'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'input_cry" type="text" value="">'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'input_deu" type="text" value="">'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="'+SCRIPT.ID_PREFIX+'label">'+
							I18N.RATIO+
							'<span id="'+SCRIPT.ID_PREFIX+'ratio_illegal">'+
								' ('+I18N.ILLEGAL+')'+
							'</span>'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'select">'+
							'<select id="'+SCRIPT.ID_PREFIX+'ratio"></select>'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'ratio_met" type="text" value="">'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'ratio_cry" type="text" value="">'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'ratio_deu" type="text" value="">'+
						'</td>'+
					'</tr>'+
					'<tr class="alt">'+
						'<td class="'+SCRIPT.ID_PREFIX+'label">'+I18N.IN_EXCH+'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'select">'+
							'<select id="'+SCRIPT.ID_PREFIX+'output"></select>'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'percent_met" type="text" value="">'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'percent_cry" type="text" value="">'+
						'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'input">'+
							'<input id="'+SCRIPT.ID_PREFIX+'percent_deu" type="text" value="">'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="'+SCRIPT.ID_PREFIX+'label" colspan="2">'+I18N.RESULT+'</td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'output" id="'+SCRIPT.ID_PREFIX+'output_met"></td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'output" id="'+SCRIPT.ID_PREFIX+'output_cry"></td>'+
						'<td class="'+SCRIPT.ID_PREFIX+'output" id="'+SCRIPT.ID_PREFIX+'output_deu"></td>'+
					'</tr>'+
					'<tr><td colspan="5">&nbsp;</td></tr>'+
					'<tr class="alt">'+
						'<td class="'+SCRIPT.ID_PREFIX+'label" colspan="5">'+I18N.PLANET+'</td>'+
					'</tr>'+
					'<tr class="alt">'+
						'<td class="'+SCRIPT.ID_PREFIX+'select1row" colspan="5">'+
							'<select id="'+SCRIPT.ID_PREFIX+'planet"></select>'+
						'</td>'+
					'</tr>'+
					'<tr><td colspan="5">&nbsp;</td></tr><tr class="alt">'+
						'<td class="'+SCRIPT.ID_PREFIX+'label" colspan="5">'+I18N.MESSAGE+'</td>'+
					'</tr>'+
					'<tr class="alt">'+
						'<td class="'+SCRIPT.ID_PREFIX+'textarea" colspan="5">'+
							'<textarea id="'+SCRIPT.ID_PREFIX+'message" cols="1" rows="1" readonly="readonly"></textarea>'+
						'</td>'+
					'</tr>'+
				'</tbody>'+
				'</table>'+
			'</div>'+
			'<div id="'+SCRIPT.ID_PREFIX+'footer"></div>'+
		'</div>',
		/*! [/TPL] */
	
	MENUBUTTON_TPL :
		/*! [TPL=BUTTON] */
		'<li>'+
			'<a id="'+SCRIPT.ID_PREFIX+'menubutton" class="menubutton" href="javascript:void(0)" accesskey="" target="_self">'+
				'<span class="textlabel">'+I18N.MENU+'</span>'+
			'</a>'+
		'</li>',
		/*! [/TPL] */
	
	menuButton : null,
	menuButtonAction : function ()
	{
		this.menuButtonAction = function(){}
		this.makeWindow();
	},
	makeMenuButton : function ()
	{
		var _this = this;
		this.menuButton = $(this.MENUBUTTON_TPL).appendTo(
			$('#menuTableTools')
		).find(
			'#'+SCRIPT.ID_PREFIX+'menubutton'
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
	planet : null,
	makePlanetSelect : function ()
	{
		var _this = this,
		select = this.window.find('#'+SCRIPT.ID_PREFIX+'planet');
		this.planetJqo = select;
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
				option.addClass(SCRIPT.ID_PREFIX+'highlight').html(option.html()+' &laquo; '+I18N.CUR_PLA);
			if (o.find('.moonlink').get().length>0)
			{
				option = $('<option value="moon:'+c+'">['+c+'] ('+I18N.MOON+')</option>').appendTo(select).addClass(SCRIPT.ID_PREFIX+'moon');
				if (c==currentPCoord && currentPType=='moon')
					option.addClass(SCRIPT.ID_PREFIX+'highlight').html(option.html()+' &laquo; '+I18N.CUR_PLA);
			}
		});
		return select.change(function()
		{
			var value = $(this).val().split(':');
			if (value.length<4)
				_this.planet = null;
			else
				_this.planet =
				{
					type   : value.shift(),
					galaxy : value.shift(),
					system : value.shift(),
					planet : value.shift()
				}
			_this.onChange();
		});
	},
	action : 'sell',
	makeActionSelect : function ()
	{
		var _this = this,
		select = this.window.find('#'+SCRIPT.ID_PREFIX+'action');
		this.actionJqo = select;
		$('<option value="sell">'+I18N.SELL+'</option>').appendTo(select);
		$('<option value="buy">'+I18N.BUY+'</option>').appendTo(select);
		return select.change(function()
		{
			_this.action = $(this).val();
			_this.onChange();
		});
	},
	makeResourceInput : function (type /*met|cry|deu*/,value)
	{
		var _this = this;
		var id = 'input'+type.capitalize();
		var input = this.window.find('#'+SCRIPT.ID_PREFIX+'input_'+type);
		this[id+'Jqo']=input;
		var onChange = function()
		{
			var value = input.val(),
			end = value.length - input.caret().end;
			value = NumberFormat.formatI(value,true);
			end = Math.max(Math.min(value.length-end,value.length),0);
			input.val(value).caret(end,end);
			_this[id] =
			{
				num : (value=='') ? 0 : NumberFormat.parseI(value),
				txt : value
			}
			_this.checkOutputSelect();
			_this.onChange();
		};
		input.val(NumberFormat.formatI(value)).focus(
		function(){
			if (input.val()=='0')
				input.val('');
		}
		).keyup(onChange).change(onChange).blur(
		function()
		{
			if (input.val()=='') input.val('0');
		});
		this[id] =
		{
			num : value,
			txt : input.val()
		}
		return input;
	},
	makeRatioOption : function (ratio,title)
	{
		return $(
			'<option value="'+
			ratio[0]+':'+
			ratio[1]+':'+
			ratio[2]+
			'">'+
			NumberFormat.formatF(ratio[0])+':'+
			NumberFormat.formatF(ratio[1])+':'+
			NumberFormat.formatF(ratio[2])+
			' ('+title+')</option>'
		);
	},
	setRatioComponent : function (type,value)
	{
		var num = parseFloat(value+''),
		id = 'ratio'+type.capitalize();
		this[id] =
		{
			num : num,
			txt : NumberFormat.formatF(num)
		}
		this[id+'Jqo'].val(this[id].txt);
	},
	makeRatioSelect : function ()
	{
		var _this = this,
		select = this.window.find('#'+SCRIPT.ID_PREFIX+'ratio').append(
			$('<option value="">-</option>')
		).append(
			this.makeRatioOption(INFO.RAT_REG, I18N.REG)
		).append(
			this.makeRatioOption(INFO.RAT_MIN, I18N.MIN)
		).append(
			this.makeRatioOption(INFO.RAT_MAX, I18N.MAX)
		);
		return select.change(function()
		{
			var value = $(this).val().split(':');
			if (value.length>2)
			{
				_this.setRatioComponent('met',value[0]);
				_this.setRatioComponent('cry',value[1]);
				_this.setRatioComponent('deu',value[2]);
				$(this).val('');
				_this.checkRatio();
				_this.onChange();
			}
		});
	},
	makeRatioInput: function (type /*met|cry|deu*/,value)
	{
		var _this = this;
		var id = 'ratio'+type.capitalize();
		var input = this.window.find('#'+SCRIPT.ID_PREFIX+'ratio_'+type);
		this[id+'Jqo']=input;
		var onChange = function()
		{
			var o = $(this),
			value = o.val(),
			end = value.length - o.caret().end;
			value = NumberFormat.formatF(o.val(),true);
			end = Math.max(Math.min(value.length-end,value.length),0);
			o.val(value).caret(end,end);
			num = NumberFormat.parseF(value);
			if (num>0)
			{
				_this[id] =
				{
					num : num,
					txt : NumberFormat.formatF(num)
				}
				_this.checkRatio();
				_this.onChange();
			}
		};
		input.val(NumberFormat.formatF(value));
		input.keyup(onChange).change(onChange).blur(function()
		{
			var o = $(this),
			value = NumberFormat.formatF(o.val());
			if (NumberFormat.parseF(value)==0)
			{
				o.val(_this[id].txt);
			}
		}).focus(function(){
			$(this).val('');
		});
		this[id] =
		{
			num : value,
			txt : input.val()
		}
		return input;
	},
	checkRatio : function()
	{
		if (ratioChecker.isLegal(
			this.ratioMet.num,
			this.ratioCry.num,
			this.ratioDeu.num
		))
			this.ratioIllegal.hide();
		else
			this.ratioIllegal.show();
	},
	disable : function (jqo,value)
	{
		jqo.attr('disabled','disabled').prop('disabled', true);
		if (arguments.length>1) jqo.val(value);
		return this;
	},
	enable : function (jqo,value)
	{
		jqo.prop("disabled", false).removeAttr('disabled');
		if (arguments.length>1) jqo.val(value);
		return this;
	},
	isDisabled : function (jqo)
	{
		return (jqo.attr('disabled')=='disabled');
	},
	makePercentInput : function (type /*met|cry|deu*/,value)
	{
		var _this = this;
		var id = 'percent'+type.capitalize();
		var input = this.window.find('#'+SCRIPT.ID_PREFIX+'percent_'+type);
		this[id+'Jqo']=input;
		var onChange = function()
		{
			var value = input.val(),
			end = value.length - input.caret().end,
			otherId = 'percentMet',
			num;
			if (NumberFormat.parseF(value)>100)
				value = '100';
			value = NumberFormat.formatF(value,true);
			end = Math.max(Math.min(value.length-end,value.length),0);
			input.val(value).caret(end,end);
			num = (value=='') ? 0 : NumberFormat.parseF(value);
			_this[id] = {
				num : num,
				txt : NumberFormat.formatF(num)+'%'
			}
			if (/Met|Cry/.test(id)&&(!_this.isDisabled(_this.percentDeuJqo)))
				otherId = 'percentDeu'
			else if (/Met|Deu/.test(id)&&(!_this.isDisabled(_this.percentCryJqo)))
				otherId = 'percentCry'
			num = 100-num;
			value = NumberFormat.formatF(num)+'%'
			_this[otherId+'Jqo'].val(value);
			_this[otherId] = {
				num : num,
				txt : value+'%'
			}
			_this.onChange();
		};
		this.disable(input,NumberFormat.formatF(value)+'%');
		input.focus(
		function(){
			if (_this.isDisabled(input)) return;
			/*input.val(input.val().replace('%',''));
			if (NumberFormat.parseF(input.val())==0)
				input.val('');*/
			input.val('');
			onChange();
		}
		).keyup(onChange).change(onChange).blur(
		function()
		{
			input.val(NumberFormat.formatF(input.val())+'%');
		});
		this[id]=
		{
			num : value,
			txt : input.val()
		}
		return input;
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
	},
	changeOutputSelect : function (value)
	{
		this.outputJqo.val(value);
		m = this.percentMetJqo,
		c = this.percentCryJqo,
		d = this.percentDeuJqo;
		this.disable(m,'0%').disable(c,'0%').disable(d,'0%');
		if (value=='m') m.val('100%');
		else if (value=='c') c.val('100%');
		else if (value=='d') d.val('100%');
		else if (value=='mc') this.enable(m,'50%').enable(c,'50%');
		else if (value=='md') this.enable(m,'50%').enable(d,'50%');
		else this.enable(c,'50%').enable(d,'50%');
		this.percentMet = {txt : m.val(), num : parseInt(m.val().replace('%',''))}
		this.percentCry = {txt : c.val(), num : parseInt(c.val().replace('%',''))}
		this.percentDeu = {txt : d.val(), num : parseInt(d.val().replace('%',''))}
	},
	makeOutputSelect : function ()
	{
		var _this = this,
		select = this.window.find('#'+SCRIPT.ID_PREFIX+'output');
		this.outputJqo = select;
		$('<option value="m">'+I18N.RES_MET+'</option>').appendTo(select);
		$('<option value="c">'+I18N.RES_CRY+'</option>').appendTo(select);
		$('<option value="d">'+I18N.RES_DEU+'</option>').appendTo(select);
		$('<option value="mc">'+I18N.RES_MET+' + '+I18N.RES_CRY+'</option>').appendTo(select);
		$('<option value="md">'+I18N.RES_MET+' + '+I18N.RES_DEU+'</option>').appendTo(select);
		$('<option value="cd">'+I18N.RES_CRY+' + '+I18N.RES_DEU+'</option>').appendTo(select);
		select.change(function()
		{
			_this.changeOutputSelect($(this).val());
			_this.onChange();
		});
		return this;
	},
	makeWindow : function ()
	{
		var _this = this, w;
		this.ogameHide = $('#inhalt').after(w=(this.window=$(this.WINDOW_TPL).hide()));
		this.addCss(this.CSS).show();
		this.closeButton = w.find('#'+SCRIPT.ID_PREFIX+'close').click(function(){_this.hide();});
		this.makeActionSelect();
		this.makeResourceInput('met',0);
		this.makeResourceInput('cry',0);
		this.makeResourceInput('deu',0);
		this.ratioIllegal = w.find('#'+SCRIPT.ID_PREFIX+'ratio_illegal').hide();
		this.makeRatioSelect();
		this.makeRatioInput('met',3);
		this.makeRatioInput('cry',2);
		this.makeRatioInput('deu',1);
		this.makeOutputSelect();
		this.makePercentInput('met',100);
		this.makePercentInput('cry',0);
		this.makePercentInput('deu',0);
		this.outputMet = w.find('#'+SCRIPT.ID_PREFIX+'output_met').text(0);
		this.outputCry = w.find('#'+SCRIPT.ID_PREFIX+'output_cry').text(0);
		this.outputDeu = w.find('#'+SCRIPT.ID_PREFIX+'output_deu').text(0);
		this.makePlanetSelect();
		this.outputMessage = w.find('#'+SCRIPT.ID_PREFIX+'message');
		this.menuButtonAction = function(){_this.toggle();}
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
	},
	init : function ()
	{
		return this.makeMenuButton();
	}
}
).init();

/////
})();
