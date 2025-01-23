export default `export default () => {
  let set1 = [1, 2, 3, 4, 5];
  let set2 = [4, 5, 6, 7, 8];

  // find the sum of every value of each set multiplied by every value of the other set

  let sum = 0;
  for (let i = 0; i < set1.length; i++) {
    for (let j = 0; j < set2.length; j++) {
      sum += set1[i] * set2[j];
    }
  }

  return sum;
};`;
