const PATTERNS = [
  { key: 'twoPointers', name: 'Two Pointers', icon: '⇔', color: '#3b82f6',
    desc: 'Move pointers toward each other. Sorted array + pair finding = Two Pointers.' },
  { key: 'binarySearch', name: 'Binary Search', icon: '◎', color: '#22c55e',
    desc: 'Eliminate half the search space each step by picking the midpoint.' },
  { key: 'hashing', name: 'Hashing', icon: '#', color: '#facc15',
    desc: 'Store seen values in a hash map for O(1) lookups.' },
  { key: 'slidingWindow', name: 'Sliding Window', icon: '▭', color: '#a855f7',
    desc: 'Expand/contract a window over contiguous data to find valid subarrays.' },
  { key: 'intervals', name: 'Intervals', icon: '═', color: '#ef4444',
    desc: 'Sort by start, then merge or schedule overlapping intervals.' },
  { key: 'bfsdfs', name: 'BFS / DFS', icon: '⊞', color: '#06b6d4',
    desc: 'Traverse graphs level-by-level (BFS) or depth-first (DFS).' },
  { key: 'dp', name: 'Dynamic Prog.', icon: '▲', color: '#f97316',
    desc: 'Solve subproblems first, build up to the full solution.' },
  { key: 'heap', name: 'Heap / Top-K', icon: '⏫', color: '#ec4899',
    desc: 'Use a heap to track the K largest/smallest without sorting everything.' },
];

const LEVELS = [];
function add(pattern, levels) { for (const l of levels) LEVELS.push({ pattern, ...l }); }

