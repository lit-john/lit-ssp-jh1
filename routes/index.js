
/*
 * GET home page.
 */

exports.index = function(req, res){
  var connection = req.app.settings.dbConnection;

  connection.query('select id, color from colors', function(err, results) {
    if (err) throw err;

    for (var i=0; i<results.length; i++) {
      console.log("Color" + results[i].id + " : " + results[i].color);
    }
    
    res.render('index', { title: 'Express', colors: results });

  });

  
};

exports.addColor = function(req, res) {
  var connection = req.app.settings.dbConnection;

  var enteredColor = req.query.color;

  connection.query('insert into ?? (??) VALUES(?)', ['colors', 'color', enteredColor], function(err, result) {
    if (err) throw err;

    console.log(result.insertId);
    res.redirect('/');
  });
};

exports.deleteColor = function(req, res) {
  var connection = req.app.settings.dbConnection;

  var colorID = req.query.id;

  connection.query('delete from colors where id=?', [colorID], function(err, result) {
    if (err) throw err;

    console.log(result.insertId);
    res.redirect('/');
  });
};