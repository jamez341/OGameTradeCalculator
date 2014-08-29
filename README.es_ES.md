
OGameTradeCalculator
====================

Este script añade una calculadora de comercio a la interfaz de [OGame]. Permite guardar tus ratios favoritos, usar porcentajes, exportar los resultados en un precioso mensaje, etc.

Las traducciones disponibles son **English** (*por defecto*), **Español** (*ogame.com.es, ogame.com.ar, mx.ogame.org*), **Française** (*ogame.fr*), **Italiano** (*ogame.it*) y **Nederlands** (*ogame.nl*) pero puedes enviarme mas [traducciones] si lo deseas, preferiblemente mediante los [asuntos] de este proyecto.

\[ ![gb-flag] English \] *Click the following link to view this document in English: [README.md]*

Instalación
-----------

  1. Instalar [Greasemonkey] \(para [Firefox]\) o alguna alternativa, como [Scriptish] \(para [Firefox]\) o [Tampermonkey] \(para [Chrome]\).
  2. Pulsa este [enlace de instalación] y acepta la instalación.

¿Este script es legal?
----------------------

Si, esta herramienta fue [legalizada por OGame Origin], así que puedes usarlo en cualquier servidor.

Un vistazo rápido a la calculadora
----------------------------------

![screenshot-calculator]

Permite calcular:

  - Un recurso de salida indicándole un recurso de entrada.
    *Por ejemplo: 300 Metal = 100 Deuterio.*
  - Un recurso de salida introduciendo dos recursos de entrada.
    *Por ejemplo: 300 Metal + 200 Cristal = 200 Deuterio.*
  - Dos recursos de salida indicando un recurso de entrada y porcentajes de reparto.
    *Por ejemplo 600 Metal = 200 Cristal (50%) + 100 Deuterio (50%).*

Características:

  - Puedes escribir ratios a mano o escogerlos del selector.
  - Si el ratio introducido es ilegal la calculadora te lo advierte.
  - Muestra la cantidad total de recursos que serán enviados y recibidos.
  - Indica la cantidad de naves grandes/pequeñas de carga necesarias para mover dichos recursos.
  - Compacta el resultado en un bonito mensaje para enviar la oferta a otros jugadores.
  - Puedes indicar donde quieres recibir los recursos en dicho mensaje.

Ajustes > Lista de ratios
-------------------------

![screenshot-ratio_list]

Permite modificar el selector de ratios de la calculadora, para que puedas escoger rápidamente los ratios mas usados en vez de escribirlos a mano.

Características:

  - Editar, añadir, borrar y ordenar los ratios.
  - Escoger el ratio por defecto.
  - Editar el ratio máximo y mínimo (usados para comprobar la legalidad de los ratios).

Ajustes > Valores por defecto
-----------------------------

![screenshot-default_values]

La captura es bastante autoexplicativa, permite escoger los valores que estarán seleccionados por defecto cada vez que abras la calculadora.

Opciones:

  - Seleccionar la acción por defecto (comprar o vender).
  - Seleccionar los recursos de salida por defecto (metal, cristal, deuterio, metal+cristal...).
  - Hacer que seleccione automáticamente el planeta o luna actual como lugar de entrega.

Ajustes > Abreviaciones y teclas de autocompletado
--------------------------------------------------

![screenshot-abbreviations]

Opciones:

  - Usar abreviaciones.
    *Por ejemplo: Mostrar `3,5M` en vez de `3.500.000`.*
  - Desabreviar al poner el ratón encima.
    *Por ejemplo: Un campo muestra `500K`, si posas el ratón encima mostrará `500.000`.*
  - Indicar la abreviación para millones y miles.
    *Por ejemplo: Si pones `KK` como abreviación para millones, entonces `3.500.000` será mostrado como `3,5KK`.*
  - Indicar atajos para escribir millones y miles.
    *Por ejemplo: Si pones `k` como atajo para miles, entonces al escribir `23kk` el campo cambiará automáticamente a `23.000.000`.*

Ajustes > Plantilla del mensaje
-------------------------------

![screenshot-message_template]

Permite definir la plantilla del mensaje usando una mezcla de **texto**, **etiquetas phpBB** (*por ejemplo: `[color=red]este texto es rojo[/color]`*), **constantes** (*por ejemplo: `este script muestra el metal usando el color {COLOR.MET}`*), **variables** (*por ejemplo: `el metal de entrada es {m}`*) y **estructuras de control** (*por ejemplo: `El metal de salida{?M} no{/M} es cero`*).

Ajustes > Importar/Exportar configuración
-----------------------------------------

Permite importar/exportar todos los ajustes como texto (JSON convertido a texto).

Información del script para foros de OGame
------------------------------------------

```
[b]OGame Trade Calculator[/b]
[list]
[*]Info : Adds a Trade calculator to the OGame interface
[*]Author : EliasGrande
[*]Website : [url]https://github.com/EliasGrande/OGameTradeCalculator[/url]
[*]Support : [url]https://github.com/EliasGrande/OGameTradeCalculator/issues[/url]
[*]Download : [url]https://github.com/EliasGrande/OGameTradeCalculator/raw/master/dist/releases/latest.user.js[/url]
[*]Screenshot : [url]https://github.com/EliasGrande/OGameTradeCalculator/raw/master/dist/img/readme/calc.png[/url]
[*]Browser : Firefox + Greasemonkey or Scriptish & Chrome + Tampermonkey
[*]Languages :  English, Español, Française, Italiano & Nederlands
[/list]
```

[OGame]:http://en.ogame.gameforge.com/
[legalizada por OGame Origin]:http://board.origin.ogame.gameforge.com/board175-user-projects/board39-official-tolerated-tools-addons-scripts/4367-ogame-trade-calculator/

[Firefox]:https://www.mozilla.org/firefox
[Greasemonkey]:https://addons.mozilla.org/firefox/addon/greasemonkey/
[Scriptish]:https://addons.mozilla.org/firefox/addon/scriptish/

[Chrome]:https://www.google.com/chrome/
[Tampermonkey]:https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

[asuntos]:/../../issues
[README.md]:README.md
[traducciones]:dist/locale
[enlace de instalación]:dist/releases/latest.user.js?raw=true&.user.js

[screenshot-calculator]:dist/img/readme/calc.png?raw=true
[screenshot-ratio_list]:dist/img/readme/ratio-list.png?raw=true
[screenshot-default_values]:dist/img/readme/def-values.png?raw=true
[screenshot-abbreviations]:dist/img/readme/abb-auto.png?raw=true
[screenshot-message_template]:dist/img/readme/msg-tpl.png?raw=true

[gb-flag]:https://dl.dropboxusercontent.com/u/89283239/icons/famfamfam.com/flag_icons/png/gb.png