// ═══════════════════════════════════════════════════
// TWO POINTERS — 9 levels
// ═══════════════════════════════════════════════════
add('twoPointers', [
  {
    id: 'tp1', title: 'Two Sum II — Basics',
    desc: 'Sorted array [2,7,11,15], find the pair summing to 9. Start pointers at opposite ends.',
    data: { arr: [2, 7, 11, 15], target: 9 },
    steps: [
      { action: 'moveRight', explanation: 'arr[L]=2 + arr[R]=15 = 17 > 9. Sum too large. Since the array is sorted, moving R left gives a smaller sum. Key insight: when sum > target, decrease it by moving the right pointer left.', hint: '2+15=17 > 9. Which pointer moves to get a smaller sum?' },
      { action: 'moveRight', explanation: 'arr[L]=2 + arr[R]=11 = 13 > 9. Still too large. Move R left again.', hint: '2+11=13 > 9. Still too large — which pointer?' },
      { action: 'moveLeft', explanation: 'arr[L]=2 + arr[R]=7 = 9 = target! Found. When sum < target, we move L right to increase it. This is how Two Pointers finds pairs in O(n) time.', hint: '2+7=9 = target. Which pointer to confirm the pair?' },
    ],
  },
  {
    id: 'tp2', title: 'Two Sum II — Practice',
    desc: 'Find the pair summing to 12 in [1,3,4,5,7,11].',
    data: { arr: [1, 3, 4, 5, 7, 11], target: 12 },
    steps: [
      { action: 'moveRight', explanation: '1+11=12 = target! Found at indices 0 and 5. This problem directly applies Two Pointers whenever you see a sorted array and need to find a pair.', hint: '1+11=12 = target. Confirm the pair by moving the right pointer.' },
    ],
  },
  {
    id: 'tp3', title: 'Container With Most Water',
    desc: 'Heights [1,8,6,2,5,4,8,3,7]. Move the pointer at the SHORTER line.',
    data: { arr: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
    steps: [
      { action: 'moveLeft', explanation: 'L=0(h=1) vs R=8(h=7). Area = 1×8 = 8. The left line is shorter. Moving the shorter line might find a taller wall. Moving the taller one only decreases width.', hint: 'Left bar (1) is shorter. Which pointer to move?' },
      { action: 'moveRight', explanation: 'L=1(h=8) vs R=8(h=7). Area = 7×7 = 49. Right is shorter now.', hint: 'Right bar (7) is shorter now. Move which?' },
      { action: 'moveRight', explanation: 'L=1(8) vs R=7(3). Area = 3×6 = 18. Right is shorter.', hint: 'Right is shorter.' },
      { action: 'moveLeft', explanation: 'L=2(6) vs R=6(8). Area = 6×4 = 24. Left is shorter. Rule: always move the SHORTER line for potential area gain.', hint: 'Left (6) is shorter than right (8).' },
      { action: 'moveLeft', explanation: 'L=3(2) vs R=6(8). Area = 2×3 = 6.', hint: 'Left (2) is shorter.' },
      { action: 'moveLeft', explanation: 'L=4(5) vs R=6(8). Area = 5×2 = 10.', hint: 'Left (5) is shorter.' },
      { action: 'moveLeft', explanation: 'L=5(4) vs R=6(8). Area = 4×1 = 4.', hint: 'Left (4) is shorter.' },
      { action: 'moveRight', explanation: 'L=6(8) vs R=6(8). Equal heights, pointers meet. Max area = 49. Key takeaway: area is limited by the shorter line, so always try to improve it.', hint: 'Equal heights. Pointers meet.' },
    ],
  },
  {
    id: 'tp4', title: '3Sum — Find Triplets',
    desc: 'Find triplets summing to 0 in [-1,0,1,2,-1,-4]. Fix one element, then Two Pointers on the rest.',
    data: { arr: [-4, -1, -1, 0, 1, 2], target: 0 },
    steps: [
      { action: 'moveLeft', explanation: 'Fix i=0 (value -4). Need pair summing to 4 in [-1,-1,0,1,2]. L=-1+2=1 < 4, move L.', hint: 'i=-4. Target complement=4. L=-1+2=1 < 4. Move L or R?' },
      { action: 'moveRight', explanation: 'L=-1, R=2: sum=1 < 4. L=-1+1=2 < 4. L=0+1=1 < 4. L=1: L=-1→0→1, but 1+2=3 < 4. Keep going.', hint: 'Move L forward.' },
      { action: 'moveLeft', explanation: 'Sum still < 4. No triplet found for i=0. Move to i=1 (value -1). Need pair sum=1 in [-1,0,1,2]. L=-1+2=1! Found [-1,-1,2].', hint: 'i=-1. Complement=1. L=-1+2=1. Move L to confirm?' },
      { action: 'moveRight', explanation: 'Found [-1,-1,2]. Skip duplicates. i=2 (value -1) - same as i=1, skip. i=3 (value 0). Need pair sum=0 in [1,2]. L=1+2=3 > 0, move R.', hint: 'i=0. Complement=0. L=1+2=3 > 0. Move which?' },
      { action: 'moveRight', explanation: 'L=1, R=1. Pointers crossed. No more pairs. Triplets found: [-1,-1,2], [-1,0,1].', hint: 'Pointers met. Done.' },
    ],
  },
  {
    id: 'tp5', title: 'Valid Palindrome',
    desc: 'Check if "A man, a plan, a canal: Panama" is a palindrome. Compare from both ends, skip non-alphanumeric.',
    data: { str: 'A man, a plan, a canal: Panama' },
    steps: [
      { action: 'moveLeft', explanation: 'L=\'a\', R=\'a\'. Match! Advance both. Two Pointers from opposite ends handles palindrome checking in O(n) time and O(1) space.', hint: '\'a\' == \'a\'. Move both pointers.' },
      { action: 'moveLeft', explanation: 'Skip spaces, punctuation. L=\'m\', R=\'m\'. Match!', hint: '\'m\' == \'m\'.' },
      { action: 'moveLeft', explanation: 'L=\'a\', R=\'a\'. Match!', hint: '\'a\' == \'a\'.' },
      { action: 'moveLeft', explanation: 'L=\'n\', R=\'n\'. Match!', hint: '\'n\' == \'n\'.' },
      { action: 'moveLeft', explanation: 'L=\'a\', R=\'a\'. Match!', hint: '\'a\' == \'a\'.' },
      { action: 'moveLeft', explanation: 'L=\'p\', R=\'p\'. Match!', hint: '\'p\' == \'p\'.' },
      { action: 'moveRight', explanation: 'L=\'l\', R=\'l\'. Match!', hint: '\'l\' == \'l\'.' },
      { action: 'moveLeft', explanation: 'L=\'a\', R=\'a\'. Match!', hint: '\'a\' == \'a\'.' },
      { action: 'moveRight', explanation: 'L=\'n\', R=\'n\'. Match! Pointers crossed. It\'s a palindrome!', hint: '\'n\' == \'n\'. Done!' },
    ],
  },
  {
    id: 'tp6', title: 'Remove Duplicates from Sorted',
    desc: 'Remove duplicates in-place from [0,0,1,1,1,2,2,3,3,4]. Use slow/fast pointers.',
    data: { arr: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] },
    steps: [
      { action: 'moveLeft', explanation: 'Slow pointer at index 0 (value 0). Fast pointer at 1 (value 0). Duplicate! Fast advances without slow moving. Slow pointer tracks the position to overwrite.', hint: 'arr[1]=arr[0]=0. Duplicate found. Move fast pointer.' },
      { action: 'moveLeft', explanation: 'Fast=2 (value 1), Slow=1. New value! Copy arr[2] to arr[1], advance slow to 2. Slow/fast pointers are great for in-place array modification.', hint: 'arr[2]=1 ≠ arr[0]=0. New value! Copy it to slow position.' },
      { action: 'moveLeft', explanation: 'Fast=3 (value 1) == arr[1]=1. Duplicate. Fast advances.', hint: 'arr[3]=1, duplicate. Skip.' },
      { action: 'moveLeft', explanation: 'Fast=4 (value 1) == arr[1]. Duplicate. Fast=5 (value 2). New value! Copy to slow=2.', hint: 'Fast=5: value 2 is new. Copy to slow position.' },
      { action: 'moveLeft', explanation: 'Fast=6 (value 2) duplicate. Fast=7 (value 3). New! Copy to slow=3.', hint: 'Fast=7: value 3 is new. Copy.' },
      { action: 'moveLeft', explanation: 'Fast=8 (value 3) duplicate. Fast=9 (value 4). New! Copy to slow=4. Slow=4 means 5 unique elements: [0,1,2,3,4].', hint: 'Fast=9: value 4 is new. Copy. Done! Unique count = 5.' },
    ],
  },
  {
    id: 'tp7', title: 'Two Sum — Multiple Queries',
    desc: 'Sorted [1,2,3,4,5,6,7], find pairs summing to 8. Don\'t stop at one — find all unique pairs.',
    data: { arr: [1, 2, 3, 4, 5, 6, 7], target: 8 },
    steps: [
      { action: 'moveRight', explanation: '1+7=8! Found pair (1,7). When we find a match, move BOTH pointers and keep going. Two Pointers can find ALL pairs in O(n).', hint: '1+7=8. Found! Move both and continue.' },
      { action: 'moveLeft', explanation: '2+6=8! Found (2,6).', hint: '2+6=8. Found! Move both.' },
      { action: 'moveLeft', explanation: '3+5=8! Found (3,5).', hint: '3+5=8. Found!' },
      { action: 'moveRight', explanation: '4+4=8 but same element. Not allowed. Pointers cross. All pairs: (1,7), (2,6), (3,5). O(n) time for all pairs.', hint: '4+4=8 (same element). Pointers cross. Done.' },
    ],
  },
  {
    id: 'tp8', title: 'Trapping Rain Water',
    desc: 'Heights [3,0,2,0,4]. Total water trapped = 7. Move pointer at the smaller height inward.',
    data: { arr: [3, 0, 2, 0, 4], comparisonText: 'Move the pointer at the smaller height' },
    steps: [
      { action: 'moveLeft', explanation: 'L=0(h=3), R=4(h=4). Left is smaller. Process: maxLeft = max(0,3) = 3. No water yet (first wall on left). Advance L. Key insight: water level is limited by the smaller side.', hint: 'L=0 (3) < R=4 (4). Move L or R?' },
      { action: 'moveLeft', explanation: 'L=1(h=0), R=4(h=4). Left smaller. maxLeft=3 > h=0 → water = 3-0 = 3. Total=3. Advance L.', hint: 'h=0 < maxLeft=3. Water trapped! Move L.' },
      { action: 'moveLeft', explanation: 'L=2(h=2), R=4(h=4). Left smaller. maxLeft=3 > h=2 → water = 3-2 = 1. Total=4. Advance L.', hint: 'h=2 < 3. More water! Move L.' },
      { action: 'moveLeft', explanation: 'L=3(h=0), R=4(h=4). Left smaller. maxLeft=3 > h=0 → water = 3-0 = 3. Total=7. Pointers meet! Total trapped water = 7.', hint: 'h=0 < 3. Last cell. Water = 3. Done!' },
    ],
  },
  {
    id: 'tp9', title: '3Sum Closest',
    desc: 'Find sum closest to target=1 in [-1,2,1,-4]. Fix one element, two pointers on the rest.',
    data: { arr: [-4, -1, 1, 2], target: 1 },
    steps: [
      { action: 'moveLeft', explanation: 'Fix i=0(-4). L=1(-1), R=3(2). Sum=-4-1+2=-3. Diff from 1=4. arr[L]+arr[R]=1 < target-complement=5. Since sum < complement, move L up to increase total.', hint: 'Fix -4. Sum -3 < 1. Move L right?' },
      { action: 'moveRight', explanation: 'L=2(1), R=3(2). Sum=-4+1+2=-1. Diff=2. Still < 1. Move L.', hint: 'Sum=-1 < 1. Move L?' },
      { action: 'moveLeft', explanation: 'L=3, R=2. Crossed. No more pairs. Move to i=1(-1). L=2(1), R=3(2). Sum=-1+1+2=2. Diff=1. Best so far! sum > target (2>1), so move R down.', hint: 'Fix -1. Sum=2. Diff=1 (closest). Move R left?' },
      { action: 'moveRight', explanation: 'L=2, R=2. Crossed. Best sum=2 (closest to 1). The 3Sum family of problems fixes one element and uses two pointers on the remaining subarray.', hint: 'Done! Closest sum = 2.' },
    ],
  },
]);
add('binarySearch', [
  {
    id: 'bs1', title: 'Binary Search — Basics',
    desc: 'Sorted [1,3,5,7,9,11,13], find target 7.',
    data: { arr: [1, 3, 5, 7, 9, 11, 13], target: 7 },
    steps: [
      { action: 'pickMid', index: 3, explanation: 'Range [0..6], mid=3. arr[3]=7 = target! Found. Binary search eliminated the entire search space in one step. O(log n) instead of O(n).', hint: 'mid = index 3. Tap the bar at index 3.' },
    ],
  },
  {
    id: 'bs2', title: 'Binary Search — Multiple Steps',
    desc: 'Find target 10 in [2,4,6,8,10,12,14,16].',
    data: { arr: [2, 4, 6, 8, 10, 12, 14, 16], target: 10 },
    steps: [
      { action: 'pickMid', index: 3, explanation: 'mid=3, arr[3]=8 < 10. Target is in the RIGHT half. Eliminate indices 0-3 in one step.', hint: 'mid=3 (value 8). Tap it.' },
      { action: 'goRight', explanation: '8 < 10, search right half [4..7].', hint: '8 < 10. Go left or right?' },
      { action: 'pickMid', index: 5, explanation: 'mid=5, arr[5]=12 > 10. Target is in the LEFT half [4..4].', hint: 'mid=5 (value 12).' },
      { action: 'goLeft', explanation: '12 > 10, search left. Range now [4..4] — one element.', hint: '12 > 10. Go left?' },
      { action: 'pickMid', index: 4, explanation: 'arr[4]=10 = target! Found in 3 comparisons. Linear would take 5.', hint: 'mid=4 (value 10).' },
    ],
  },
  {
    id: 'bs3', title: 'Search in Rotated Array',
    desc: 'Rotated [4,5,6,7,0,1,2], find target 0.',
    data: { arr: [4, 5, 6, 7, 0, 1, 2], target: 0 },
    steps: [
      { action: 'pickMid', index: 3, explanation: 'mid=3, arr[3]=7. Left half [4..7] is sorted (4<5<6<7). Right half [7,0,1,2] has the rotation. One half is always normally sorted.', hint: 'mid=3 (value 7).' },
      { action: 'goRight', explanation: 'Target 0 < 4, not in left sorted half. Must be in right half. Key: check which half is sorted, then see if target belongs there.', hint: '0 < 4, not in left. Go right.' },
      { action: 'pickMid', index: 5, explanation: 'mid=5, arr[5]=1 > 0. Left part of right half.', hint: 'mid=5 (value 1).' },
      { action: 'goLeft', explanation: '1 > 0, go left.', hint: '1 > 0, go left.' },
      { action: 'pickMid', index: 4, explanation: 'arr[4]=0 = target! Found. Rotated array trick: compare target with the sorted half to narrow down.', hint: 'mid=4 (value 0). Found!' },
    ],
  },
  {
    id: 'bs4', title: 'Find First and Last Position',
    desc: 'Sorted [1,2,3,3,3,4,5], find first and last occurrence of target 3. Use two binary searches.',
    data: { arr: [1, 2, 3, 3, 3, 4, 5], target: 3 },
    steps: [
      { action: 'pickMid', index: 3, explanation: 'mid=3, arr[3]=3. But is it the FIRST 3? Check left. This is "find leftmost" — when we find a match, keep searching left.', hint: 'mid=3 (value 3). Could be earlier 3s. Search left for first occurrence.' },
      { action: 'goLeft', explanation: 'Search left half for the first 3.', hint: 'Search left for first occurrence.' },
      { action: 'pickMid', index: 1, explanation: 'mid=1, arr[1]=2 < 3. Go right.', hint: 'mid=1 (value 2) < 3. Go right.' },
      { action: 'goRight', explanation: '2 < 3, search right.', hint: 'Go right.' },
      { action: 'pickMid', index: 2, explanation: 'arr[2]=3, and arr[1]=2 < 3. This IS the first 3 (index 2). Now binary search for the LAST 3.', hint: 'mid=2 (value 3), and left neighbor is 2. First 3 found!' },
      { action: 'pickMid', index: 4, explanation: 'mid=4, arr[4]=3. Check right. This finds the last occurrence.', hint: 'mid=4 (value 3). Search right for last occurrence.' },
      { action: 'goRight', explanation: 'arr[5]=4 > 3, so index 4 is the last 3. Range: [2..4].', hint: 'arr[5]=4 > 3. So index 4 is the last 3.' },
    ],
  },
  {
    id: 'bs5', title: 'Find Peak Element',
    desc: 'Find any peak in [1,2,3,1]. A peak is greater than its neighbors. Binary search on the "slope".',
    data: { arr: [1, 2, 3, 1] },
    steps: [
      { action: 'pickMid', index: 1, explanation: 'mid=1, arr[1]=2. Compare with neighbor arr[2]=3. The slope is upward (2→3). When the slope is upward, the peak must be on the right.', hint: 'mid=1 (value 2). arr[2]=3 > 2. Slope is up. Peak is on which side?' },
      { action: 'goRight', explanation: 'Upward slope → peak is right. Now search [2..3].', hint: 'Peak is right. Go right.' },
      { action: 'pickMid', index: 2, explanation: 'mid=2, arr[2]=3 > arr[1]=2 AND > arr[3]=1. Peak found at index 2! The binary search on slope finds a peak in O(log n).', hint: 'mid=2 (value 3). Check neighbors: 3>2 and 3>1. It\'s a peak!' },
    ],
  },
  {
    id: 'bs6', title: 'Find Min in Rotated Sorted',
    desc: 'Find minimum element in rotated [4,5,6,7,0,1,2]. The minimum is the rotation point.',
    data: { arr: [4, 5, 6, 7, 0, 1, 2] },
    steps: [
      { action: 'pickMid', index: 3, explanation: 'mid=3, arr[3]=7. Compare with arr[high]=2. 7 > 2, so the minimum must be in the RIGHT half. The rotation point is where arr[i] > arr[i+1].', hint: 'mid=3 (value 7) > arr[high]=2. Min is in which half?' },
      { action: 'goRight', explanation: '7 > 2, min is in right half [4..6].', hint: 'Go right.' },
      { action: 'pickMid', index: 5, explanation: 'mid=5, arr[5]=1. Compare with arr[high]=2. 1 < 2, so maybe min. Check left half too for a smaller value.', hint: 'mid=5 (value 1) < 2. This could be the min. Check left.' },
      { action: 'goLeft', explanation: 'Search left half [4..4].', hint: 'Check left for smaller value.' },
      { action: 'pickMid', index: 4, explanation: 'arr[4]=0 < 1. This is the minimum! Found at index 4. O(log n) find min in rotated array.', hint: 'mid=4 (value 0). This is smaller than 1! Min found.' },
    ],
  },
  {
    id: 'bs7', title: 'Search in 2D Matrix',
    desc: 'Search target 3 in [[1,3,5,7],[10,11,16,20],[23,30,34,60]]. Treat as one sorted array.',
    data: { arr: [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], target: 3 },
    steps: [
      { action: 'pickMid', index: 5, explanation: 'mid=5 (global index). In 2D: row=5//4=1, col=5%4=1. Value=11 > 3. Go left.', hint: 'mid=5 (value 11) > 3. Go left.' },
      { action: 'goLeft', explanation: '11 > 3, search left half.', hint: 'Go left.' },
      { action: 'pickMid', index: 2, explanation: 'mid=2, row=0, col=2. Value=5 > 3. Go left.', hint: 'mid=2 (value 5) > 3. Go left.' },
      { action: 'goLeft', explanation: '5 > 3, go left.', hint: 'Go left.' },
      { action: 'pickMid', index: 0, explanation: 'mid=0. Value=1 < 3. Go right.', hint: 'mid=0 (value 1) < 3. Go right.' },
      { action: 'goRight', explanation: '1 < 3, go right.', hint: 'Go right.' },
      { action: 'pickMid', index: 1, explanation: 'arr[1]=3 = target! Found in O(log(mn)). The 2D matrix trick: treat as a 1D array and use row=mid//cols, col=mid%cols.', hint: 'mid=1 (value 3). Found!' },
    ],
  },
  {
    id: 'bs8', title: 'Search Insert Position',
    desc: 'Find where target 2 goes in [1,3,5,6]. Binary search narrows down to the insert index.',
    data: { arr: [1, 3, 5, 6], target: 2 },
    steps: [
      { action: 'pickMid', index: 1, explanation: 'mid=1, arr[1]=3 > 2. Target is smaller. Search the LEFT half.', hint: 'mid=1 (value 3) > 2. Go left?' },
      { action: 'goLeft', explanation: 'Range [0..0] — one element left.', hint: '3 > 2. Go left.' },
      { action: 'pickMid', index: 0, explanation: 'mid=0, arr[0]=1 < 2. Target should go AFTER this. Range ended. Insert at index 1 (between 1 and 3). O(log n) finds the position.', hint: 'mid=0 (value 1) < 2. Insert at index 1.' },
      { action: 'goRight', explanation: '1 < 2, search right half. Range [1..0] — empty. Insert at index 1.', hint: '1 < 2. Go right. Range empty. Insert at 1.' },
    ],
  },
  {
    id: 'bs9', title: 'Valid Perfect Square',
    desc: 'Is 16 a perfect square? Binary search on squares [1,4,9,16,25].',
    data: { arr: [1, 4, 9, 16, 25], target: 16 },
    steps: [
      { action: 'pickMid', index: 2, explanation: 'mid=2 (value 9). 9 < 16. Target is larger. Search the RIGHT half.', hint: 'mid=2 (9) < 16. Go right?' },
      { action: 'goRight', explanation: '9 < 16, search right half [3..4].', hint: 'Go right.' },
      { action: 'pickMid', index: 3, explanation: 'mid=3 (value 16). 16 = 16! It\'s a perfect square. Binary search finds it in O(log n) without needing sqrt().', hint: 'mid=3 (value 16) = target. Perfect square!' },
    ],
  },
]);

