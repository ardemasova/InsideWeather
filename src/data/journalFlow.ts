/**
 * AI Journal demo — a finite-state conversation graph.
 *
 * Every node is a state the conversation can be in. A node declares the
 * assistant lines it speaks on entry and the way the visitor can respond:
 *   - "choice":  quick replies, each pointing to the next node
 *   - "save":    offers to keep an observation (Save / Do Not Save)
 *   - "compose": free-text note (Keep This Note / Cancel)
 *   - "end":     terminal states with restart/finish actions
 *
 * All copy is fictional and scripted. No inference happens and nothing
 * entered by the visitor leaves the browser tab.
 */

export type NodeId =
  | 'start'
  | 'difficult' | 'work' | 'workAfraid' | 'workDisappoint' | 'workHandle' | 'workUnclear' | 'saveWork'
  | 'close' | 'closeFeel' | 'saveClose' | 'wordless' | 'saveWordless'
  | 'overwhelm' | 'replay' | 'saveReplay' | 'ahead' | 'saveAhead' | 'tangled' | 'saveTangled'
  | 'compose'
  | 'saved' | 'declined' | 'cancelled' | 'finished'

export interface Reply {
  label: string
  next: NodeId
  /** What appears as the visitor's message (defaults to the label). */
  says?: string
  /** Sets the observation that a later "save" node will offer to keep. */
  observation?: string
}

interface BaseNode {
  ai: string[]
}
export interface ChoiceNode extends BaseNode {
  type: 'choice'
  replies: Reply[]
}
export interface SaveNode extends BaseNode {
  type: 'save'
  /** Used when no reply on the path set a more specific observation. */
  defaultObservation: string
}
export interface ComposeNode extends BaseNode {
  type: 'compose'
  prompt: string
}
export interface EndNode extends BaseNode {
  type: 'end'
  variant: 'saved' | 'declined' | 'cancelled' | 'finished'
}
export type FlowNode = ChoiceNode | SaveNode | ComposeNode | EndNode

export const SAVE_QUESTION =
  'Would you like to keep this observation so you can return to it before a future session, if you choose?'

const DEFAULT_WORK_OBSERVATION =
  'I sometimes agree to extra responsibilities even when I do not want to, because I worry about how others might react.'

