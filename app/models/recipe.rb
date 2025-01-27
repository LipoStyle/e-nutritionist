class Recipe < ApplicationRecord
  validates :title, :ingredients, :instructions, :prep_time, :cook_time, :servings, presence: true
  validates :prep_time, :cook_time, :servings, numericality: { only_integer: true, greater_than: 0 }
end
