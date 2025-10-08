export type Lang = 'en' | 'es' | 'el'

export interface TrainingRecipePair {
  id: string

  // Training half
  trainingTitle: string
  trainingBlurb: string
  trainingHref: string
  trainingImage: string  // background image

  // Recipe half
  recipeTitle: string
  recipeBlurb: string     // short desc (can include vitamins/micros)
  recipeHref: string
  recipeThumb: string     // small circular image (or icon)
}
