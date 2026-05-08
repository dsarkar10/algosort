import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';

// ── UI Primitives ──
function Pill({ children, color = COLORS.primary }) {
  return <View style={[s.pill, { backgroundColor: color + '22', borderColor: color }]}><Text style={[s.pillText, { color }]}>{children}</Text></View>;
}

function Bar({ value, h, color, label, selected, onClick, dim }) {
  const height = h || Math.max(24, Math.min(140, 20 + value * 4));
  return (
    <View style={s.barCol}>
      <Text style={[s.barVal, { opacity: dim ? 0.3 : 1 }]}>{value}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onClick}
        style={[s.bar, {
          height, backgroundColor: selected ? COLORS.warning : (color || COLORS.primary), opacity: dim ? 0.3 : 1,
        }]} />
      {label ? <Text style={[s.barLabel, { opacity: dim ? 0.3 : 1 }]}>{label}</Text> : null}
    </View>
  );
}

function BarRow({ arr, colors, labels, selected, onClick, dims }) {
  return (
    <View style={s.barRow}>
      {arr.map((v, i) => (
        <Bar key={i} value={v} label={labels?.[i]} color={colors?.[i]} selected={selected?.includes(i)} dim={dims?.[i]} onClick={onClick ? () => onClick(i) : undefined} />
      ))}
    </View>
  );
}

function Feedback({ type, message }) {
  if (!message) return null;
  return (
    <View style={[s.feedbackBox, { borderLeftColor: type === 'correct' ? COLORS.success : COLORS.error }]}>
      <Text style={[s.feedbackIcon]}>{type === 'correct' ? '✓' : '✗'}</Text>
      <Text style={[s.feedbackText, { color: type === 'correct' ? COLORS.success : COLORS.error }]}>{message}</Text>
    </View>
  );
}

function Explanation({ text }) {
  return (
    <View style={s.expBox}>
      <Text style={s.expTitle}>Why this works</Text>
      <Text style={s.expText}>{text}</Text>
    </View>
  );
}

function NavButtons({ onBack, onNext, showNext }) {
  return (
    <View style={s.navRow}>
      {onBack && <TouchableOpacity style={s.navBtn} onPress={onBack}><Text style={s.navText}>← Back</Text></TouchableOpacity>}
      {showNext && <TouchableOpacity style={[s.navBtn, s.navPrimary]} onPress={onNext}><Text style={[s.navText, { color: COLORS.textPrimary }]}>Next →</Text></TouchableOpacity>}
    </View>
  );
}

