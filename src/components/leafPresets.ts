import { PALETTE, type ClusterOptions } from './Leaves'

/** Upper-right sprig that drifts into the weather section. */
export const WEATHER_LEAVES: ClusterOptions = {
  seed: 101, count: 7, x: [560, 640], y: [600, 620], angle: [-78, -18],
  length: [260, 460], width: [22, 36], palette: PALETTE.light, opacity: [0.55, 0.9],
}
/** Low, tonal leaves rising from the bottom edge of dark sections. */
export const DARK_LEAVES: ClusterOptions = {
  seed: 202, count: 11, x: [320, 640], y: [600, 620], angle: [-72, 8],
  length: [260, 560], width: [26, 44], palette: PALETTE.onDark, opacity: [0.7, 1],
}
export const CTA_LEAVES: ClusterOptions = {
  seed: 303, count: 14, x: [300, 680], y: [800, 820], angle: [-70, 22],
  length: [360, 760], width: [34, 60], palette: [...PALETTE.onDark, { color: '#2F6450', light: '#3A6F57', rib: '#6E9274' }],
}
export const PRIVACY_LEAVES: ClusterOptions = {
  seed: 404, count: 8, x: [-20, 120], y: [600, 620], angle: [8, 70],
  length: [240, 460], width: [22, 38], palette: PALETTE.light, opacity: [0.5, 0.85],
}
export const JOURNAL_LEAVES: ClusterOptions = {
  seed: 505, count: 6, x: [-20, 90], y: [600, 620], angle: [10, 62],
  length: [220, 380], width: [20, 32], palette: PALETTE.light, opacity: [0.35, 0.6],
}
