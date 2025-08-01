export const CURRENT_VERSION = 2.0
export const migrations = [
  {
    fromVersion: 1.0,
    toVersion: 2.0,
    apply: (state) => {
      state.trees.peach = {
        cost: 1_500_000,
        level: 4,
        produce: 'peach',
        purchased: 0,
      }
      state.fruits.peach = 0
    },
  },
]

export function migrate(localState) {
  if (localState?.version < CURRENT_VERSION) {
    for (const migration of migrations) {
      if (localState.version === migration.fromVersion) {
        migration.apply(localState)
        localState.version = migration.toVersion
      }
    }
    localState.version = CURRENT_VERSION
  }
  return localState
}