// ── Two Pointers ──
export function TwoPointersView({ level, stepIndex, steps, onCorrect, onWrong, wrongCount }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const arr = level.data.arr;
  const target = level.data.target;
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);

  const lMoves = steps.slice(0, stepIndex).filter(s => s.action === 'moveLeft').length;
  const rMoves = steps.slice(0, stepIndex).filter(s => s.action === 'moveRight').length;
  const left = lMoves;
  const right = arr.length - 1 - rMoves;

  const colors = arr.map((_, i) => {
    if (i === left || i === right) return COLORS.warning;
    return COLORS.primary;
  });
  const labels = arr.map((_, i) => {
    if (i === left) return 'L';
    if (i === right) return 'R';
    return '';
  });

  function handleMove(dir) {
    if (correct) return;
    if (dir === st.action) {
      setFeedback({ type: 'correct', message: '✓ Correct!' });
      setCorrect(true);
    } else {
      setFeedback({ type: 'wrong', message: '✗ Not the right pointer to move' });
      onWrong();
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function advance() {
    setFeedback(null);
    setCorrect(false);
    onCorrect(st);
  }

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color={COLORS.primary}>Two Pointers</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>
      {target != null && <Text style={s.info}>Target sum: {target}</Text>}
      {left < right && <Text style={s.comparison}>{level.data.comparisonText || `arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${arr[left] + arr[right]}`}</Text>}

      <BarRow arr={arr} colors={colors} labels={labels} />

      {correct && <Explanation text={st.explanation} />}
      {feedback && <Feedback type={feedback.type} message={feedback.message} />}
      {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}

      {correct ? (
        <NavButtons showNext onNext={advance} />
      ) : (
        !feedback && (
          <View style={s.btnRow}>
            <TouchableOpacity style={s.btn} onPress={() => handleMove('moveLeft')}>
              <Text style={s.btnText}>Move L →</Text>
              <Text style={s.btnSub}>advance left pointer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btn} onPress={() => handleMove('moveRight')}>
              <Text style={s.btnText}>← Move R</Text>
              <Text style={s.btnSub}>retreat right pointer</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </ScrollView>
  );
}

// ── Binary Search ──
export function BinarySearchView({ level, stepIndex, steps, onCorrect, onWrong, wrongCount }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const arr = level.data.arr;
  const target = level.data.target;
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [phase, setPhase] = useState(st.action === 'pickMid' ? 'pick' : 'choose');

  // compute range from completed steps
  const prevMids = steps.slice(0, stepIndex).filter(s => s.action === 'pickMid').map(s => s.index);
  const prevDirs = steps.slice(0, stepIndex).filter(s => s.action === 'goLeft' || s.action === 'goRight');
  let low = 0, high = arr.length - 1;
  for (let i = 0; i < prevMids.length && i < prevDirs.length; i++) {
    if (prevDirs[i].action === 'goLeft') high = prevMids[i] - 1;
    else low = prevMids[i] + 1;
  }

  function handlePick(index) {
    if (correct || phase !== 'pick') return;
    if (index === st.index) {
      setCorrect(true);
      setFeedback({ type: 'correct', message: '✓ Correct midpoint!' });
    } else {
      setFeedback({ type: 'wrong', message: `✗ Correct midpoint is index ${st.index}` });
      onWrong();
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function handleDirection(dir) {
    if (correct || phase !== 'choose') return;
    if (dir === st.action) {
      setCorrect(true);
      setFeedback({ type: 'correct', message: '✓ Correct direction!' });
    } else {
      setFeedback({ type: 'wrong', message: '✗ Wrong direction' });
      onWrong();
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function advance() {
    setCorrect(false);
    setFeedback(null);
    onCorrect(st);
  }

  // Determine which bars are in range
  const dims = arr.map((_, i) => i < low || i > high);

  const colors = arr.map((_, i) => {
    if (st.action === 'pickMid' && i === st.index) return COLORS.warning;
    if (!dims[i]) return COLORS.primaryLight;
    return COLORS.elevated;
  });
  const labels = arr.map((_, i) => {
    if (i === Math.floor((low + high) / 2) && low <= high) return 'mid?';
    return '';
  });

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color={COLORS.success}>Binary Search</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>
      {!dims.every(d => !d) && <Text style={s.info}>Range: [{low}..{high}] ({high - low + 1} elements)</Text>}

      <BarRow arr={arr} colors={colors} labels={labels} dims={dims} onClick={st.action === 'pickMid' ? handlePick : undefined} />

      {st.action === 'goLeft' || st.action === 'goRight' ? (
        <>
          {correct && <Explanation text={st.explanation} />}
          {feedback && !correct && <Feedback type={feedback.type} message={feedback.message} />}
          {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}
          {correct ? (
            <NavButtons showNext onNext={advance} />
          ) : (
            !feedback && (
              <View style={s.btnRow}>
                <TouchableOpacity style={s.btn} onPress={() => handleDirection('goLeft')}><Text style={s.btnText}>Go Left ←</Text></TouchableOpacity>
                <TouchableOpacity style={s.btn} onPress={() => handleDirection('goRight')}><Text style={s.btnText}>Go Right →</Text></TouchableOpacity>
              </View>
            )
          )}
        </>
      ) : (
        <>
          {correct && <Explanation text={st.explanation} />}
          {feedback && !correct && <Feedback type={feedback.type} message={feedback.message} />}
          {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}
          {correct && <NavButtons showNext onNext={advance} />}
        </>
      )}
    </ScrollView>
  );
}

// ── Hashing ──
export function HashingView({ level, stepIndex, steps, onCorrect, onWrong }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const arr = level.data.arr || level.data.words || [];
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);

  function handleTap(i) {
    if (correct) return;
    if (st.action === 'pickPair') {
      if (selected.includes(i)) { setSelected(selected.filter(x => x !== i)); return; }
      const ns = [...selected, i];
      if (ns.length === 2) {
        const [a, b] = ns;
        if ((a === st.indices[0] && b === st.indices[1]) || (a === st.indices[1] && b === st.indices[0])) {
          setCorrect(true);
          setFeedback({ type: 'correct', message: '✓ Correct pair!' });
        } else {
          setFeedback({ type: 'wrong', message: '✗ That pair doesn\'t sum to the target' });
          onWrong();
          setSelected([]);
          setTimeout(() => setFeedback(null), 800);
        }
      } else {
        setSelected(ns);
      }
    } else if (st.action === 'pickDuplicate') {
      if (i === st.index) {
        setCorrect(true);
        setFeedback({ type: 'correct', message: '✓ Found the duplicate!' });
      } else {
        setFeedback({ type: 'wrong', message: '✗ That\'s not the duplicate' });
        onWrong();
        setTimeout(() => setFeedback(null), 800);
      }
    }
  }

  function advance() {
    setCorrect(false);
    setFeedback(null);
    setSelected([]);
    onCorrect(st);
  }

  const sel2 = selected;
  const colors = arr.map((_, i) => {
    if (sel2.includes(i)) return COLORS.warning;
    if (correct && st.indices?.includes(i)) return COLORS.success;
    if (correct && st.action === 'pickDuplicate' && i === st.index) return COLORS.success;
    return COLORS.primary;
  });

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color="#facc15">Hashing</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>
      {level.data.target && <Text style={s.info}>Target sum: {level.data.target}</Text>}

      {level.data.words ? (
        <View style={s.wordRow}>
          {arr.map((w, i) => (
            <TouchableOpacity key={i} onPress={() => handleTap(i)}
              style={[s.wordChip, { backgroundColor: sel2.includes(i) ? COLORS.warning : (correct && st.indices?.includes(i) ? COLORS.success : COLORS.elevated) }]}>
              <Text style={s.wordText}>{w}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <BarRow arr={arr} colors={colors} onClick={handleTap} selected={sel2} />
      )}

      {correct && <Explanation text={st.explanation} />}
      {feedback && !correct && <Feedback type={feedback.type} message={feedback.message} />}
      {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}
      {correct && <NavButtons showNext onNext={advance} />}
    </ScrollView>
  );
}

// ── Sliding Window ──
export function SlidingWindowView({ level, stepIndex, steps, onCorrect, onWrong }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const data = level.data.arr;
  const k = level.data.k;
  const str = level.data.str;
  const items = data || (str ? str.split('') : []);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);

  const prevAdvances = steps.slice(0, stepIndex).filter(s => s.action === 'advance').length;
  const prevExpands = steps.slice(0, stepIndex).filter(s => s.action === 'expand').length;
  const prevShrinks = steps.slice(0, stepIndex).filter(s => s.action === 'shrink').length;

  let winStart = 0, winEnd = -1;
  if (k) {
    const adv = prevAdvances;
    winStart = adv;
    winEnd = adv + k - 1;
  } else {
    winStart = prevShrinks;
    winEnd = prevExpands - 1;
  }

  function handleAction(action) {
    if (correct) return;
    if (action === st.action) {
      setCorrect(true);
      setFeedback({ type: 'correct', message: '✓ Correct!' });
    } else {
      setFeedback({ type: 'wrong', message: '✗ That\'s not the right move' });
      onWrong();
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function advance() {
    setCorrect(false);
    setFeedback(null);
    onCorrect(st);
  }

  const colors = items.map((_, i) => {
    if (winEnd >= winStart && i >= winStart && i <= winEnd) return COLORS.warning;
    return COLORS.primary;
  });

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color={COLORS.purple}>Sliding Window</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>
      {k && <Text style={s.info}>Window size: {k}</Text>}
      {winEnd >= winStart && <Text style={s.info}>Window: [{winStart}..{winEnd}]</Text>}

      <BarRow arr={items} colors={colors} />
      {winEnd >= winStart && (
        <View style={s.windowInd}><Text style={s.windowText}>Window</Text></View>
      )}

      {correct && <Explanation text={st.explanation} />}
      {feedback && !correct && <Feedback type={feedback.type} message={feedback.message} />}
      {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}

      {correct ? (
        <NavButtons showNext onNext={advance} />
      ) : (
        !feedback && (
          <View style={s.btnRow}>
            {(st.action === 'expand' || st.action === 'advance') && (
              <TouchableOpacity style={s.btn} onPress={() => handleAction(st.action)}>
                <Text style={s.btnText}>{st.action === 'expand' ? 'Expand →' : 'Advance →'}</Text>
              </TouchableOpacity>
            )}
            {st.action === 'shrink' && (
              <TouchableOpacity style={s.btn} onPress={() => handleAction('shrink')}>
                <Text style={s.btnText}>Shrink ←</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      )}
    </ScrollView>
  );
}

// ── Intervals ──
export function IntervalsView({ level, stepIndex, steps, onCorrect, onWrong }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const intervals = level.data.intervals;
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [removed, setRemoved] = useState([]);

  function handleTap(i) {
    if (correct || removed.includes(i)) return;
    if (st.action === 'merge') {
      if (selected.includes(i)) { setSelected(selected.filter(x => x !== i)); return; }
      const ns = [...selected, i];
      if (ns.length === 2) {
        const [a, b] = ns;
        if ((a === st.indices[0] && b === st.indices[1]) || (a === st.indices[1] && b === st.indices[0])) {
          setCorrect(true);
          setFeedback({ type: 'correct', message: '✓ Merged!' });
        } else {
          setFeedback({ type: 'wrong', message: '✗ These intervals don\'t overlap or shouldn\'t be merged' });
          onWrong();
          setSelected([]);
          setTimeout(() => setFeedback(null), 800);
        }
      } else {
        setSelected(ns);
      }
    } else if (st.action === 'keep' || st.action === 'remove') {
      if (st.indices?.includes(i)) {
        if (st.action === 'remove') setRemoved([...removed, i]);
        setCorrect(true);
        setFeedback({ type: 'correct', message: st.action === 'keep' ? '✓ Keep it' : '✓ Removed' });
      } else {
        setFeedback({ type: 'wrong', message: '✗ Not the right interval' });
        onWrong();
        setTimeout(() => setFeedback(null), 800);
      }
    }
  }

  function advance() {
    setCorrect(false);
    setFeedback(null);
    setSelected([]);
    if (st.action === 'next') onCorrect(st);
    else onCorrect(st);
  }

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color={COLORS.error}>Intervals</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>

      <View style={s.intRow}>
        {intervals.map((iv, i) => {
          if (removed.includes(i)) return null;
          const isSel = selected.includes(i);
          return (
            <TouchableOpacity key={i} onPress={() => handleTap(i)}
              style={[s.intBar, {
                backgroundColor: isSel ? COLORS.warning : (correct && st.indices?.includes(i) ? COLORS.success : COLORS.primary),
                flex: iv[1] - iv[0] + 1,
              }]}>
              <Text style={s.intText}>[{iv[0]},{iv[1]}]</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {correct && <Explanation text={st.explanation} />}
      {feedback && !correct && <Feedback type={feedback.type} message={feedback.message} />}
      {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}

      {correct ? (
        <NavButtons showNext onNext={advance} />
      ) : st.action === 'next' ? (
        !feedback && <TouchableOpacity style={s.btn} onPress={advance}><Text style={s.btnText}>Next →</Text></TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

// ── BFS / DFS ──
export function BFSDFSView({ level, stepIndex, steps, onCorrect, onWrong }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const grid = level.data.grid;
  const tree = level.data.tree;
  const [visited, setVisited] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);

  function handleGrid(r, c) {
    if (correct) return;
    if (r === st.row && c === st.col) {
      setVisited([...visited, `${r},${c}`]);
      setCorrect(true);
      setFeedback({ type: 'correct', message: '✓ Visited!' });
    } else {
      setFeedback({ type: 'wrong', message: '✗ That\'s not the next cell to visit' });
      onWrong();
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function handleNode(val) {
    if (correct) return;
    if (val === st.node) {
      setVisited([...visited, val]);
      setCorrect(true);
      setFeedback({ type: 'correct', message: '✓ Visited!' });
    } else {
      setFeedback({ type: 'wrong', message: '✗ Wrong node' });
      onWrong();
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function advance() {
    setCorrect(false);
    setFeedback(null);
    onCorrect(st);
  }

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color={COLORS.accent}>BFS / DFS</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>

      {grid && (
        <View style={s.gridBox}>
          {grid.map((row, r) => (
            <View key={r} style={s.gridRow}>
              {row.map((cell, c) => {
                const key = `${r},${c}`;
                const vis = visited.includes(key);
                const cur = r === st.row && c === st.col;
                return (
                  <TouchableOpacity key={c} onPress={() => handleGrid(r, c)}
                    style={[s.gridCell, {
                      backgroundColor: cell === '0' ? COLORS.elevated : (vis ? COLORS.success : COLORS.primary),
                      borderColor: cur ? COLORS.warning : 'transparent',
                      borderWidth: cur ? 3 : 0,
                    }]}>
                    <Text style={s.gCellText}>{cell}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      )}

      {tree && <TreeView node={tree} onTap={handleNode} visited={visited} currentVal={st.node} />}

      {correct && <Explanation text={st.explanation} />}
      {feedback && !correct && <Feedback type={feedback.type} message={feedback.message} />}
      {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}
      {correct && <NavButtons showNext onNext={advance} />}
    </ScrollView>
  );
}

function TreeView({ node, onTap, visited, currentVal }) {
  if (!node) return null;
  const vis = visited.includes(node.val);
  const cur = node.val === currentVal;
  return (
    <View style={s.treeCol}>
      <TouchableOpacity onPress={() => onTap(node.val)}
        style={[s.treeNode, { backgroundColor: vis ? COLORS.success : (cur ? COLORS.warning : COLORS.primary) }]}>
        <Text style={s.treeVal}>{node.val}</Text>
      </TouchableOpacity>
      <View style={s.treeRow}>
        <TreeView node={node.left} onTap={onTap} visited={visited} currentVal={currentVal} />
        <TreeView node={node.right} onTap={onTap} visited={visited} currentVal={currentVal} />
      </View>
    </View>
  );
}

// ── DP ──
export function DPView({ level, stepIndex, steps, onCorrect, onWrong }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const [correct, setCorrect] = useState(false);

  function advance() {
    setCorrect(false);
    onCorrect(st);
  }

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color={COLORS.dp || '#f97316'}>Dynamic Programming</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>

      <View style={s.dpCard}>
        <Text style={s.dpTitle}>DP Table</Text>
        {level.data.dpTable && (
          <View style={s.dpTable}>
            {level.data.dpTable.map((row, ri) => (
              <View key={ri} style={s.dpRow}>
                <Text style={s.dpLabel}>{row.label}:</Text>
                {row.values.map((v, ci) => (
                  <Text key={ci} style={[s.dpCell, { color: ci <= stepIndex ? COLORS.warning : COLORS.textSecondary }]}>{v}</Text>
                ))}
              </View>
            ))}
          </View>
        )}
        {!level.data.dpTable && level.data.arr && (
          <View style={s.dpTable}>
            <View style={s.dpRow}><Text style={s.dpLabel}>Array:</Text>{level.data.arr.map((v, i) => <Text key={i} style={s.dpCell}>{v}</Text>)}</View>
            <View style={s.dpRow}><Text style={s.dpLabel}>DP:</Text>{level.data.arr.map((_, i) => {
              const val = computeDP(level.data.arr, i);
              return <Text key={i} style={[s.dpCell, { color: i === stepIndex ? COLORS.warning : COLORS.textPrimary }]}>{val}</Text>;
            })}</View>
          </View>
        )}
        {level.data.n && (
          <View style={s.dpTable}>
            <View style={s.dpRow}><Text style={s.dpLabel}>Stairs:</Text>{[1,2,3,4,5].map((v, i) => <Text key={i} style={[s.dpCell, { color: i + 1 <= stepIndex + 1 ? COLORS.warning : COLORS.textSecondary }]}>{v}</Text>)}</View>
            <View style={s.dpRow}><Text style={s.dpLabel}>Ways:</Text>{[1,2,3,5,8].map((v, i) => <Text key={i} style={[s.dpCell, { color: i <= stepIndex ? COLORS.warning : COLORS.textSecondary }]}>{v}</Text>)}</View>
          </View>
        )}
      </View>

      <Explanation text={st.explanation} />
      <NavButtons showNext onNext={advance} />
    </ScrollView>
  );
}

function computeDP(arr, i) {
  if (i === 0) return arr[0];
  if (i === 1) return Math.max(arr[0], arr[1]);
  let prev2 = arr[0], prev1 = Math.max(arr[0], arr[1]);
  for (let j = 2; j <= i; j++) {
    const cur = Math.max(prev1, prev2 + arr[j]);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

// ── Heap ──
export function HeapView({ level, stepIndex, steps, onCorrect, onWrong }) {
  const st = steps[stepIndex];
  if (!st) return null;
  const arr = level.data.arr || level.data.words || [];
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);

  function handleTap(i) {
    if (correct || st.action === 'next') return;
    if (st.indices) {
      if (selected.includes(i)) { setSelected(selected.filter(x => x !== i)); return; }
      const ns = [...selected, i];
      if (ns.length === st.indices.length) {
        const match = st.indices.every(idx => ns.includes(idx));
        if (match) {
          setCorrect(true);
          setFeedback({ type: 'correct', message: '✓ Correct!' });
        } else {
          setFeedback({ type: 'wrong', message: '✗ Not the top K' });
          onWrong();
          setSelected([]);
          setTimeout(() => setFeedback(null), 800);
        }
      } else {
        setSelected(ns);
      }
    } else {
      if (i === st.index) {
        setCorrect(true);
        setFeedback({ type: 'correct', message: '✓ Correct!' });
      } else {
        setFeedback({ type: 'wrong', message: '✗ Wrong element' });
        onWrong();
        setTimeout(() => setFeedback(null), 800);
      }
    }
  }

  function advance() {
    setCorrect(false);
    setFeedback(null);
    setSelected([]);
    onCorrect(st);
  }

  const colors = arr.map((_, i) => {
    if (selected.includes(i)) return COLORS.warning;
    if (correct && st.indices?.includes(i)) return COLORS.success;
    if (correct && i === st.index) return COLORS.success;
    return COLORS.primary;
  });

  return (
    <ScrollView style={s.container}>
      <View style={s.topBar}><Pill color={COLORS.heap || '#ec4899'}>Heap / Top-K</Pill><Pill color={COLORS.textSecondary}>Step {stepIndex + 1}/{steps.length}</Pill></View>
      <Text style={s.desc}>{level.desc}</Text>
      {level.data.k && <Text style={s.info}>K = {level.data.k}</Text>}

      <BarRow arr={arr} colors={colors} onClick={st.action === 'next' ? undefined : handleTap} selected={selected} />

      {correct && <Explanation text={st.explanation} />}
      {feedback && !correct && <Feedback type={feedback.type} message={feedback.message} />}
      {!feedback && !correct && <Text style={s.hint}>💡 {st.hint}</Text>}
      {correct && <NavButtons showNext onNext={advance} />}
      {st.action === 'next' && !correct && <TouchableOpacity style={s.btn} onPress={() => { setCorrect(true); }}><Text style={s.btnText}>Next →</Text></TouchableOpacity>}
    </ScrollView>
  );
}

// ── Styles ──
const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, borderWidth: 1 },
  pillText: { fontSize: 11, fontWeight: '600' },
  desc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 8 },
  info: { fontSize: 14, color: COLORS.accent, fontWeight: '600', marginBottom: 6 },
  comparison: { fontSize: 16, fontWeight: 'bold', color: COLORS.warning, textAlign: 'center', marginVertical: 6, fontFamily: 'monospace' },
  barRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 6, marginVertical: 10, minHeight: 160 },
  barCol: { alignItems: 'center' },
  barVal: { fontSize: 13, fontWeight: 'bold', marginBottom: 2, fontFamily: 'monospace', color: COLORS.textPrimary },
  bar: { width: 32, borderRadius: 6, borderTopLeftRadius: 10, borderTopRightRadius: 10, minHeight: 20 },
  barLabel: { fontSize: 11, fontWeight: 'bold', color: COLORS.warning, marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginVertical: 12 },
  btn: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, minWidth: 100, alignItems: 'center' },
  btnText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  btnSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  hint: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', fontStyle: 'italic', marginVertical: 8, lineHeight: 18, paddingHorizontal: 8 },
  feedbackBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 8, borderLeftWidth: 4, padding: 12, marginVertical: 6, gap: 8 },
  feedbackIcon: { fontSize: 18, fontWeight: 'bold' },
  feedbackText: { fontSize: 14, fontWeight: '600', flex: 1 },
  expBox: { backgroundColor: COLORS.surface, borderRadius: 10, padding: 14, marginVertical: 8 },
  expTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  expText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },
  navRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginVertical: 12, marginBottom: 32 },
  navBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: COLORS.elevated },
  navPrimary: { backgroundColor: COLORS.primary },
  navText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  windowInd: { alignItems: 'center', marginTop: -6, marginBottom: 6 },
  windowText: { fontSize: 11, color: COLORS.warning, fontWeight: '600' },
  intRow: { flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 16, minHeight: 50 },
  intBar: { paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center', minWidth: 50 },
  intText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '600', fontFamily: 'monospace' },
  gridBox: { alignItems: 'center', marginVertical: 12 },
  gridRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  gridCell: { width: 48, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 0 },
  gCellText: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  treeCol: { alignItems: 'center', marginVertical: 8 },
  treeRow: { flexDirection: 'row', gap: 24 },
  treeNode: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', margin: 4 },
  treeVal: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  dpCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginVertical: 8 },
  dpTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  dpTable: { gap: 8, marginBottom: 8 },
  dpRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dpLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, width: 50 },
  dpCell: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, fontFamily: 'monospace', width: 36, textAlign: 'center' },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginVertical: 14 },
  wordChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, minWidth: 56, alignItems: 'center' },
  wordText: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
});
