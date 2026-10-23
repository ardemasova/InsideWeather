import { getNode, type NodeId, type Reply } from './journalFlow'

export interface JournalEntry {
  id: string
  kind: 'observation' | 'note'
  text: string
  edited: boolean
}

export interface ChatMessage {
  id: string
  from: 'ai' | 'user'
  text: string
  time: string
  /** When set, the message renders as a saved-entry card for this journal entry. */
  entryId?: string
}

export interface JournalState {
  node: NodeId
  messages: ChatMessage[]
  /** Assistant lines waiting to be "typed" into the conversation. */
  queue: ChatMessage[]
  /** Observation proposed by the current path, if any. */
  pendingObservation: string | null
  /** In-memory demo journal. Lives only as long as this page. */
  journal: JournalEntry[]
  clock: number
  seq: number
}

export type JournalAction =
  | { type: 'reply'; reply: Reply }
  | { type: 'save' }
  | { type: 'decline' }
  | { type: 'keepNote'; text: string }
  | { type: 'cancelNote' }
  | { type: 'finish' }
  | { type: 'restart' }
  | { type: 'editEntry'; id: string; text: string }
  | { type: 'deliver' }

const START_CLOCK = 21 * 60 + 14

const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

function makeMsg(state: JournalState, from: ChatMessage['from'], text: string, entryId?: string): [ChatMessage, JournalState] {
  const seq = state.seq + 1
  const clock = from === 'user' ? state.clock + 1 : state.clock
  return [{ id: `m${seq}`, from, text, time: fmt(clock), entryId }, { ...state, seq, clock }]
}

/** Move to a node: record the visitor's words, then queue the node's assistant lines. */
function transition(state: JournalState, userText: string | null, next: NodeId, extra?: Partial<JournalState>): JournalState {
  let s: JournalState = { ...state, ...extra }
  const messages = [...s.messages]
  if (userText) {
    const [m, s2] = makeMsg(s, 'user', userText)
    messages.push(m)
    s = s2
  }
  const queue: ChatMessage[] = []
  for (const line of getNode(next).ai) {
    const [m, s2] = makeMsg(s, 'ai', line)
    queue.push(m)
    s = s2
  }
  return { ...s, node: next, messages, queue }
}

export function initialJournalState(journal: JournalEntry[] = []): JournalState {
  const base: JournalState = {
    node: 'start',
    messages: [],
    queue: [],
    pendingObservation: null,
    journal,
    clock: START_CLOCK,
    seq: 0,
  }
  // The greeting appears immediately so the demo is complete at rest.
  const t = transition(base, null, 'start')
  return { ...t, messages: t.queue, queue: [] }
}

export function journalReducer(state: JournalState, action: JournalAction): JournalState {
  const node = getNode(state.node)
  const busy = state.queue.length > 0

  switch (action.type) {
    case 'deliver': {
      if (!busy) return state
      const [first, ...rest] = state.queue
      return { ...state, messages: [...state.messages, first], queue: rest }
    }

    case 'reply': {
      if (busy || node.type !== 'choice') return state
      const { reply } = action
      return transition(state, reply.says ?? reply.label, reply.next, {
        pendingObservation: reply.observation ?? state.pendingObservation,
      })
    }

    case 'save': {
      if (busy || node.type !== 'save') return state
      const entry: JournalEntry = {
        id: `e${state.seq + 1}`,
        kind: 'observation',
        text: state.pendingObservation ?? node.defaultObservation,
        edited: false,
      }
      const t = transition(state, 'Save Observation', 'saved', { journal: [...state.journal, entry], pendingObservation: null })
      const [card, s] = makeMsg(t, 'ai', 'Observation added to your demo journal.', entry.id)
      return { ...s, queue: [card] }
    }

    case 'decline': {
      if (busy || node.type !== 'save') return state
      // Nothing is stored: the proposed observation is discarded.
      return transition(state, 'Do Not Save', 'declined', { pendingObservation: null })
    }

    case 'keepNote': {
      const text = action.text.trim()
      if (busy || node.type !== 'compose' || !text) return state
      const entry: JournalEntry = { id: `e${state.seq + 1}`, kind: 'note', text, edited: false }
      const t = transition(state, text, 'saved', { journal: [...state.journal, entry] })
      const [card, s] = makeMsg(t, 'ai', 'Note added to your demo journal.', entry.id)
      return { ...s, queue: [card] }
    }

    case 'cancelNote': {
      if (busy || node.type !== 'compose') return state
      return transition(state, 'Cancel', 'cancelled')
    }

    case 'finish': {
      if (busy) return state
      return transition(state, 'Finish Demo', 'finished')
    }

    case 'restart':
      // The demo journal survives a restart within the same page view, so saved notes can be reviewed.
      return initialJournalState(state.journal)

    case 'editEntry': {
      const text = action.text.trim()
      if (!text) return state
      return {
        ...state,
        journal: state.journal.map((e) => (e.id === action.id ? { ...e, text, edited: true } : e)),
      }
    }
  }
}
