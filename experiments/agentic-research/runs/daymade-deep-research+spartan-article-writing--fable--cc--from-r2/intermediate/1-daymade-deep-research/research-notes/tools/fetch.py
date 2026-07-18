import sys, urllib.request, re, html
url = sys.argv[1]; limit = int(sys.argv[2]) if len(sys.argv)>2 else 6000
start = int(sys.argv[3]) if len(sys.argv)>3 else 0
req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
body = urllib.request.urlopen(req, timeout=25).read().decode("utf-8","ignore")
body = re.sub(r'(?is)<(script|style|nav|footer|header|svg)[^>]*>.*?</\1>', ' ', body)
text = re.sub(r'<[^>]+>', ' ', body)
text = html.unescape(re.sub(r'\s+', ' ', text)).strip()
print(text[start:start+limit])
