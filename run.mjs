#!/usr/bin/env zx

const web = within(async () => {
  cd("./web");

  await $`yarn dev`;
});

const app = within(async () => {
  cd("./app");

  await $`yarn dev`;
});

const yolo = within(async () => {
  cd("./yolo");

  await $`python3 script.py`;
});

await Promise.all([web, app, yolo]);
