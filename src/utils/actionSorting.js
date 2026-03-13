function getActionOrder(action) {
  if (action === 'F') return 0;
  if (action === 'C') return 1;
  if (action === 'MIN') return 2;
  if (action === 'A') return 4;
  if (action.startsWith('R')) return 3;
  return 5;
}

function getRaiseSize(action) {
  if (!action.startsWith('R')) {
    return Number.POSITIVE_INFINITY;
  }

  return Number.parseFloat(action.slice(1));
}

export function sortActions(actionList) {
  return actionList.sort((left, right) => {
    const orderDiff = getActionOrder(left) - getActionOrder(right);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    if (left.startsWith('R') && right.startsWith('R')) {
      return getRaiseSize(left) - getRaiseSize(right);
    }

    return left.localeCompare(right);
  });
}
