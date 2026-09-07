const FEEDS = [
  'https://news.google.com/rss/search?q=E-Commerce%20OR%20Onlinehandel%20OR%20Online%20Retail%20when%3A7d&hl=de&gl=AT&ceid=AT%3Ade',
  'https://news.google.com/rss/search?q=Shopify%20OR%20Shopware%20OR%20WooCommerce%20OR%20Odoo%20when%3A14d&hl=de&gl=AT&ceid=AT%3Ade',
  'https://news.google.com/rss/search?q=AI%20Shopping%20OR%20Social%20Commerce%20OR%20Google%20Shopping%20when%3A14d&hl=de&gl=AT&ceid=AT%3Ade'
];

function decodeXml(s='') {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
    .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}
function stripHtml(s='') { return decodeXml(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }
function tagFor(title='') {
  const t = title.toLowerCase();
  if (/ai|ki|chatgpt|agent|gemini|künstliche/.test(t)) return {label:'KI & Shopping', icon:'✦'};
  if (/shopify|shopware|woocommerce|odoo|shop-system|plattform/.test(t)) return {label:'Shopsysteme', icon:'▦'};
  if (/google|seo|search|ads|marketing|analytics/.test(t)) return {label:'SEO & Marketing', icon:'⌕'};
  if (/tiktok|instagram|meta|social|creator|influencer/.test(t)) return {label:'Social Commerce', icon:'◉'};
  if (/payment|paypal|klarna|checkout|logistik|delivery|versand|liefer/.test(t)) return {label:'Payment & Logistik', icon:'↗'};
  if (/eu|gesetz|recht|datenschutz|dsgvo|barriere|verbraucher/.test(t)) return {label:'EU & Recht', icon:'§'};
  return {label:'E-Commerce', icon:'◆'};
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
    const tag = tagFor(cleanTitle + ' ' + description);
    out.push({title:cleanTitle,url:link,source,publishedAt:pubDate?new Date(pubDate).toISOString():null,category:tag.label,icon:tag.icon});
  }
  return out;
}
module.exports = async function handler(req, res) {
  try {
    const results = await Promise.all(FEEDS.map(async (url) => {
      const r = await fetch(url,{headers:{'user-agent':'Mozilla/5.0 E-Commerce Dashboard/1.0'}});
      if (!r.ok) throw new Error('Feed konnte nicht geladen werden');
      return parseItems(await r.text());
    }));
    const seen = new Set();
    const items = results.flat().filter(x => {
      const k=x.title.toLowerCase().replace(/[^a-z0-9äöüß]+/g,' ').trim();
      if(seen.has(k)) return false; seen.add(k); return true;
    }).sort((a,b)=>new Date(b.publishedAt||0)-new Date(a.publishedAt||0)).slice(0,6);
    res.setHeader('Cache-Control','s-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json({updatedAt:new Date().toISOString(),items});
  } catch (err) {
    res.status(500).json({error:'News konnten momentan nicht geladen werden.',items:[]});
  }
};