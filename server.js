var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  console.log(uri);
/*  if(uri !== '/index.html' && uri.indexOf('/js/') !== 0) {
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.end();
    return;
  }
*/

  if(uri === '/v2/datapoint') {
	      var body = '';
	      request.on('data', function (data) {
		            body += data;
		          });
	      console.log('gotrequestfordatapoint');
	      request.on('end', function () {
		            console.log('iposted');

		        var post_options = {
				      host: 'localhost',
				      port: '8080',
				      path: '/v2/datapoint',
				      method: 'POST',
				      headers: {
					                'Content-Type': 'application/json',
					                'Content-Length': Buffer.byteLength(body)
					            }
				  };

		        // Set up the request
		         var post_req = http.request(post_options, function(res) {
		               res.setEncoding('utf8');
		                     res.on('data', function (chunk) {
		                               console.log(body);
		                                     });
		                                      });
		      
		     
		      
		                                         // post the data
		                                           post_req.write(body);
		                                           post_req.end();
		      
		                                               });
		         response.writeHead(200);
		            response.write("");
		            response.end();
		      return;
		                                                     }
		      


  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
