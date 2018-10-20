const readline = require("readline-sync");
const cheerio = require("cheerio");
const request = require("request");
const argsArr = [...process.argv].slice(2);
const scrapeGoogle = name => {
  url = `https://www.google.ca/search?q=${name}`;
  request(url, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(body);
      const text = $("h3");
      text.each((_, link) => {
        console.log($(link).text());
      });
    } else {
      console.log(`ERROR: ${err}`);
    }
  });
};
const init = () => {
  const getName = () => {
    const name = readline.question("Enter a movie name: ");
    if (name === "") {
      console.log("movie name is required!\n");
      return getName();
    } else {
      return name.toLowerCase();
    }
  };
  const movieName = getName();
  const getTime = () => {
    const time = readline.question("Set a time for the timer: ");
    const regex = new RegExp("^[A-Za-z!@#$%&*]");
    if (time === "") {
      console.log("Timer has to be set! Please enter a number");
      return getTime();
    } else if (regex.test(time)) {
      console.log(`'${time}' does not look like a number, does it?`);
      return getTime();
    } else {
      return Number(time);
    }
  };
  const timer = getTime();
  const getData = () => {
    url = `https://api.themoviedb.org/3/search/movie?api_key=702bbcef2ab1256c536f5e2deaf3fcd6&language=en-US&query=${movieName}&page=1&include_adult=false`;
    request(url, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        const x = JSON.parse(body);
        if (x.results.length !== 0) {
          console.log(
            `Moive Title:\n${x.results[0].title}\nRelease Date:\n${
              x.results[0].release_date
            }\nPlot:\n${x.results[0].overview}`
          );
          if (readline.keyInYN(`Let us spoil another one for you eh?!`)) {
            return init();
          } else {
            console.log(
              "Anytime you wanna have a movie plot spoiled, you know who to go to. Bye for now Wilson!"
            );
          }
        } else {
          console.log("Looks like the movie you search for does not exist!");
          if (
            readline.keyInYN(
              "Would you like us to spoil another movie for you?"
            )
          ) {
            return init();
          } else {
            console.log("Thank you for using our app!");
          }
        }
      } else {
        console.log(`ERROR: ${err}`);
      }
    });
  };
  setTimeout(getData, `${timer}000`);
  console.log(
    `*** spoiler warning *** We will be spoiling the plot of ${movieName} in ${timer} seconds.`
  );
  scrapeGoogle(movieName);
};
if (argsArr.length !== 0) {
  let movieName = argsArr[0];
  let timer = Number(argsArr[1]);
  const getData = () => {
    url = `https://api.themoviedb.org/3/search/movie?api_key=702bbcef2ab1256c536f5e2deaf3fcd6&language=en-US&query=${movieName}&page=1&include_adult=false`;
    request(url, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        const x = JSON.parse(body);
        if (x.results.length !== 0) {
          console.log(
            `Moive Title:\n${x.results[0].title}\nRelease Date:\n${
              x.results[0].release_date
            }\nPlot:\n${x.results[0].overview}`
          );
          if (
            readline.keyInYN(
              "Would you like us to spoil another movie for you??"
            )
          ) {
            return init();
          } else {
            console.log(
              "Thank you for choosing us to ruin a movie plot for you!"
            );
          }
        } else {
          console.log("Movie Not Found!");
          if (readline.keyInYN("Would like to try again?")) {
            return init();
          } else {
            console.log(
              "Thank you for choosing us as your number 1 movie spolier. Have a nice day."
            );
          }
        }
      } else {
        console.log(`ERROR: ${err}`);
      }
    });
  };
  setTimeout(getData, `${timer}000`);
  console.log(
    `*** spoiler warning *** We will be spoiling ${movieName} in ${timer} seconds.`
  );
  scrapeGoogle(movieName);
} else {
  init();
}
