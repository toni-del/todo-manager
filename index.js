#!/usr/bin/env node

const { Command } = require("commander");
const programm = new Command();
const fs = require("fs");

const DBPATH = "D:/Docs/nodejs/todo-manager/tasks.json";

programm.version("1.0.0").description("To do list manager.");

programm
  .command("add <taskname>")
  .option("--status <status>", "Task status.")
  .alias("a")
  .description("Add task")
  .action((taskname, cmd) => {
    let dbData = JSON.parse(fs.readFileSync(DBPATH, (err, data) => data));

    let task = {
      taskname,
      status: "not done",
    };
    if (cmd.status) task.status = cmd.status;

    dbData.push(task);

    fs.writeFileSync(DBPATH, JSON.stringify(dbData));
  });

programm
  .command("edit <tasknumber> <taskname>")
  .option("--status <status>", "New task status")
  .alias("e")
  .description("Edit task")
  .action((tasknumber, taskname, cmd) => {
    let dbData = JSON.parse(fs.readFileSync(DBPATH, (err, data) => data));

    tasknumber = Number(tasknumber);

    if (dbData.length < tasknumber || tasknumber <= 0) {
      console.log("There are no task with such number");
      return;
    }

    let task = {
      taskname,
      status: "not done",
    };
    if (cmd.status) task.status = cmd.status;

    dbData[tasknumber - 1] = task;

    fs.writeFileSync(DBPATH, JSON.stringify(dbData));
  });

programm
  .command("delete <tasknumber>")
  .alias("d")
  .description("Delete task")
  .action((tasknumber, cmd) => {
    let dbData = JSON.parse(fs.readFileSync(DBPATH, (err, data) => data));

    tasknumber = Number(tasknumber);

    if (dbData.length < tasknumber || tasknumber <= 0) {
      console.log("There are no task with such number");
      return;
    }

    dbData.splice(tasknumber - 1, 1);

    fs.writeFileSync(DBPATH, JSON.stringify(dbData));
  });

programm
  .command("list")
  .option("--status <status>", "Status filter")
  .alias("l")
  .description("Print all tasks")
  .action((cmd) => {
    let dbData = JSON.parse(fs.readFileSync(DBPATH, (err, data) => data));

    let index = 0;

    if (cmd.status)
      dbData.forEach((task) => {
        if (cmd.status == task.status) {
          index++;
          console.log(`${index}) ${task.taskname} - ${task.status}`);
        }
      });
    else
      dbData.forEach((task) => {
        index++;
        console.log(`${index}) ${task.taskname} - ${task.status}`);
      });
  });

programm.parse(process.argv);
