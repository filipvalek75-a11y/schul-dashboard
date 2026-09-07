const FEEDS = [
  'https://news.google.com/rss/search?q=(E-Commerce%20OR%20Onlinehandel)%20(Österreich%20OR%20Wien)%20when%3A14d&hl=de&gl=AT&ceid=AT%3Ade',
  'https://news.google.com/rss/search?q=(Handel%20OR%20Onlineshop%20OR%20Digitalhandel)%20(Österreich%20OR%20Wien)%20when%3A14d&hl=de&gl=AT&ceid=AT%3Ade',
  'https://news.google.com/rss/search?q=(WKÖ%20OR%20Handelsverband%20OR%20Wirtschaftskammer)%20(E-Commerce%20OR%20Onlinehandel%20OR%20Digitalisierung)%20when%3A30d&hl=de&gl=AT&ceid=AT%3Ade',
  'https://news.google.com/rss/search?q=(Shopify%20OR%20Shopware%20OR%20WooCommerce%20OR%20Odoo%20OR%20KI%20OR%20Payment%20OR%20Logistik)%20Österreich%20when%3A30d&hl=de&gl=AT&ceid=AT%3Ade',
  'https://news.google.com/rss/search?q=(EU%20OR%20Gesetz%20OR%20Verbraucherrecht%20OR%20Verpackung)%20Onlinehandel%20Österreich%20when%3A30d&hl=de&gl=AT&ceid=AT%3Ade'
];

function decodeXml(s='') {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
    .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}
function stripHtml(s='') { return decodeXml(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }
function tagFor(title='') {
  const t = title.toLowerCase();
  if (/wien|vienna/.test(t)) return {label:'Wien', icon:'◆'};
  if (/ai|ki|chatgpt|agent|gemini|künstliche/.test(t)) return {label:'KI & Handel', icon:'✦'};
  if (/shopify|shopware|woocommerce|odoo|shop-system|plattform/.test(t)) return {label:'Shopsysteme', icon:'▦'};
  if (/google|seo|search|ads|marketing|analytics/.test(t)) return {label:'Marketing & SEO', icon:'⌕'};
  if (/tiktok|instagram|meta|social|creator|influencer/.test(t)) return {label:'Social Commerce', icon:'◉'};
  if (/payment|paypal|klarna|checkout|logistik|delivery|versand|liefer|post/.test(t)) return {label:'Payment & Logistik', icon:'↗'};
  if (/eu|gesetz|recht|datenschutz|dsgvo|barriere|verbraucher|verpackung/.test(t)) return {label:'Recht & EU', icon:'§'};
  return {label:'Österreich', icon:'🇦🇹'};
}
function parseItems(xml) {
  const out = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of blocks) {
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,'i'));
      return m ? decodeXml(m[1]).trim() : '';
    };
    const title = stripHtml(get('title'));
    const link = stripHtml(get('link'));
    const pubDate = stripHtml(get('pubDate'));
    const description = stripHtml(get('description'));
    const sourceMatch = block.match(/<source(?:\s+url="([^"]*)")?>([\s\S]*?)<\/source>/i);
    const source = sourceMatch ? stripHtml(sourceMatch[2]) : 'News';
    if (!title || !link) continue;
    const cleanTitle = title.replace(/\s+-\s+[^-]{2,80}$/,'').trim() || title;
    const text = `${cleanTitle} ${description} ${source}`;
    const tag = tagFor(text);
    const lower = text.toLowerCase();
    let regionScore = 0;
    if (/wien|vienna|wiener/.test(lower)) regionScore += 8;
    if (/österreich|austria|österreichisch|wko|wirtschaftskammer|handelsverband/.test(lower)) regionScore += 5;
    if (/eu|europäisch/.test(lower)) regionScore += 1;
    out.push({title:cleanTitle,url:link,source,publishedAt:pubDate?new Date(pubDate).toISOString():null,category:tag.label,icon:tag.icon,regionScore});
  }
  return out;
}
module.exports = async function handler(req, res) {
  try {
    const results = await Promise.all(FEEDS.map(async (url) => {
      const r = await fetch(url,{headers:{'user-agent':'Mozilla/5.0 E-Commerce Dashboard Austria/1.0'}});
      if (!r.ok) throw new Error('Feed konnte nicht geladen werden');
      return parseItems(await r.text());
    }));
    const seen = new Set();
    const all = results.flat().filter(x => {
      const k=x.title.toLowerCase().replace(/[^a-z0-9äöüß]+/g,' ').trim();
      if(seen.has(k)) return false; seen.add(k); return true;
    });
    const local = all.filter(x=>x.regionScore>=5);
    const pool = local.length >= 6 ? local : [...local, ...all.filter(x=>x.regionScore<5)];
    const items = pool.sort((a,b) => {
      const scoreDiff=(b.regionScore||0)-(a.regionScore||0);
      if(scoreDiff) return scoreDiff;
      return new Date(b.publishedAt||0)-new Date(a.publishedAt||0);
    }).slice(0,6).map(({regionScore,...x})=>x);
    res.setHeader('Cache-Control','s-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json({updatedAt:new Date().toISOString(),region:'Österreich / Wien',items});
  } catch (err) {
    res.status(500).json({error:'News konnten momentan nicht geladen werden.',items:[]});
  }
};