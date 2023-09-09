const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require('path')
const rateLimit = require('express-rate-limit'),
 cors = require("cors"),
bodyParser = require('body-parser'),
crypto = require("crypto"),
config = require("./services/config")
app.use(cors());
//meta reference
const { urlencoded, json } = require("body-parser");
const { Connection } = require("./database/db");

const router = express.Router()

app.use(express.json()); 
app.use(cookieParser());
// app.use("/api/v1/auth", authRouter);
app.post("/login", router)
app.post('/signup', router);


app.get("/", function (_req, res) {
  // res.json({message:"Hello"})
  res.sendFile(path.join(__dirname, 'client', 'Home.html')); // Adjust the path to your messenger.html file
});
app.get("/login", function (_req, res) {
  // res.json({message:"Hello"})
  res.sendFile(path.join(__dirname, 'client', 'login.html')); // Adjust the path to your messenger.html file
});
app.get("/signup", function (_req, res) {
  // res.json({message:"Hello"})
  res.sendFile(path.join(__dirname, 'client', 'signUp.html')); // Adjust the path to your messenger.html file
});
const USERNAME = process.env.DB_USERNAME

const PASSWORD = process.env.DB_PASSWORD

//parse the importted usrname and password
Connection(USERNAME, PASSWORD);

// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature-256" in headers.`);
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha256", config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
// Respond with index file when a GET request is made to the homepage
// app.get("/", function (_req, res) {
//   res.render("messenger");
// });  

app.use(express.static(path.join(__dirname, 'client')));

// app.get("/", function (_req, res) {
//   res.render("messenger");
// });
// Respond with index file when a GET request is made to the homepage
app.get("/", function (_req, res) {
  // res.json({message:"Hello"})
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html')); // Adjust the path to your messenger.html file
});
// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  
  // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === "subscribe" && token === config.verifyToken) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });

  // Create the endpoint for your webhook
  app.post("/webhook", (req, res) => {
    let body = req.body;
  
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });
  
    // Check if this is an event from a page subscription
    if (body.object === "page") {
      // Returns a '200 OK' response to all requests
      res.status(200).send("EVENT_RECEIVED");
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(async function (entry) {
        if ("changes" in entry) {
          // Handle Page Changes event
          let receiveMessage = new Receive();
          if (entry.changes[0].field === "feed") {
            let change = entry.changes[0].value;
            switch (change.item) {
              case "post":
                return receiveMessage.handlePrivateReply(
                  "post_id",
                  change.post_id
                );
              case "comment":
                return receiveMessage.handlePrivateReply(
                  "comment_id",
                  change.comment_id
                );
              default:
                console.warn("Unsupported feed change type.");
                return;
            }
          }
        }
  
        // Iterate over webhook events - there may be multiple
        entry.messaging.forEach(async function (webhookEvent) {
          // Discard uninteresting events
          if ("read" in webhookEvent) {
            console.log("Got a read event");
            return;
          } else if ("delivery" in webhookEvent) {
            console.log("Got a delivery event");
            return;
          } else if (webhookEvent.message && webhookEvent.message.is_echo) {
            console.log(
              "Got an echo of our send, mid = " + webhookEvent.message.mid
            );
            return;
          }
  
          // Get the sender PSID
          let senderPsid = webhookEvent.sender.id;
          // Get the user_ref if from Chat plugin logged in user
          let user_ref = webhookEvent.sender.user_ref;
          // Check if user is guest from Chat plugin guest user
          let guestUser = isGuestUser(webhookEvent);
  
          if (senderPsid != null && senderPsid != undefined) {
            if (!(senderPsid in users)) {
              if (!guestUser) {
                // Make call to UserProfile API only if user is not guest
                let user = new User(senderPsid);
                GraphApi.getUserProfile(senderPsid)
                  .then((userProfile) => {
                    user.setProfile(userProfile);
                  })
                  .catch((error) => {
                    // The profile is unavailable
                    console.log(JSON.stringify(body));
                    console.log("Profile is unavailable:", error);
                  })
                  .finally(() => {
                    console.log("locale: " + user.locale);
                    users[senderPsid] = user;
                    i18n.setLocale("en_US");
                    console.log(
                      "New Profile PSID:",
                      senderPsid,
                      "with locale:",
                      i18n.getLocale()
                    );
                    return receiveAndReturn(
                      users[senderPsid],
                      webhookEvent,
                      false
                    );
                  });
              } else {
                setDefaultUser(senderPsid);
                return receiveAndReturn(users[senderPsid], webhookEvent, false);
              }
            } else {
              i18n.setLocale(users[senderPsid].locale);
              console.log(
                "Profile already exists PSID:",
                senderPsid,
                "with locale:",
                i18n.getLocale()
              );
              return receiveAndReturn(users[senderPsid], webhookEvent, false);
            }
          } else if (user_ref != null && user_ref != undefined) {
            // Handle user_ref
            setDefaultUser(user_ref);
            return receiveAndReturn(users[user_ref], webhookEvent, true);
          }
        });
      });
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
});
  
function setDefaultUser(id) {
    let user = new User(id);
    users[id] = user;
    i18n.setLocale("en_US");
}
  
function isGuestUser(webhookEvent) {
    let guestUser = false;
    if ("postback" in webhookEvent) {
      if ("referral" in webhookEvent.postback) {
        if ("is_guest_user" in webhookEvent.postback.referral) {
          guestUser = true;
        }
      }
    }
    return guestUser;
}
  
  function receiveAndReturn(user, webhookEvent, isUserRef) {
    let receiveMessage = new Receive(user, webhookEvent, isUserRef);
    return receiveMessage.handleMessage();
  }
  

app.listen(3000, function () {
    console.log("server started at port 3000");
})


