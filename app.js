const http = require('http'), //This module provides the HTTP server functionalities
    path = require('path'), //The path module provides utilities for working with file and directory paths
    express = require('express'), //This module allows this app to respond to HTTP Requests, defines the routing and renders back the required content
    fs = require('fs'), //This module allows to work witht the file system: read and write files back
    xmlParse = require('xslt-processor').xmlParse, //This module allows us to work with XML files
    xsltProcess = require('xslt-processor').xsltProcess, //The same module allows us to utilise XSL Transformations
    xml2js = require('xml2js'), //This module does XML to JSON conversion and also allows us to get from JSON back to XML
    Ajv = require('ajv').default,
    ajv = new Ajv({allErrors: true}),
    validator = require('xsd-schema-validator');

var router = express(); //We set our routing to be handled by Express
var server = http.createServer(router); //This is where our server gets created

router.use(express.static(path.resolve(__dirname, 'views'))); //We define the views folder as the one where all static content will be served
router.use(express.urlencoded({extended: true})); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       cx                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    });
}
  
//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
}

router.get('/', function(req, res) {

    res.render('index');

});

router.get('/cart', function(req,res){
    res.sendFile(__dirname + "/views/cart.html")
})


router.get('/car', function(req,res){
    res.sendFile(__dirname + "/views/car.html")
})

router.get('/motorcycle', function(req, res) {
    res.sendFile(__dirname + "/views/motorcycle.html");

});

router.get('/get/car', function(req, res) {
    validator.validateXML({file: 'car.xml'}, 'car.xsd', (error, result) => {
        if (result.valid) {
            console.log('XML Validation was correct');
        } else {
            console.log("xml invalid")
        }
        res.end();
    });
    xmlFileToJs('car.xml', function(err,result){
        console.log(JSON.stringify(result,null,"  "))
            res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
            var xml = fs.readFileSync('car.xml', 'utf8'); //We are reading in the XML file
            var xsl = fs.readFileSync('car.xsl', 'utf8'); //We are reading in the XSL file

            var doc = xmlParse(xml); //Parsing our XML file
            var stylesheet = xmlParse(xsl); //Parsing our XSL file

            var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation

            res.end(result.toString()); //Send the result back to the user, but convert to type string first
        
    })
        


});

router.get('/get/motorcycle', function(req, res) {
    var xml = fs.readFileSync('motorcycle.xml', 'utf8'); //We are reading in the XML file

            res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
            
            var xsl = fs.readFileSync('motorcycle.xsl', 'utf8'); //We are reading in the XSL file

            var doc = xmlParse(xml); //Parsing our XML file
            var stylesheet = xmlParse(xsl); //Parsing our XSL file

            var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation

            res.end(result.toString()); //Send the result back to the user, but convert to type string first



});

router.get('/get/cart', function(req, res){
    var xml = fs.readFileSync('cart.xml', 'utf8'); //We are reading in the XML file


            res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
            var xsl = fs.readFileSync('cart.xsl', 'utf8'); //We are reading in the XSL file

            var doc = xmlParse(xml); //Parsing our XML file
            var stylesheet = xmlParse(xsl); //Parsing our XSL file

            var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation

            res.end(result.toString()); //Send the result back to the user, but convert to type string first

})

router.post('/post/json/add_car', function (req, res) {
    function appendJSON(obj) {
        console.log(obj)

        xmlFileToJs('car.xml', function (err, result) {
            if (err) throw (err);
            result.carmenu.section[obj.sec_add].entree.push({'item': obj.item_add, 'price': obj.price_add});
            
            if(obj.item_add == '' || obj.price_add == ''){
            } 
            else{
                jsToXmlFile('car.xml', result, function(err){
                    if (err) console.log(err);
                })
            }
            
        });
    };

    appendJSON(req.body);

    res.redirect('back');

    
});

router.post('/post/json/cart_rm', function (req, res) {
    function appendJSON(obj) {

        console.log(obj)

        xmlFileToJs('cart.xml', function (err, result) {
            if (err) throw (err);
            console.log(JSON.stringify(result, null, "  "));
            var item = obj.item
            var confirmation = false
            var i = 0;
            while(confirmation == false){
                if(item == result.cart.section[0].entree[i].item){ 
                    result.cart.section[0].entree.splice(i,1)
                    confirmation = true
                }
                i++;
            }
            var billTotal = 0
            for( var i = 1 ; i < result.cart.section[0].entree.length ; i++ ){
                billTotal += parseFloat(result.cart.section[0].entree[i].price)
            }
            billTotal = Math.round(billTotal * 100.0) / 100.0
            result.cart.section[0].billTotal = billTotal
            console.log(JSON.stringify(result, null, "  "));
            jsToXmlFile('cart.xml', result, function(err){
                if (err) console.log(err);
            });
            
        })
        
    };

    appendJSON(req.body);

    res.redirect('back');

});

