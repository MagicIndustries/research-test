import sys, urllib.request, urllib.parse, html, re
q = urllib.parse.quote_plus(sys.argv[1])
req = urllib.request.Request(f"https://html.duckduckgo.com/html/?q={q}", headers={"User-Agent":"Mozilla/5.0"})
body = urllib.request.urlopen(req, timeout=20).read().decode("utf-8","ignore")
seen=set()
for m in re.finditer(r'<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)</a>', body):
    href, title = m.group(1), re.sub(r'<[^>]+>','',m.group(2))
    u = urllib.parse.parse_qs(urllib.parse.urlparse(href).query).get("uddg",[href])[0]
    if u not in seen:
        seen.add(u)
        print(html.unescape(title).strip(), "|", u)
    if len(seen)>=8: break
