const http = require('http'), //This module provides the HTTP server functionalities
    path = require('path'), //The path module provides utilities for working with file and directory paths
    express = require('express'), //This module allows this app to respond to HTTP Requests, defines the routing and renders back the required content
    fs = require('fs'), //This module allows to work witht the file system: read and write files back
    xmlParse = require('xslt-processor').xmlParse, //This module allows us to work with XML files
    xsltProcess = require('xslt-processor').xsltProcess, //The same module allows us to utilise XSL Transformations
    xml2js = require('xml2js'), //This module does XML to JSON conversion and also allows us to get from JSON back to XML
    Ajv = require('ajv').default, //Validate using JSON schema
    ajv = new Ajv({allErrors: true}),
    validator = require('xsd-schema-validator'); //Validate file using xsd Schema

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
      xml2js.parseString(xmlStr, {}, cb);
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

/* Cart Page */
router.get('/cart', function(req,res){
    /* Sending a file to /cart */
    res.sendFile(__dirname + "/views/cart.html")
})

router.get('/get/cart', function(req, res){

    res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
    var xml = fs.readFileSync('xml/cart/cart.xml', 'utf8'); //We are reading in the XML file
    var xsl = fs.readFileSync('xml/cart/cart.xsl', 'utf8'); //We are reading in the XSL file

    var doc = xmlParse(xml); //Parsing our XML file
    var stylesheet = xmlParse(xsl); //Parsing our XSL file

    var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation

    res.end(result.toString()); //Send the result back to the user, but convert to type string first

})

