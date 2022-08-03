#!/usr/bin/env zx

const app = within(async () => {
  cd("./app");

  await $`yarn start`;
});

const yolo = within(async () => {
  cd("./yolo");

  await $`python3 script.py`;
});

await Promise.all([app, yolo]);
