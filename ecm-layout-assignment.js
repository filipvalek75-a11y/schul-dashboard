(()=>{const KEY='quick-add-store-v2';let items=[];try{items=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{}if(!Array.isArray(items))items=[];const id='ecm-layout-webshop-2026-09-14';const studyNotes=[
'Die 3 Säulen einer guten Website: Präsentation, Nutzen, Vertrauen.',
'Das Layout eines Webshops ist durchdacht: Kunden entscheiden sehr schnell, ob ein Shop vertrauenswürdig, übersichtlich und leicht bedienbar wirkt.',
'Viele Webshops folgen einer ähnlichen Grundstruktur, damit Besucher bekannte Elemente intuitiv finden und problemlos navigieren können.',
'Wichtige Informationen wie Versandkosten, Impressum, Kontaktmöglichkeiten und Warenkorbansichten müssen schnell erkennbar sein.',
'Ein funktioneller und professioneller Aufbau hilft, die Kaufabbruchsquote zu minimieren.',
'Eine typische Webshop-Seite besteht aus Header, Body und Footer.',
'Der Header sollte auf allen Seiten gleich sein und enthält typischerweise Logo, Seitentitel, Warenkorb, Hauptnavigation, Kontaktmöglichkeit, Suche, Serviceinfos, Hilfe, Login/Konto/Merkzettel, FAQ, Über uns und Social-Media-Verknüpfungen.',
'Das Logo befindet sich typischerweise links oben, zeigt dem Nutzer, dass er sich noch auf derselben Website befindet und sollte beim Anklicken immer zur Startseite führen.',
'Der Footer ist das Gegenstück zum Header, ist ebenfalls auf allen Seiten gleich und enthält weiterführende sowie rechtlich notwendige Links.',
'Typische Footer-Inhalte: Impressum, AGB, Datenschutzhinweise, Widerrufsbelehrung, Kontakt, Gütesiegel, SSL-Hinweise, Bewertungen, Auszeichnungen, Newsletter und Über uns.',
'Der Footer sollte nicht überladen werden; als Richtwert nennt das Arbeitsblatt nicht mehr als 7–9 Informationen.',
'Der Body liegt zwischen Header und Footer, ist individuell gestaltbar und besteht häufig aus einer, zwei oder drei Spalten mit Texten und Bildern.',
'Beim Scrollen kann der Header verkleinert oder teilweise ausgeblendet werden, damit der Fokus stärker auf den Artikeln liegt.',
'Das Arbeitsblatt stellt außerdem Aufgaben zu Whitespace, CTA-Buttons und dem Vergleich von zwei Webshops; dafür enthält es selbst keine ausgearbeiteten Definitionen oder Musterlösungen.'
];
const practiceQuestions=[
{q:'Nenne die 3 Säulen einer guten Website.',a:'Präsentation, Nutzen und Vertrauen.'},
{q:'Warum haben viele Webshops eine ähnliche Grundstruktur?',a:'Damit Nutzer sich intuitiv orientieren und bekannte Elemente schnell finden können.'},
{q:'Welche Informationen müssen in einem Webshop schnell erkennbar sein?',a:'Zum Beispiel Versandkosten, Impressum, Kontaktmöglichkeiten und Warenkorbansichten.'},
{q:'Warum ist ein funktioneller und professioneller Aufbau wichtig?',a:'Er erleichtert die Orientierung und hilft, Kaufabbrüche zu reduzieren.'},
{q:'Aus welchen drei Hauptbereichen besteht eine typische Internetseite eines Webshops?',a:'Header, Body und Footer.'},
{q:'Was ist der Header?',a:'Der obere, meist farblich abgesetzte Bereich einer Website, der auf allen Seiten des Webshops gleich sein sollte.'},
{q:'Nenne mindestens sechs typische Elemente eines Headers.',a:'Zum Beispiel Logo, Seitentitel, Warenkorb, Hauptnavigation, Kontaktmöglichkeit, Suchfunktion, Serviceinfos, Hilfe, Login/Konto, FAQ, Über uns oder Social Media.'},
{q:'Welche Funktion hat das Logo im Header?',a:'Es zeigt die Zugehörigkeit zur Website und sollte beim Anklicken immer zur Startseite führen.'},
{q:'Was ist der Footer?',a:'Die Fußzeile im unteren Bereich der Website; sie ist das Gegenstück zum Header und auf allen Seiten identisch.'},
{q:'Nenne typische Elemente eines Footers.',a:'Impressum, AGB, Datenschutzhinweise, Widerrufsbelehrung, Kontakt, Gütesiegel, SSL-Hinweise, Bewertungen, Newsletter oder Über uns.'},
{q:'Wie viele Informationen sollte der Footer laut Arbeitsblatt ungefähr maximal enthalten?',a:'Nicht mehr als etwa 7–9 Informationen, damit der Nutzer nicht überfordert wird.'},
{q:'Was ist der Body?',a:'Der Bereich zwischen Header und Footer; er ist individuell gestaltbar und enthält häufig Texte und Bilder.'},
{q:'Wie kann ein Body typischerweise aufgebaut sein?',a:'Zum Beispiel einspaltig, zweispaltig oder dreispaltig.'},
{q:'Was kann beim Scrollen mit dem Header passieren?',a:'Er kann verkleinert oder teilweise ausgeblendet werden, damit der Fokus stärker auf den Artikeln liegt.'},
{q:'Welche Themen sollen laut Aufgabe 3 zusätzlich bearbeitet werden, obwohl das Arbeitsblatt keine fertigen Lösungen dazu liefert?',a:'Whitespace, CTA-Button und der Vergleich von zwei Webshops mit Screenshots und Bemerkungen.'}
];
const base={id,type:'task',title:'Das Layout der Internetseiten eines Webshops',subject:'ECM',description:'Arbeitsblatt vom 14.09.2026: durchdachtes Webshop-Layout, 3 Säulen einer guten Website, typische Webshop-Struktur sowie Header, Body und Footer. Aufgabe 3 verlangt 10 Fragen/Aufgaben auszuarbeiten und anschließend in LMS hochzuladen.',date:'2026-09-14',time:'',status:'In Arbeit',priority:'Mittel',progress:60,checks:[{text:'3 Säulen guter Websites beschreiben',done:true},{text:'Typische Elemente einer Webshop-Seite erklären',done:true},{text:'Header und typische Header-Elemente erklären',done:true},{text:'Footer und typische Footer-Elemente erklären',done:true},{text:'Mögliche Inhalte des Bodys erläutern',done:false},{text:'Whitespace definieren',done:false},{text:'CTA-Button erklären und ideale Umsetzung beschreiben',done:false},{text:'2 Webshops vergleichen, Screenshots und Bemerkungen ergänzen',done:false},{text:'Dokument in LMS hochladen',done:false}],links:[],studyNotes,practiceQuestions,sourceFile:'Das_Layout_Allgemein_Internetseiten_eines_Webshops-AB.docx',createdAt:'2026-09-14T10:22:00',updatedAt:new Date().toISOString()};
const i=items.findIndex(x=>x.id===id);if(i<0)items.push(base);else items[i]={...items[i],...base,checks:items[i].checks?.length?items[i].checks:base.checks};localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('quick-add-data-changed',{detail:{items}}));})();