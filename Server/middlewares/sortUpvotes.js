function compareUpvote(a, b) {
  const upvoteA = a.upvotes;
  const upvoteB = b.upvotes;

  let comparison = 0;
  if (upvoteA > upvoteB) {
    comparison = 1;
  } else {
    comparison = -1;
  }
  return comparison;
}

function ascUpvotes(a, b) {
  const comparison = compareUpvote(a, b);

  return comparison;
}

function descUpvotes(a, b) {
  const comparison = compareUpvote(a, b);

  return comparison * -1;
}

export { descUpvotes, ascUpvotes };
