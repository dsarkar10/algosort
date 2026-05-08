export function generateShuffledArray(size) {
  const nums = [];
  const used = new Set();
  while (nums.length < size) {
    const n = Math.floor(Math.random() * 90) + 10;
    if (!used.has(n)) {
      used.add(n);
      nums.push(n);
    }
  }
  return nums;
}

function precomputeBubbleSortSteps(arr) {
  const a = [...arr];
  const swaps = [];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps.push({ indices: [j, j + 1] });
      }
    }
  }
  return swaps;
}

function precomputeSelectionSortSteps(arr) {
  const a = [...arr];
  const swaps = [];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps.push({ indices: [i, minIdx] });
    }
  }
  return swaps;
}

function precomputeInsertionSortSteps(arr) {
  const a = [...arr];
  const swaps = [];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      swaps.push({ indices: [j - 1, j] });
      j--;
    }
  }
  return swaps;
}

function precomputeMergeSortSteps(arr) {
  const a = [...arr];
  const swaps = [];
  function merge(left, mid, right) {
    let i = left;
    let j = mid + 1;
    while (i <= mid && j <= right) {
      if (a[i] <= a[j]) {
        i++;
      } else {
        let temp = j;
        while (temp > i) {
          [a[temp - 1], a[temp]] = [a[temp], a[temp - 1]];
          swaps.push({ indices: [temp - 1, temp] });
          temp--;
        }
        i++;
        mid++;
        j++;
      }
    }
  }
  function mergeSort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }
  mergeSort(0, a.length - 1);
  return swaps;
}

function precomputeQuickSortSteps(arr) {
  const a = [...arr];
  const swaps = [];
  function partition(low, high) {
    const pivotVal = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (a[j] <= pivotVal) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swaps.push({ indices: [i, j] });
        }
      }
    }
    if (i + 1 !== high) {
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      swaps.push({ indices: [i + 1, high] });
    }
    return i + 1;
  }
  function quickSort(low, high) {
    if (low >= high) return;
    const pi = partition(low, high);
    quickSort(low, pi - 1);
    quickSort(pi + 1, high);
  }
  quickSort(0, a.length - 1);
  return swaps;
}

export const ALGORITHMS = {
  bubble: {
    key: 'bubble',
    name: 'Bubble Sort',
    adjacentOnly: true,
    difficulty: 'Easy',
    world: 1,
    precomputeSteps: precomputeBubbleSortSteps,
  },
  selection: {
    key: 'selection',
    name: 'Selection Sort',
    adjacentOnly: false,
    difficulty: 'Medium',
    world: 2,
    precomputeSteps: precomputeSelectionSortSteps,
  },
  insertion: {
    key: 'insertion',
    name: 'Insertion Sort',
    adjacentOnly: true,
    difficulty: 'Medium',
    world: 3,
    precomputeSteps: precomputeInsertionSortSteps,
  },
  merge: {
    key: 'merge',
    name: 'Merge Sort',
    adjacentOnly: true,
    difficulty: 'Hard',
    world: 4,
    precomputeSteps: precomputeMergeSortSteps,
  },
  quick: {
    key: 'quick',
    name: 'Quick Sort',
    adjacentOnly: false,
    difficulty: 'Expert',
    world: 5,
    precomputeSteps: precomputeQuickSortSteps,
  },
};
