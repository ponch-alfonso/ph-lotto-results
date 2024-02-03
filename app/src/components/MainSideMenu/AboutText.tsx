import { Typography } from "@mui/material";

export default function AboutText() {
  // TODO: Add email, logo, logo of tools, socials
  return (
    <div>
      <Typography gutterBottom style={{ fontWeight: "bold" }}>
        PhLottoResult: Where luck clicks into play!
      </Typography>
      <p>
        <Typography gutterBottom>
          Ever chased that jackpot dream? We all have! This little project is a
          passion project where we tinker with React, Progressive Web Apps
          (PWAs), and Firebase to bring you the fastest, smoothest way to check
          those PCSO results. ⚡️
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
        <Typography gutterBottom>
          Got a question or suggestion? Shoot us a message - we're all ears (and
          maybe even have a lucky number or two to share).
        </Typography>
      </p>
      <p>
        <Typography gutterBottom style={{ fontWeight: "bold" }}>
          Here's to chasing our dreams (and maybe winning big while we're at
          it)!
        </Typography>
      </p>
    </div>
  );
}
