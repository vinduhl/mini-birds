const express = require("express");
const { json } = require("body-parser");
const mongoJS = require("mongoJS");
const cors = require("cors");


const app = express();
const port = 8800;

const db = mongoJS("birds123", ["sightings"]);


app.use(json());
app.use(cors());


app.post("/api/sighting", function(req, res) {
  db.sightings.save(req.body, function(err, response) {
    if(err) {
      return res.status(500).json(err);
    } else {
      return res.status(200).json(response);
    }
  })
});

app.get("/api/sighting", function(req, res) {
  let query = {};
  if(req.query.bird) {
    query.species = req.query.bird;
  }
  if(req.query.color) {
    query.color = req.query.color;
  }
  if(req.query.numberleft) {
    query.number_left = { $lt: parseInt(req.query.numberleft) }; //less than
  }

  db.sightings.find(query, function(err, response) {
    if(err) {
      return res.status(500).json(err);
    } else {
      return res.status(200).json(response);
    }
  });
});

app.put("/api/sighting", function(req, res) {
  db.sightings.findAndModify({
    query: {
      _id: mongoJS.ObjectId(req.query.id)
    },
    update: {
      $set: req.body
    }},
    function(err, response) {
      if(err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(response);
      }
    });
});


app.delete("/api/sighting", function(req, res) {
  db.sightings.remove({_id: mongoJS.ObjectId(req.query.id)},
    function(err, response) {
      if(err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(response);
      }
    });
});

app.listen(port, function() {
  console.log(`server listening on port ${port}`);
});
