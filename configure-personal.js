const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const fs = require("fs/promises");

(async () => {
const stdio = readline.createInterface({ input, output });
  try {
    const config = {
      mysql: {
        password: ""
      },
      session: {
        secret: ""
      }
    }
    config.mysql.password = await stdio.question("What is the password for your MySQL root account? ");
    config.session.secret = await stdio.question("What session secret do you want to use? ")
    const json = JSON.stringify(config);
    await fs.writeFile("personal.config.json", json);
    stdio.write("Your configuration is save in configure-personal.js successfully!\n")
    stdio.close();
    process.exit(-1);
  } catch(err) {
    stdio.write("Saving configuration failed\n")
    stdio.close();
    console.log("Error: ", err);
    process.exit(-1)
  }
})();
