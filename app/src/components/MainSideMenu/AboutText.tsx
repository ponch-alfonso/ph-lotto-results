import { Typography } from "@mui/material";

import gcash_image from "../../assets/gcash.jpg";

export default function AboutText() {
  // TODO: Add email, logo, logo of tools, socials
  return (
    <div>
      <Typography gutterBottom style={{ fontWeight: "bold" }}>
        PhLottoResult: Where luck clicks into play! ⚡️
      </Typography>
      <p>
        <Typography gutterBottom>
          Ever chased that jackpot dream? We all have! This little project is a
          passion project where we tinker with React, Progressive Web Apps
          (PWAs), and Firebase to bring you the fastest, smoothest way to check
          those PCSO results.
        </Typography>
      </p>
      <p>
        <Typography gutterBottom style={{ fontWeight: "bold" }}>
          Think of it as your lucky charm in digital form! ✨
        </Typography>
      </p>
      <p>
        <Typography gutterBottom>
          Remember, those awesome logos you see? They belong to their rightful
          owners - we wouldn't dream of stealing the shine!
        </Typography>
      </p>
      <p>
        <Typography
          gutterBottom
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Enjoying the app? Consider fueling our coding sessions with a cup of
          coffee ☕️. Who knows? It might just be your lucky charm! 🍀
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <a href={gcash_image} download>
            <img
              src={gcash_image}
              alt="Gcash QR code for donations"
              style={{ width: "200px" }}
            />
          </a>
        </div>
      </p>
      <p>
        <p>
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            Got a question or suggestion? 🤔
          </Typography>
        </p>
        <Typography gutterBottom>
          Shoot us a message - we're all ears (and maybe even have a lucky
          number or two to share).
        </Typography>
      </p>
    </div>
  );
}