// ═══════════════════════════════════════════════════
// HASHING — 9 levels
// ═══════════════════════════════════════════════════
// BINARY SEARCH — 9 levels
// ═══════════════════════════════════════════════════
add('hashing', [
  {
    id: 'hs1', title: 'Two Sum — Hash Map',
    desc: 'Find pair summing to 10 in [3,7,2,8,1].',
    data: { arr: [3, 7, 2, 8, 1], target: 10 }, steps: [
      { action: 'pickPair', indices: [1, 3], explanation: '7 + 3 = 10. The hash map approach: iterate once, for each num check if (target - num) is in the map. If yes → found. If no → store num. O(n) time, O(n) space.', hint: 'Tap the two numbers summing to 10.' },
    ],
  },
  {
    id: 'hs2', title: 'Two Sum — Practice',
    desc: 'Find pair summing to 15 in [4,6,2,9,5,10].',
    data: { arr: [4, 6, 2, 9, 5, 10], target: 15 }, steps: [
      { action: 'pickPair', indices: [3, 5], explanation: '9 + 6 = 15. The map stored 6 at index 1. When we reach 9 at index 3, we find 15-9=6 in the map. One pass, O(n).', hint: 'Tap two numbers summing to 15.' },
    ],
  },
  {
    id: 'hs3', title: 'Contains Duplicate',
    desc: 'Find the duplicate value in [5,2,8,2,9].',
    data: { arr: [5, 2, 8, 2, 9] }, steps: [
      { action: 'pickDuplicate', index: 3, explanation: 'Value 2 appears at indices 1 and 3. With a hash set: if we\'ve already seen a value when re-encountering it, it\'s a duplicate. O(n) instead of O(n²).', hint: 'One value appears twice. Tap its second occurrence.' },
    ],
  },
  {
    id: 'hs4', title: 'Group Anagrams',
    desc: 'Group anagrams from ["eat","tea","tan","ate","nat","bat"]. Anagrams share the same sorted character key.',
    data: { words: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, steps: [
      { action: 'pickPair', indices: [0, 1], explanation: '"eat" and "tea" both sort to "aet". The hash map groups them by sorted key.', hint: 'Tap two anagrams.' },
      { action: 'pickPair', indices: [2, 4], explanation: '"tan" and "nat" both sort to "ant". Third group: "bat". Hash map key = sorted string. Groups: [[eat,tea,ate],[tan,nat],[bat]].', hint: 'Tap two more anagrams.' },
    ],
  },
  {
    id: 'hs5', title: 'Subarray Sum Equals K',
    desc: 'Count subarrays summing to 3 in [1,2,1,2,1]. Track prefix sums in a hash map.',
    data: { arr: [1, 2, 1, 2, 1], target: 3 }, steps: [
      { action: 'pickDuplicate', index: 3, explanation: 'Prefix sums: [0,1,3,4,6,7]. At each step, we need prefix(i) - k in the map. For k=3: prefix[2]=3→count(0)=1. prefix[4]=6→count(3)=1. prefix[5]=7→count(4)=1. Answer: 3 subarrays ([1,2], [2,1], [1,2]). The hash map stores prefix sum frequencies.', hint: 'Count how many prefix differences equal 3.' },
    ],
  },
  {
    id: 'hs6', title: 'Longest Consecutive Sequence',
    desc: 'Find longest consecutive sequence in [100,4,200,1,3,2]. Use a hash set for O(1) lookups.',
    data: { arr: [100, 4, 200, 1, 3, 2] }, steps: [
      { action: 'pickDuplicate', index: 3, explanation: 'Put all numbers in a hash set. For each number, check if num-1 exists (start of a sequence). If not, count consecutive numbers: 1→2→3→4 (length 4). 100 (length 1), 200 (length 1). Longest: 4. O(n) time.', hint: 'Which number starts the longest consecutive sequence? Tap the start.' },
    ],
  },
  {
    id: 'hs7', title: 'Intersection of Two Arrays',
    desc: 'Find common elements in [1,2,2,1] and [2,2]. Return unique intersections.',
    data: { arr: [1, 2, 2, 1], target: 2 }, steps: [
      { action: 'pickDuplicate', index: 1, explanation: 'Store [1,2,2,1] in a hash set → {1,2}. Then iterate [2,2] and check membership. Result: [2]. Hash set gives O(n+m) time instead of O(n×m).', hint: 'What number appears in both arrays? Tap it.' },
    ],
  },
  {
    id: 'hs8', title: 'Valid Anagram',
    desc: 'Are "listen" and "silent" anagrams? Tap the two matching words.',
    data: { words: ['listen', 'silent', 'hello', 'world'] },
    steps: [
      { action: 'pickPair', indices: [0, 1], explanation: '"listen" and "silent" both sort to "eilnst". The hash map approach: count character frequencies for each string. If every character has the same count, they\'re anagrams. O(n) time.', hint: 'Tap two words that are anagrams.' },
    ],
  },
  {
    id: 'hs9', title: 'Contains Duplicate II',
    desc: 'Is there a duplicate within distance k=3 in [1,2,3,1,4,5]?',
    data: { arr: [1, 2, 3, 1, 4, 5] },
    steps: [
      { action: 'pickDuplicate', index: 3, explanation: 'Value 1 appears at index 0 and index 3. Distance = 3 ≤ k=3. Use a hash map storing the last seen index of each value. If value seen before and distance ≤ k, return true. O(n) time.', hint: 'One value repeats within 3 steps. Tap its second occurrence.' },
    ],
  },
]);
add('slidingWindow', [
  {
    id: 'sw1', title: 'Max Sum Subarray of Size K',
    desc: 'Find subarray of size 3 with max sum in [2,5,1,8,3,9,1].',
    data: { arr: [2, 5, 1, 8, 3, 9, 1], k: 3 }, steps: [
      { action: 'advance', explanation: 'Window [2,5,1]=8. Slide right: subtract arr[0]=2, add arr[3]=8. New sum = 8-2+8=14. O(n) instead of O(n·k).', hint: 'Current sum=8. Slide right.' },
      { action: 'advance', explanation: 'Window [5,1,8]=14. Best=14.', hint: 'Sum=14. Slide right.' },
      { action: 'advance', explanation: 'Window [1,8,3]=12. Best still 14.', hint: 'Sum=12. Slide right.' },
      { action: 'advance', explanation: 'Window [8,3,9]=20. New best!', hint: 'Sum=20. Slide right.' },
      { action: 'advance', explanation: 'Window [3,9,1]=13. Max=20 at [8,3,9]. Sliding window: O(n) by reusing the previous sum.', hint: 'Sum=13. Done!' },
    ],
  },
  {
    id: 'sw2', title: 'Longest Unique Substring',
    desc: 'Longest substring without repeats in "abcabcbb".',
    data: { str: 'abcabcbb' }, steps: [
      { action: 'expand', explanation: 'Window: "a". Unique.', hint: 'Expand.' },
      { action: 'expand', explanation: 'Window: "ab". Unique.', hint: 'Expand.' },
      { action: 'expand', explanation: 'Window: "abc". Length 3, all unique.', hint: 'Expand.' },
      { action: 'shrink', explanation: 'Next "a" repeats. Shrink from left until "a" is gone. Track last index of each char in a hash map to shrink efficiently.', hint: '"a" repeats! Shrink left.' },
      { action: 'expand', explanation: 'Window: "bca". Length 3.', hint: 'Expand.' },
      { action: 'shrink', explanation: '"b" repeats. Shrink.', hint: '"b" repeats. Shrink.' },
      { action: 'expand', explanation: 'Window: "cab". Length 3.', hint: 'Expand.' },
      { action: 'shrink', explanation: '"c" repeats. Shrink. Max length = 3.', hint: '"c" repeats. Shrink. Max=3.' },
    ],
  },
  {
    id: 'sw3', title: 'Minimum Window Substring',
    desc: 'Find min window in "ADOBECODEBANC" containing all chars of "ABC".',
    data: { str: 'ADOBECODEBANC', target: 'ABC' }, steps: [
      { action: 'expand', explanation: 'Window expands until it contains all target chars. Need: {A:1,B:1,C:1}.', hint: 'Expand to find all characters.' },
      { action: 'expand', explanation: 'Still expanding. Window needs to cover A, B, and C.', hint: 'Keep expanding.' },
      { action: 'expand', explanation: 'Still expanding...', hint: 'Expand more.' },
      { action: 'expand', explanation: 'Window "ADOBEC" has all three! Now shrink from left to minimize.', hint: 'All chars found! Shrink from left.' },
      { action: 'shrink', explanation: 'Shrink left past redundant chars. "DOBEC" — still has all. "OBEC" — lost A, stop. Best: "ADOBEC".', hint: 'Keep shrinking until we lose a required char.' },
      { action: 'expand', explanation: 'Expand right to find A again. "OBECODEBA" — has all. Shrink left.', hint: 'Expand to find A again.' },
      { action: 'shrink', explanation: 'Shrink left: "CODEBA" → "ODEBA" → "DEBA" → "EBA" — lost C. Min window so far: "BANC" (length 4). Final answer!', hint: 'Shrink left as much as possible.' },
    ],
  },
  {
    id: 'sw4', title: 'Longest Repeating Char Replacement',
    desc: 'Longest substring with all same chars after 2 replacements in "AABABBA".',
    data: { str: 'AABABBA', k: 2 }, steps: [
      { action: 'expand', explanation: 'Window "AA": most freq char = A(2), replacements used = 0. Valid. When (window size - max freq) ≤ K, we can replace the rest.', hint: 'Expand window "AA".' },
      { action: 'expand', explanation: 'Window "AAB": freq A=2, B=1. Size=3, maxFreq=2. Need 1 replacement ≤ K=2. Valid!', hint: 'Expand to "AAB".' },
      { action: 'expand', explanation: 'Window "AABA": freq A=3, B=1. Size=4, maxFreq=3. Need 1 ≤ 2. Valid!', hint: 'Expand to "AABA".' },
      { action: 'expand', explanation: 'Window "AABAB": A=3, B=2. Size=5, maxFreq=3. Need 2 ≤ 2. Valid! Best so far: 5.', hint: 'Expand to "AABAB".' },
      { action: 'shrink', explanation: 'Window "AABABB": A=3, B=3. Size=6, maxFreq=3. Need 3 > 2. Invalid! Shrink left.', hint: 'Need 3 > K=2. Shrink.' },
      { action: 'shrink', explanation: 'Window "ABABB": A=2, B=3. Size=5, maxFreq=3. Need 2 ≤ 2. Valid but best still 5.', hint: 'Now valid. Keep shrinking or expand?' },
    ],
  },
  {
    id: 'sw5', title: 'Permutation in String',
    desc: 'Does "ab" appear as a permutation in "eidbaooo"? Check with a fixed-size window.',
    data: { str: 'eidbaooo', target: 'ab' }, steps: [
      { action: 'advance', explanation: 'Window "ei": freq {e:1,i:1} vs target {a:1,b:1}. No match. Slide.', hint: '"ei" ≠ "ab". Slide right.' },
      { action: 'advance', explanation: 'Window "id": {i:1,d:1}. No.', hint: 'Slide.' },
      { action: 'advance', explanation: 'Window "db": {d:1,b:1}. No.', hint: 'Slide.' },
      { action: 'advance', explanation: 'Window "ba": {b:1,a:1}. Matches "ab"! Permutation found at index 2. Fixed-size sliding window: slide and compare character frequency maps.', hint: '"ba" matches "ab"! Found!' },
    ],
  },
  {
    id: 'sw6', title: 'Max Consecutive 1s (Flip K)',
    desc: 'Longest subarray of 1s after flipping at most 2 zeros in [1,1,0,0,1,1,1,0,1].',
    data: { arr: [1, 1, 0, 0, 1, 1, 1, 0, 1], k: 2 }, steps: [
      { action: 'expand', explanation: 'Window [1,1]: zeros=0 ≤ 2. Valid. Expand.', hint: 'Expand [1,1].' },
      { action: 'expand', explanation: '[1,1,0]: zeros=1 ≤ 2.', hint: 'Expand.' },
      { action: 'expand', explanation: '[1,1,0,0]: zeros=2 = K. Exactly K flips used.', hint: 'Expand — zeros=2 = K.' },
      { action: 'shrink', explanation: '[1,1,0,0,1]: zeros=2, size=5. Still valid. But [1,1,0,0,1,1] is even longer! Actually wait, let\'s track zeros: [0,0,1,1,1] zeros=2, size=5. Try expanding more.', hint: 'Zeros=2 ≤ 2, keep expanding.' },
      { action: 'expand', explanation: 'Next 0 pushes zeros to 3 > K. Shrink left until zeros ≤ K. Max length found = 6 (three 1s + two flipped 0s + one more 1).', hint: 'Zeros=3 > K. Shrink.' },
    ],
  },
  {
    id: 'sw7', title: 'Sliding Window Maximum',
    desc: 'Find max in each window of size 3 in [1,3,-1,-3,5,3,6,7]. Use a deque for O(n).',
    data: { arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, steps: [
      { action: 'advance', explanation: 'Window [1,3,-1]: max=3. Deque stores indices of elements in decreasing order.', hint: 'Window max = 3. Slide.' },
      { action: 'advance', explanation: '[3,-1,-3]: max=3. Slide: remove 1, add -3.', hint: 'Max = 3. Slide.' },
      { action: 'advance', explanation: '[-1,-3,5]: max=5. Deque: when adding 5, remove all smaller elements from the back first.', hint: 'Max = 5. Slide.' },
      { action: 'advance', explanation: '[-3,5,3]: max=5. Deque maintains decreasing order.', hint: 'Max = 5. Slide.' },
      { action: 'advance', explanation: '[5,3,6]: max=6. The deque approach maintains O(n) overall — each element added/removed once.', hint: 'Max = 6. Slide.' },
      { action: 'advance', explanation: '[3,6,7]: max=7. Results: [3,3,5,5,6,7].', hint: 'Max = 7. Done!' },
    ],
  },
  {
    id: 'sw8', title: 'Maximum Avg Subarray I',
    desc: 'Find max average subarray of size 4 in [1,12,-5,-6,50,3].',
    data: { arr: [1, 12, -5, -6, 50, 3], k: 4 },
    steps: [
      { action: 'advance', explanation: 'Window [1,12,-5,-6]=2. Avg=0.5. Slide right: subtract 1, add 50. New sum=12-5-6+50=51. Avg=12.75.', hint: 'Sum=2. Slide right.' },
      { action: 'advance', explanation: 'Window [12,-5,-6,50]=51. Avg=12.75. Best=12.75.', hint: 'Sum=51. Slide.' },
      { action: 'advance', explanation: 'Window [-5,-6,50,3]=42. Avg=10.5. Best still 12.75. O(n) sliding window calculates each sum in O(1) by adding the new and subtracting the old.', hint: 'Sum=42. Slide. Max avg = 12.75.' },
    ],
  },
  {
    id: 'sw9', title: 'Fruit Into Baskets',
    desc: 'Longest subarray with at most 2 distinct types in [1,2,1,2,3]. Expand until 3 types, then shrink.',
    data: { arr: [1, 2, 1, 2, 3] },
    steps: [
      { action: 'expand', explanation: 'Window [1]: 1 type ≤ 2. Expand.', hint: '1 distinct type. Expand?' },
      { action: 'expand', explanation: 'Window [1,2]: 2 types = K. Valid.', hint: '2 distinct types. Expand?' },
      { action: 'expand', explanation: 'Window [1,2,1]: 2 types. Length=3.', hint: 'Still 2 types. Expand?' },
      { action: 'expand', explanation: 'Window [1,2,1,2]: 2 types. Length=4. Max so far.', hint: 'Still 2 types. Expand?' },
      { action: 'expand', explanation: 'Window [1,2,1,2,3]: 3 types > K! Must shrink.', hint: '3 types > K! Shrink?' },
      { action: 'shrink', explanation: 'Window [2,1,2,3]: still 3 types. Shrink more.', hint: 'Still 3 types. Shrink?' },
      { action: 'shrink', explanation: 'Window [1,2,3]: still 3 types.', hint: 'Still 3 types. Shrink?' },
      { action: 'shrink', explanation: 'Window [2,3]: 2 types = K. Max length = 4. Sliding window with expand/shrink handles this in O(n).', hint: '2 types. Max = 4!' },
    ],
  },
]);
add('intervals', [
  {
    id: 'in1', title: 'Merge Intervals',
    desc: 'Merge [[1,3],[2,6],[8,10],[15,18]].',
    data: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, steps: [
      { action: 'merge', indices: [0, 1], explanation: '[1,3] and [2,6] overlap (2≤3). Merge to [1,6]. Key: sort by start time first, then greedily merge when start of current ≤ end of merged.', hint: 'Tap the two overlapping intervals.' },
      { action: 'next', explanation: '[1,6] vs [8,10]: 8>6, no overlap. Keep [1,6].', hint: 'No overlap. Next.' },
      { action: 'next', explanation: '[8,10] vs [15,18]: no overlap. Result: [[1,6],[8,10],[15,18]].', hint: 'No overlap. Done.' },
    ],
  },
  {
    id: 'in2', title: 'Non-Overlapping Intervals',
    desc: 'Remove minimum to make rest non-overlapping: [[1,2],[2,3],[3,4],[1,3]].',
    data: { intervals: [[1,2],[2,3],[3,4],[1,3]] }, steps: [
      { action: 'keep', indices: [0], explanation: 'Sorted by end: [1,2] ends earliest. Keep it. Greedy: always keep the interval that ends earliest for maximum remaining space.', hint: 'Keep [1,2] (ends earliest).' },
      { action: 'keep', indices: [1], explanation: '[2,3]: starts at 2 ≥ 2. No overlap. Keep.', hint: '[2,3] doesn\'t overlap. Keep?' },
      { action: 'keep', indices: [2], explanation: '[3,4]: starts at 3 ≥ 3. Keep.', hint: 'Keep [3,4]?' },
      { action: 'remove', indices: [3], explanation: '[1,3] overlaps with kept intervals. Remove it. Minimum removals=1. The greedy "earliest end" strategy guarantees optimal minimum removals.', hint: '[1,3] overlaps. Remove?' },
    ],
  },
  {
    id: 'in3', title: 'Insert Interval',
    desc: 'Insert [4,8] into non-overlapping [[1,2],[3,5],[6,7],[8,10],[12,16]].',
    data: { intervals: [[1,2],[3,5],[6,7],[8,10],[12,16]] }, steps: [
      { action: 'keep', indices: [0], explanation: '[1,2] ends before new interval starts (2<4). Keep as-is.', hint: '[1,2]: before [4,8]. Keep?' },
      { action: 'next', explanation: '[3,5] overlaps with [4,8]. Merge: min(3,4)=3, max(5,8)=8. New: [3,8].', hint: 'Overlap! Merge [3,5] with [4,8].' },
      { action: 'next', explanation: '[6,7] is inside [3,8]. Keep [3,8].', hint: '[6,7] inside [3,8]. Skip.' },
      { action: 'next', explanation: '[8,10] overlaps with [3,8]. Extend to [3,10].', hint: '[8,10] touches [3,8]. Merge to [3,10].' },
      { action: 'keep', indices: [4], explanation: '[12,16] starts after [3,10] ends. Keep as-is. Result: [[1,2],[3,10],[12,16]].', hint: '[12,16]: after [3,10]. Keep.' },
    ],
  },
  {
    id: 'in4', title: 'Meeting Rooms',
    desc: 'Can a person attend all meetings? [[0,30],[5,10],[15,20]]. Check for any overlaps.',
    data: { intervals: [[0,30],[5,10],[15,20]] }, steps: [
      { action: 'merge', indices: [0, 1], explanation: 'Sorted by start: [0,30] and [5,10]: 5<30, overlap! Can\'t attend both. This is simply checking if any interval starts before the previous one ends.', hint: 'Do [0,30] and [5,10] overlap?' },
    ],
  },
  {
    id: 'in5', title: 'Minimum Meeting Rooms',
    desc: 'How many rooms needed for [[0,30],[5,10],[15,20]]? Sweep line: track starts and ends.',
    data: { intervals: [[0,30],[5,10],[15,20]] }, steps: [
      { action: 'keep', indices: [0], explanation: 'Separate starts and ends. Sort all. Room count += at start, -= at end. Max count = min rooms needed. Here: start→1, start→2, end→1, start→2, end→1, end→0. Max=2 rooms.', hint: 'Track running count of active meetings.' },
    ],
  },
  {
    id: 'in6', title: 'Interval List Intersections',
    desc: 'Find intersection of [[0,2],[5,10],[13,23]] and [[1,5],[8,12],[15,24]].',
    data: { intervals: [[0,2],[5,10],[13,23],[1,5],[8,12],[15,24]] }, steps: [
      { action: 'merge', indices: [0, 3], explanation: 'First list A: [[0,2],[5,10],[13,23]]. Second list B: [[1,5],[8,12],[15,24]]. Compare A[0]=[0,2] and B[0]=[1,5]. Intersection = [1,2]. Advance the one ending earlier (A).', hint: 'Find overlap of A[0]=[0,2] and B[0]=[1,5]. Intersection = [1,2]!' },
      { action: 'next', explanation: 'A[1]=[5,10] vs B[0]=[1,5]. Intersection = [5,5] (a point). Advance B.', hint: '[5,10] vs [1,5]. Intersection = [5,5].' },
      { action: 'next', explanation: 'A[1]=[5,10] vs B[1]=[8,12]. Intersection = [8,10]. Advance A.', hint: 'Intersection = [8,10].' },
      { action: 'next', explanation: 'A[2]=[13,23] vs B[1]=[8,12]. No intersection (13>12). Advance B.', hint: 'No overlap (13>12).' },
      { action: 'next', explanation: 'A[2]=[13,23] vs B[2]=[15,24]. Intersection = [15,23]. Advance A. Done. Result: [[1,2],[5,5],[8,10],[15,23]].', hint: 'Intersection = [15,23]. Done!' },
    ],
  },
  {
    id: 'in7', title: 'Min Arrows to Burst Balloons',
    desc: 'Burst all balloons [[10,16],[2,8],[1,6],[7,12]] with minimum arrows. Sort by end, then shoot.',
    data: { intervals: [[1,6],[2,8],[7,12],[10,16]] },
    steps: [
      { action: 'keep', indices: [0], explanation: 'Sorted by end: [1,6] ends earliest. Place arrow at x=6. Burst [1,6]. Greedy: always shoot at the earliest ending balloon.', hint: 'Tap the balloon to burst at its end (6).' },
      { action: 'next', explanation: '[2,8]: starts at 2 ≤ 6. Same arrow bursts it! No new arrow needed.', hint: 'Overlaps with arrow at 6. One arrow does both.' },
      { action: 'next', explanation: '[7,12]: starts at 7 > 6. Need a new arrow. Place at x=12.', hint: '7 > 6. New arrow needed at 12.' },
      { action: 'next', explanation: '[10,16]: starts at 10 ≤ 12. Same arrow bursts it. Total: 2 arrows. Greedy by end = minimum arrows.', hint: '10 ≤ 12. Same arrow. Total: 2 arrows.' },
    ],
  },
]);
add('bfsdfs', [
  {
    id: 'bf1', title: 'DFS — Number of Islands',
    desc: 'Count islands in [["1","1","0"],["1","1","0"],["0","0","1"]]. Tap cells in DFS order.',
    data: { grid: [['1','1','0'],['1','1','0'],['0','0','1']] }, steps: [
      { action: 'visit', row: 0, col: 0, explanation: 'Found land at (0,0). DFS explores depth-first: go as far as possible in one direction before backtracking.', hint: 'Tap (0,0) to start DFS.' },
      { action: 'visit', row: 0, col: 1, explanation: 'Move right to (0,1) — still land.', hint: 'Next adjacent land.' },
      { action: 'visit', row: 1, col: 0, explanation: 'No more land right, backtrack and go down to (1,0).', hint: 'Go down to (1,0).' },
      { action: 'visit', row: 1, col: 1, explanation: 'Visit (1,1). Island 1 complete. Island count=1.', hint: 'Visit (1,1).' },
      { action: 'visit', row: 2, col: 2, explanation: 'New island at (2,2). Count=2. DFS completed.', hint: 'Tap the isolated land cell.' },
    ],
  },
  {
    id: 'bf2', title: 'BFS — Level Order Traversal',
    desc: 'Traverse tree level by level: [1,2,3,4]. Tap nodes in BFS order.',
    data: { tree: { val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: { val: 4, left: null, right: null }, right: null } } }, steps: [
      { action: 'visit', node: 1, explanation: 'BFS uses a QUEUE (FIFO). Enqueue root 1. Visit it, enqueue children.', hint: 'Visit root 1.' },
      { action: 'visit', node: 2, explanation: 'Dequeue 2. Visit it. Queue: [3].', hint: 'Visit 2.' },
      { action: 'visit', node: 3, explanation: 'Dequeue 3. Visit it. Enqueue child 4. Queue: [4].', hint: 'Visit 3.' },
      { action: 'visit', node: 4, explanation: 'Dequeue 4. Visit it. BFS order: [1,2,3,4]. BFS=queue(FIFO), DFS=stack(LIFO).', hint: 'Visit 4. Done!' },
    ],
  },
  {
    id: 'bf3', title: 'Clone Graph',
    desc: 'Clone a graph with 4 nodes. BFS/DFS both work — track visited nodes in a hash map.',
    data: { tree: { val: 1, neighbors: [{ val: 2, neighbors: [{ val: 4, neighbors: [] }, { val: 3, neighbors: [] }] }] } }, steps: [
      { action: 'visit', node: 1, explanation: 'Start BFS from node 1. Create clone 1. Map: {1→clone1}. Enqueue neighbors.', hint: 'Visit/clone node 1.' },
      { action: 'visit', node: 2, explanation: 'Dequeue 2. Clone 2. Map: {1→c1, 2→c2}. Connect c1→c2.', hint: 'Clone and connect node 2.' },
      { action: 'visit', node: 3, explanation: 'Dequeue 3. Clone 3. Connect c1→c3.', hint: 'Clone node 3.' },
      { action: 'visit', node: 4, explanation: 'Dequeue 4. Clone 4. Connect c2→c4, c2→c3. Graph cloned! The hash map ensures we don\'t clone nodes twice.', hint: 'Clone node 4. Graph cloned!' },
    ],
  },
  {
    id: 'bf4', title: 'BFS — Rotting Oranges',
    desc: 'In [[2,1,1],[1,1,0],[0,1,1]], all oranges rot in 4 mins. BFS from all rotten oranges.',
    data: { grid: [['2','1','1'],['1','1','0'],['0','1','1']] }, steps: [
      { action: 'visit', row: 0, col: 0, explanation: 'Rotten orange at (0,0). BFS: enqueue all rotten oranges first. Minute 0.', hint: 'Rotten orange at (0,0). BFS starts here.' },
      { action: 'visit', row: 0, col: 1, explanation: 'Minute 1: (0,0) rots (0,1) and (1,0).', hint: '(0,0) rots neighbor (0,1).' },
      { action: 'visit', row: 1, col: 0, explanation: 'Minute 1: also rots (1,0).', hint: '(0,0) also rots (1,0).' },
      { action: 'visit', row: 0, col: 2, explanation: 'Minute 2: (0,1) rots (0,2). (1,0) rots (1,1).', hint: 'Minute 2: (0,1) rots (0,2).' },
      { action: 'visit', row: 1, col: 1, explanation: 'Minute 2: (1,0) rots (1,1).', hint: 'Minute 2: (1,0) rots (1,1).' },
      { action: 'visit', row: 2, col: 2, explanation: 'Minute 3: (1,1) rots (2,1) — wait, (2,1) is 1! Minute 3: (2,1) rots (2,2). Minute 4: all rotten! Total: 4 minutes.', hint: 'Minute 4: all rotten!' },
    ],
  },
  {
    id: 'bf5', title: 'DFS — Word Search',
    desc: 'Find "ABCCED" in the grid [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]. DFS + backtracking.',
    data: { grid: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCCED' }, steps: [
      { action: 'visit', row: 0, col: 0, explanation: 'Start DFS from (0,0)=A. Matches first char \'A\'. Mark visited, explore neighbors.', hint: 'A matches \'A\'. Start here.' },
      { action: 'visit', row: 0, col: 1, explanation: '(0,1)=B matches. Visit.', hint: 'B matches.' },
      { action: 'visit', row: 0, col: 2, explanation: '(0,2)=C matches.', hint: 'C matches.' },
      { action: 'visit', row: 1, col: 2, explanation: '(1,2)=C matches \'C\'.', hint: 'C matches.' },
      { action: 'visit', row: 2, col: 2, explanation: '(2,2)=E matches \'E\'.', hint: 'E matches.' },
      { action: 'visit', row: 2, col: 1, explanation: '(2,1)=D matches \'D\'. Word "ABCCED" found! DFS backtracking: try each direction, backtrack if wrong path.', hint: 'D matches. Word found!' },
    ],
  },
  {
    id: 'bf6', title: 'Course Schedule (Topological Sort)',
    desc: 'Can you finish 4 courses with prerequisites [[1,0],[2,0],[3,1],[3,2]]? BFS with in-degree counting.',
    data: { grid: [['0','0','0','0'],['1','1','1','1']] }, steps: [
      { action: 'visit', row: 0, col: 0, explanation: 'Course 0 has no prerequisites. Start with it (in-degree=0). This is Kahn\'s algorithm: BFS over courses with in-degree tracking.', hint: 'Course 0 has no prereqs. Take it.' },
      { action: 'visit', row: 1, col: 0, explanation: 'After taking 0, courses 1 and 2 now have no remaining prereqs. Take 1.', hint: 'Course 1 is now available. Take it.' },
      { action: 'visit', row: 2, col: 0, explanation: 'Take course 2.', hint: 'Take 2.' },
      { action: 'visit', row: 3, col: 0, explanation: 'Course 3 now has all prereqs done. Take it. All courses taken! No cycle. If there were a cycle, some courses would never reach in-degree 0.', hint: 'Take 3. All done! No cycle detected.' },
    ],
  },
  {
    id: 'bf7', title: 'Pacific Atlantic Water Flow',
    desc: 'Find cells that can flow to both Pacific (top/left) and Atlantic (bottom/right) in this 4×4 grid. Heights shown.',
    data: { grid: [['1','2','2','3'],['3','2','3','4'],['2','4','5','3'],['6','7','1','4']] },
    steps: [
      { action: 'visit', row: 0, col: 0, explanation: 'Start DFS from Pacific edge. (0,0) touches Pacific. Water flows from higher to equal/lower neighbors. Mark as Pacific-reachable.', hint: 'Visit (0,0) on Pacific edge.' },
      { action: 'visit', row: 0, col: 1, explanation: '(0,1) height 2 ≥ 1. Water from (0,0) can flow here. Pacific-reachable.', hint: 'Flow to (0,1).' },
      { action: 'visit', row: 0, col: 2, explanation: '(0,2) height 2 ≥ 2. Reachable.', hint: 'Visit (0,2).' },
      { action: 'visit', row: 0, col: 3, explanation: '(0,3) height 3 ≥ 2. Top edge touches Pacific. Marked.', hint: 'Visit (0,3).' },
      { action: 'visit', row: 3, col: 0, explanation: 'Also DFS from Atlantic edge. (3,0) touches Atlantic. Mark Atlantic-reachable. Cells marked by BOTH → answer.', hint: 'Start from Atlantic edge at (3,0).' },
      { action: 'visit', row: 3, col: 1, explanation: '(3,1) Atlantic-reachable. Cells reachable from both oceans are the high points that split the flow.', hint: 'Flow to (3,1).' },
    ],
  },
  {
    id: 'bf8', title: 'Surrounded Regions',
    desc: 'Capture all O\'s surrounded by X in this board. Border O\'s and connected ones survive.',
    data: { grid: [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']] },
    steps: [
      { action: 'visit', row: 1, col: 1, explanation: 'Check border O\'s first. (3,1) is a border O — it can\'t be captured. DFS marks all O\'s connected to border.', hint: 'Border O at (3,1) is safe.' },
      { action: 'visit', row: 1, col: 2, explanation: 'Mark (1,2): connected to border O? No. (3,1) is not directly connected to (1,2). Actually, let\'s see... (1,1) connects to (1,2) and (2,2). Chain: (3,1)→(1,1) via row 2? No, row 2 col 1 is X. So (1,1) and (1,2) are NOT connected to border. They get captured!', hint: '(1,1) not connected to border. Will be captured.' },
      { action: 'visit', row: 2, col: 2, explanation: '(2,2) is O, surrounded by X on all sides. Captured. All interior O\'s become X. Only O\'s on border or connected survive.', hint: '(2,2) surrounded by X. Captured.' },
    ],
  },
]);
add('dp', [
  {
    id: 'dp1', title: 'Climbing Stairs',
    desc: 'Climb 5 stairs. Each step: 1 or 2 stairs. How many distinct ways? ways(n) = ways(n-1) + ways(n-2).',
    data: { n: 5 }, steps: [
      { action: 'next', explanation: 'Base: 1 stair→1 way, 2 stairs→2 ways. To reach step n, you must have come from n-1 (take 1 step) or n-2 (take 2 steps). So ways(n) = ways(n-1) + ways(n-2). It\'s Fibonacci!', hint: 'dp[1]=1, dp[2]=2. Compute dp[3].' },
      { action: 'next', explanation: 'dp[3] = dp[2] + dp[1] = 2 + 1 = 3. [1+1+1, 1+2, 2+1]', hint: 'dp[3] = 3' },
      { action: 'next', explanation: 'dp[4] = dp[3] + dp[2] = 3 + 2 = 5', hint: 'dp[4] = 5' },
      { action: 'next', explanation: 'dp[5] = dp[4] + dp[3] = 5 + 3 = 8. Answer: 8 ways. O(n) time, O(1) space (only need last 2 values). The essence of DP: subproblems build up!', hint: 'dp[5] = 8. Answer!' },
    ],
  },
  {
    id: 'dp2', title: 'House Robber',
    desc: 'Houses [2,7,9,3,1]. Max money without robbing adjacent houses.',
    data: { arr: [2, 7, 9, 3, 1] }, steps: [
      { action: 'next', explanation: 'House 0 (2): rob=2, skip=0. best=2. dp[0]=2. At each house, decide: rob=value+dp[i-2], or skip=dp[i-1].', hint: 'House 0: rob=2 vs skip=0.' },
      { action: 'next', explanation: 'House 1 (7): rob=7+0=7, skip=2. best=7. dp[1]=7. Robbing here is better.', hint: 'House 1: rob=7 vs skip=2?' },
      { action: 'next', explanation: 'House 2 (9): rob=9+dp[0]=9+2=11, skip=dp[1]=7. best=11. dp[2]=11.', hint: 'House 2: rob=9+2=11 vs skip=7?' },
      { action: 'next', explanation: 'House 3 (3): rob=3+dp[1]=3+7=10, skip=dp[2]=11. best=11. dp[3]=11. Skipping is better.', hint: 'House 3: rob=10 vs skip=11?' },
      { action: 'next', explanation: 'House 4 (1): rob=1+dp[2]=1+11=12, skip=dp[3]=11. best=12. Answer: 12. Recurrence: dp[i] = max(arr[i]+dp[i-2], dp[i-1]).', hint: 'House 4: rob=12 vs skip=11? Answer: 12!' },
    ],
  },
  {
    id: 'dp3', title: 'Coin Change — Minimum Coins',
    desc: 'Coins [1,2,5], amount 11. Min coins needed? dp[a] = min(dp[a-coin]+1 for each coin).',
    data: { arr: [1, 2, 5], target: 11 }, steps: [
      { action: 'next', explanation: 'dp[0]=0. Building up: for each amount, try each coin. dp[1]=min(dp[0]+1)=1. dp[2]=min(dp[1]+1=2, dp[0]+1=1)=1.', hint: 'Building DP table from 0 to 11.' },
      { action: 'next', explanation: 'dp[3]=dp[2]+1=2 (coin 1) or dp[1]+1=2 (coin 2). dp[3]=2.', hint: 'dp[3]=2' },
      { action: 'next', explanation: 'dp[4]=dp[3]+1=3 (coin 1), dp[2]+1=2 (coin 2). dp[4]=2.', hint: 'dp[4]=2' },
      { action: 'next', explanation: 'dp[5]=dp[4]+1=3, dp[3]+1=3, or dp[0]+1=1 (coin 5!). dp[5]=1.', hint: 'dp[5]=1 (use coin 5!)' },
      { action: 'next', explanation: 'Continuing... dp[11] = dp[6]+1=3 (coin 5). Answer: 3 coins (5+5+1). The DP table builds optimal solutions for all sub-amounts.', hint: 'dp[11]=3. Answer: 3 coins!' },
    ],
  },
  {
    id: 'dp4', title: 'Longest Increasing Subsequence',
    desc: 'Find LIS length in [10,9,2,5,3,7,101,18]. Each dp[i] = best LIS ending at i.',
    data: { arr: [10, 9, 2, 5, 3, 7, 101, 18] }, steps: [
      { action: 'next', explanation: 'dp[0]=1 ([10]). Each element starts as its own subsequence of length 1.', hint: 'LIS ending at 10 = 1.' },
      { action: 'next', explanation: 'dp[1]=1 ([9]). 9<10, so can\'t extend. maxSoFar=1.', hint: 'dp[1]=1' },
      { action: 'next', explanation: 'dp[2]=1 ([2]). 2<10,2<9. Can\'t extend. max=1.', hint: 'dp[2]=1' },
      { action: 'next', explanation: 'dp[3]=2 ([2,5]). 5>2, so dp[3]=dp[2]+1=2! The key: check all previous elements that are smaller.', hint: '5>2 → dp[3]=dp[2]+1=2' },
      { action: 'next', explanation: 'dp[4]=2 ([2,3]). 3>2 → dp[4]=dp[2]+1=2. Not longer than 2,5.', hint: 'dp[4]=2' },
      { action: 'next', explanation: 'dp[5]=3 ([2,5,7] or [2,3,7]). 7>5 → dp[5]=dp[3]+1=3.', hint: 'dp[5]=3 ([2,5,7])' },
      { action: 'next', explanation: 'dp[6]=4 ([2,5,7,101]). 101>7 → dp[6]=dp[5]+1=4! New max.', hint: 'dp[6]=4 ([2,5,7,101])' },
      { action: 'next', explanation: 'dp[7]=4 ([2,5,7,18]). Can\'t beat 4. LIS length = 4. O(n²) DP, can be optimized to O(n log n).', hint: 'dp[7]=4. LIS = 4!' },
    ],
  },
  {
    id: 'dp5', title: 'Palindromic Substrings',
    desc: 'Count palindromic substrings in "abc". Each single char is a palindrome, plus expand around center.',
    data: { str: 'abc' }, steps: [
      { action: 'next', explanation: 'Single chars: "a", "b", "c" — all palindromes. Count = 3. Expand around each center for odd and even length palindromes.', hint: '3 single-char palindromes.' },
      { action: 'next', explanation: 'Check pairs: "ab" — not palindrome. "bc" — not palindrome. Total = 3. For "aaa": 6 palindromes. Expand-around-center checks in O(n²) but is O(1) space.', hint: 'No longer palindromes in "abc". Total = 3.' },
    ],
  },
  {
    id: 'dp6', title: 'Unique Paths',
    desc: 'How many unique paths from top-left to bottom-right in a 3×3 grid? Only move right or down.',
    data: { arr: [3, 3] }, steps: [
      { action: 'next', explanation: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]. First row all 1s (only one way: keep moving right). First column all 1s (only down).', hint: 'Initialize first row and col to 1.' },
      { action: 'next', explanation: 'dp[1][1] = dp[0][1] + dp[1][0] = 1+1 = 2. Two paths to center: R-D or D-R.', hint: 'dp[1][1]=2' },
      { action: 'next', explanation: 'dp[1][2] = dp[0][2] + dp[1][1] = 1+2 = 3. dp[2][1] = dp[1][1] + dp[2][0] = 2+1 = 3.', hint: 'dp[1][2]=3, dp[2][1]=3' },
      { action: 'next', explanation: 'dp[2][2] = dp[1][2] + dp[2][1] = 3+3 = 6. Answer: 6 unique paths. The DP table builds up the solution one cell at a time.', hint: 'dp[2][2]=6. Answer: 6!' },
    ],
  },
  {
    id: 'dp7', title: 'Edit Distance',
    desc: 'Min operations to convert "horse" to "ros". Operations: insert, delete, replace.',
    data: { arr: ['horse', 'ros'] }, steps: [
      { action: 'next', explanation: 'dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]. Base: dp[i][0]=i (delete all), dp[0][j]=j (insert all).', hint: 'Initialize DP table bases.' },
      { action: 'next', explanation: 'h vs r: replace h→r (1). or delete h (1) + insert r (1)=2. Min=1 (replace). dp[1][1]=1.', hint: 'h→r: replace = 1.' },
      { action: 'next', explanation: 'h vs ro: need r then o. Delete h(1)+insert r(1)+insert o(1)=3. Or replace h→r(1)+insert o(1)=2. dp[1][2]=2.', hint: 'h→ro = 2.' },
      { action: 'next', explanation: 'ho vs r: options: replace h→r(1)+delete o(1)=2. Or delete h(1)+delete o(1)+insert r(1)=3. dp[2][1]=2 (delete o, replace h→r).', hint: 'dp[2][1]=2' },
      { action: 'next', explanation: 'Building up... dp table fills with min of: insert(i,j-1)+1, delete(i-1,j)+1, replace(i-1,j-1)+(0 if same else 1).', hint: 'Continue filling.' },
      { action: 'next', explanation: 'Final dp[5][3] = 3. "horse"→"ros": replace h→r, delete o, delete e (or similar). Answer: 3 operations. O(m×n) time.', hint: 'Answer: 3 operations!' },
    ],
  },
  {
    id: 'dp8', title: 'Decode Ways',
    desc: 'Count ways to decode "12". Letters: 1→A, 2→B, ..., 12→L. dp[i] = ways to decode prefix of length i.',
    data: { dpTable: [{ label: 'String', values: ['', '1', '12'] }, { label: 'Ways', values: [1, 1, 2] }] },
    steps: [
      { action: 'next', explanation: 'dp[0] = 1 (empty string: 1 way to decode). Base case.', hint: 'dp[0]=1 (empty string).' },
      { action: 'next', explanation: 'dp[1] = 1 (only "1" → A). Single digit always decodes one way.', hint: 'dp[1]=1 ("1" → A).' },
      { action: 'next', explanation: 'dp[2] = dp[1] + dp[0] = 1+1=2. "1"+"2"→AB, "12"→L. Two ways! Recurrence: dp[i] = dp[i-1] (single digit) + dp[i-2] (if two-digit ≤ 26).', hint: 'dp[2]=2. Two ways: AB or L!' },
    ],
  },
  {
    id: 'dp9', title: 'Combination Sum IV',
    desc: 'Count ways to sum to 4 using [1,2,3]. dp[i] = sum of dp[i-num] for each num ≤ i.',
    data: { dpTable: [{ label: 'Sum', values: [0, 1, 2, 3, 4] }, { label: 'Ways', values: [1, 1, 2, 4, 7] }] },
    steps: [
      { action: 'next', explanation: 'dp[0]=1 (one way: no coins). Base case.', hint: 'dp[0]=1.' },
      { action: 'next', explanation: 'dp[1]=dp[0]=1 (only 1). dp[1] = dp[0] (using coin 1).', hint: 'dp[1]=1.' },
      { action: 'next', explanation: 'dp[2]=dp[1] + dp[0] = 1+1 = 2 (1+1, 2). dp[2] = dp[1](coin1) + dp[0](coin2).', hint: 'dp[2]=2.' },
      { action: 'next', explanation: 'dp[3]=dp[2]+dp[1]+dp[0]=2+1+1=4. dp[3]=dp[2](coin1)+dp[1](coin2)+dp[0](coin3).', hint: 'dp[3]=4.' },
      { action: 'next', explanation: 'dp[4]=dp[3]+dp[2]+dp[1]=4+2+1=7. Answer: 7 ways. Recurrence: dp[i] = Σ dp[i-num] for each num. O(target×n) time.', hint: 'dp[4]=7. Answer!' },
    ],
  },
]);
add('heap', [
  {
    id: 'hp1', title: 'Kth Largest Element',
    desc: 'Find the 3rd largest in [3,2,1,5,6,4]. Tap the correct bar.',
    data: { arr: [3, 2, 1, 5, 6, 4], k: 3 }, steps: [
      { action: 'select', index: 4, explanation: 'Sorted: [1,2,3,4,5,6]. 3rd largest = 4 (at index 4). With a min-heap of size K: push elements, keep size K. Root is always the Kth largest. O(n log K) vs O(n log n).', hint: 'Tap the 3rd largest (value 4).' },
    ],
  },
  {
    id: 'hp2', title: 'Top K Frequent Words',
    desc: 'Tap the 2 most frequent words: ["i","love","leetcode","i","love","coding"].',
    data: { words: ['i','love','leetcode','i','love','coding'], k: 2 }, steps: [
      { action: 'select', indices: [0, 2], explanation: 'Freq: "i"=2, "love"=2, "coding"=1, "leetcode"=1. Top 2: "i", "love". Count with hash map (O(n)), then min-heap of size K (O(n log K)).', hint: 'Tap the two most frequent words.' },
    ],
  },
  {
    id: 'hp3', title: 'K Closest Points to Origin',
    desc: 'Find the 2 closest points to origin from [[1,3],[-2,2],[5,8],[0,1]]. Distance = x²+y².',
    data: { words: ['(1,3):10', '(-2,2):8', '(5,8):89', '(0,1):1'], k: 2 }, steps: [
      { action: 'select', indices: [3, 1], explanation: 'Distances: (0,1)=1, (-2,2)=8, (1,3)=10, (5,8)=89. Closest 2: (0,1) and (-2,2). Use a max-heap of size K: push distances, if heap>K, pop largest.', hint: 'Tap the 2 closest points (smallest distances).' },
    ],
  },
  {
    id: 'hp4', title: 'Sort Characters By Frequency',
    desc: 'Sort "tree" by character frequency: highest freq first → "eert" (e appears twice).',
    data: { words: ['t', 'r', 'e', 'e'], k: 4 }, steps: [
      { action: 'select', indices: [2, 3, 0, 1], explanation: 'Freq: e→2, t→1, r→1. High freq first: e, e, t, r → "eert". Heap approach: push all (freq, char) into a max-heap, then pop one by one.', hint: 'Tap characters in descending frequency order.' },
    ],
  },
  {
    id: 'hp5', title: 'Find Median from Data Stream',
    desc: 'Insert [2,1,5,7,0] one by one and find median after each insertion. Use two heaps: max-heap for left half, min-heap for right half.',
    data: { arr: [2, 1, 5, 7, 0], k: 5 }, steps: [
      { action: 'next', explanation: 'Insert 2. maxHeap=[2], minHeap=[]. median=2. Two heaps keep the left half in a max-heap and right half in a min-heap.', hint: 'Insert 2. Median = 2.' },
      { action: 'next', explanation: 'Insert 1. maxHeap=[1], minHeap=[2]. median=(1+2)/2=1.5. Balance: maintain |size(max)-size(min)| ≤ 1.', hint: 'Insert 1. median = 1.5.' },
      { action: 'next', explanation: 'Insert 5. maxHeap=[2,1], minHeap=[5]. median=2.', hint: 'Insert 5. median = 2.' },
      { action: 'next', explanation: 'Insert 7. maxHeap=[2,1], minHeap=[5,7]. median=(2+5)/2=3.5.', hint: 'Insert 7. median = 3.5.' },
      { action: 'next', explanation: 'Insert 0. maxHeap=[2,1,0], minHeap=[5,7]. median=2. Two heaps give O(log n) per insertion, O(1) median retrieval.', hint: 'Insert 0. median = 2.' },
    ],
  },
  {
    id: 'hp6', title: 'Kth Smallest in Sorted Matrix',
    desc: 'Find the 5th smallest in [[1,5,9],[10,11,13],[12,13,15]]. Each row is sorted.',
    data: { arr: [1, 5, 9, 10, 11, 12, 13, 13, 15], k: 5 }, steps: [
      { action: 'select', index: 3, explanation: 'Flattened (sorted): [1,5,9,10,11,12,13,13,15]. 5th smallest = 10. Better: use a min-heap starting with first element of each row. Pop K times, pushing the next element from the same row each time. O(K log n) where n=rows.', hint: 'Tap the 5th smallest element.' },
    ],
  },
  {
    id: 'hp7', title: 'Kth Largest in a Stream',
    desc: 'Stream [4,5,8,2], find the 3rd largest after each insertion. Use a min-heap of size K.',
    data: { arr: [4, 5, 8, 2], k: 3 },
    steps: [
      { action: 'next', explanation: 'Insert 4. Heap: [4]. Only 1 element < K=3. Not enough elements yet for Kth largest.', hint: 'Heap has 1 element. Need K=3.' },
      { action: 'next', explanation: 'Insert 5. Heap: [4,5]. Still only 2 elements.', hint: '2 elements < K. Keep streaming.' },
      { action: 'next', explanation: 'Insert 8. Heap: [4,5,8] (min-heap of size 3). Kth largest = root = 4!', hint: 'Heap is full! Root = 4 = 3rd largest.' },
      { action: 'next', explanation: 'Insert 2. Heap: [2,4,5,8] → pop 2 (min) → [4,5,8]. Kth largest = 4. O(n log K) maintains the K largest in a min-heap.', hint: 'Insert 2. Pop min. Kth largest still 4.' },
    ],
  },
  {
    id: 'hp8', title: 'Min Cost to Connect Sticks',
    desc: 'Connect sticks [2,4,3] by merging two at a time. Always merge the two smallest using a min-heap.',
    data: { arr: [2, 4, 3] },
    steps: [
      { action: 'next', explanation: 'Sticks: [2,4,3]. Put all in a min-heap. Pop two smallest: 2 and 3. Merge cost = 5. Total cost so far = 5. Push 5 back.', hint: 'Pop 2 and 3 (smallest). Merge = 5.' },
      { action: 'next', explanation: 'Heap: [4,5]. Pop 4 and 5. Merge cost = 9. Total = 5+9 = 14. Push 9 back.', hint: 'Pop 4 and 5. Merge = 9.' },
      { action: 'next', explanation: 'Heap: [9]. Only one left. Done! Total cost = 14. The greedy approach of always merging the two smallest minimizes total cost (like Huffman coding).', hint: 'Done! Total cost = 14.' },
    ],
  },
]);

export { PATTERNS, LEVELS };
