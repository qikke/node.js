var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var path = request.url
  var query = ''
  if (path.indexOf('?') >= 0) {
    query = path.substring(path.indexOf('?'))
    path = path.slice(0,path.indexOf('?'))
  }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method

  //----------------------------
  console.log('HTTP 路径为\n' + path)
  console.log('查询字符串为\n' + query)
  // console.log('不含查询字符串的路径为\n' + pathNoQuery)


  if (path == '/') {
    var string = fs.readFileSync('./index.html', 'utf8')
    var amount = fs.readFileSync('./db', 'utf8') //100
    string = string.replace('&&&amount&&&', amount)
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path == '/main.js') {
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write('alert("js出来啦")')
    response.end()
  } else if (path == '/style.css') {
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write('body{bacground-color:#ddd;}h1{color:red;}')
    response.end()
  } else if (path == '/pay') {
    var amount = fs.readFileSync('./db', 'utf8')
    amount -= 1
    if (Math.random() > 0.5) {
      fs.writeFileSync('./db', amount)
      response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
      response.statusCode = 200
      response.write(`${queryObject.callback}.call(undefined,'success')`)
    }else{
      response.statusCode = 400
    }
    response.end()
  } else {
    response.statusCode = 404
    response.end()
  }


})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)