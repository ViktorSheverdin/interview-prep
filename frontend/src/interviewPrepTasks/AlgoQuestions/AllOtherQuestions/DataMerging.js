/**
 * @param {Array<{user: number, duration: number, equipment: Array<string>}>} sessions
 * @return {Array}
 */
function mergeData(sessions) {
  // loop through the session with reducer
  // check if there is an entry for a user -> use Set for the default equipment array
  // check the duration time in the accumulator vs the current time
  // return the accumulator

  const results = new Map();
  for (const session of sessions) {
    if (results.has(session.user)) {
      const loggedUser = results.get(session.user);

      loggedUser.duration = loggedUser.duration + session.duration;
      loggedUser.equipment = Array.from(
        new Set([...loggedUser.equipment, ...session.equipment].sort())
      );
    } else {
      const copyOfSession = {
        user: session.user,
        duration: session.duration,
        equipment: [...session.equipment],
      };
      results.set(session.user, copyOfSession);
    }
  }
  return Array.from(results.values());
}

const data = [
  { user: 8, duration: 50, equipment: ['bench'] },
  { user: 7, duration: 150, equipment: ['dumbbell'] },
  { user: 1, duration: 10, equipment: ['barbell'] },
  { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
  { user: 7, duration: 200, equipment: ['bike'] },
  { user: 2, duration: 200, equipment: ['treadmill'] },
  { user: 2, duration: 200, equipment: ['bike'] },
];

console.log(mergeData(data));
// [
//   { user: 8, duration: 50, equipment: ['bench'] },
//   { user: 7, duration: 450, equipment: ['bike', 'dumbbell', 'kettlebell'] },
//   { user: 1, duration: 10, equipment: ['barbell'] },
//   { user: 2, duration: 400, equipment: ['bike', 'treadmill'] },
// ];
