var http = require('http');
var fs = require('fs');
var url = require('url');
var dom = require('jsdom');

var mangas = {};
var jqfile = fs.readFileSync('./jquery-1.7.min.js').toString();

var DELAY = 7200;
var MAX_CHAPTERS = 5;

function readManga(res, id) {
    var ts = new Date().getTime();
    if ((mangas[id] == undefined) || (mangas[id].time < (ts - DELAY))) {
	dom.env({html: 'http://mangareader.net/' +id+ '/.html',
		 src: [ jqfile ],
		 done: function(error, window) {
		     var $ = window.jQuery;
		     var list = $("#listing tr");
		     var last = list.length - 2;
		     var newer;
		     if (!mangas[id]) {
			 mangas[id] = {
			     title: $('#mangaproperties .aname').text(),
			     latest: 0,
			     chapters: []
			 };
		     }
		     mangas[id].time = ts;
		     newer = last - mangas[id].latest
		     if (newer > 0)
		     {
			 for (var i = 0; i < newer; i++) { mangas[id].chapters.pop(); }
			 last = last - mangas[id].latest;
			 list.each(
			     function(i, item) {
				 var self = $(item);
				 var href = self.find("a");
				 var time;
				 var title;
				 self.find("td").each(
				     function(i,item) {
					 if (i == 0) { title = $(item).text().substring(2); }
					 if (i == 1) {
					     time = $(item).text().split('/');
					     time = new Date(time[2], time[0], time[1]);
					 }
				     });
				 if (i > (last - MAX_CHAPTERS)) {
				     mangas[id].chapters.unshift({
					 title: href.text(),
					 link: href.attr('href'),
					 desc: title,
					 date: time
				     });
				 }
			     }
			 );
			 mangas[id].latest = last;
		     }
		     outputManga(res, id);
		 }});
    } else {
	outputManga(res, id);
    }
}

function outputManga(res, id)
{
    res.writeHead(200, {'Content-Type': 'application/rss+xml'});
    res.write('<?xml version="1.0"?>\n');
    res.write('<rss version="2.0">\n');
    res.write('  <channel>\n');
    res.write('    <title>' + mangas[id].title +'</title>\n');
    res.write('    <link>http://www.mangareader.net/' + id + '/index.html</link>\n');
    res.write('    <description>Latest ' + mangas[id].title + ' chapters</description>\n');
    res.write('    <language>en-us</language>\n');
    res.write('    <lastBuildDate>' + new Date(mangas[id].time) + '</lastBuildDate>\n');
    for (var i = 0; i < mangas[id].chapters.length; i++)
    {
	var item = mangas[id].chapters[i];
	res.write('      <item>\n');
	res.write('        <title>' + item.title + '</title>\n');
	res.write('        <link>' + item.link + '</link>\n');
	res.write('        <description>' + item.desc + '</description>\n');
	res.write('        <pubDate>' + item.date + '</pubDate>\n');
	res.write('      </item>\n');
    }
    res.write('  </channel>\n');
    res.end('</rss>\n');
}

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log('PATHNAME_GET_' + pathname);
    if (pathname == '/')
    {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.write('foo? bar!');
	res.end();
    }
    else
    {
	readManga(res, pathname.split('/')[1]);
    }
}).listen(process.env.PORT || 3000);