/* car page post receiving all user input */
router.post('/post/json/cart/car', function(req,res){
    function getJson(obj){
        /* pulling the json schema from the car to the schema variable */
        var schema = fs.readFileSync(__dirname + "/json-schemas/car/cart.schema.json", "utf-8")
        /* Transforming the contents of the schema variable from String to JSON */
        schema = JSON.parse(schema)
        /* Using the ajv module for json schema validation */
        var validate = ajv.compile(schema)
        console.log(obj)
        if(validate(obj)){
            /* If the json is valid */
            xmlFileToJs('xml/cart/cart.xml', function(err2, result2){
                if(err2) throw (err2)
                
                console.log(JSON.stringify(result2, null, "  "));
                
                xmlFileToJs('xml/car/car.xml', function(err1, result1){
                    if(err1) throw (err1)
                    var json_cart
                    /* Identifying which items were selected by the user */
                    for(var k = 0; k < result1.carmenu.section.length ; k++){
                        var section = result1.carmenu.section[k].entree
                        
                        switch(k){
                            case 0:
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
                    /* Calculating the bill */
                    for( var i = 1 ; i < result2.cart.section[0].entree.length ; i++ ){
                        billTotal += parseFloat(result2.cart.section[0].entree[i].price)
                    }
                    billTotal = Math.round(billTotal * 100.0) / 100.0
                    result2.cart.section[0].billTotal = billTotal
                    console.log(JSON.stringify(result2, null, "  "))
                    jsToXmlFile('xml/cart/cart.xml', result2, function(err2){
                        if(err2) console.log(err2)
                    })
                })
            })
            res.write("valid input!")
        }
        else{
            /* If the json is invalid */
            res.write("invalid input!")
        }
        res.end()
    }
    getJson(req.body)
})

/* post getting all the motorcycle entries */
router.post('/post/json/cart/moto', function(req,res){
    function getJson(obj){
        var schema = fs.readFileSync(__dirname + "/json-schemas/motorcycle/cart.schema.json", "utf-8")
        schema = JSON.parse(schema)
        var validate = ajv.compile(schema)
        console.log(obj)
        if(validate(obj)){
            xmlFileToJs('xml/cart/cart.xml', function(err2, result2){
                if(err2) throw (err2)
                
                console.log(JSON.stringify(result2, null, "  "));
                
                xmlFileToJs('xml/motorcycle/motorcycle.xml', function(err1, result1){
                    if(err1) throw (err1)
                    var json_cart
                    for(var k = 0; k < result1.motomenu.section.length ; k++){
                        var section = result1.motomenu.section[k].entree
                        
                        switch(k){
                            case 0:
                                console.log(Array.isArray(obj.motorcycle))
                                for(var j = 0 ; j < section.length ; j++ ){
                                    if(obj.motorcycle){
                                        if(obj.motorcycle == section[j].item){
                                            json_cart = section[j]
                                            result2.cart.section[0].entree.push({'item': json_cart.item, 'price': json_cart.price})
                                        }
                                    }
                                }
                                break;
                            case 1:
                                for(var i = 0 ; i < section.length ; i++ ){
                                    console.log(Array.isArray(obj.helmets))
                                    for(var j = 1 ; j < section.length ; j++ ){
                                        if(obj.helmets){
                                            if(obj.helmets[i] == section[j].item){
                                                json_cart = section[j]
                                                result2.cart.section[0].entree.push({'item': json_cart.item, 'price': json_cart.price})
                                            }
                                            
                                        }
                                    }
                                }
                                break;
                            case 2:
                                for(var j = 0 ; j < section.length ; j++ ){
                                    if(obj.seat){
                                        if(obj.seat == section[j].item){
                                            json_cart = section[j]
                                            result2.cart.section[0].entree.push({'item': json_cart.item, 'price': json_cart.price})
                                        }
                                    }
                                }
                                break;
                            case 3:
                                for(var j = 0 ; j < section.length ; j++ ){
                                    if(obj.grips){
                                        if(obj.grips == section[j].item){
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
                    jsToXmlFile('xml/cart/cart.xml', result2, function(err2){
                        if(err2) console.log(err2)
                    })
                })
            })
            res.write("valid input!")
        }
        else{
            res.write("invalid input!")
        }
        res.end()
    }
    getJson(req.body)
})

/* post receiving a request to remove an item from the cart */
router.post('/post/json/cart_rm', function (req, res) {
    function appendJSON(obj) {

        console.log(obj)

        xmlFileToJs('xml/cart/cart.xml', function (err, result) {
            if (err) throw (err);
            console.log(JSON.stringify(result, null, "  "));
            var item = obj.item
            var confirmation = false
            var i = 0;
            /* Checking which item the user selected to remove */
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
            jsToXmlFile('xml/cart/cart.xml', result, function(err){
                if (err) console.log(err);
            });
            
        })
        
    };

    appendJSON(req.body);

    res.redirect('back');

});

/* Resetting the shopping cart */
router.post("/post/json/confirm", function(req,res){  
    xmlFileToJs('xml/cart/cart.xml', function (err, result) {
        if (err) throw (err);
        var length = result.cart.section[0].entree.length
        length -= 1
        console.log(length)
        result.cart.section[0].entree.splice(1,length)
        result.cart.section[0].billTotal = 0
        console.log(JSON.stringify(result, null, "  "));
        jsToXmlFile('xml/cart/cart.xml', result, function(err){
            if (err) console.log(err);
        });     
    })
})

/* Car Page */
router.get('/car', function(req,res){
    /* Sending a file to /car */
    res.sendFile(__dirname + "/views/car.html")
})

router.get('/get/car', function(req, res) {
    /* Resetting the shopping cart */
    xmlFileToJs('xml/cart/cart.xml', function (err, result) {
        if (err) throw (err);
        var length = result.cart.section[0].entree.length
        length -= 1
        console.log(length)
        /* Using splice(index, how many indexes) to delete */
        result.cart.section[0].entree.splice(1,length)
        result.cart.section[0].billTotal = 0
        console.log(JSON.stringify(result, null, "  "));
        jsToXmlFile('xml/cart/cart.xml', result, function(err){
            if (err) console.log(err);
        });     
    })
    /* Validation of the xml file using xsd-schema-validator */
    validator.validateXML({file: 'xml/car/car.xml'}, 'xsd/car.xsd', (error, result) => {
        if(result.valid){
            /* After verifying that the xml file is valid */
            xmlFileToJs('xml/car/car.xml', function(err,result){
                // console.log(JSON.stringify(result,null,"  "))
                res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
                var xml = fs.readFileSync('xml/car/car.xml', 'utf8'); //We are reading in the XML file
                var xsl = fs.readFileSync('xml/car/car.xsl', 'utf8'); //We are reading in the XSL file

                var doc = xmlParse(xml); //Parsing our XML file
                var stylesheet = xmlParse(xsl); //Parsing our XSL file

                var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation
                res.end(result.toString()); //Send the result back to the user, but convert to type string first
            })
        }
        else{
            /* If the xml file is invalid it will throw an error */
            throw(error)
        }
    
    }); 
});

/* Receiving all entries to add to the xml car file */
router.post('/post/json/add_car', function (req, res) {
    function appendJSON(obj) {
        /* Transforming the content of json obj.price_add to float */
        obj.price_add = parseFloat(obj.price_add)
        var schema = fs.readFileSync(__dirname + "/json-schemas/car/add.schema.json", "utf-8")
        schema = JSON.parse(schema)
        var validate = ajv.compile(schema)
        if(validate(obj)){
            xmlFileToJs('xml/car/car.xml', function (err, result) {
                if (err) throw (err);
                result.carmenu.section[obj.sec_add].entree.push({'item': obj.item_add, 'price': obj.price_add});
                jsToXmlFile('xml/car/car.xml', result, function(err){
                    if (err) throw(err);
                })
                
            });
            res.write("valid input!")
        }
        else{
            res.write("invalid input!")
        }
        res.end();
    };
    appendJSON(req.body);
});

/* Receiving all entries to remove an item in the xml car file */
router.post('/post/json/rm_car', function (req, res) {
    function appendJSON(obj) {
        xmlFileToJs('xml/car/car.xml', function (err, result) {
            var error = false
            var schema = fs.readFileSync(__dirname + "/json-schemas/car/rm.schema.json","utf-8")
            schema = JSON.parse(schema)
            var validate = ajv.compile(schema)
            if(validate(obj)){
                
                if (err) throw (err);
                var item = obj.item_rm
                var confirmation = false
                var i = 0;
                while(confirmation == false){
                    try{
                        if(item == result.carmenu.section[obj.sec_rm].entree[i].item){ 
                            result.carmenu.section[obj.sec_rm].entree.splice(i,1)
                            confirmation = true
                        }
                    }
                    catch(e){
                        confirmation = true
                        error = true
                    }
                    i++
                }
                // console.log(JSON.stringify(result, null, "  "));
                jsToXmlFile('xml/car/car.xml', result, function(err){
                    if (err) throw(err);
                });
                
            }
            else error = true

            if(error) res.write("invalid input!")
            else res.write("valid input!")

            res.end()
        })
    };

    appendJSON(req.body);

});


router.get('/motorcycle', function(req, res) {
    res.sendFile(__dirname + "/views/motorcycle.html");

});

router.get('/get/motorcycle', function(req, res) {
    /* Resetting the shopping cart */
    xmlFileToJs('xml/cart/cart.xml', function (err, result) {
        if (err) throw (err);
        var length = result.cart.section[0].entree.length
        length -= 1
        console.log(length)
        /* Using splice(index, how many indexes) to delete */
        result.cart.section[0].entree.splice(1,length)
        result.cart.section[0].billTotal = 0
        console.log(JSON.stringify(result, null, "  "));
        jsToXmlFile('xml/cart/cart.xml', result, function(err){
            if (err) console.log(err);
        });     
    })
    /* Validation of the xml file using xsd-schema-validator */
    validator.validateXML({file: 'xml/motorcycle/motorcycle.xml'}, 'xsd/motorcycle.xsd', (error, result) => {
        if(result.valid){
            /* After verifying that the xml file is valid */
            xmlFileToJs('xml/motorcycle/motorcycle.xml', function(err,result){
                // console.log(JSON.stringify(result,null,"  "))
                res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
                var xml = fs.readFileSync('xml/motorcycle/motorcycle.xml', 'utf8'); //We are reading in the XML file
                var xsl = fs.readFileSync('xml/motorcycle/motorcycle.xsl', 'utf8'); //We are reading in the XSL file

                var doc = xmlParse(xml); //Parsing our XML file
                var stylesheet = xmlParse(xsl); //Parsing our XSL file

                var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation
                res.end(result.toString()); //Send the result back to the user, but convert to type string first
            })
        }
        else{
            /* If the xml file is invalid it will throw an error */
            throw(error)
        }
    
    }); 

});

/*  */
router.post('/post/json/add_moto', function (req, res) {
    function appendJSON(obj) {
        obj.price_add = parseFloat(obj.price_add)
        var schema = fs.readFileSync(__dirname + "/json-schemas/motorcycle/add.schema.json", "utf-8")
        schema = JSON.parse(schema)
        var validate = ajv.compile(schema)
        if(validate(obj)){
            xmlFileToJs('xml/motorcycle/motorcycle.xml', function (err, result) {
                if (err) throw (err);
                result.motomenu.section[obj.sec_add].entree.push({'item': obj.item_add, 'price': obj.price_add});
                jsToXmlFile('xml/motorcycle/motorcycle.xml', result, function(err){
                    if (err) throw(err);
                })
            });
            res.write("valid input!")
        }
        else{
            res.write("invalid input!")
        }
        res.end();
    };
    appendJSON(req.body);
});

router.post('/post/json/rm_moto', function (req, res) {
    function appendJSON(obj) {
        xmlFileToJs('xml/motorcycle/motorcycle.xml', function (err, result) {
            var schema = fs.readFileSync(__dirname + "/json-schemas/motorcycle/rm.schema.json","utf-8")
            schema = JSON.parse(schema)
            var validate = ajv.compile(schema)
            var error = false
            if(validate(obj)){
                if (err) throw (err);
                var item = obj.item_rm
                var confirmation = false
                var i = 1;
                while(confirmation == false){
                    try{
                        if(item == result.motomenu.section[obj.sec_rm].entree[i].item){ 
                            result.motomenu.section[obj.sec_rm].entree.splice(i,1)
                            confirmation = true
                        }
                    }
                    catch(e){
                        confirmation = true
                        error = true
                    }
                    i++;
                }
                // console.log(JSON.stringify(result, null, "  "));
                jsToXmlFile('xml/motorcycle/motorcycle.xml', result, function(err){
                    if (err) throw(err);
                });
            }
            else error = true

            if(error) res.write('invalid input!')
            else res.write('valid input!')

            res.end()
        })
        
    };

    appendJSON(req.body);
    

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});