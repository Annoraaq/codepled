var input = `callMe().then(result => {
  return callSomeoneElse().then(result2 => {
    return filterResult(result2);
  }).then(filtered => {
    return mapResult(filtered);
  });
});
`;
