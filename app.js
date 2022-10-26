const data = require("./data");

("use strict");

const args = process.argv;

/**
 * UTILITY METHODS
 * -----------------------------------------------------------------------------------------------------
 */

/**
 * The old function was using JavaScript "short-circuiting" with the and (&&) operator.
 * The && operator will return false as soon as it gets any falsy value and
 * will return the last true value if all the values are truthy (in this case the length of the array)
 *
 * I fixed it by failing fast if it's not an array and by returning if it's empty or not.
 *
 * @param countries
 * @returns if the array is empty
 */
function isEmpty(array) {
  if (!Array.isArray(array)) {
    throw new Error("not an array"); // fail fast
    // some devs don't like to throw in boolean function
  }

  return !array.length;
}

function matchIgnoreCase(str1, str2) {
  return str1.toLowerCase().includes(str2.toLowerCase()); // case insensitive match
}

function concatNameWithLength(key, value) {
  return `${key} [${value.length}]`;
}

/**
 * -----------------------------------------------------------------------------------------------------
 */

/**
 * Here are the problems in the old code :
 *
 * The filter function was an impure function. Why ? :
 *      a) it's not predictable because it has an effect on the outside variable "data".
 *      b) it's not immutable because the original data is modified :
 *         let newCountry = q, newCountry.people = ...
 *         let newPerson = p, newPerson.animals = ...
 *
 *         The developer probably tried to make it immutable by assigning it to a new variable
 *         but in JavaScript an object is a reference type, so he was just copying the reference and modifiying it without noticing it.
 *
 * NOTE: this function has a time complexity of O(n^3). For the purpose of this exercice it's fine, but in reality it's bad,
 * especially on big lists. It would be nice to reduce the complexity to O(n log n) or O(n), or making the filtering
 * on the database side or using other data structures or algorithms.
 *
 * @param countries
 * @param searchedStr
 * @returns the filtered array
 */
function filter(countries, searchedStr) {
  if (!searchedStr) {
    throw new Error("search string should be defined"); // fail fast
  }

  const hasMatchingName = (animal) => matchIgnoreCase(animal.name, searchedStr);
  const hasAnimals = (person) => {
    person.animals = person.animals.filter(hasMatchingName); // DISCUSSION it can be considered has mutation, maybe we should make a shallow copy

    return !isEmpty(person.animals);
  };
  const hasPeople = (country) => {
    country.people = country.people.filter(hasAnimals); // same

    return !isEmpty(country.people);
  };

  return countries.filter(hasPeople);
}

/**
 * To avoid the mutation of our objects, I make a shallow copy.
 * Of course if a deep copy is needed I would consider a JSON.parse(JSON.stringify(obj))
 *
 * @param countries
 * @returns
 */
const count = (countries) =>
  countries.map((country) => ({
    ...country,
    name: concatNameWithLength(country.name, country.people),
    people: country.people.map((person) => ({
      ...person,
      name: concatNameWithLength(person.name, person.animals),
    })),
  }));

/**
 * After a first look, we could add a flag on the filter function parameter with default
 * value to false (e.g: printCount = false), mainly to avoid to iterate again on the list.
 *
 * But, the rule is clear : "The count command should add the number of children after the filter was applied".
 */

if (require.main === module) {
  try {
    const commands = args.slice(2).map((arg) => arg.split("="));

    const filterCommands = ["--filter", "filter"];
    const countCommands = ["--count", "count"];
    const allowedCommands = new Set(filterCommands.concat(countCommands));

    // Let's suppose we only allow existing commands
    if (
      commands.length < 1 ||
      commands.length > 2 ||
      !commands.every((command) => allowedCommands.has(command.at(0)))
    ) {
      console.log("Wrong arguments.");
      throw new Error(); // fail fast
    }

    const isFilter = (command) => filterCommands.includes(command);
    const isCount = (command) => countCommands.includes(command);

    const [cmd1, cmd2] = commands;
    const c1 = cmd1.at(0);
    const c2 = cmd2?.at(0);

    if ((isFilter(c1) || isFilter(c2)) && (isCount(c1) || isCount(c2))) {
      const idFilter = commands.findIndex((array) => isFilter(array.at(0)));
      const [, pattern] = commands[idFilter];
      const result = count(filter(data, pattern));
      console.log(
        isEmpty(result) ? "Nothing found" : JSON.stringify(result, null, 2)
      );
    } else if (isFilter(c1)) {
      const result = filter(data, commands[0][1]);
      console.log(
        isEmpty(result) ? "Nothing found" : JSON.stringify(result, null, 2)
      );
    } else if (isCount(c1)) {
      console.log(JSON.stringify(count(data), null, 2));
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  count,
  filter,
  isEmpty,
  matchIgnoreCase,
  concatNameWithLength,
};