export const FLOW: Record<NodeId, FlowNode> = {
  start: {
    type: 'choice',
    ai: [
      'Hi. How are you feeling today? We can simply make space for what is happening — there is no need to figure everything out at once.',
    ],
    replies: [
      { label: 'It was a difficult day.', next: 'difficult' },
      { label: 'My thoughts feel overwhelming.', next: 'overwhelm' },
      { label: 'I want to write something down.', next: 'compose' },
    ],
  },

  /* ───────── Scenario A: a difficult day ───────── */
  difficult: {
    type: 'choice',
    ai: ['Would you like to share what took the most energy today? We can start with just one moment that stayed with you.'],
    replies: [
      {
        label: 'Something at work.',
        next: 'work',
        says: 'I agreed to take on another task even though I really did not want to.',
      },
      { label: 'A conversation with someone close.', next: 'close' },
      { label: 'I cannot quite put it into words.', next: 'wordless' },
    ],
  },
  work: {
    type: 'choice',
    ai: ['It sounds like you agreed to something while feeling differently inside. What felt hardest about that moment?'],
    replies: [
      { label: 'I was afraid to say no.', next: 'workAfraid' },
      { label: 'I did not want to disappoint my colleagues.', next: 'workDisappoint' },
      {
        label: 'I felt I should be able to handle it.',
        next: 'workHandle',
        observation:
          'I sometimes take on more than I want to because I feel I should be able to handle everything on my own.',
      },
      { label: 'It is hard to explain.', next: 'workUnclear' },
    ],
  },
  workAfraid: {
    type: 'choice',
    ai: ['Thank you for noticing that. What do you imagine might have happened if you had said no?'],
    replies: [
      { label: 'They might think less of me.', next: 'saveWork' },
      { label: 'I might let the team down.', next: 'saveWork' },
      { label: 'I might miss an opportunity.', next: 'saveWork' },
      { label: 'I am not sure.', next: 'saveWork' },
    ],
  },
  workDisappoint: {
    type: 'choice',
    ai: ['Being someone others can rely on can matter a lot. When you picture their reaction, what do you notice in yourself?'],
    replies: [
      { label: 'I worry they would be frustrated.', next: 'saveWork' },
      { label: 'I would feel I had failed them.', next: 'saveWork' },
      { label: 'I am not sure.', next: 'saveWork' },
    ],
  },
  workHandle: {
    type: 'choice',
    ai: ['That expectation can be quite demanding. When did you first notice that sense of “I should be able to handle it” today?'],
    replies: [
      { label: 'Right when I was asked.', next: 'saveWork' },
      { label: 'Only later, when I felt tired.', next: 'saveWork' },
      { label: 'I am not sure.', next: 'saveWork' },
    ],
  },
  workUnclear: {
    type: 'choice',
    ai: ['That is okay. Some moments are easier to feel than to describe. When you think about it now, what do you notice first?'],
    replies: [
      { label: 'A kind of tightness.', next: 'saveWork' },
      { label: 'Mostly tiredness.', next: 'saveWork' },
      { label: 'I would rather not go further today.', next: 'saveWork' },
    ],
  },
  saveWork: {
    type: 'save',
    ai: [SAVE_QUESTION],
    defaultObservation: DEFAULT_WORK_OBSERVATION,
  },

  close: {
    type: 'choice',
    ai: ['Conversations with people close to us can stay with us for a while. What part of it is still with you?'],
    replies: [
      {
        label: 'Something that was said.',
        next: 'closeFeel',
        observation: 'Something said in a recent conversation with someone close is still on my mind.',
      },
      {
        label: 'Something that was left unsaid.',
        next: 'closeFeel',
        observation: 'After a recent conversation with someone close, I keep thinking about what was left unsaid.',
      },
      {
        label: 'How it ended.',
        next: 'closeFeel',
        observation: 'The way a recent conversation with someone close ended has stayed with me.',
      },
    ],
  },
  closeFeel: {
    type: 'choice',
    ai: ['It sounds like this still carries some weight. If you were to name how you felt afterwards, what word comes closest?'],
    replies: [
      { label: 'Unheard.', next: 'saveClose' },
      { label: 'Distant.', next: 'saveClose' },
      { label: 'I am still sorting it out.', next: 'saveClose' },
    ],
  },
  saveClose: {
    type: 'save',
    ai: [SAVE_QUESTION],
    defaultObservation: 'A recent conversation with someone close is still on my mind.',
  },

  wordless: {
    type: 'choice',
    ai: ['That is completely okay. We do not need the right words. If today had a kind of weather, what would it be?'],
    replies: [
      {
        label: 'Heavy, like rain.',
        next: 'saveWordless',
        observation: 'Today was hard to put into words. It felt heavy, a bit like rain.',
      },
      {
        label: 'Grey and still.',
        next: 'saveWordless',
        observation: 'Today was hard to put into words. It felt grey and still.',
      },
      {
        label: 'Restless, like wind.',
        next: 'saveWordless',
        observation: 'Today was hard to put into words. It felt restless, like wind.',
      },
    ],
  },
  saveWordless: {
    type: 'save',
    ai: ['Thank you. Sometimes an image says more than an explanation.', SAVE_QUESTION],
    defaultObservation: 'Today was hard to put into words.',
  },

  /* ───────── Scenario B: overwhelming thoughts ───────── */
  overwhelm: {
    type: 'choice',
    ai: [
      'When several thoughts arrive at once, it can be hard to know where to begin. Is there one thought that feels especially present right now?',
    ],
    replies: [
      { label: 'I keep replaying a conversation.', next: 'replay' },
      { label: 'I am worried about what comes next.', next: 'ahead' },
      { label: 'Everything feels tangled.', next: 'tangled' },
    ],
  },
  replay: {
    type: 'choice',
    ai: ['What part of the conversation keeps coming back to you?'],
    replies: [
      {
        label: 'Something I said.',
        next: 'saveReplay',
        observation: 'I keep replaying something I said in a recent conversation.',
      },
      {
        label: 'Something they said.',
        next: 'saveReplay',
        observation: 'I keep returning to something another person said to me in a recent conversation.',
      },
      {
        label: 'How I felt afterward.',
        next: 'saveReplay',
        observation: 'After a recent conversation, the way I felt afterward keeps coming back to me.',
      },
    ],
  },
  saveReplay: {
    type: 'save',
    ai: ['It makes sense that it returns. Noticing which part stays with you can be a meaningful place to start.', SAVE_QUESTION],
    defaultObservation: 'I keep replaying a recent conversation.',
  },
  ahead: {
    type: 'choice',
    ai: ['Thinking ahead can take a lot of energy. What feels most uncertain about what comes next?'],
    replies: [
      {
        label: 'Work or studies.',
        next: 'saveAhead',
        observation: 'I have been worrying about what comes next, especially around work or studies.',
      },
      {
        label: 'A relationship.',
        next: 'saveAhead',
        observation: 'I have been worrying about what comes next in one of my relationships.',
      },
      {
        label: 'I do not know yet.',
        next: 'saveAhead',
        observation: 'I have been feeling uncertain about what comes next, without knowing exactly why.',
      },
    ],
  },
  saveAhead: {
    type: 'save',
    ai: ['Thank you for naming it. Uncertainty can feel lighter once it has a place to rest.', SAVE_QUESTION],
    defaultObservation: 'I have been worrying about what comes next.',
  },
  tangled: {
    type: 'choice',
    ai: ['We do not need to untangle everything right now. If you held one thread for a moment, which would it be?'],
    replies: [
      {
        label: 'Something I need to decide.',
        next: 'saveTangled',
        observation: 'My thoughts felt tangled today, and one thread was a decision I need to make.',
      },
      {
        label: 'Something I feel guilty about.',
        next: 'saveTangled',
        observation: 'My thoughts felt tangled today, and one thread was something I feel guilty about.',
      },
      {
        label: 'I would rather just pause.',
        next: 'saveTangled',
        observation: 'My thoughts felt tangled today, and I chose to pause rather than untangle them.',
      },
    ],
  },
  saveTangled: {
    type: 'save',
    ai: ['That is a valid choice. Pausing is part of noticing, too.', SAVE_QUESTION],
    defaultObservation: 'My thoughts felt tangled today.',
  },

  /* ───────── Scenario C: write something down ───────── */
  compose: {
    type: 'compose',
    ai: ['Of course. Take your time — a few words are enough.'],
    prompt: 'What would you like to remember about this moment?',
  },

  /* ───────── Endings ───────── */
  saved: {
    type: 'end',
    variant: 'saved',
    ai: [],
  },
  declined: {
    type: 'end',
    variant: 'declined',
    ai: [
      'Of course. You do not have to save anything you do not want to. We can simply leave this thought here and continue whenever you feel ready.',
    ],
  },
  cancelled: {
    type: 'end',
    variant: 'cancelled',
    ai: ['That is fine. Nothing has been kept. You can come back to writing whenever it feels right.'],
  },
  finished: {
    type: 'end',
    variant: 'finished',
    ai: [
      'Thank you for exploring. In a real journal, you could come back whenever you like — there is no streak to keep and no daily check-in to complete.',
    ],
  },
}

export const getNode = (id: NodeId): FlowNode => FLOW[id]