router.post('/post/json/rm_car', function (req, res) {
    var erro = 0;
    function appendJSON(obj) {
        
        xmlFileToJs('car.xml', function (err, result) {
            if (err) throw (err);
            var item = obj.item_rm
            var confirmation = false
            var i = 0;
            while(confirmation == false){
                try{
                    if (item!=""){
                        if(item == result.carmenu.section[obj.sec_rm].entree[i].item){ 
                            result.carmenu.section[obj.sec_rm].entree.splice(i,1)
                            confirmation = true
                        }
                    }
                    else{
                        confirmation = true
                        erro = 1
                    }
                }
                catch(e){
                    confirmation = true
                    erro = 1;
                }
                i++;
            }
            // console.log(JSON.stringify(result, null, "  "));
            if(item == ""){
            }
            else{
                if(erro != 1){
                    jsToXmlFile('car.xml', result, function(err){
                        if (err) console.log(err);
                    });
                }
            }
        })
    };

    appendJSON(req.body);

    res.redirect('back');

});

router.post('/post/json/cart', function(req,res){
    function getJson(obj){
        console.log(obj)
        xmlFileToJs('cart.xml', function(err2, result2){
            if(err2) throw (err2)
            
            // console.log(JSON.stringify(result, null, "  "));
            
            xmlFileToJs('car.xml', function(err1, result1){
                if(err1) throw (err1)
                var json_cart
                for(var k = 0; k < result1.carmenu.section.length ; k++){
                    var section = result1.carmenu.section[k].entree
                    
                    switch(k){
                        case 0:
                            console.log(Array.isArray(obj.car))
                            for(var j = 0 ; j < section.length ; j++ ){
                                if(obj.car){
                                    if(obj.car == section[j].item){
                                        json_cart = section[j]
                                        result2.cart.section[0].entree.push({'item': json_cart.item, 'price': json_cart.price})
                                    }
                                }
                            }
                            break;
                        case 1:
                            for(var j = 0 ; j < section.length ; j++ ){
                                if(obj.model){
                                    if(obj.model == section[j].item){
                                        json_cart = section[j]
                                        result2.cart.section[0].entree.push({'item': json_cart.item, 'price': json_cart.price})
                                    }
                                }
                            }
                            break;
                        case 2:
                            for(var i = 0 ; i < section.length ; i++ ){
                                console.log(Array.isArray(obj.accessory))
                                for(var j = 1 ; j < section.length ; j++ ){
                                    if(obj.accessory){
                                        if(obj.accessory[i] == section[j].item){
                                            json_cart = section[j]
                                            result2.cart.section[0].entree.push({'item': json_cart.item, 'price': json_cart.price})
                                        }
                                    }
                                }
                            }
                            break;
                        case 3:
                            for(var j = 0 ; j < section.length ; j++ ){
                                if(obj.door){
                                    if(obj.door == section[j].item){
                                        json_cart = section[j]
                                        result2.cart.section[0].entree.push({'item': json_cart.item, 'price': json_cart.price})
                                    }
                                }
                            }
                            break;
                    }
                }
                var billTotal = 0
                for( var i = 1 ; i < result2.cart.section[0].entree.length ; i++ ){
                    billTotal += parseFloat(result2.cart.section[0].entree[i].price)
                }
                billTotal = Math.round(billTotal * 100.0) / 100.0
                result2.cart.section[0].billTotal = billTotal
                console.log(JSON.stringify(result2, null, "  "))
                // if(obj.accessory)
                //     var accessories = result.carmenu.section[obj.accessory]
                jsToXmlFile('cart.xml', result2, function(err2){
                    if(err2) console.log(err2)
                })
            })
        })
    }
    getJson(req.body)
    res.redirect('/cart')
})

router.post("/post/json/confirm", function(req,res){  
    xmlFileToJs('cart.xml', function (err, result) {
        if (err) throw (err);
        var length = result.cart.section[0].entree.length
        length -= 1
        console.log(length)
        result.cart.section[0].entree.splice(1,length)
        result.cart.section[0].billTotal = 0
        console.log(JSON.stringify(result, null, "  "));
        jsToXmlFile('cart.xml', result, function(err){
            if (err) console.log(err);
        });     
    })
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});