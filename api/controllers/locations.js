require("dotenv").config();
const mongoose = require("mongoose");
const satelize = require("satelize");
const crypto = require("crypto");
const Location = require("../model/location");
const axios = require("axios");

exports.get_locations = (req, res, next) => {
  Location.find()
    .select("_id ip city region country loc org timezone visits vid")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        message: "Locations fetched successfully",
        data: docs.map((doc) => {
          return {
            _id: doc._id,
            ip: doc.ip,
            city: doc.city,
            region: doc.region,
            country: doc.country,
            loc: doc.loc,
            org: doc.org,
            timezone: doc.timezone,
            visits: doc.visits,
            vid: doc.vid,
          };
        }),
      });
    })
    .catch((error) =>
      res.status(500).json({
        error: error,
      })
    );
};

exports.create_or_edit_location = async (req, res, next) => {
  const ipAddr = await axios.get("https://api.ipify.org");
  const ipInfo = await axios.get(
    `https://ipinfo.io/${ipAddr.data}?token=${process.env.IPINFO_KEY}`
  );
  if (req.query.type === "new-visit") {
    const vid = crypto.randomUUID();

    try {
      const location = new Location({
        _id: new mongoose.Types.ObjectId(),
        vid: vid,
        ip: ipInfo.data.ip,
        city: ipInfo.data.timezone.split("/")[1],
        region: ipInfo.data.region,
        country: ipInfo.data.country,
        loc: ipInfo.data.loc,
        org: ipInfo.data.org,
        timezone: ipInfo.data.timezone,
      });
      location.save().then((data) => {
        return res.status(201).json({
          message: "Location created successfully",
          data: {
            vid: data.vid,
          },
          request: {
            type: "GET",
            description: "Get all locations",
            url: `http://localhost:3000/api/locations/`,
          },
        });
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Error from the request body",

        error: error,
      });
    }
  } else if (req.query.type === "existing-visit") {
    const locationId = req.query.vid;

    Location.find({ vid: locationId })
      .exec()
      .then((location) => {
        if (location.length === 0) {
          return res.status(404).json({
            message: "Location not found",
          });
        }

        Location.findByIdAndUpdate(
          { _id: location[0]._id },
          { $set: { visits: location[0].visits + 1, ip: ipInfo.data.ip } }
        )
          .exec()
          .then(() => {
            res.status(201).json({
              message: "Location updated successfuly",
              request: {
                type: "GET",
                description: "Get all locations",
                url: `http://localhost:3000/api/locations/`,
              },
            });
          })
          .catch((error) => {
            res.status(400).json({
              message:
                "Please, please provide a valid ID and make sure body request is an array [key: value]",
              error: error,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  } else {
    res.status(400).json({
      message: "Unknown request, please check documentation",
    });
  }
};

exports.get_location = (req, res, next) => {
  const id = req.params.locId;
  Location.findById(id)
    .select("_id vid ip city region country loc org timezone visits ")
    .exec()
    .then((location) => {
      if (!location) {
        return res.status(404).json({
          data: location,
          message: "Location not Found",
        });
      }
      res.status(200).json({
        data: location,
        message: "Location by ID fetched successfuly",
        request: {
          type: "POST",
          description: "Post locations",
          url: `http://localhost:3000/api/locations/`,
        },
      });
    });
};

exports.delete_location = (req, res, next) => {
  const id = req.params.locId;

  Location.findById(id)
    .exec()
    .then((location) => {
      if (!location) {
        return res.status(404).json({
          data: location,
          message: "Location not Found",
        });
      }
      Location.findByIdAndRemove({ _id: id })
        .exec()
        .then(() => {
          res.status(204).json({
            message: "Location Deleted successfuly",
            request: {
              type: "POST",
              description: "Post location",
              url: `http://localhost:3000/api/locations/`,
            },
          });
        })
        .catch((error) => {
          res.status(404).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
